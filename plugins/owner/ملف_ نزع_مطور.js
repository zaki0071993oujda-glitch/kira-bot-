// 🍁 ملف: نزع_مطور.js - إزالة مطور - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const handler = async (m, { conn, bot }) => {
    // ✅ الحصول على المستخدم المطلوب
    const targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
    
    if (!targetLid) {
        return m.reply(
            `${EMOJI} *أمر إزالة مطور*\n\n` +
            `📌 *الاستخدام:*\n` +
            `.نزع_مطور @المستخدم\n\n` +
            `أو رد على رسالة المستخدم ثم اكتب .نزع_مطور`
        );
    }

    // ✅ استخراج الرقم من الـ JID
    const targetNumber = targetLid.split('@')[0].split(':')[0];
    let userJid = targetNumber + '@s.whatsapp.net';
    let userName = 'مطور';

    // ✅ محاولة الحصول على اسم المستخدم
    try {
        if (m.chat.endsWith('@g.us')) {
            const meta = await conn.groupMetadata(m.chat);
            const user = meta.participants.find(p => 
                p.id === targetLid || 
                p.phoneNumber === targetNumber
            );
            if (user) {
                userName = user.name || user.displayName || 'مطور';
                userJid = user.phoneNumber + '@s.whatsapp.net';
            }
        }
    } catch (e) {
        console.log(`${EMOJI} فشل جلب بيانات المجموعة:`, e.message);
    }

    if (m.mentionedJid?.[0]) {
        userName = m.pushName || 'مطور';
    }

    if (m.quoted?.sender) {
        try {
            const quotedSender = m.quoted.sender;
            const quotedNumber = quotedSender.split('@')[0].split(':')[0];
            if (quotedNumber === targetNumber) {
                userName = m.quoted.pushName || 'مطور';
                userJid = quotedSender;
            }
        } catch (e) {}
    }

    // ✅ التحقق من أنه مطور بالفعل
    const ownerIndex = bot.config.owners.findIndex(o => 
        o.jid === userJid || 
        o.jid?.split('@')[0] === targetNumber ||
        o.lid === targetLid
    );

    if (ownerIndex === -1) {
        return m.reply(`${EMOJI} *الشخص ده مش مطور في البوت*`);
    }

    // ✅ منع إزالة المطور الأساسي (primary)
    const isPrimary = bot.config.owners[ownerIndex]?.primary === true;
    if (isPrimary) {
        return m.reply(
            `${EMOJI} *⚠️ لا يمكن إزالة المطور الأساسي!*\n\n` +
            `👤 *${userName}* هو المطور الأساسي للبوت ولا يمكن إزالته.`
        );
    }

    // ✅ الحصول على اسم المطور قبل الإزالة
    const removedOwner = bot.config.owners[ownerIndex];
    userName = removedOwner.name || userName;

    // ✅ إزالة المطور من config
    bot.config.owners.splice(ownerIndex, 1);

    // ✅ إزالة من قاعدة البيانات
    try {
        if (global.db?.data?.extraOwners) {
            global.db.data.extraOwners = global.db.data.extraOwners.filter(o => 
                o.jid !== userJid && 
                o.lid !== targetLid &&
                o.jid?.split('@')[0] !== targetNumber
            );
        }
        
        console.log(`${EMOJI} ✅ تم إزالة مطور: ${userJid} (${userName})`);
    } catch (e) {
        console.error(`${EMOJI} فشل إزالة المطور من قاعدة البيانات:`, e.message);
    }

    // ✅ إرسال رسالة التأكيد في الجروب/الخاص
    const mention = targetLid;
    await conn.sendMessage(m.chat, {
        text:
            `${EMOJI}━━━[ *🗑️ تم إزالة مطور* ]━━━${EMOJI}\n\n` +
            `👤 *الاسم:* ${userName}\n` +
            `📱 *الرقم:* ${targetNumber}\n\n` +
            `*✅ تم إلغاء صلاحيات المطور بنجاح*\n` +
            `🔒 لم يعد بإمكانه استخدام أوامر المطورين\n\n` +
            `${EMOJI} *تم الحفظ - سيبقى بعد الريستارت*`,
        mentions: [mention]
    }, { quoted: m });

    // ✅ إرسال رسالة خاصة للمطور المزال
    try {
        await conn.sendMessage(userJid, {
            text:
                `${EMOJI}━━━[ *⚠️ إلغاء صلاحية المطور* ]━━━${EMOJI}\n\n` +
                `🔴 *تم إلغاء صلاحيات المطور الخاصة بك في*\n${BOT_NAME}\n\n` +
                `👤 *تم الإلغاء بواسطة:* ${m.pushName || 'المطور الرئيسي'}\n\n` +
                `📋 *ما تم إلغاؤه:*\n` +
                `├ ❌ أوامر المطورين\n` +
                `├ ❌ صلاحية إدارة البوت\n` +
                `└ ❌ الوصول للإعدادات الحساسة\n\n` +
                `${EMOJI} *إذا كان هذا خطأ، تواصل مع المطور الرئيسي*`
        });
    } catch (e) {
        console.log(`${EMOJI} فشل إرسال رسالة خاصة للمطور المزال:`, e.message);
    }

    // ✅ إرسال إشعار للمطورين الآخرين (اختياري)
    try {
        const otherOwners = bot.config.owners.filter(o => 
            o.jid !== bot.config.owners[0]?.jid
        );
        
        for (const owner of otherOwners) {
            if (owner.jid && owner.jid !== userJid) {
                await conn.sendMessage(owner.jid, {
                    text:
                        `${EMOJI} *إشعار إدارة البوت*\n\n` +
                        `🔄 *تم إزالة مطور:* ${userName}\n` +
                        `📱 *الرقم:* ${targetNumber}\n` +
                        `👤 *بواسطة:* ${m.pushName || 'المطور الرئيسي'}\n` +
                        `🕐 *التاريخ:* ${new Date().toLocaleString('ar-EG')}`
                }).catch(() => {});
            }
        }
    } catch (e) {}
};

handler.usage = ['نزع_مطور @مستخدم'];
handler.category = 'owner';
handler.command = ['نزع_مطور', 'ازاله_مطور', 'remove_owner', 'حذف_مطور'];
handler.owner = true;

export default handler;