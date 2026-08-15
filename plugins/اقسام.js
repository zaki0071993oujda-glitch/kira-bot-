// 🍁 ملف: قائمة_ازرار.js - قائمة الأقسام مع جميع الألعاب والبنك - ISAGI TENGEN BOT

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

// 🍁 الأقسام
const CATEGORIES = {
    'game': { 
        name: '🎮 الألعاب', 
        commands: [
            { cmd: 'اكس', desc: '🎯 لعبة XO' },
            { cmd: 'احزر', desc: '🤔 احزر الشخصية' },
            { cmd: 'عين', desc: '👀 عيون الأنمي' },
            { cmd: 'سؤال', desc: '❓ اختبار الأنمي' },
            { cmd: 'رياضة', desc: '⚽ أسئلة كرة قدم' },
            { cmd: 'دين', desc: '🕌 أسئلة دينية' },
            { cmd: 'خمن', desc: '🎭 خمن الشخصية' },
            { cmd: 'شنق', desc: '✏️ املأ الفراغ' },
            { cmd: 'ايموجي', desc: '😊 تخمين الإيموجي' },
            { cmd: 'انمي', desc: '🎌 خمن الشخصية (جماعي)' },
            { cmd: 'عاصمة', desc: '🏛️ لعبة العواصم' },
            { cmd: 'تحدي_حجر_ورقة', desc: '✊ حجر ورقة مقص' },
            { cmd: 'تفكيك', desc: '🧩 تفكيك الكلمات' },
            { cmd: 'ترتيب', desc: '🔤 ترتيب الحروف' },
            { cmd: 'نرد', desc: '🎲 رمي النرد' },
            { cmd: 'حظ', desc: '🍀 اختبار الحظ' }
        ] 
    },
    'bank': { 
        name: '💰 البنك', 
        commands: [
            { cmd: 'رصيد', desc: '💎 عرض الرصيد' },
            { cmd: 'بنك', desc: '🏦 معلومات البنك' },
            { cmd: 'مستوى', desc: '📈 المستوى' },
            { cmd: 'يومية', desc: '🎁 مكافأة يومية' },
            { cmd: 'إيداع', desc: '📥 إيداع' },
            { cmd: 'سحب', desc: '📤 سحب' },
            { cmd: 'تحويل', desc: '🔄 تحويل نقاط' },
            { cmd: 'هدية', desc: '🎀 إرسال هدية' },
            { cmd: 'سرقة', desc: '🥷 سرقة عملات' },
            { cmd: 'نهب', desc: '⚔️ نهب XP' },
            { cmd: 'متصدرين', desc: '🏆 المتصدرين' },
            { cmd: 'عمل', desc: '💼 عمل يومي' },
            { cmd: 'توب', desc: '🏅 قائمة الأغنياء' }
        ] 
    },
    'anime': { 
        name: '🎌 الأنمي', 
        commands: [
            { cmd: 'شخصية_انمي', desc: '👤 معلومات شخصية' },
            { cmd: 'اقتباس_انمي', desc: '💬 اقتباسات' },
            { cmd: 'افضل_انمي', desc: '⭐ أفضل الأنميات' },
            { cmd: 'رشحلي_انمي', desc: '📺 ترشيح أنمي' },
            { cmd: 'انمي_صور', desc: '🖼️ صور أنمي' }
        ] 
    },
    'admins': { 
        name: '🛡️ الإدارة', 
        commands: [
            { cmd: 'تفعيل', desc: '✅ تفعيل' },
            { cmd: 'قفل', desc: '🔒 قفل الأوامر' },
            { cmd: 'فتح', desc: '🔓 فتح الأوامر' },
            { cmd: 'طرد', desc: '🚫 طرد عضو' },
            { cmd: 'حظر', desc: '⛔ حظر عضو' },
            { cmd: 'فك-حظر', desc: '✅ فك الحظر' },
            { cmd: 'كشف_البوتات', desc: '🤖 كشف البوتات' },
            { cmd: 'منشن', desc: '📢 منشن الجميع' },
            { cmd: 'ترقية', desc: '⬆️ ترقية مشرف' },
            { cmd: 'تنزيل', desc: '⬇️ تنزيل مشرف' }
        ] 
    },
    'download': { 
        name: '⬇️ التحميلات', 
        commands: [
            { cmd: 'تحميل', desc: '📥 تحميل عام' },
            { cmd: 'يوتيوب', desc: '▶️ يوتيوب' },
            { cmd: 'تيك', desc: '🎵 تيك توك' },
            { cmd: 'فيس', desc: '📘 فيسبوك' },
            { cmd: 'انستغرام', desc: '📸 انستغرام' },
            { cmd: 'صور', desc: '🖼️ بحث صور' },
            { cmd: 'شغل', desc: '🎶 تشغيل أغنية' },
            { cmd: 'تحميل_اغنية', desc: '🎵 تحميل أغنية' }
        ] 
    },
    'ai': { 
        name: '🧠 الذكاء', 
        commands: [
            { cmd: 'ذكاء', desc: '🤖 محادثة ذكية' },
            { cmd: 'جيميناي', desc: '✨ Gemini' },
            { cmd: 'ديبسيك', desc: '🧠 DeepSeek' },
            { cmd: 'توليد_صورة', desc: '🎨 توليد صورة' },
            { cmd: 'اسأل', desc: '❓ اسأل الذكاء' },
            { cmd: 'ai', desc: '🤖 AI مساعد' }
        ] 
    },
    'fun': { 
        name: '🎭 ترفيه', 
        commands: [
            { cmd: 'نكتة', desc: '😂 نكت' },
            { cmd: 'مغازلة', desc: '💕 مغازلة' },
            { cmd: 'تاج', desc: '🏷️ منشن عشوائي' },
            { cmd: 'غباء', desc: '🧠 اختبار الغباء' },
            { cmd: 'ذكاء', desc: '⚡ اختبار الذكاء' },
            { cmd: 'تهكير', desc: '💻 تهكير وهمي' },
            { cmd: 'صراحة', desc: '🗣️ أسئلة صراحة' },
            { cmd: 'لو', desc: '🤔 لو خيروك' },
            { cmd: 'مدح', desc: '🌟 مدح' },
            { cmd: 'قمع', desc: '🔇 قمع' },
            { cmd: 'اقتباس', desc: '📜 اقتباس' },
            { cmd: 'نصيحة', desc: '💡 نصيحة' }
        ] 
    },
    'owner': { 
        name: '👑 المطور', 
        commands: [
            { cmd: 'رستارت', desc: '🔄 إعادة تشغيل' },
            { cmd: 'تنظيف', desc: '🧹 تنظيف' },
            { cmd: 'حظر_من_البوت', desc: '⛔ حظر' },
            { cmd: 'فك_حظر_من_البوت', desc: '✅ فك حظر' },
            { cmd: 'ضيف_مطور', desc: '➕ إضافة مطور' },
            { cmd: 'نزع_مطور', desc: '➖ إزالة مطور' },
            { cmd: 'نقاط+', desc: '⬆️ إضافة نقاط' },
            { cmd: 'نقاط-', desc: '⬇️ خصم نقاط' },
            { cmd: 'عملات+', desc: '⬆️ إضافة عملات' },
            { cmd: 'عملات-', desc: '⬇️ خصم عملات' },
            { cmd: 'ماس+', desc: '💎 إضافة ماس' },
            { cmd: 'ماس-', desc: '💎 خصم ماس' }
        ] 
    },
    'tools': { 
        name: '🛠️ الأدوات', 
        commands: [
            { cmd: 'ترجمة', desc: '🌐 ترجمة' },
            { cmd: 'حاسبة', desc: '🧮 آلة حاسبة' },
            { cmd: 'كيو_ار', desc: '📱 QR Code' },
            { cmd: 'نسخ', desc: '📋 نسخ النص' },
            { cmd: 'تعديل', desc: '🎨 تعديل الصور' },
            { cmd: 'جودة', desc: '✨ تحسين جودة' },
            { cmd: 'لينك', desc: '🔗 رابط المجموعة' },
            { cmd: 'tomp3', desc: '🎵 فيديو إلى MP3' },
            { cmd: 'قص', desc: '✂️ قص فيديو' }
        ] 
    },
    'info': { 
        name: '📋 معلومات', 
        commands: [
            { cmd: 'معلومات', desc: '📊 معلومات البوت' },
            { cmd: 'حالة', desc: '📡 حالة البوت' },
            { cmd: 'وقت', desc: '🕐 التوقيت' },
            { cmd: 'المتصلين', desc: '📱 المتصلين' },
            { cmd: 'تاريخ', desc: '📅 التاريخ' }
        ] 
    },
    'sticker': { 
        name: '🌄 الملصقات', 
        commands: [
            { cmd: 'ستيكر', desc: '🎨 تحويل إلى ملصق' },
            { cmd: 'نص_ستيكر', desc: '📝 ملصق نصي' },
            { cmd: 'ستيكر_متحرك', desc: '🎬 ملصق متحرك' },
            { cmd: 'كولاج', desc: '🖼️ كولاج صور' }
        ] 
    }
};

