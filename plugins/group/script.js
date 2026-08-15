// 🍁 ملف: سكريبت.js - روابط السورس والقناة - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

// 🍁 روابط المشروع
const GITHUB_URL = 'https://www.mediafire.com/file/wj9uahjcac4vf7n/bot_llbay3.rar/file';
const YOUTUBE_URL = 'https://youtube.com/@your-channel';

// 🍁 سياق الرسالة
const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_JID,
        newsletterName: CHANNEL_NAME,
        serverMessageId: 0
    },
    externalAdReply: {
        title: `${EMOJI} ${BOT_NAME}`,
        body: `👑 من تطوير ${DEVELOPER}`,
        thumbnailUrl: img || MAIN_IMAGE,
        sourceUrl: CHANNEL_LINK,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const handler = async (m, { conn, bot }) => {
    // ✅ الحصول على صورة
    const { images } = bot.config.info || {};
    const img = Array.isArray(images) && images.length > 0 
        ? images[Math.floor(Math.random() * images.length)] 
        : MAIN_IMAGE;

    // ✅ بناء الرسالة
    const text = `${EMOJI}━━━[ *📦 سورس البوت* ]━━━${EMOJI}

📌 *الروابط:*

🔗 *GitHub:*
${GITHUB_URL}

▶️ *يوتيوب:*
${YOUTUBE_URL}

📢 *قناة البوت:*
${CHANNEL_LINK}

━━━━━━━━━━━━━━━━━━━━━━
⭐ *لا تنسى وضع نجمة للريبو* 🌟

${EMOJI} *${BOT_NAME}*`;

    // ✅ إرسال الرسالة
    try {
        await conn.sendButton(m.chat, {
            imageUrl: img,
            bodyText: text,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: [
                {
                    name: 'cta_url',
                    params: {
                        display_text: `${EMOJI} GitHub`,
                        url: GITHUB_URL
                    }
                },
                {
                    name: 'cta_url',
                    params: {
                        display_text: `${EMOJI} يوتيوب`,
                        url: YOUTUBE_URL
                    }
                },
                {
                    name: 'cta_url',
                    params: {
                        display_text: `${EMOJI} قناة البوت`,
                        url: CHANNEL_LINK
                    }
                }
            ],
            mentions: [m.sender],
            newsletter: {
                name: CHANNEL_NAME,
                jid: CHANNEL_JID
            },
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        console.log(`${EMOJI} فشل إرسال الأزرار:`, e);
        await conn.sendMessage(m.chat, {
            text: text,
            contextInfo: context(m.sender, img)
        }, { quoted: m });
    }
};

handler.usage = ['سكريبت', 'سورس', 'sc'];
handler.category = 'info';
handler.command = ['سكريبت', 'سورس', 'sc', 'source', 'github'];

export default handler;