// 🍁 ملف: plugins/bank/نظام_البنك.js - نظام البنك والمستخدمين - ISAGI TENGEN BOT

import { canLevelUp, xpRange } from '../../system/levelling.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// ────────────────[الرتب حسب المستوى]────────────────
export const ROLES = {
    0: '🌱 مبتدئ',
    5: '🐣 جديد',
    10: '⚡ متعلم',
    20: '🌟 طالب',
    30: '🔥 محترف',
    40: '💎 خبير',
    50: '👑 أسطورة',
    75: '🌟 خرافي',
    100: '🚀 أسطوري',
    150: '🦸 خارق',
    200: '👾 إلهي',
    300: '⚡ نصف إله',
    500: '🌌 كوني',
    1000: '♾️ لا نهائي'
};

// ────────────────[الحصول على الرتبة]────────────────
export function getRole(level) {
    let role = ROLES[0];
    for (const [minLevel, roleName] of Object.entries(ROLES)) {
        if (level >= parseInt(minLevel)) {
            role = roleName;
        }
    }
    return role;
}

// ────────────────[ضمان وجود المستخدم]────────────────
export function ensureUser(sender) {
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};
    
    if (!global.db.data.users[sender]) {
        global.db.data.users[sender] = {
            name: 'مستخدم',
            level: 0,
            exp: 0,
            points: 0,
            bank: 0,
            monedas: 0,
            diamond: 0,
            gamesWon: 0,
            gamesPlayed: 0,
            giftsSent: 0,
            giftsReceived: 0,
            registered: Date.now()
        };
    }
    return global.db.data.users[sender];
}

// ────────────────[الحصول على مستخدم]────────────────
export function getUser(sender) {
    return global.db?.data?.users?.[sender] || null;
}

// ────────────────[حفظ المستخدم]────────────────
export function saveUser(sender, data) {
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};
    global.db.data.users[sender] = data;
    try {
        if (typeof global.db.save === 'function') global.db.save();
    } catch (e) {}
}

// ────────────────[إضافة نقاط]────────────────
export async function addExp(sender, amount) {
    const user = ensureUser(sender);
    const before = user.level || 0;
    
    user.exp = (user.exp || 0) + amount;
    
    let level = before;
    while (canLevelUp(level, user.exp)) {
        level++;
    }
    user.level = level;
    user.role = getRole(level);
    
    saveUser(sender, user);
    
    const leveledUp = level > before;
    let reward = 0;
    let levelUpMsg = null;
    
    if (leveledUp) {
        reward = Math.floor(100 + (level * 50) + Math.random() * 100);
        user.exp = (user.exp || 0) + reward;
        while (canLevelUp(level, user.exp)) {
            level++;
        }
        user.level = level;
        user.role = getRole(level);
        saveUser(sender, user);
        
        const msgs = [
            `🎉 رفع المستوى إلى ${level}! 💰 +${reward} نقطة`,
            `⚡ مستوى جديد! 📈 ${level} | 💰 +${reward} نقطة`,
            `🌟 ترقية! 📈 ${level} | 💰 +${reward} نقطة`
        ];
        levelUpMsg = msgs[Math.floor(Math.random() * msgs.length)];
    }
    
    return { user, leveledUp, reward, levelUpMsg };
}

// ────────────────[تنسيق الأرقام]────────────────
export function formatNumber(num) {
    return num ? num.toLocaleString('ar-EG') : '0';
}

// ────────────────[تصدير افتراضي]────────────────
export default {
    ROLES,
    getRole,
    ensureUser,
    getUser,
    saveUser,
    addExp,
    formatNumber
};