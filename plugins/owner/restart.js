// 🍁 ملف: رستارت.js - إعادة تشغيل البوت - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const handler = async (m, { conn, bot }) => {
    // ─── التحقق من أن المستخدم مطور ──────────────────
    const isOwner = bot.config.owners.some(o => 
        m.sender === o.jid || 
        m.sender === o.lid
    );
    
    if (!isOwner) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *الأمر ده للمطورين فقط*`
        }, { quoted: m });
    }

    try {
        // ─── رد فعل مؤقت ──────────────────────────────────
        await conn.sendMessage(m.chat, {
            react: { text: '🟢', key: m.key }
        });

        // ─── إرسال رسالة التأكيد ──────────────────────────
        await conn.sendMessage(m.chat, {
            text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🔄 إِعَادَةُ تَشْغِيلِ الْبُوتِ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

⏳ *جاري إعادة التشغيل...*
🔄 *يرجى الانتظار بضع ثوانٍ*

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`,
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

        // ─── إعادة تشغيل البوت ──────────────────────────────
        setTimeout(() => { 
            bot.restart(); 
        }, 1000);

    } catch (error) {
        console.error(`${EMOJI} خطأ في إعادة التشغيل:`, error);
        await conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *حدث خطأ أثناء إعادة التشغيل*\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.usage = ['رستارت'];
handler.category = 'owner';
handler.command = ['رستارت', 'restart'];
handler.owner = true;
handler.description = '🔄 إعادة تشغيل البوت (للمطورين فقط)';

export default handler;