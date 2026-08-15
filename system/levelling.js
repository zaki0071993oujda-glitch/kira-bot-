// 🍁 system/levelling.js - نظام المستويات والخبرة

/**
 * حساب نطاق الخبرة للمستوى الحالي
 */
export function xpRange(level, multiplier = 1) {
    const min = level === 0 ? 0 : Math.floor((level * 100) * multiplier);
    const max = Math.floor(((level + 1) * 100) * multiplier);
    const xp = max - min;
    return { min, max, xp };
}

/**
 * التحقق من إمكانية رفع المستوى
 */
export function canLevelUp(level, exp, multiplier = 1) {
    const { max } = xpRange(level, multiplier);
    return exp >= max;
}

/**
 * حساب المستوى بناءً على الخبرة
 */
export function findLevel(exp, multiplier = 1) {
    let level = 0;
    while (canLevelUp(level, exp, multiplier)) {
        level++;
    }
    return level;
}

/**
 * حساب الخبرة المطلوبة للمستوى التالي
 */
export function expToNextLevel(level, multiplier = 1) {
    const { max } = xpRange(level, multiplier);
    return max;
}

/**
 * حساب نسبة التقدم
 */
export function getProgress(level, exp, multiplier = 1) {
    const { min, max } = xpRange(level, multiplier);
    const expInLevel = exp - min;
    const totalExpInLevel = max - min;
    return Math.min(100, Math.floor((expInLevel / totalExpInLevel) * 100));
}

/**
 * إنشاء شريط تقدم
 */
export function getProgressBar(level, exp, length = 15, multiplier = 1) {
    const progress = getProgress(level, exp, multiplier);
    const filled = Math.min(length, Math.floor((progress / 100) * length));
    return '█'.repeat(filled) + '░'.repeat(length - filled);
}

/**
 * الحصول على رسالة رفع المستوى
 */
export function getLevelUpMessage(level, role) {
    const messages = [
        { condition: level >= 100, message: `👑 *مهيب!* لقد وصلت لمستوى أسطوري!` },
        { condition: level >= 50, message: `🌟 *رائع!* أنت أسطورة حقيقية!` },
        { condition: level >= 30, message: `🔥 *مذهل!* أنت محترف حقيقي!` },
        { condition: level >= 20, message: `💪 *أحسنت!* أنت في طريقك للقمة!` },
        { condition: level >= 10, message: `✨ *جميل!* بدأت تتفوق على الآخرين!` },
        { condition: level >= 5, message: `🎉 *ممتاز!* أنت تتقدم بسرعة!` }
    ];
    
    const found = messages.find(m => m.condition);
    return found ? found.message : `🎊 *مبروك!* أول مستوى لك!`;
}

export default {
    xpRange,
    canLevelUp,
    findLevel,
    expToNextLevel,
    getProgress,
    getProgressBar,
    getLevelUpMessage
};