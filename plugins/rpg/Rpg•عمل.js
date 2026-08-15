// 🍁 ملف: Rpg•عمل.js - نظام العمل وكسب المال - ISAGI TENGEN BOT

import { ensureUser, saveUser } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 60 * 60 * 1000; // 1 ساعة
const MIN_REWARD = 1000;
const MAX_REWARD = 5000;

// قائمة الوظائف
const trabajos = [
    'مبرمج 💻', 'هاكر 🕶️', 'سائق توصيل 🚴', 'خباز 🥖',
    'محارب ⚔️', 'ساحر 🔮', 'صياد 🏹', 'عامل منجم ⛏️',
    'ستريمر 🎥', 'طباخ 👨‍🍳', 'مرتزق 💣', 'رائد فضاء 🚀',
    'قرصان 🏴‍☠️', 'موسيقي 🎸', 'فنان 🎨', 'إطفائي 🚒',
    'شرطي 👮', 'محقق 🕵️', 'قاضٍ ⚖️', 'راقص 💃',
    'مهندس 🏗️', 'كاتب ✍️', 'مصور 📸', 'بائع 🛍️'
];

function msToTime(duration) {
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor((duration / 1000 / 60 / 60) % 24);
    return `${hours} ساعة ${minutes} دقيقة`;
}

const handler = async (m, { conn }) => {
    const user = ensureUser(m.sender);
    const now = Date.now();
    const lastWork = user.lastWork || 0;

    // التحقق من الكولداون
    if (now - lastWork < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastWork);
        const time = msToTime(remaining);
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *لقد عملت مؤخراً*\n📌 عُد بعد *${time}* لكسب المزيد من العملات.`
        }, { quoted: m });
    }

    // اختيار الوظيفة والمكافأة
    const trabajoElegido = trabajos[Math.floor(Math.random() * trabajos.length)];
    const recompensa = Math.floor(Math.random() * (MAX_REWARD - MIN_REWARD + 1)) + MIN_REWARD;

    // إضافة المكافأة
    user.monedas = (user.monedas || 0) + recompensa;
    user.lastWork = now;
    saveUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *💼 عَمَلْ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

✅ *عملت كـ:* ${trabajoElegido}
💰 *ربحت:* *${recompensa.toLocaleString()}* 🪙

🕐 *عُد بعد ساعة للمواصلة!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`
    }, { quoted: m });
};

handler.command = ['عمل', 'trabajar', 'work', 'وورك'];
handler.category = 'rpg';

export default handler;