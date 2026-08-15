// 🍁 ملف: فريق_الدعم.js - فريق الدعم - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

// 🍁 فريق الدعم - حسب معلوماتك
const SUPPORT_TEAM = [
    { name: 'تنغن كيرا', jid: '3197010524960@s.whatsapp.net' },
    { name: '𝐈𝐒𝐀𝐆𝐈',    jid: '212687411464@s.whatsapp.net' }
];

const handler = async (m, { conn }) => {
    // ✅ بناء قائمة أعضاء الدعم
    const links = SUPPORT_TEAM.map((s, i) =>
        `${i + 1}. *${s.name}*\n📱 wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
    ).join('\n\n');

    // ✅ بناء النص
    const bodyText = `${EMOJI}━━━[ *🛡️ فريق الدعم* ]━━━${EMOJI}

👑 *مرحباً ${m.pushName || 'مستخدم'}*

📌 *أعضاء فريق الدعم:*

${links}

📢 ${CHANNEL_LINK}

${EMOJI} *${BOT_NAME}*`;

    // ✅ أزرار التواصل
    const buttons = SUPPORT_TEAM.map(s => ({
        name: 'cta_url',
        params: {
            display_text: `${EMOJI} ${s.name}`,
            url: `https://wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
        }
    }));

    // ✅ زر إضافي للقناة
    buttons.push({
        name: 'cta_url',
        params: {
            display_text: `${EMOJI} قناة البوت`,
            url: CHANNEL_LINK
        }
    });

    try {
        await conn.sendButton(m.chat, {
            imageUrl: MAIN_IMAGE,
            bodyText: bodyText,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: buttons,
            mentions: [m.sender],
            newsletter: {
                name: CHANNEL_NAME,
                jid: CHANNEL_JID
            },
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        console.log(`${EMOJI} فشل إرسال الأزرار:`, e);
        await m.reply(bodyText);
    }
};

handler.command = ['فريق_الدعم', 'الدعم', 'support', 'دعم'];
handler.category = 'info';

export default handler;