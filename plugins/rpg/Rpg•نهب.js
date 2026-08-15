// 🍁 ملف: Rpg•نهب.js - نظام نهب نقاط الخبرة (XP) - ISAGI TENGEN BOT

import { ensureUser, saveUser, addExp } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 2 * 60 * 60 * 1000; // ساعتان
const MAX_ROB = 3000; // الحد الأقصى لنقاط XP التي يمكن سرقتها

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    let parts = [];
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (minutes > 0) parts.push(`${minutes} دقيقة`);
    if (seconds > 0) parts.push(`${seconds} ثانية`);
    return parts.length > 0 ? parts.join(' و ') : 'أقل من ثانية';
}

const handler = async (m, { conn }) => {
    const user = ensureUser(m.sender);
    const now = Date.now();

    // 1. التحقق من الكولداون
    if (user.lastRob2 && now - user.lastRob2 < COOLDOWN) {
        const timeLeft = msToTime(COOLDOWN - (now - user.lastRob2));
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *مازال نظام النهب في وضع الاستراحة*\n📌 انتظر ${timeLeft} لتتمكن من النهب مجدداً.`
        }, { quoted: m });
    }

    // 2. تحديد الهدف
    let target;
    if (m.isGroup) {
        target = m.mentionedJid?.[0] || m.quoted?.sender;
    } else {
        target = m.chat;
    }

    if (!target) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} 🚩 *يجب عليك ذكر شخص ما (تاغ) لنهبه.*`
        }, { quoted: m });
    }
    if (target === m.sender) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} 🚩 *لا يمكنك نهب نفسك! هذا غباء.*`
        }, { quoted: m });
    }

    const targetUser = ensureUser(target);

    // 3. التحقق من أن الضحية لديها XP كافية
    const targetExp = targetUser.exp || 0;
    if (targetExp < MAX_ROB) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} 😔 @${target.split("@")[0]} يمتلك أقل من *${MAX_ROB} XP*\nلا تسرق الفقراء!`,
            mentions: [target]
        }, { quoted: m });
    }

    // 4. حساب المبلغ المسروق
    const robbedAmount = Math.floor(Math.random() * MAX_ROB);

    // 5. تحديث الأرصدة وتسجيل وقت النهب
    // خصم من الضحية
    targetUser.exp = (targetUser.exp || 0) - robbedAmount;
    saveUser(target, targetUser);

    // إضافة للسارق (مع تحديث المستوى والرتبة)
    const result = await addExp(m.sender, robbedAmount);
    user.lastRob2 = now;
    saveUser(m.sender, user);

    // 6. رسالة النجاح
    let msg = `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🥷 نَهْبْ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🚩 *نجحت عملية النهب!*
💰 *حصلت على:* *${robbedAmount} XP*
👤 *من:* @${target.split("@")[0]}
💵 *رصيدك:* ${(result.user.exp || 0).toLocaleString('ar-EG')} XP

🕐 *عُد بعد ساعتين للنهب مجدداً!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`;

    if (result.leveledUp) {
        msg += `\n\n${result.levelUpMsg}`;
    }

    await conn.sendMessage(m.chat, {
        text: msg,
        mentions: [target]
    }, { quoted: m });
};

handler.command = ['نهب', 'نصب'];
handler.category = 'rpg';

export default handler;