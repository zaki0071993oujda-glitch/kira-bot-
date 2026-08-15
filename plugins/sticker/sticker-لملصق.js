// 🍁 ملف: sticker-لملصق.js - صانع الملصقات - ISAGI TENGEN BOT

import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// ────────────────[معلومات القناة]────────────────
const CHANNEL_INFO = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_JID,
            newsletterName: CHANNEL_NAME,
            serverMessageId: -1
        }
    }
};

// ────────────────[دالة التحقق من الروابط]────────────────
function isUrl(text) {
    return /^https?:\/\/.*\.(jpe?g|gif|png|webp|mp4)$/i.test(text);
}

// ────────────────[دالة تنزيل الملف من الرابط]────────────────
async function downloadFile(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('❌ فشل التنزيل:', error.message);
        throw error;
    }
}

// ────────────────[دالة إنشاء الملصق]────────────────
async function createSticker(buffer, pack, author) {
    try {
        const sticker = new Sticker(buffer, {
            pack: pack || 'ملصقات تنغن 👑',
            author: author || 'بواسطة تنغن',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 80,
            background: '#FFFFFF'
        });

        return await sticker.toBuffer();
    } catch (error) {
        console.error('❌ فشل إنشاء الملصق:', error.message);
        throw error;
    }
}

// ────────────────[الأمر الرئيسي]────────────────
const handler = async (m, { conn, args, command }) => {
    const chatId = m.chat;
    let stiker = null;

    try {
        // ─── التأكد من وجود مجلد tmp ──────────────────────
        if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || q.mediaType || '';

        // ─── حالة 1: وسائط (صورة/فيديو/ملصق) ──────────────
        if (/webp|image|video/g.test(mime)) {
            // ─── التحقق من مدة الفيديو ──────────────────────
            if (/video/.test(mime) && ((q.msg || q).seconds > 8)) {
                return conn.sendMessage(chatId, {
                    text: `${EMOJI} ⚠️ *مدة الفيديو طويلة!*\n\n📌 لا يمكن أن تتجاوز مدة الفيديو 8 ثوانٍ لإنشاء ملصق متحرك.`,
                    ...CHANNEL_INFO
                }, { quoted: m });
            }

            // ─── تنزيل الوسائط ──────────────────────────────
            const media = await q.download();
            if (!media) {
                return conn.sendMessage(chatId, {
                    text: `${EMOJI} ❌ *فشل التنزيل!*\n\n📌 تأكد من الرد على صورة/فيديو/ملصق.`,
                    ...CHANNEL_INFO
                }, { quoted: m });
            }

            // ─── إنشاء الملصق ──────────────────────────────
            stiker = await createSticker(
                media,
                global.packsticker || 'ملصقات تنغن 👑',
                global.author || 'بواسطة تنغن'
            );

        } 
        // ─── حالة 2: رابط مباشر ──────────────────────────
        else if (args[0]) {
            if (isUrl(args[0])) {
                const media = await downloadFile(args[0]);
                stiker = await createSticker(
                    media,
                    global.packsticker || 'ملصقات تنغن 👑',
                    global.author || 'بواسطة تنغن'
                );
            } else {
                return conn.sendMessage(chatId, {
                    text: `${EMOJI} ❌ *رابط غير صالح!*\n\n📌 الرابط يجب أن ينتهي بـ .jpg / .png / .webp / .mp4`,
                    ...CHANNEL_INFO
                }, { quoted: m });
            }
        } 
        // ─── حالة 3: استخدام غير صحيح ──────────────────────
        else {
            const helpText = `
${EMOJI}━━━[ *🖼️ صانع الملصقات* ]━━━${EMOJI}

📌 *طريقة الاستخدام:*

1️⃣ *من صورة/فيديو:*
┃ ${command} (رد على صورة/فيديو)

2️⃣ *من رابط:*
┃ ${command} https://example.com/image.jpg

📝 *مثال:*
┃ ${command} (رد على صورة)

⏰ *ملاحظة:* الفيديو max 8 ثواني
${EMOJI} *${BOT_NAME}*`;

            return conn.sendMessage(chatId, {
                text: helpText,
                ...CHANNEL_INFO
            }, { quoted: m });
        }

    } catch (error) {
        console.error('❌ خطأ في إنشاء الملصق:', error);
        return conn.sendMessage(chatId, {
            text: `${EMOJI} ❌ *حدث خطأ!*\n\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`,
            ...CHANNEL_INFO
        }, { quoted: m });
    }

    // ─── إرسال الملصق ──────────────────────────────────────
    if (stiker) {
        try {
            // ─── إرسال الملصق ──────────────────────────────
            await conn.sendMessage(chatId, {
                sticker: stiker
            }, { quoted: m });

            // ─── رد فعل ──────────────────────────────────────
            await conn.sendMessage(chatId, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error('⚠️ خطأ في إرسال الملصق:', error);
            return conn.sendMessage(chatId, {
                text: `${EMOJI} ❌ *فشل إرسال الملصق!*\n\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`,
                ...CHANNEL_INFO
            }, { quoted: m });
        }
    } else {
        return conn.sendMessage(chatId, {
            text: `${EMOJI} ❌ *فشل إنشاء الملصق!*\n\n📌 تأكد من أن الملف صورة/فيديو قصير أو رابط صحيح.`,
            ...CHANNEL_INFO
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.help = ['ملصق', 's'].map(v => v + ' <صورة|فيديو|رابط>');
handler.tags = ['أدوات'];
handler.command = ['s', 'لملصق', 'stiker', 'ملصق', 'sticker'];
handler.register = true;
handler.category = 'tools';
handler.description = '🖼️ تحويل الصور والفيديوهات إلى ملصقات';
handler.usage = '.ملصق (رد على صورة/فيديو)';

export default handler;