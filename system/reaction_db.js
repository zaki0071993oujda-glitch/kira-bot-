// 🍁 system/reaction_db.js - قاعدة بيانات التفاعلات - ISAGI TENGEN BOT

// ❌ لا تستخدم import uuid
// import { v4 as uuidv4 } from 'uuid';

// تخزين الاشتراكات في الذاكرة
let subscriptions = [];
let idCounter = 0;

// 🍁 توليد ID بسيط (بدون مكتبة)
function generateId() {
    idCounter++;
    return `sub_${idCounter}_${Date.now()}`;
}

// 🍁 الحصول على اشتراكات قناة معينة
export const getSubsByChannel = (channelJid) => {
    return subscriptions.filter(sub => 
        sub.channelJid === channelJid && 
        sub.active !== false &&
        Date.now() < sub.expiresAt
    );
};

// 🍁 الحصول على جميع الاشتراكات
export const getAllSubs = () => {
    return subscriptions;
};

// 🍁 الحصول على اشتراكات مستخدم معين
export const getSubsByUser = (userId) => {
    return subscriptions.filter(sub => sub.owner === userId && sub.active !== false);
};

// 🍁 إضافة اشتراك جديد
export const addSub = (data) => {
    const {
        id = generateId(),
        channelJid,
        owner,
        ownerName,
        expiresAt,
        durLabel,
        count = 3,
        emojis = ['😂','❤','✨','🍁','🔥'],
        chat
    } = data;
    
    const existing = subscriptions.find(s => s.channelJid === channelJid && s.owner === owner);
    if (existing) {
        existing.expiresAt = expiresAt;
        existing.count = count;
        existing.emojis = emojis;
        existing.active = true;
        existing.durLabel = durLabel;
        return existing;
    }
    
    const sub = {
        id,
        channelJid,
        owner,
        ownerName: ownerName || owner?.split('@')[0] || 'مستخدم',
        expiresAt,
        durLabel: durLabel || 'غير محدد',
        count,
        emojis,
        chat,
        active: true,
        createdAt: Date.now()
    };
    subscriptions.push(sub);
    return sub;
};

// 🍁 إزالة اشتراك
export const removeSub = (id) => {
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
        subscriptions[index].active = false;
        return true;
    }
    return false;
};

// 🍁 تفعيل اشتراك
export const activateSub = (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
        sub.active = true;
        return true;
    }
    return false;
};

// 🍁 الحصول على اشتراك بواسطة ID
export const getSub = (id) => {
    return subscriptions.find(s => s.id === id);
};

// 🍁 تنظيف الاشتراكات المنتهية
export const cleanExpired = () => {
    const now = Date.now();
    const expired = subscriptions.filter(s => s.expiresAt <= now && s.active !== false);
    subscriptions = subscriptions.filter(s => s.expiresAt > now || s.active === false);
    return expired;
};

// 🍁 تنسيق وقت الانتهاء
export const formatExpiry = (expiresAt) => {
    const now = Date.now();
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'انتهى';
    
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    
    if (days > 0) return `${days} يوم ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة ${mins} دقيقة`;
    return `${mins} دقيقة`;
};

// 🍁 تحويل رابط القناة إلى JID
export const parseChannelJid = (input) => {
    if (!input) return null;
    
    if (input.includes('@newsletter')) {
        return input.trim();
    }
    
    if (input.includes('whatsapp.com/channel')) {
        try {
            const url = new URL(input);
            const pathParts = url.pathname.split('/');
            const code = pathParts[pathParts.length - 1];
            if (code) {
                return `${code}@newsletter`;
            }
        } catch {}
    }
    
    if (/^\d+$/.test(input.trim())) {
        return `${input.trim()}@newsletter`;
    }
    
    return null;
};

export default {
    getSubsByChannel,
    getAllSubs,
    getSubsByUser,
    addSub,
    removeSub,
    activateSub,
    getSub,
    cleanExpired,
    formatExpiry,
    parseChannelJid
};