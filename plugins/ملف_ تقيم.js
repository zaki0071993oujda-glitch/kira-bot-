// 🍁 ملف: تقيم.js - تقييم البوت - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

// ✅ أرقام التواصل
const DEVELOPER_CONTACT = '212687411464@s.whatsapp.net';
const TENGEN_NUMBER = '212687411464';

const handler = async (m, { conn, text }) => {
    const chatId = m.chat;

    // ✅ إذا كان المستخدم يختار تقييماً
    if (m.text?.startsWith('.قيم')) {
        const stars = parseInt(m.text.replace('.قيم', '').trim());
        if (stars >= 1 && stars <= 5) {
            await sendFeedbackResponse(stars, m, conn);
        }
        return;
    }

    // ✅ عرض واجهة التقييم
    const bodyText = `${EMOJI}━━━[ *⭐ تقييم البوت* ]━━━${EMOJI}

👑 *مرحباً ${m.pushName || 'مستخدم'}*

📌 *قيم البوت لمساعدتنا على التحسين*

${EMOJI} *اختر عدد النجوم 👇*`;

    const buttons = [
        { name: 'quick_reply', params: { display_text: '⭐', id: `.قيم 1` } },
        { name: 'quick_reply', params: { display_text: '⭐⭐', id: `.قيم 2` } },
        { name: 'quick_reply', params: { display_text: '⭐⭐⭐', id: `.قيم 3` } },
        { name: 'quick_reply', params: { display_text: '⭐⭐⭐⭐', id: `.قيم 4` } },
        { name: 'quick_reply', params: { display_text: '⭐⭐⭐⭐⭐', id: `.قيم 5` } },
        {
            name: 'cta_url',
            params: {
                display_text: `${EMOJI} قناة البوت`,
                url: CHANNEL_LINK
            }
        }
    ];

    try {
        await conn.sendButton(chatId, {
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
        console.log(`${EMOJI} فشل:`, e);
        await m.reply(bodyText);
    }
};

// ✅ دالة الرد على التقييم
const sendFeedbackResponse = async (stars, m, conn) => {
    let feedbackMessage = '';

    switch (stars) {
        case 1:
            feedbackMessage = `⭐ *تقييم نجمة واحدة*\n\n📌 *شكراً لتقييمك! سنعمل على تحسين البوت.*\n${EMOJI} *${BOT_NAME}*`;
            break;
        case 2:
            feedbackMessage = `⭐⭐ *تقييم نجمتين*\n\n📌 *نقدر رأيك! سنسعى لتقديم الأفضل.*\n${EMOJI} *${BOT_NAME}*`;
            break;
        case 3:
            feedbackMessage = `⭐⭐⭐ *تقييم ثلاث نجوم*\n\n📌 *شكراً لك! سنواصل التطوير لخدمتك.*\n${EMOJI} *${BOT_NAME}*`;
            break;
        case 4:
            feedbackMessage = `⭐⭐⭐⭐ *تقييم أربع نجوم*\n\n📌 *نشكرك جداً! دعمك يحفزنا للمزيد.*\n${EMOJI} *${BOT_NAME}*`;
            break;
        case 5:
            feedbackMessage = `⭐⭐⭐⭐⭐ *تقييم خمس نجوم*\n\n📌 *شكراً جزيلاً! هذا التقييم يعني لنا الكثير.*\n${EMOJI} *${BOT_NAME}*`;
            break;
        default:
            feedbackMessage = `${EMOJI} ❌ *تقييم غير صالح*\n📌 اختر من 1 إلى 5`;
            break;
    }

    // ✅ إرسال التقييم للمطور
    try {
        await conn.sendMessage(DEVELOPER_CONTACT, {
            text: `${EMOJI}━━━[ *تقييم جديد* ]━━━${EMOJI}

⭐ *التقييم:* ${stars} نجوم
👤 *من:* @${m.sender.split('@')[0]}

${EMOJI} *${BOT_NAME}*`,
            mentions: [m.sender]
        });
    } catch (e) {
        console.log(`${EMOJI} فشل إرسال التقييم للمطور:`, e);
    }

    // ✅ إرسال الرد للمستخدم
    await m.reply(feedbackMessage);
};

handler.command = ['تقيم', 'تقييم', 'rate'];
handler.category = 'info';

export default handler;