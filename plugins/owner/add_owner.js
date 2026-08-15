// 🍁 ملف: ضيف_مطور.js - إضافة مطور جديد - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const handler = async (m, { conn, bot }) => {
    try {
        // ✅ الحصول على المستخدم المطلوب
        const targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
        
        if (!targetLid) {
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} *أمر إضافة مطور جديد*\n\n📌 *الاستخدام:*\n.ضيف_مطور @المستخدم\n\nأو رد على رسالة المستخدم ثم اكتب .ضيف_مطور`
            }, { quoted: m });
        }

        // ✅ استخراج الرقم من الـ JID
        const targetNumber = targetLid.split('@')[0].split(':')[0];
        let userJid = targetNumber + '@s.whatsapp.net';
        let userName = 'مطور جديد';

        // ✅ محاولة الحصول على اسم المستخدم
        try {
            if (m.chat.endsWith('@g.us')) {
                const meta = await conn.groupMetadata(m.chat);
                const user = meta.participants.find(p => 
                    p.id === targetLid || 
                    p.phoneNumber === targetNumber
                );
                if (user) {
                    userName = user.name || user.displayName || 'مطور جديد';
                    userJid = user.phoneNumber + '@s.whatsapp.net';
                }
            }
        } catch (e) {
            console.log(`${EMOJI} فشل جلب بيانات المجموعة:`, e.message);
        }

        if (m.mentionedJid?.[0]) {
            userName = m.pushName || 'مطور جديد';
        }

        if (m.quoted?.sender) {
            try {
                const quotedSender = m.quoted.sender;
                const quotedNumber = quotedSender.split('@')[0].split(':')[0];
                if (quotedNumber === targetNumber) {
                    userName = m.quoted.pushName || 'مطور جديد';
                    userJid = quotedSender;
                }
            } catch (e) {}
        }

        // ✅ التحقق من أنه ليس مطوراً بالفعل
        const isAlreadyOwner = bot.config.owners.some(o => 
            o.jid === userJid || 
            o.jid?.split('@')[0] === targetNumber ||
            o.lid === targetLid
        );

        if (isAlreadyOwner) {
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} *الشخص ده مطور بالفعل*`
            }, { quoted: m });
        }

        // ✅ إضافة المطور الجديد
        const newOwner = {
            name: userName,
            jid: userJid,
            lid: targetLid,
            secondary: true,
            addedAt: Date.now()
        };

        // ✅ إضافة إلى config
        bot.config.owners.push(newOwner);

        // ✅ حفظ في قاعدة البيانات (UltraDB)
        try {
            if (!global.db) global.db = {};
            if (!global.db.data) global.db.data = {};
            if (!global.db.data.extraOwners) global.db.data.extraOwners = [];
            
            // إزالة أي إدخال مكرر
            global.db.data.extraOwners = global.db.data.extraOwners.filter(
                o => o.jid !== userJid && o.lid !== targetLid
            );
            global.db.data.extraOwners.push(newOwner);
            
            // ✅ حفظ قاعدة البيانات
            if (typeof global.db.save === 'function') {
                await global.db.save();
            }
            
            console.log(`${EMOJI} ✅ تم إضافة مطور جديد: ${userJid} (${userName})`);
        } catch (e) {
            console.error(`${EMOJI} فشل حفظ المطور:`, e.message);
        }

        // ✅ تحديث قائمة المطورين في bot
        try {
            // إعادة تحميل المطورين من قاعدة البيانات
            const extra = global.db?.data?.extraOwners || [];
            if (extra.length) {
                const cleaned = extra.map(({ secondary, ...rest }) => rest);
                // دمج مع المطورين الأساسيين دون تكرار
                const existingJids = new Set(bot.config.owners.map(o => o.jid));
                for (const owner of cleaned) {
                    if (!existingJids.has(owner.jid)) {
                        bot.config.owners.push(owner);
                    }
                }
            }
        } catch (e) {
            console.log(`${EMOJI} فشل تحديث قائمة المطورين:`, e.message);
        }

        // ✅ رد فعل مؤقت
        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

        // ✅ إرسال رسالة التأكيد
        const mention = targetLid;
        await conn.sendMessage(m.chat, {
            text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *✅ تَمَّ إِضَافَةُ مُطَوِّرٍ جَدِيدٍ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

👤 *الاسم:* ${userName}
📱 *الرقم:* ${targetNumber}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
*📋 الصلاحيات:*
├ 🔄 .رستارت
├ 🧹 .تنظيف
├ 📢 .اذاعه
└ 🗑️ .تنظيف_شامل

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
✅ *تم الحفظ - سيبقى بعد الريستارت*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`,
            mentions: [mention],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: CHANNEL_NAME,
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        // ✅ إرسال رسالة خاصة للمطور الجديد
        try {
            await conn.sendMessage(userJid, {
                text: `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *🎉 تَهَانِينَا!*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

🎊 *تم تعيينك كمطور في*\n${BOT_NAME}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
*📋 الأوامر المتاحة:*
├ .رستارت
├ .تنظيف
├ .اذاعه
└ .تنظيف_شامل

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
🔹 *استخدم الأوامر بمسؤولية*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`
            });
        } catch (e) {
            console.log(`${EMOJI} فشل إرسال رسالة خاصة للمطور الجديد:`, e.message);
        }

    } catch (error) {
        console.error(`${EMOJI} خطأ في إضافة المطور:`, error);
        await conn.sendMessage(m.chat, {
            text: `${EMOJI} ❌ *حدث خطأ في إضافة المطور*\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.usage = ['ضيف_مطور @مستخدم'];
handler.category = 'owner';
handler.command = ['ضيف_مطور', 'اضافه_مطور', 'add_owner', 'اضف_مطور'];
handler.owner = true;
handler.description = '👑 إضافة مطور جديد للبوت';

export default handler;