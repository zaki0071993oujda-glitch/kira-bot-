// 🍁 ملف: plugins/bank/نظام_البنك.js - نظام البنك والمستخدمين - ISAGI TENGEN BOT

import { canLevelUp } from '../../system/levelling.js';

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
export function addExp(sender, amount) {
    const user = ensureUser(sender);
    
    user.exp = (user.exp || 0) + amount;
    user.points = (user.points || 0) + amount;
    
    // التحقق من رفع المستوى
    let levelUp = false;
    while (canLevelUp(user.level, user.exp)) {
        user.level += 1;
        levelUp = true;
    }
    
    if (levelUp) {
        user.role = getRole(user.level);
        const bonus = user.level * 50;
        user.points = (user.points || 0) + bonus;
    }
    
    saveUser(sender, user);
    return { user, levelUp };
}

// ────────────────[✅ إضافة نقاط تلقائية]────────────────
export function addAutoPoints(sender) {
    const user = ensureUser(sender);
    const pointsEarned = Math.floor(Math.random() * 5) + 1; // 1-5 نقاط
    
    user.points = (user.points || 0) + pointsEarned;
    user.exp = (user.exp || 0) + pointsEarned;
    
    // التحقق من رفع المستوى
    let levelUp = false;
    while (canLevelUp(user.level, user.exp)) {
        user.level += 1;
        levelUp = true;
    }
    
    if (levelUp) {
        user.role = getRole(user.level);
        const bonus = user.level * 50;
        user.points = (user.points || 0) + bonus;
    }
    
    saveUser(sender, user);
    return { pointsEarned, levelUp };
}

// ────────────────[تنسيق الأرقام]────────────────
export function formatNumber(num) {
    return num ? num.toLocaleString('ar-EG') : '0';
}

// ────────────────[✅ تصدير جميع الدوال]────────────────
export default {
    ROLES,
    getRole,
    ensureUser,
    getUser,
    saveUser,
    addExp,
    addAutoPoints,
    formatNumber
};