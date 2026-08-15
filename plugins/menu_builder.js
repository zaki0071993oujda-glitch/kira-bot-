// 🍁 ملف: menu_builder.js - بناء القوائم - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

const NEWSLETTER = { 
    name: CHANNEL_NAME, 
    jid: CHANNEL_JID 
};

// 🍁 وسوم افتراضية
const DEFAULT_TAGS = ['🍁 تنغن', '🔥 الأسطوري', '👑 المبهرج', '💎 كيرا', '🚀 إيساغي', '✨ الأفضل', '🎯 جربه', '🏆 تنغن كيرا'];
const tagFor = (i) => DEFAULT_TAGS[i % DEFAULT_TAGS.length];

// 🍁 إرسال نص احتياطي
async function safeText(conn, m, text) {
    try {
        return await conn.sendMessage(m.chat, { text }, { quoted: m });
    } catch (e) {
        console.error('[menu_builder] حتى الرسالة النصية فشلت:', e?.message);
        return null;
    }
}

// 🍁 القائمة الرئيسية - نسخة الصورة + الأزرار
async function sendMainMenu(m, { conn, bot }, { sections, user, totalUsers } = {}) {
  try {
    const mentionId = m.sender;
    const now = new Date();
    const week = now.toLocaleDateString('ar-EG', { weekday: 'long' });
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    // ✅ بناء النص
    const bodyText = `${EMOJI}━━━[ 👑 *${BOT_NAME}* 👑 ]━━━${EMOJI}

👤 @${mentionId.split('@')[0]}
🤖 ${BOT_NAME}
👑 ${DEVELOPER}

📅 ${week}
📆 ${date}

🍁 المستوى: ${user?.level ?? '-'}
⚔️ الرتبة: ${user?.role ?? '-'}
🌍 المستخدمين: ${totalUsers ?? '-'}

━━━━━━━━━━━━━━━━━━━━━━
🍁 "القوة ليست في العضلات، بل في الروح."
🍁 "من لا يحترم نفسه، لا يستحق الاحترام."

📌 *اختر القسم المناسب:*`;

    // ✅ بناء أزرار الأقسام (quick_reply)
    const sectionButtons = (sections || []).map((s) => ({
        name: 'quick_reply',
        params: {
            display_text: `${s.title}`,
            id: s.id
        }
    }));

    // ✅ أزرار إضافية
    const extraButtons = [
        {
            name: 'cta_url',
            params: {
                display_text: `${EMOJI} قناة البوت`,
                url: CHANNEL_LINK
            }
        },
        {
            name: 'quick_reply',
            params: {
                display_text: `${EMOJI} المطور`,
                id: `.المطور`
            }
        },
        {
            name: 'quick_reply',
            params: {
                display_text: `${EMOJI} معلومات`,
                id: `.معلومات`
            }
        }
    ];

    const allButtons = [...sectionButtons, ...extraButtons];

    // ✅ إرسال القائمة كصورة + أزرار
    try {
        return await conn.sendButton(m.chat, {
            imageUrl: MAIN_IMAGE,
            bodyText: bodyText,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: allButtons,
            mentions: [m.sender],
            newsletter: NEWSLETTER,
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        console.error('[sendMainMenu] فشل إرسال الأزرار:', e?.message);
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    console.error('[sendMainMenu] خطأ غير متوقع:', e?.message);
    return safeText(conn, m, `${EMOJI} *حصل خطأ في عرض القائمة، جرب تاني.*`);
  }
}

// 🍁 قائمة القسم - نسخة الصورة + الأزرار
async function sendSectionMenu(m, { conn, bot }, { sectionId, sectionTitle, sectionEmoji = '🍁', rows, backCommand = 'قائمة' } = {}) {
  try {
    // ✅ بناء النص
    const bodyText = `${EMOJI}━━━[ *قـائـمـة ${sectionTitle}* ]━━━${EMOJI}

📜 *عدد الأوامر:* ${rows?.length || 0}
${EMOJI} *اختر الأمر المناسب:*`;

    // ✅ بناء أزرار الأوامر
    const commandButtons = (rows || []).map(r => ({
        name: 'quick_reply',
        params: {
            display_text: `${sectionEmoji} ${r.cmd}`,
            id: `.${r.cmd}`
        }
    }));

    // ✅ زر الرجوع
    commandButtons.push({
        name: 'quick_reply',
        params: {
            display_text: `${EMOJI} الرئيسية`,
            id: `.${backCommand}`
        }
    });

    // ✅ إرسال قائمة القسم كصورة + أزرار
    try {
        return await conn.sendButton(m.chat, {
            imageUrl: MAIN_IMAGE,
            bodyText: bodyText,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: commandButtons,
            mentions: [m.sender],
            newsletter: NEWSLETTER,
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        console.error('[sendSectionMenu] فشل إرسال الأزرار:', e?.message);
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    console.error('[sendSectionMenu] خطأ غير متوقع:', e?.message);
    return safeText(conn, m, `${EMOJI} *حصل خطأ في عرض القائمة، جرب تاني.*`);
  }
}

// 🍁 قائمة المطورين - نسخة الصورة + الأزرار
async function sendDevMenu(m, { conn, bot }, isDev, backCommand = 'قائمة') {
    if (!isDev) return null;
  try {
    const cmds = [
        { cmd: 'بنج', desc: 'اختبار سرعة البوت' },
        { cmd: 'رام', desc: 'إظهار استخدام الذاكرة' },
        { cmd: 'معلومات', desc: 'معلومات البوت' },
        { cmd: 'حظر', desc: 'حظر مستخدم' },
        { cmd: 'فك-حظر', desc: 'فك حظر مستخدم' },
        { cmd: 'اذاعه', desc: 'إذاعة لجميع المجموعات' },
        { cmd: 'تنظيف', desc: 'حذف الملفات المؤقتة' },
        { cmd: 'لمطور', desc: 'معرّف المستخدم' }
    ];

    // ✅ بناء النص
    const bodyText = `${EMOJI}━━━[ *قـائـمـة المطورين* ]━━━${EMOJI}

👑 ${DEVELOPER}
📜 *عدد الأوامر:* ${cmds.length}
${EMOJI} *اختر الأمر المناسب:*`;

    // ✅ بناء أزرار الأوامر
    const commandButtons = cmds.map(c => ({
        name: 'quick_reply',
        params: {
            display_text: `${EMOJI} ${c.cmd}`,
            id: `.${c.cmd}`
        }
    }));

    // ✅ زر الرجوع
    commandButtons.push({
        name: 'quick_reply',
        params: {
            display_text: `${EMOJI} الرئيسية`,
            id: `.${backCommand}`
        }
    });

    // ✅ إرسال قائمة المطورين كصورة + أزرار
    try {
        return await conn.sendButton(m.chat, {
            imageUrl: MAIN_IMAGE,
            bodyText: bodyText,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: commandButtons,
            mentions: [m.sender],
            newsletter: NEWSLETTER,
            interactiveConfig: { buttons_limits: 20 }
        }, m);
    } catch (e) {
        console.error('[sendDevMenu] فشل إرسال الأزرار:', e?.message);
        return safeText(conn, m, bodyText);
    }
  } catch (e) {
    console.error('[sendDevMenu] خطأ غير متوقع:', e?.message);
    return safeText(conn, m, `${EMOJI} *حصل خطأ في عرض القائمة، جرب تاني.*`);
  }
}

export { sendMainMenu, sendSectionMenu, sendDevMenu };