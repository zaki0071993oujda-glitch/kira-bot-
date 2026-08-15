// 🍁 ملف: commands.js - القائمة الرئيسية - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

// 🖼️ قائمة الصور العشوائية
const IMAGES = [
    'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg',
    'https://i.postimg.cc/Ls393WJK/mntnmanlanlamlt.jpg',
    'https://i.postimg.cc/cLd4h99Q/1ec6d4d9d187860bebecd5655c2130a7.jpg',
    'https://i.postimg.cc/L5m0w1r1/6539a3ddd4b8e9804e2235afa2928e4a.jpg',
    'https://i.postimg.cc/BQHBH6yw/49361b48a01156b70d4e94f5a954aa3f.jpg',
    'https://i.postimg.cc/J7JkdFqB/fe5a547f50ff075c6697d8802c96f31f.jpg',
    'https://i.postimg.cc/T1CG4GHh/c4bac4df1cf0be95920442ceae42fa8e.jpg',
    'https://i.postimg.cc/tTBM0TpC/c8c75a230d652e70a57f364f2c3c20b9.jpg',
    'https://i.postimg.cc/L8FvbfL5/bb5f15bce9d3efdb69edae96cd559cb9.jpg',
    'https://i.postimg.cc/nhnSLBrZ/41187c79fcad726d466fa80e90a51207.jpg',
    'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg',
    'https://i.postimg.cc/JnTyPJ74/telechargement-(4).jpg',
    'https://i.postimg.cc/XJx2L2ys/anime-7-63864269925437.jpg'
];

// 🎲 دالة اختيار صورة عشوائية
function getRandomImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

// 🍁 الأقسام مع إيموجيات
const CATEGORIES = [
    ['🎮 الألعاب', 'game', 1],
    ['🎌 الأنمي', 'anime', 2],
    ['🛡️ الإدارة', 'admins', 3],
    ['🎨 التحويلات', 'convert', 4],
    ['⬇️ التحميلات', 'downloads', 5],
    ['💰 البنك', 'bank', 6],
    ['🧠 الذكاء', 'ai', 7],
    ['🌐 الإنترنت', 'search', 8],
    ['🎭 الترفيه', 'fun', 9],
    ['👑 المطور', 'owner', 10],
    ['🏰 الألقاب', 'guilds', 11],
    ['🛠️ الأدوات', 'tools', 12],
    ['📋 المعلومات', 'info', 13],
    ['🌄 الملصقات', 'sticker', 14],
    ['🖼️ التصميم', 'canvas', 15]
];

// ── عرض الأقسام ──
const sectionsHandler = async (m, { conn }) => {
    const randomImage = getRandomImage();
    let text = `${EMOJI} *📂 الأقسام*\n\n`;
    CATEGORIES.forEach((cat, i) => {
        text += `${i + 1}. ${cat[0]}\n`;
    });

    try {
        await conn.sendButton(m.chat, {
            imageUrl: randomImage,
            bodyText: text,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: [
                {
                    name: 'quick_reply',
                    params: {
                        display_text: `🏠 الرئيسية`,
                        id: `.اوامر`
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
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        await m.reply(text);
    }
};

// ── عرض القسم ──
const sectionHandler = async (m, { conn, bot, command, args }) => {
    const randomImage = getRandomImage();
    const selected = parseInt(args[0]);
    
    if (isNaN(selected)) {
        await m.reply(`${EMOJI} ❌ اختر رقم القسم`);
        return;
    }

    const cat = CATEGORIES.find(c => c[2] === selected);
    if (!cat) {
        await m.reply(`${EMOJI} ❌ قسم غير موجود`);
        return;
    }

    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    if (cat[1] === 'owner' && !isOwner) {
        await m.reply(`🔒 للمطورين فقط`);
        return;
    }

    let usageList = [];
    try {
        const cmds = await bot.getAllCommands();
        const categoryCmds = cmds.filter(c => c.category === cat[1]);
        usageList = categoryCmds
            .filter(c => Array.isArray(c.usage) && c.usage.length > 0)
            .flatMap(c => c.usage)
            .filter(u => u && u !== 'undefined');
    } catch (e) {
        usageList = [`${cat[1]}_1`, `${cat[1]}_2`, `${cat[1]}_3`];
    }

    if (!usageList.length) {
        await m.reply(`📭 القسم فاضي`);
        return;
    }

    const bodyText = `${EMOJI} *${cat[0]}* (${usageList.length})`;

    const buttons = usageList.map(u => ({
        name: 'quick_reply',
        params: {
            display_text: `${u}`,
            id: `.${u}`
        }
    }));

    buttons.push({
        name: 'quick_reply',
        params: {
            display_text: `🔙 رجوع`,
            id: `.اقسام`
        }
    });

    try {
        await conn.sendButton(m.chat, {
            imageUrl: randomImage,
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
        await m.reply(bodyText);
    }
};

// ── المعالج الرئيسي ──
const handler = async (m, { conn, bot, command, args }) => {
    const randomImage = getRandomImage();
    
    if (command === 'اقسام_القائمة') {
        await sectionsHandler(m, { conn });
        return;
    }

    if (args[0] && !isNaN(args[0])) {
        await sectionHandler(m, { conn, bot, command, args });
        return;
    }

    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    const xp = global.db?.users?.[m.sender]?.xp || 0;
    const lvl = isOwner ? 999 : (Math.floor(Math.sqrt(xp / 100)) + 1);
    const totalUsers = Object.keys(global.db?.users || {}).length;

    // ✅ رسالة مختصرة مع إيموجيات
    const bodyText = `${EMOJI} *👑 ${BOT_NAME}*\n👤 ${m.pushName || 'مجهول'} | 🆙 Lv ${lvl} | 🌍 ${totalUsers}`;

    const buttons = [
        { 
            name: 'quick_reply', 
            params: { 
                display_text: `📂 الأقسام`, 
                id: `.اقسام` 
            } 
        },
        { 
            name: 'quick_reply', 
            params: { 
                display_text: `📝 أوامر نصية`, 
                id: `.أوامر` 
            } 
        },
        { 
            name: 'quick_reply', 
            params: { 
                display_text: `⭐ تقييم`, 
                id: `.تقيم` 
            } 
        },
        { 
            name: 'quick_reply', 
            params: { 
                display_text: `👨‍💻 المطور`, 
                id: `.المطور` 
            } 
        },
        { 
            name: 'quick_reply', 
            params: { 
                display_text: `⚙️ تنصيب`, 
                id: `.تنصيب` 
            } 
        },
        { 
            name: 'cta_url', 
            params: { 
                display_text: `📢 قناة البوت`, 
                url: CHANNEL_LINK 
            } 
        }
    ];

    try {
        await conn.sendButton(m.chat, {
            imageUrl: randomImage,
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
        await m.reply(bodyText);
    }
};

handler.command = ['اوامر'];
handler.sectionCommand = ['اقسام_القائمة'];

export default handler;