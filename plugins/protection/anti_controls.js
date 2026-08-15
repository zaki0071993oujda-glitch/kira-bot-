// تحكم في كل المضادات بأمر واحد (بدون مضاد الروابط)
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const ANTI_MAP = {
    // 'anti-link':    'antiLink',    'مضاد_روابط':     'antiLink',  // ❌ تم إزالته
    'anti-spam':    'antiSpam',    'مضاد_ازعاج':     'antiSpam',
    'anti-tag':     'antiTag',     'مضاد_منشن':      'antiTag',
    'anti-fake':    'antiFake',    'مضاد_وهمي':      'antiFake',
    'anti-bot':     'antiBots',    'مضاد_بوتات':     'antiBots',
    'anti-delete':  'antiDelete',  'كشف_المحذوف':    'antiDelete',
    'anti-edit':    'antiEdit',    'كشف_التعديل':    'antiEdit',
    'anti-media':   'antiMedia',   'مضاد_ميديا':     'antiMedia',
    'anti-sticker': 'antiSticker', 'مضاد_ستيكر':     'antiSticker',
    'anti-audio':   'antiAudio',   'مضاد_صوت':       'antiAudio',
    'anti-status-tag': 'antiStatusTag', 'مضاد_تاق_الحالات': 'antiStatusTag',
    'anti-status':  'antiStatusTag', 'مضاد_الحالات':  'antiStatusTag',
    'anti-forward': 'antiForward', 'مضاد_التوجيه':   'antiForward',
    'مضاد_اعادة_التوجيه': 'antiForward', 'مضاد_إعادة_التوجيه': 'antiForward',
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');

    await adminGuard(m, { conn, bot });
    if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

    const g = getG(m.chat);
    const key = ANTI_MAP[command];
    if (!key) return;

    const action = text?.trim()?.toLowerCase();
    if (!action) {
        const status = g[key] ? '✅ مفعل' : '❌ مطفي';
        return m.reply(`*${command}*\nالحالة: ${status}\n\nاستخدام:\n*.${command} تشغيل* للتفعيل\n*.${command} ايقاف* للإيقاف`);
    }

    const names = {
        // antiLink: '🔗 مضاد الروابط',  // ❌ تم إزالته
        antiSpam: '📢 مضاد الإزعاج',
        antiTag: '🏷️ مضاد المنشن الجماعي',
        antiFake: '📵 مضاد الأرقام الوهمية',
        antiBots: '🤖 مضاد البوتات',
        antiDelete: '🗑️ كشف الرسائل المحذوفة',
        antiEdit: '✏️ كشف التعديل',
        antiMedia: '🖼️ مضاد الميديا',
        antiSticker: '🎭 مضاد الستيكر',
        antiAudio: '🔉 مضاد الصوت',
        antiStatusTag: '📵 مضاد تاق الحالات',
        antiForward: '↪️ مضاد إعادة التوجيه'
    };

    if (action === 'on' || action === 'تشغيل') {
        g[key] = true;
        return m.reply(`✅ *تم تفعيل ${names[key] || key}*`);
    }

    if (action === 'off' || action === 'إيقاف' || action === 'ايقاف') {
        delete g[key];
        return m.reply(`✅ *تم إيقاف ${names[key] || key}*`);
    }

    return m.reply(`*استخدام:* .${command} تشغيل / ايقاف`);
};

// ❌ تم إزالة أوامر مضاد الروابط من القائمة
handler.command  = [
    // 'anti-link','مضاد_روابط',  // ❌ تم إزالتهما
    'anti-spam','مضاد_ازعاج',
    'anti-tag','مضاد_منشن',
    'anti-fake','مضاد_وهمي',
    'anti-bot','مضاد_بوتات',
    'anti-delete','كشف_المحذوف',
    'anti-edit','كشف_التعديل',
    'anti-media','مضاد_ميديا',
    'anti-sticker','مضاد_ستيكر',
    'anti-audio','مضاد_صوت',
    'anti-status-tag','مضاد_تاق_الحالات',
    'anti-status','مضاد_الحالات',
    'anti-forward','مضاد_التوجيه',
    'مضاد_اعادة_التوجيه','مضاد_إعادة_التوجيه'
];
handler.usage    = ['مضاد_ازعاج تشغيل/ايقاف'];
handler.admin    = true;
handler.category = 'protection';
export default handler;