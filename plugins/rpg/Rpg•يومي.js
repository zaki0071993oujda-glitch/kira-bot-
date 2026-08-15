// 🍁 ملف: Rpg•يومي.js - نظام المكافأة اليومية - ISAGI TENGEN BOT

import { ensureUser, saveUser, addExp } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 12 * 60 * 60 * 1000; // 12 ساعة

function msToTime(duration) {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const handler = async (m, { conn, isPrems }) => {
    const user = ensureUser(m.sender);
    const now = Date.now();
    const lastClaim = user.lastClaim || 0;

    // 1. التحقق من الكولداون
    if (now - lastClaim < COOLDOWN) {
        const timeLeft = msToTime(COOLDOWN - (now - lastClaim));
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *نظام المكافآت في وضع الاستراحة*\n📌 عُد في: *${timeLeft}*`
        }, { quoted: m });
    }

    // 2. تحديد المكافآت
    const coin = pickRandom([500, 700, 1000, 1500, 2000, 3000, 5000]);
    const exp = isPrems
        ? pickRandom([1500, 2000, 2500, 3000, 4000])
        : pickRandom([700, 900, 1200, 1500, 1800]);
    const diamonds = pickRandom([1, 2, 3, 4, 5]);

    // 3. إضافة المكافآت
    user.monedas = (user.monedas || 0) + coin;
    user.diamond = (user.diamond || 0) + diamonds;
    user.lastClaim = now;
    saveUser(m.sender, user);

    // إضافة XP مع تحديث المستوى والرتبة
    const result = await addExp(m.sender, exp);

    // 4. رسالة الاستلام
    let msg = `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🎁 مَكَافَأَةٌ يَوْمِيَّةٌ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🕐 *تم توليد مكافأتك بواسطة النظام.*
👤 @${m.sender.split("@")[0]}
⭐ *عضوية مميزة:* ${isPrems ? '✅' : '❌'}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
💰 *العملات:* +${coin} 🪙
✨ *الخبرة (XP):* +${exp}
💎 *الماس:* +${diamonds}

🕐 *يمكنك إعادة المطالبة بعد 12 ساعة.*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`;

    if (result.leveledUp) {
        msg += `\n\n${result.levelUpMsg}`;
    }

    await conn.sendMessage(m.chat, {
        text: msg,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.command = ['يومي', 'daily', 'claim'];
handler.category = 'rpg';

export default handler;