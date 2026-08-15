// 🍁 ملف: بوت_ومطور.js - أوامر البوت والمطور - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن ايساغي';
const DEVELOPER_PHONE = '3197010526269';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const MAIN_IMAGE = 'https://i.postimg.cc/28ygCwzs/file-0000000089a081f480896f1d6c828c5b.png';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

// 🍁 رابط المطور
const MAIN_OWNER_URL = 'https://wa.me/3197010526269';

// 🍁 معلومات المطور - ✅ بدون رابط في النص
const OWNER_INFO = `${EMOJI}━━━[ *معلومات المطور* ]━━━${EMOJI}

👑 *الاسم:* ${DEVELOPER}
📱 *الرقم:* ${DEVELOPER_PHONE}
📌 *الحالة:* 🟢 متصل

${EMOJI} *${BOT_NAME}*`;

// 🍁 رسائل البوت - حسب اسم المطور
const makeOwnerBotMsgs = (ownerName) => [
    `${EMOJI} *تم استشعار المطور* 👁‍🗨\nالنظام تحت أمرك يا سيد ${ownerName} 👑🔥`,
    `${EMOJI} ${ownerName} هنا 🍁\nأوامرك يا معلم 👑`,
    `${EMOJI} *أهلاً بك ${ownerName}*\nالبوت جاهز لأوامرك 🚀`,
];

const handler = async (m, { conn, bot, command }) => {
    const owners = bot?.config?.owners || [];

    // ✅ جيب بيانات المطور اللي كتب الأمر
    const ownerEntry = owners.find(o =>
        m.sender === o.jid || 
        m.sender === o.lid ||
        m.sender?.split('@')[0] === o.jid?.split('@')[0]
    );
    const isOwner = !!ownerEntry;
    const ownerName = ownerEntry?.name || DEVELOPER;

    // ============================================
    // 🍁 أوامر البوت والمطور
    // ============================================

    // 🍁 أمر "بوت" - ✅ مع زر القناة وبدون رابط في النص
    if (command === 'بوت' || command === 'bot') {
        if (isOwner) {
            const msgs = makeOwnerBotMsgs(ownerName);
            return conn.sendMessage(m.chat, {
                text: msgs[Math.floor(Math.random() * msgs.length)]
            }, { quoted: m });
        }
        
        // ✅ إرسال رسالة مع زر القناة (بدون رابط في النص)
        try {
            return conn.sendButton(m.chat, {
                imageUrl: MAIN_IMAGE,
                bodyText: `${EMOJI} أنا *${BOT_NAME}*\n👑 من تطوير ${DEVELOPER}`,
                footerText: `${EMOJI} ${BOT_NAME}`,
                buttons: [
                    { 
                        name: 'cta_url', 
                        params: { 
                            display_text: `📢 قناة البوت`, 
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
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} أنا *${BOT_NAME}*\n👑 من تطوير ${DEVELOPER}`
            }, { quoted: m });
        }
    }

    // 🍁 أمر "المطور" - ✅ مع زر القناة وبدون رابط في النص
    if (command === 'المطور' || command === 'مطور' || command === 'owner') {
        if (global.devStatus === 'closed') {
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} *المطور مش فاضي دلوقتي* 🛡️`
            }, { quoted: m });
        }

        try {
            return conn.sendButton(m.chat, {
                imageUrl: MAIN_IMAGE,
                bodyText: OWNER_INFO,
                footerText: `${EMOJI} ${BOT_NAME}`,
                buttons: [
                    { 
                        name: 'cta_url', 
                        params: { 
                            display_text: `${EMOJI} تواصل مع المطور`, 
                            url: MAIN_OWNER_URL 
                        } 
                    },
                    { 
                        name: 'cta_url', 
                        params: { 
                            display_text: `📢 قناة البوت`, 
                            url: CHANNEL_LINK 
                        } 
                    }
                ],
                mentions: [m.sender],
                newsletter: { 
                    name: CHANNEL_NAME, 
                    jid: CHANNEL_JID 
                },
                interactiveConfig: { buttons_limits: 2 }
            }, m);
        } catch (e) {
            console.log('🍁 فشل إرسال الأزرار:', e);
            return conn.sendMessage(m.chat, {
                text: `${OWNER_INFO}\n\n📌 *للتواصل:* ${MAIN_OWNER_URL}`
            }, { quoted: m });
        }
    }
};

handler.command = ['بوت', 'bot', 'المطور', 'مطور', 'owner'];
handler.usePrefix = false;

export default handler;