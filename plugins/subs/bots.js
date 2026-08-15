// 🍁 ملف: البوتات.js - عرض البوتات الفرعية - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

const run = async (m, { conn, bot }) => {
    // ✅ التحقق من المطور
    if (!m.isOwner) {
        return m.reply(`${EMOJI} *الأمر ده للمطورين فقط*`);
    }

    const sub = global.subBots;
    if (!sub) {
        return m.reply(`${EMOJI} *نظام البوتات الفرعية غير متاح*`);
    }

    const bots = sub.list ? sub.list() : [];
    if (!bots.length) {
        return m.reply(`${EMOJI} *📭 لا يوجد بوتات فرعية مثبتة*`);
    }

    // ✅ بناء النص
    let text = `${EMOJI}━━━[ *البوتات الفرعية* ]━━━${EMOJI}\n\n`;
    const mentions = [];

    bots.forEach((b, i) => {
        const jid = b.phone ? `${b.phone}@s.whatsapp.net` : null;
        if (jid) mentions.push(jid);

        text += `⚜️ *#${i + 1}*\n`;
        text += `📱 *الرقم:* ${jid ? `@${b.phone}` : b.phone || 'غير معروف'}\n`;
        text += `📍 *الحالة:* ${b.connected ? '🟢 متصل' : '🔴 غير متصل'}\n`;
        text += `📨 *الرسائل:* ${b.messages || 0}\n`;
        text += `🆔 *الايدي:* ${b.id}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    });

    text += `\n${EMOJI} *المجموع:* ${bots.length}`;

    // ✅ إرسال الصورة + النص
    const { images } = bot.config.info || {};
    const img = Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : MAIN_IMAGE;

    try {
        await conn.sendButton(m.chat, {
            imageUrl: img,
            bodyText: text,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: [
                {
                    name: 'quick_reply',
                    params: {
                        display_text: `${EMOJI} الرئيسية`,
                        id: `.قائمة`
                    }
                }
            ],
            mentions: mentions,
            newsletter: {
                name: CHANNEL_NAME,
                jid: CHANNEL_JID
            },
            interactiveConfig: { buttons_limits: 10 }
        }, m);
    } catch (e) {
        console.log(`${EMOJI} فشل إرسال:`, e.message);
        await conn.sendMessage(m.chat, {
            text: text,
            mentions: mentions,
            contextInfo: {
                externalAdReply: {
                    title: `${EMOJI} ${BOT_NAME}`,
                    body: `👑 من تطوير ${DEVELOPER}`,
                    thumbnailUrl: img,
                    sourceUrl: CHANNEL_LINK,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    }
};

run.command = ['البوتات', 'bots', 'subbots'];
run.owner = true;
run.category = 'owner';
run.usage = ['البوتات'];

export default run;
