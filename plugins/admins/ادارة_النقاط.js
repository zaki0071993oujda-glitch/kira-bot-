// 🍁 ملف: ادارة_النقاط.js - إدارة نقاط المستخدمين (للمطور فقط) - ISAGI TENGEN BOT

import { ensureUser, saveUser, addExp } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';

// قائمة المطورين
const OWNERS = [
    '212723062183@s.whatsapp.net',
    '212687411464@s.whatsapp.net'
];

function isOwner(sender) {
    return OWNERS.includes(sender);
}

// ✅ أمر إضافة نقاط
const addPointsHandler = async (m, { conn, args }) => {
    if (!isOwner(m.sender)) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *هذا الأمر للمطور فقط*`
        }, { quoted: m });
    }

    const target = m.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const amount = parseInt(args[1]);

    if (!target || !amount || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *الاستخدام:* .نقاط+ @مستخدم 100`
        }, { quoted: m });
    }

    const result = await addExp(target, amount);

    let msg = `${EMOJI} ✅ *تم إضافة ${amount} نقطة* 👤 @${target.split('@')[0]}\n💵 *الرصيد:* ${(result.user.exp || 0).toLocaleString('ar-EG')}`;
    if (result.leveledUp) {
        msg += `\n\n${result.levelUpMsg}`;
    }

    await conn.sendMessage(m.chat, {
        text: msg,
        mentions: [target]
    }, { quoted: m });
};
addPointsHandler.command = ['نقاط+', 'addpoints'];
addPointsHandler.category = 'admin';

// ✅ أمر خصم نقاط
const removePointsHandler = async (m, { conn, args }) => {
    if (!isOwner(m.sender)) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *هذا الأمر للمطور فقط*`
        }, { quoted: m });
    }

    const target = m.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const amount = parseInt(args[1]);

    if (!target || !amount || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *الاستخدام:* .نقاط- @مستخدم 100`
        }, { quoted: m });
    }

    const user = ensureUser(target);
    user.exp = Math.max(0, (user.exp || 0) - amount);
    saveUser(target, user);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI} ✅ *تم خصم ${amount} نقطة* 👤 @${target.split('@')[0]}\n💵 *الرصيد:* ${(user.exp || 0).toLocaleString('ar-EG')}`,
        mentions: [target]
    }, { quoted: m });
};
removePointsHandler.command = ['نقاط-', 'removepoints'];
removePointsHandler.category = 'admin';

// ✅ أمر إضافة عملات
const addCoinsHandler = async (m, { conn, args }) => {
    if (!isOwner(m.sender)) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *هذا الأمر للمطور فقط*`
        }, { quoted: m });
    }

    const target = m.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const amount = parseInt(args[1]);

    if (!target || !amount || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *الاستخدام:* .عملات+ @مستخدم 100`
        }, { quoted: m });
    }

    const user = ensureUser(target);
    user.monedas = (user.monedas || 0) + amount;
    saveUser(target, user);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI} ✅ *تم إضافة ${amount} عملة* 👤 @${target.split('@')[0]}\n🪙 *الرصيد:* ${(user.monedas || 0).toLocaleString('ar-EG')}`,
        mentions: [target]
    }, { quoted: m });
};
addCoinsHandler.command = ['عملات+', 'addcoins'];
addCoinsHandler.category = 'admin';

// ✅ أمر خصم عملات
const removeCoinsHandler = async (m, { conn, args }) => {
    if (!isOwner(m.sender)) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *هذا الأمر للمطور فقط*`
        }, { quoted: m });
    }

    const target = m.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const amount = parseInt(args[1]);

    if (!target || !amount || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *الاستخدام:* .عملات- @مستخدم 100`
        }, { quoted: m });
    }

    const user = ensureUser(target);
    user.monedas = Math.max(0, (user.monedas || 0) - amount);
    saveUser(target, user);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI} ✅ *تم خصم ${amount} عملة* 👤 @${target.split('@')[0]}\n🪙 *الرصيد:* ${(user.monedas || 0).toLocaleString('ar-EG')}`,
        mentions: [target]
    }, { quoted: m });
};
removeCoinsHandler.command = ['عملات-', 'removecoins'];
removeCoinsHandler.category = 'admin';

export {
    addPointsHandler,
    removePointsHandler,
    addCoinsHandler,
    removeCoinsHandler
};