// ── عرض القسم ──
async function showCategory(m, { conn, bot, catKey }) {
    const cat = CATEGORIES[catKey];
    if (!cat) {
        await m.reply(`${EMOJI} *قسم غير موجود*`);
        return;
    }

    const randomImage = getRandomImage();
    const commands = cat.commands;
    const bodyText = `${EMOJI} *${cat.name}* (${commands.length})`;

    const buttons = commands.map(cmd => ({
        name: 'quick_reply',
        params: {
            display_text: `${cmd.cmd}`,
            id: `.${cmd.cmd}`
        }
    }));

    buttons.push({
        name: 'quick_reply',
        params: {
            display_text: `🔙 رجوع`,
            id: `.اقسام`
        }
    });

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
}

// ── عرض القائمة الرئيسية ──
async function showMainMenu(m, { conn, bot }) {
    const randomImage = getRandomImage();
    const user = global.db?.data?.users?.[m.sender];
    const xp = user?.exp || 0;
    const level = user?.level || 0;
    const monedas = user?.monedas || 0;
    const diamond = user?.diamond || 0;

    const bodyText = `${EMOJI} *👑 ${BOT_NAME}*
👤 ${m.pushName || 'مجهول'} | 📈 ${level} | 🪙 ${monedas.toLocaleString('ar-EG')} | 💎 ${diamond || 0}`;

    const buttons = Object.keys(CATEGORIES).map(key => ({
        name: 'quick_reply',
        params: {
            display_text: CATEGORIES[key].name,
            id: `.قسم_${key}`
        }
    }));

    buttons.push({
        name: 'cta_url',
        params: {
            display_text: `📢 قناة البوت`,
            url: CHANNEL_LINK
        }
    });

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
}

// ── المعالج الرئيسي ──
const handler = async (m, { conn, bot, command, args }) => {
    if (command.startsWith('قسم_')) {
        const key = command.replace('قسم_', '');
        if (CATEGORIES[key]) {
            await showCategory(m, { conn, bot, catKey: key });
            return;
        }
        await m.reply(`${EMOJI} *قسم غير موجود*`);
        return;
    }

    await showMainMenu(m, { conn, bot });
};

handler.before = async (m, { conn, bot }) => {
    const body = m.body || '';

    if (body.startsWith('.قسم_')) {
        const key = body.replace('.قسم_', '');
        if (CATEGORIES[key]) {
            await showCategory(m, { conn, bot, catKey: key });
            return true;
        }
        await m.reply(`${EMOJI} *قسم غير موجود*`);
        return true;
    }

    if (body === '.اقسام' || body === '.قائمة_ازرار' || body === '.sections') {
        await showMainMenu(m, { conn, bot });
        return true;
    }

    return false;
};

handler.command = ['قائمة_ازرار', 'اقسام', 'sections'];
export default handler;