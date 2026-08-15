// 🍁 ملف: Rpg•صيد.js - نظام الصيد والمطاردة - ISAGI TENGEN BOT

import { ensureUser, saveUser } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const COOLDOWN = 30 * 60 * 1000; // 30 دقيقة

// قائمة الحيوانات
const objetos = [
    '🐗 خنزير بري',
    '🐍 ثعبان سام',
    '🐺 ذئب ضاري',
    '🐉 تنين صغير',
    '🦅 نسر ملكي',
    '🐰 أرنب سريع',
    '🦊 ثعلب ماكر',
    '🦁 أسد متوحش',
    '🐅 نمر مفترس',
    '🦄 حصان أحادي القرن',
    '🐉 وحش مجنح (Wyvern)',
    '🦖 ديناصور منقرض',
    '🕷️ عنكبوت عملاق',
    '🐉 تنين ناري',
    '🦦 ثعلب الماء السحري',
    '🐲 تنين شرقي',
    '🦈 سمكة قرش',
    '🐊 تمساح عملاق',
    '🦅 صقر حر',
    '🐻 دب ضخم',
    '🦌 غزال سريع',
    '🦚 طاووس سحري',
    '🦉 بومة حكيمة',
    '🐋 حوت عملاق'
];

function msToTime(duration) {
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const seconds = Math.floor((duration / 1000) % 60);
    return `${minutes} دقيقة ${seconds} ثانية`;
}

const handler = async (m, { conn }) => {
    const user = ensureUser(m.sender);
    const now = Date.now();
    const lastCazar = user.lastCazar || 0;

    // التحقق من الكولداون
    if (now - lastCazar < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastCazar);
        const time = msToTime(remaining);
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⏳ *يجب عليك الانتظار*\n📌 عُد بعد *${time}* للصيد مجدداً.`
        }, { quoted: m });
    }

    // اختيار الحيوان والمكافأة
    const resultado = objetos[Math.floor(Math.random() * objetos.length)];
    const recompensa = Math.floor(Math.random() * 15000) + 5000; // 5,000 - 20,000

    // إضافة المكافأة
    user.monedas = (user.monedas || 0) + recompensa;
    user.lastCazar = now;
    saveUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🏹 صَيْدْ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🎯 *صيدك:* ${resultado}
💰 *ربحت:* *${recompensa.toLocaleString()}* 🪙

🕐 *عُد بعد 30 دقيقة للصيد مجدداً!*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`
    }, { quoted: m });
};

handler.command = ['صيد', 'cazar', 'hunt', 'قنص', 'مطاردة'];
handler.category = 'rpg';

export default handler;