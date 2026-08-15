// 🍁 ملف: tomp3.js - تحويل الفيديو إلى MP3 - ISAGI TENGEN BOT
// ✅ نسخة مصححة بالكامل - طريقة مختلفة للتعامل مع الردود

import { downloadMediaMessage } from '@whiskeysockets/baileys';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ────────────────────[الإعدادات]────────────────────
const EMOJI = '🍁';
const BOT_NAME = 'ISAGI TENGEN BOT';
const CREATOR = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const VERSION = '3.0.0';

// ✅ الحصول على مسار الملف الحالي
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ إعداد مسار ffmpeg
const ffmpegPath = path.join(__dirname, '../ffmpeg.exe');
if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}

// ────────────────────[المعالج الرئيسي]────────────────────
const handler = async (m, { conn }) => {
    const jid = m.chat;
    
    // ✅ محاولة الحصول على الفيديو من الرد بطرق متعددة
    let videoMessage = null;
    let quotedMsg = null;
    
    // ✅ الطريقة 1: التحقق من m.quoted (الأكثر شيوعاً)
    if (m.quoted) {
        quotedMsg = m.quoted;
        if (m.quoted.message?.videoMessage) {
            videoMessage = m.quoted.message.videoMessage;
        } else if (m.quoted.videoMessage) {
            videoMessage = m.quoted.videoMessage;
        }
    }
    
    // ✅ الطريقة 2: التحقق من extendedTextMessage
    if (!videoMessage && m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
        if (quoted.videoMessage) {
            videoMessage = quoted.videoMessage;
            quotedMsg = { message: quoted };
        }
    }
    
    // ✅ الطريقة 3: التحقق من messageContextInfo
    if (!videoMessage && m.message?.messageContextInfo?.messageSecret) {
        try {
            // محاولة استخراج من contextInfo
            const ctxInfo = m.message.extendedTextMessage?.contextInfo;
            if (ctxInfo?.quotedMessage?.videoMessage) {
                videoMessage = ctxInfo.quotedMessage.videoMessage;
                quotedMsg = { message: ctxInfo.quotedMessage };
            }
        } catch (e) {}
    }
    
    // ✅ الطريقة 4: التحقق المباشر من الرسالة نفسها
    if (!videoMessage && m.message?.videoMessage) {
        videoMessage = m.message.videoMessage;
        quotedMsg = m;
    }
    
    // ✅ إذا لم يتم العثور على فيديو
    if (!videoMessage) {
        return conn.sendMessage(jid, {
            text: `🍁 *تحويل الفيديو إلى MP3 - ${BOT_NAME}*

❌ *لم يتم العثور على فيديو!*

📌 *طريقة الاستخدام الصحيحة:*

1️⃣ أرسل فيديو في المحادثة
2️⃣ اضغط مع الاستمرار على الفيديو
3️⃣ اختر "رد" ✍️
4️⃣ اكتب الأمر: .tomp3
5️⃣ اضغط إرسال 📤

📝 *مثال:*
[فيديو] ← ترسله
[ترد عليه بـ] .tomp3

🍁 *${BOT_NAME}* v${VERSION}`
        }, { quoted: m });
    }

    // ✅ تفاعل "جاري المعالجة"
    await conn.sendMessage(jid, {
        react: { text: "⏳", key: m.key }
    });

    let inputPath, outputPath;
    
    try {
        // ✅ تنزيل الفيديو
        let videoBuffer;
        
        try {
            // محاولة تنزيل باستخدام quotedMsg
            if (quotedMsg) {
                videoBuffer = await downloadMediaMessage(
                    quotedMsg,
                    "buffer",
                    {},
                    {
                        logger: console,
                        reuploadRequest: conn.updateMediaMessage
                    }
                );
            }
        } catch (e) {
            console.log('محاولة تنزيل بديلة...');
        }
        
        // ✅ محاولة بديلة باستخدام videoMessage مباشرة
        if (!videoBuffer) {
            try {
                videoBuffer = await downloadMediaMessage(
                    { message: { videoMessage: videoMessage } },
                    "buffer",
                    {},
                    {
                        logger: console,
                        reuploadRequest: conn.updateMediaMessage
                    }
                );
            } catch (e) {
                console.log('محاولة تنزيل ثالثة...');
            }
        }
        
        // ✅ محاولة أخيرة
        if (!videoBuffer) {
            try {
                const msgWithVideo = {
                    key: m.key,
                    message: {
                        videoMessage: videoMessage
                    }
                };
                videoBuffer = await downloadMediaMessage(
                    msgWithVideo,
                    "buffer",
                    {},
                    {
                        logger: console,
                        reuploadRequest: conn.updateMediaMessage
                    }
                );
            } catch (e) {}
        }

        if (!videoBuffer || videoBuffer.length < 1000) {
            throw new Error("فشل تحميل الفيديو - الملف فارغ أو تالف");
        }

        console.log(`📥 تم تحميل الفيديو: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        // ✅ إنشاء مجلد temp
        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // ✅ إنشاء ملفات مؤقتة
        const timestamp = Date.now();
        inputPath = path.join(tempDir, `video_${timestamp}.mp4`);
        outputPath = path.join(tempDir, `audio_${timestamp}.mp3`);

        fs.writeFileSync(inputPath, videoBuffer);

        // ✅ تحويل الفيديو إلى MP3
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat("mp3")
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .outputOptions([
                    '-metadata', `title=ISAGI TENGEN BOT`,
                    '-metadata', `artist=${CREATOR}`,
                    '-metadata', `album=${BOT_NAME}`,
                    '-metadata', `year=${new Date().getFullYear()}`
                ])
                .on("end", () => {
                    console.log('✅ تم التحويل بنجاح');
                    resolve();
                })
                .on("error", (err) => {
                    reject(err);
                })
                .save(outputPath);
        });

        // ✅ التحقق من الملف الناتج
        if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 1000) {
            throw new Error("فشل التحويل");
        }

        // ✅ قراءة الملف الصوتي
        const audioBuffer = fs.readFileSync(outputPath);
        const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

        // ✅ إرسال الملف الصوتي
        await conn.sendMessage(jid, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `ISAGI_TENGEN_${timestamp}.mp3`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        // ✅ تفاعل النجاح
        await conn.sendMessage(jid, {
            react: { text: "✅", key: m.key }
        });

        // ✅ رسالة تأكيد
        await conn.sendMessage(jid, {
            text: `🍁 *تم التحويل بنجاح!* 🎵

📌 *المعلومات:*
• 🎵 الصيغة: MP3
• 📦 الجودة: 128 kbps
• 📂 الحجم: ${fileSizeMB} MB
• 👤 ${BOT_NAME}

🎧 *استماع ممتع!* 🍁`
        }, { quoted: m });

    } catch (err) {
        console.error("❌ خطأ:", err);

        await conn.sendMessage(jid, {
            react: { text: "❌", key: m.key }
        });

        await conn.sendMessage(jid, {
            text: `🍁 *فشل التحويل*

❌ ${err.message || 'حدث خطأ غير معروف'}

💡 *حاول:*
• فيديو آخر أصغر حجماً
• إعادة المحاولة
• التأكد من اتصال الإنترنت

🍁 *${BOT_NAME}*`
        }, { quoted: m });
    } finally {
        // ✅ تنظيف الملفات المؤقتة
        try {
            if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (e) {}
    }
};

// ────────────────────[بيانات الأمر]────────────────────
handler.usage = ["tomp3", "mp3"];
handler.category = "media";
handler.command = ["tomp3", "mp3", "لصوت", "تحويل", "صوت"];
handler.description = "🎵 تحويل الفيديو إلى MP3";
handler.version = "3.0.0";

export default handler;