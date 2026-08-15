// 🍁 ملف: rpg-هدية.js - نظام صندوق الحظ والهدايا - ISAGI TENGEN BOT

import { ensureUser, saveUser } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 30 * 60 * 1000; // 30 دقيقة

const handler = async (m, { conn }) => {
    const user = ensureUser(m.sender);
    const now = Date.now();
    const lastBox = user.lastbox || 0;

    // 1. التحقق من الكولداون
    if (now - lastBox < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastBox);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *انتظر يا تنغن!*\n📌 عليك الانتظار *${minutes} دقيقة و ${seconds} ثانية* لفتح صندوق حظ جديد.`
        }, { quoted: m });
    }

    // 2. حساب الجائزة
    const especial = Math.random() < 0.01; // 1% فرصة للجائزة الخاصة
    let premio;

    if (especial) {
        premio = 500000;
        await conn.sendMessage(m.chat, {
            text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *✨🎉 مَبْرُوكٌ! 🎉✨*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🌟 *لقد ربحت صندوق الحظ الأسطوري!*

💰 *الجائزة:* *${premio.toLocaleString()}* 🪙

🔥 *فلترافقك الثروة والبركة في مغامراتك القادمة!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`
        }, { quoted: m });
    } else {
        premio = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
        await conn.sendMessage(m.chat, {
            text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🎁 صُنْدُوقُ الْحَظِّ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

📦 *لقد فتحت صندوق حظ عادياً!*

💰 *ربحت:* *${premio.toLocaleString()}* 🪙

🕐 *عُد بعد 30 دقيقة لفتح صندوق جديد!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`
        }, { quoted: m });
    }

    // 3. إضافة الجائزة وتحديث الوقت
    user.monedas = (user.monedas || 0) + premio;
    user.lastbox = now;
    saveUser(m.sender, user);
};

handler.command = ['صندوق-الحظ', 'box', 'حظي', 'هدية'];
handler.category = 'rpg';

export default handler;