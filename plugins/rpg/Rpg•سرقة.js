// 🍁 ملف: Rpg•سرقة.js - نظام سرقة العملات - ISAGI TENGEN BOT

import { ensureUser, saveUser } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 2 * 60 * 60 * 1000; // ساعتان
const MIN_ROB = 2000;
const MAX_ROB = 50000;

// رسائل النجاح
const frases = [
    "💰 لقد حصلت على غنيمة جيدة من @TARGET.",
    "🪙 سرقت العملات ببراعة من @TARGET.",
    "🚀 نجاح كاسح! @TARGET لم يلاحظ شيئاً.",
    "🏴‍☠️ كقرصان حقيقي، سرقت من @TARGET.",
    "🎯 أصبت جيب @TARGET مباشرة.",
    "🕵️‍♂️ بخفاء، أخذت عملات من @TARGET.",
    "🔥 سرقت بسرعة قبل أن يتمكن @TARGET من الرد.",
    "💸 العملات تتطاير إلى جيبك من @TARGET.",
    "⚡ عملية سرقة خاطفة ومكتملة على @TARGET.",
    "🎉 حظ مؤقت حصلت عليه من @TARGET.",
    "👀 لم ير أحد كيف سرقت @TARGET.",
    "💎 أخذت عملات ثمينة من @TARGET.",
    "🥷 سرقت @TARGET بمهارة دون ترك أي أثر.",
    "🏹 كانت عملية سرقتك لـ @TARGET مثالية.",
    "🛡️ سرقت العملات بينما كان @TARGET مشتتاً."
];

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
    const lastRob = user.lastRob || 0;

    // 1. التحقق من الكولداون
    if (now - lastRob < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastRob);
        const time = msToTime(remaining);
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *نظام السرقة في وضع الاستراحة*\n📌 انتظر ${time} لتتمكن من السرقة مجدداً.`
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
            text: `${EMOJI} 📌 *يجب عليك ذكر شخص ما (تاغ) لسرقته.*`
        }, { quoted: m });
    }

    if (target === m.sender) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *لا يمكنك سرقة نفسك! هذا غباء.*`
        }, { quoted: m });
    }

    const targetUser = ensureUser(target);
    const targetMonedas = targetUser.monedas || 0;

    // 3. التحقق من الحد الأدنى للهدف
    if (targetMonedas < MIN_ROB) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} 😔 @${target.split('@')[0]} لديه أقل من ${MIN_ROB.toLocaleString()} عملة 🪙\n📌 لا تسرق الفقراء!`,
            mentions: [target]
        }, { quoted: m });
    }

    // 4. حساب المبلغ المسروق
    let robbedAmount;
    // 1% فرصة لسرقة كل شيء
    if (Math.random() < 0.01) {
        robbedAmount = targetMonedas;
    } else {
        robbedAmount = Math.floor(Math.random() * (MAX_ROB - MIN_ROB + 1)) + MIN_ROB;
        if (robbedAmount > targetMonedas) robbedAmount = targetMonedas;
    }

    // 5. تحديث الأرصدة
    user.monedas = (user.monedas || 0) + robbedAmount;
    targetUser.monedas = (targetUser.monedas || 0) - robbedAmount;
    user.lastRob = now;
    saveUser(m.sender, user);
    saveUser(target, targetUser);

    // 6. رسالة النجاح
    const frase = frases[Math.floor(Math.random() * frases.length)].replace('@TARGET', `@${target.split('@')[0]}`);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🦹 سَرِقَةٌ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

${frase}

💰 *سرقت:* *${robbedAmount.toLocaleString()}* 🪙
👤 *من:* @${target.split('@')[0]}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
💵 *رصيدك:* ${(user.monedas || 0).toLocaleString()} 🪙
🕐 *عُد بعد ساعتين للسرقة مجدداً!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`,
        mentions: [target]
    }, { quoted: m });
};

handler.command = ['سرقة', 'نصب', 'نهب', 'اغتيال', 'rob'];
handler.category = 'rpg';

export default handler;