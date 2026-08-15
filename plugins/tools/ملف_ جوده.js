// 🍁 ملف: جوده.js - تحسين جودة الصور - ISAGI TENGEN BOT

import sharp from 'sharp';
import axios from 'axios';
import https from 'https';

const EMOJI = '🍁';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ========== تحسين الصورة ==========
async function enhanceImage(imageBuffer) {
    try {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        
        let width = metadata.width || 800;
        let height = metadata.height || 600;
        
        if (width < 1920 || height < 1080) {
            const scale = Math.min(1920 / width, 1080 / height);
            width = Math.round(width * scale * 1.5);
            height = Math.round(height * scale * 1.5);
        }
        
        const enhanced = await image
            .resize(width, height, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .sharpen({ sigma: 1.5, m1: 1.0, m2: 2.0, x1: 2.0, y2: 10.0, y3: 0.0 })
            .modulate({ brightness: 1.05, saturation: 1.1 })
            .normalize()
            .withMetadata()
            .jpeg({ quality: 100, progressive: true })
            .toBuffer();
            
        return enhanced;
    } catch (error) {
        console.error(`${EMOJI} خطأ:`, error);
        return imageBuffer;
    }
}

// ────────────────[الأمر الرئيسي]────────────────
const handler = async (m, { conn }) => {
    try {
        const chatId = m.chat;
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || "";
        
        if (!mime) {
            return conn.sendMessage(chatId, {
                text: `${EMOJI} رد على صورة`
            }, { quoted: m });
        }
        
        if (!/image\/(jpe?g|png|webp)/.test(mime)) {
            return conn.sendMessage(chatId, {
                text: `${EMOJI} صيغة غير مدعومة`
            }, { quoted: m });
        }

        await conn.sendMessage(chatId, {
            react: { text: '🔄', key: m.key }
        });

        await conn.sendMessage(chatId, {
            text: `${EMOJI} جاري التحسين...`
        }, { quoted: m });

        let img = await q.download?.();
        
        if (typeof img === 'string') {
            const response = await axios.get(img, { 
                responseType: 'arraybuffer',
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            img = Buffer.from(response.data);
        }

        const originalSize = (img.length / 1024).toFixed(2);
        const enhanced = await enhanceImage(img);
        const enhancedSize = (enhanced.length / 1024).toFixed(2);
        const improvement = ((enhanced.length - img.length) / img.length * 100).toFixed(1);

        // ✅ رسالة قصيرة مع الحفاظ على معرف القناة
        const caption = `${EMOJI} *جودة الصورة*\n` +
                       `📊 ${originalSize}KB → ${enhancedSize}KB ${improvement > 0 ? `✨${improvement}%` : ''}`;

        await conn.sendMessage(chatId, {
            image: enhanced,
            caption: caption,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        await conn.sendMessage(chatId, {
            react: { text: '✅', key: m.key }
        });

    } catch (error) {
        console.error(`${EMOJI} خطأ:`, error);
        
        try {
            let q = m.quoted ? m.quoted : m;
            let img = await q.download?.();
            
            if (typeof img === 'string') {
                const response = await axios.get(img, { 
                    responseType: 'arraybuffer',
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });
                img = Buffer.from(response.data);
            }
            
            await conn.sendMessage(m.chat, {
                image: img,
                caption: `${EMOJI} فشل التحسين، الصورة الأصلية`
            }, { quoted: m });
        } catch {
            await conn.sendMessage(m.chat, {
                text: `${EMOJI} فشل التحسين`
            }, { quoted: m });
        }
    }
};

// ────────────────[الإعدادات]────────────────
handler.usage = ['جودة'];
handler.category = 'media';
handler.command = ['جودة', 'جوده', 'تحسين', 'hd', 'fhd'];
handler.description = 'تحسين جودة الصور';

export default handler;