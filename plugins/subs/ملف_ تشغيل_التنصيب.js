// 🍁 ملف: تشغيل_التنصيب.js - تشغيل/إيقاف التنصيب - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// ✅ دالة للحصول على اسم المجموعة (بدلاً من conn.getName)
async function getGroupName(conn, jid) {
    try {
        const meta = await conn.groupMetadata(jid);
        return meta.subject || jid;
    } catch (e) {
        return jid;
    }
}

const handler = async (m, { conn, bot, text, args }) => {
    // ✅ التحقق من المطور
    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );
    
    if (!isOwner) {
        return m.reply(`${EMOJI} *الأمر للمطورين فقط*`);
    }

    // ✅ تحديد المجموعة المستهدفة (المجموعة الحالية)
    const targetGroup = m.chat;

    // ✅ التحقق من أن المستهدف مجموعة
    if (!targetGroup.includes('@g.us')) {
        return m.reply(`${EMOJI} *⚠️ هذا الأمر يعمل في المجموعات فقط*`);
    }

    const action = args[0]?.toLowerCase().trim();

    // ✅ تهيئة التخزين لكل مجموعة
    if (!global._subSettings) global._subSettings = {};
    if (!global._subSettings[targetGroup]) {
        global._subSettings[targetGroup] = {
            noSub: false,
            disabledCommands: [],
            disabledCategories: []
        };
    }

    const settings = global._subSettings[targetGroup];

    if (action === 'on' || action === 'تشغيل') {
        // ✅ تشغيل التنصيب في هذه المجموعة فقط
        settings.noSub = false;
        
        const groupName = await getGroupName(conn, targetGroup);
        return m.reply(
            `${EMOJI}━━━[ *✅ تم تشغيل التنصيب* ]━━━${EMOJI}\n\n` +
            `📌 *المجموعة:* ${groupName}\n` +
            `📌 *الحالة:* ✅ مفعل\n\n` +
            `${EMOJI} *${BOT_NAME}*`
        );
        
    } else if (action === 'off' || action === 'ايقاف') {
        // ✅ إيقاف التنصيب في هذه المجموعة فقط
        settings.noSub = true;
        
        const groupName = await getGroupName(conn, targetGroup);
        return m.reply(
            `${EMOJI}━━━[ *⏸️ تم إيقاف التنصيب* ]━━━${EMOJI}\n\n` +
            `📌 *المجموعة:* ${groupName}\n` +
            `📌 *الحالة:* ❌ موقف\n\n` +
            `${EMOJI} *${BOT_NAME}*`
        );
        
    } else {
        // ✅ عرض حالة التنصيب في هذه المجموعة
        const status = settings.noSub ? '❌ موقف' : '✅ مفعل';
        const groupName = await getGroupName(conn, targetGroup);
        
        return m.reply(
            `${EMOJI}━━━[ *🔧 نظام التنصيب* ]━━━${EMOJI}\n\n` +
            `📌 *المجموعة:* ${groupName}\n` +
            `📌 *الحالة:* ${status}\n\n` +
            `📝 *.تشغيل_التنصيب on* - تشغيل في هذه المجموعة\n` +
            `📝 *.تشغيل_التنصيب off* - إيقاف في هذه المجموعة\n\n` +
            `${EMOJI} *${BOT_NAME}*`
        );
    }
};

// ✅ before hook - التحقق قبل تنفيذ أمر التنصيب
handler.before = async (m, { conn, bot }) => {
    // ✅ إذا كان الأمر "تنصيب" أو "install"
    const body = m.body || '';
    if (!body.startsWith('.تنصيب') && !body.startsWith('.install') && !body.startsWith('.setup')) {
        return false;
    }

    // ✅ التحقق من المطور (يستثنى من الحظر)
    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );
    if (isOwner) return false;

    const chatId = m.chat;
    
    // ✅ التحقق من إعدادات المجموعة
    if (!global._subSettings) global._subSettings = {};
    const settings = global._subSettings[chatId];
    
    // ✅ إذا كان التنصيب موقفاً في هذه المجموعة
    if (settings?.noSub) {
        await m.reply(
            `${EMOJI} *🚫 التنصيب موقف في هذه المجموعة*\n\n` +
            `📌 للتواصل مع المطور: .المطور`
        );
        return true; // منع التنفيذ
    }

    return false; // السماح بالتنفيذ
};

handler.command = ['تشغيل_التنصيب', 'تفعيل_التنصيب', 'تنصيب_جروب'];
handler.category = 'owner';

export default handler;