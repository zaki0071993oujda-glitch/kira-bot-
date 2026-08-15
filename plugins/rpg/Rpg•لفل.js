// 🍁 ملف: Rpg•لفل.js - عرض المستوى والتقدم - ISAGI TENGEN BOT

import { xpRange, canLevelUp, getProgressBar, getLevelUpMessage } from '../../system/levelling.js';
import { ensureUser, getRole, formatNumber } from '../bank/نظام_البنك.js';
import { getLevelImage, getRandomImage } from '../../lib/images.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const CHANNEL_INFO = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_JID,
            newsletterName: CHANNEL_NAME,
            serverMessageId: -1
        }
    }
};

// ────────────────[دالة حساب التقدم]────────────────
function getProgress(level, exp) {
    const expForNext = level * 100 || 100;
    return Math.min(100, Math.floor((exp / expForNext) * 100));
}

// ────────────────[الأمر الرئيسي]────────────────
const handler = async (m, { conn }) => {
    try {
        // ─── جلب بيانات المستخدم ──────────────────────────
        const user = ensureUser(m.sender);
        const name = m.pushName || 'مستخدم';
        
        let level = user.level || 0;
        const exp = user.exp || 0;
        const role = user.role || getRole(level);
        const points = user.points || 0;
        
        // ─── الحصول على صورة المستوى ──────────────────────
        const levelImage = getLevelImage(level);
        const randomImage = getRandomImage();
        const useRandom = Math.random() < 0.3;
        const imageUrl = useRandom ? randomImage : levelImage;

        // ─── حساب التقدم ──────────────────────────────────
        const progressPercent = getProgress(level, exp);
        const expForNext = level * 100 || 100;
        const xpNeeded = expForNext - exp;

        // ─── شريط التقدم ──────────────────────────────────
        const barLength = 15;
        const filled = Math.min(barLength, Math.floor((progressPercent / 100) * barLength));
        const progressBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

        // ─── بناء الرسالة ──────────────────────────────────
        const text = `${EMOJI}━━[ *📈 حارسك الشخصي* ]━━${EMOJI}

👤 *الاسم:* ${name}
📊 *المستوى:* ${level}
👑 *الرتبة:* ${role}
💎 *النقاط:* ${formatNumber(points)}
${progressBar} ${progressPercent}%

✨ *الخبرة:* ${formatNumber(exp)} XP
🎯 *المتبقي:* ${xpNeeded > 0 ? formatNumber(xpNeeded) : '0'} XP

${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}
📌 *تفاعل لترفع مستواك!*
📌 *.بنك* لعرض الترتيب
${EMOJI} *${BOT_NAME}*`;

        // ─── إرسال الصورة مع الكابشن ──────────────────────
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: text,
            ...CHANNEL_INFO
        }, { quoted: m });

    } catch (error) {
        console.error('❌ خطأ في أمر المستوى:', error);
        
        await conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *حدث خطأ*\n\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`,
            ...CHANNEL_INFO
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.command = ['مستوى', 'lvl', 'levelup', 'level', 'لفل', 'رتبتي', 'بروفايلي', 'myprofile'];
handler.category = 'rpg';
handler.description = '📈 عرض المستوى والتقدم';
handler.usage = '.مستوى';

export default handler;