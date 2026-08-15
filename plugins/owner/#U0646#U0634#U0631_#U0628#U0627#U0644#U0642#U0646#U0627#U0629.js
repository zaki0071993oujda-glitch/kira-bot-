// 🍁 ملف: نشر_بالقناة.js - ISAGI TENGEN BOT

// 🍁 قناة ISAGI TENGEN - تم التحديث
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const EMOJI = '🍁';

// 🍁 التحقق من المطور
const isOwner = (m, bot) => {
    if (!bot?.config?.owners) return false;
    return bot.config.owners.some(o => 
        m.sender === o.jid || 
        m.sender === o.lid || 
        m.sender?.split('@')[0] === o.jid?.split('@')[0]
    );
};

const handler = async (m, { conn, text, bot }) => {
    // ✅ التحقق من صلاحيات المطور
    if (!isOwner(m, bot)) {
        return m.reply(`*${EMOJI} الأمر ده للمطورين فقط*`);
    }
    
    // ✅ التحقق من وجود النص
    if (!text?.trim()) {
        return m.reply(
            `${EMOJI} *أمر النشر في القناة*\n\n` +
            `📝 *الاستخدام:*\n` +
            `.نشر_بالقناة النص المراد نشره\n\n` +
            `📌 *مثال:*\n` +
            `.نشر_بالقناة تحديث جديد للبوت! 🎉`
        );
    }

    // ✅ معالجة النص (إضافة توقيع البوت)
    const message = `🍁━━━[ *${CHANNEL_NAME}* ]━━━🍁\n\n${text.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n🍁 ${CHANNEL_NAME}`;

    try {
        // ✅ محاولة الإرسال للقناة
        await conn.sendMessage(CHANNEL_JID, { 
            text: message 
        });
        
        return m.reply(
            `✅ *تم النشر في القناة بنجاح!*\n\n` +
            `📢 ${CHANNEL_NAME}\n` +
            `📝 ${text.trim().slice(0, 50)}...\n\n` +
            `${EMOJI} تم الإرسال`
        );
    } catch (e) {
        console.error('🍁 فشل النشر:', e);
        
        // ✅ محاولة بديلة: إرسال بدون توقيع
        try {
            await conn.sendMessage(CHANNEL_JID, { 
                text: text.trim() 
            });
            return m.reply(`✅ *تم النشر في القناة (بدون توقيع)*\n🍁 ${CHANNEL_NAME}`);
        } catch (e2) {
            return m.reply(
                `*❌ فشل النشر في القناة*\n\n` +
                `📌 ${e2?.message?.slice(0, 80) || 'خطأ غير معروف'}\n\n` +
                `${EMOJI} تأكد من أن البوت عضو في القناة`
            );
        }
    }
};

handler.usage    = ['نشر_بالقناة'];
handler.category = 'settings';
handler.command  = ['نشر_بالقناة', 'publish', 'قناة_نشر'];
handler.owner    = true;
handler.cooldown = 3000;

export default handler;;
