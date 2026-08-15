// 🍁 ملف: ضيف_ديف.js - إضافة مطور ثانوي - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';

const handler = async (m, { conn, bot }) => {
    // ✅ الحصول على المستخدم المطلوب
    const targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!targetLid) {
        return m.reply(
            `${EMOJI} *أمر إضافة مطور ثانوي*\n\n` +
            `📌 *الاستخدام:*\n` +
            `.ضيف_ديف @المستخدم\n\n` +
            `أو رد على رسالة المستخدم ثم اكتب .ضيف_ديف`
        );
    }

    // ✅ الحصول على بيانات المستخدم من الجروب
    let user;
    try {
        const meta = await conn.groupMetadata(m.chat);
        user = meta.participants.find(p => p.id === targetLid);
    } catch {
        return m.reply(`${EMOJI} *لازم تستخدم الأمر في جروب*`);
    }

    if (!user) {
        return m.reply(`${EMOJI} *مش قادر أجيب بيانات الشخص*`);
    }

    // ✅ استخراج المعلومات
    const rawPhone = user.phoneNumber;
    const jid = (typeof rawPhone === 'string' && rawPhone.includes('@s.whatsapp.net'))
        ? rawPhone
        : String(rawPhone || user.id || '').replace(/@.*/, '') + '@s.whatsapp.net';

    const lid = String(user.id || targetLid);
    const phone = jid.replace('@s.whatsapp.net', '').split(':')[0];

    if (!phone || phone === 'undefined') {
        return m.reply(`${EMOJI} *مش قادر أجيب رقم الشخص*`);
    }

    // ✅ التحقق من أنه ليس مطوراً بالفعل
    const alreadyOwner = bot.config.owners.some(o =>
        (o.jid && o.jid === jid) || (o.lid && o.lid === lid)
    );
    if (alreadyOwner) {
        return m.reply(`${EMOJI} *الشخص ده مطور بالفعل*`);
    }

    // ✅ إضافة المطور الجديد
    const newOwner = { 
        name: user.name || 'مطور ثانوي', 
        jid, 
        lid, 
        secondary: true 
    };
    
    bot.config.owners.push(newOwner);

    // ✅ حفظ في قاعدة البيانات
    try {
        if (!global.db) global.db = {};
        if (!global.db.data) global.db.data = {};
        if (!global.db.data.extraOwners) global.db.data.extraOwners = [];
        
        // إزالة أي إدخال مكرر
        global.db.data.extraOwners = global.db.data.extraOwners.filter(
            o => o.jid !== jid && o.lid !== lid
        );
        global.db.data.extraOwners.push(newOwner);
        
        console.log(`${EMOJI} تم إضافة مطور جديد: ${phone}`);
    } catch (e) {
        console.error('🍁 فشل حفظ المطور:', e);
    }

    // ✅ إرسال رسالة التأكيد في الجروب
    await conn.sendMessage(m.chat, {
        text:
            `${EMOJI}━━━[ *تم إضافة مطور ثانوي* ]━━━${EMOJI}\n\n` +
            `👤 @${phone}\n` +
            `📛 ${user.name || 'مطور ثانوي'}\n\n` +
            `*📋 الصلاحيات:*\n` +
            `├ 🔄 *.رستارت* - إعادة تشغيل البوت\n` +
            `├ 🧹 *.تنظيف* - حذف الملفات المؤقتة\n` +
            `├ 📢 *.اذاعه* - إرسال رسالة للجميع\n` +
            `└ 🗑️ *.تنظيف_شامل* - تنظيف شامل\n\n` +
            `${EMOJI} *تم الحفظ - سيبقى بعد الريستارت*`,
        mentions: [lid]
    }, { quoted: m });

    // ✅ إرسال رسالة خاصة للمطور الجديد
    try {
        await conn.sendMessage(jid, {
            text:
                `${EMOJI}━━━[ *تهانينا!* ]━━━${EMOJI}\n\n` +
                `🎉 *تم تعيينك كمطور ثانوي في*\n${BOT_NAME}\n\n` +
                `👑 *المطور الرئيسي:* ${DEVELOPER}\n\n` +
                `*📋 الأوامر المتاحة:*\n` +
                `├ .رستارت - إعادة تشغيل البوت\n` +
                `├ .تنظيف - حذف الملفات المؤقتة\n` +
                `├ .اذاعه - إرسال رسالة للجميع\n` +
                `└ .تنظيف_شامل - تنظيف شامل\n\n` +
                `${EMOJI} *استخدم الأوامر بمسؤولية*`
        });
    } catch (e) {
        console.log('🍁 فشل إرسال رسالة خاصة للمطور الجديد');
    }
};

handler.usage    = ['ضيف_ديف @مستخدم'];
handler.category = 'owner';
handler.command  = ['ضيف_ديف', 'اضافه_ديف', 'add_dev', 'اضف_مطور'];
handler.owner    = true;

export default handler;