// 🍁 ملف: فضح.js - فك تشفير رسائل viewOnce - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// ────────────────[الأمر الرئيسي]────────────────
const handler = async (m, { conn }) => {
    try {
        // ─── التحقق من وجود رسالة viewOnce ──────────────
        if (!m.quoted || !m.quoted.viewOnce) {
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} 📌 *رد على فيديو أو صورة تم تعيينها للمشاهدة مرة واحدة فقط.*`
            }, { quoted: m });
        }

        // ─── تحميل الميديا ──────────────────────────────────
        let buffer = await m.quoted.download();
        let caption = m.quoted.msg?.caption || '';
        let mtype = (m.quoted.mtype || '').replace(/Message$/, '');

        // ─── رد فعل مؤقت ──────────────────────────────────
        await conn.sendMessage(m.chat, {
            react: { text: '👀', key: m.key }
        });

        // ─── إضافة تذييل للرسالة ──────────────────────────
        if (mtype === 'image' || mtype === 'video') {
            caption += `\n\n${EMOJI} لا يسمح لك بإخفاء شيء هنا! هااا 🤫`;
        }

        // ─── إرسال الميديا ──────────────────────────────────
        await conn.sendMessage(m.chat, {
            [mtype]: buffer,
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

    } catch (error) {
        console.error(`${EMOJI} خطأ في أمر فضح:`, error);
        await conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *حدث خطأ في تنفيذ الأمر*\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.usage = ['فضح (رد على رسالة viewOnce)'];
handler.category = 'media';
handler.command = ['فضح', 'readviewonce', 'mirar'];
handler.description = '👀 فك تشفير رسائل المشاهدة مرة واحدة (viewOnce)';

export default handler;