// 🍁 ملف: أوامر القناة - ISAGI TENGEN BOT

// 🍁 قناة ISAGI TENGEN - تم التحديث
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

const handler = async (m, { conn, command, text }) => {

    // 🍁 أمر الانضمام للقناة
    if (command === 'انضم_القناة' || command === 'join_channel') {
        let channelJid = CHANNEL_JID;
        
        // استخراج الـ JID من النص إذا وُجد
        if (text?.trim()) {
            const t = text.trim();
            // لو رابط invite
            if (t.includes('chat.whatsapp.com') || t.includes('whatsapp.com/channel')) {
                try {
                    await m.reply('⏳ *جاري الانضمام إلى القناة...* 🍁');
                    // محاولة استخراج الكود من الرابط
                    const code = t.split('/').pop().split('?')[0];
                    await conn.groupAcceptInvite(code);
                    return m.reply(`✅ *تم الانضمام بنجاح!*\n🍁 ${CHANNEL_NAME}`);
                } catch (e) {
                    return m.reply(`*❌ فشل الانضمام:* ${e.message?.slice(0, 80)}`);
                }
            }
            if (t.includes('@newsletter')) channelJid = t;
        }

        // محاولة الانضمام بطرق مختلفة
        try {
            // الطريقة 1: newsletterFollow
            await conn.newsletterFollow(channelJid);
            return m.reply(`✅ *تم الانضمام للقناة بنجاح!*\n🍁 ${CHANNEL_NAME}`);
        } catch (e) {
            console.log('🍁 newsletterFollow فشل:', e.message);
            try {
                // الطريقة 2: followNewsletter
                await conn.followNewsletter(channelJid);
                return m.reply(`✅ *تم الانضمام للقناة!*\n🍁 ${CHANNEL_NAME}`);
            } catch (e2) {
                console.log('🍁 followNewsletter فشل:', e2.message);
                try {
                    // الطريقة 3: إرسال رابط القناة
                    await conn.sendMessage(m.chat, {
                        text: `🍁 *قناة ISAGI TENGEN BOT*\n\n📢 ${CHANNEL_LINK}\n\n*اضغط على الرابط للانضمام*`
                    });
                    return m.reply(`✅ *تم إرسال رابط القناة*\n🍁 اضغط على الرابط للانضمام`);
                } catch (e3) {
                    return m.reply(`*❌ فشل الانضمام:* ${e3.message?.slice(0, 80)}`);
                }
            }
        }
    }

    // 🍁 أمر تفعيل/إيقاف التفاعل
    if (command === 'تفاعل_القناة' || command === 'channel_react') {
        const val = text?.trim()?.toLowerCase();
        if (!global._channelReact) global._channelReact = {};

        if (val === 'on' || val === 'تشغيل') {
            global._channelReact[CHANNEL_JID] = true;
            return m.reply('✅ *تم تفعيل التفاعل التلقائي مع القناة* 🍁');
        }
        if (val === 'off' || val === 'ايقاف') {
            delete global._channelReact[CHANNEL_JID];
            return m.reply('✅ *تم إيقاف التفاعل* 🍁');
        }
        
        const status = global._channelReact?.[CHANNEL_JID] ? '✅ مفعل' : '❌ مطفي';
        return m.reply(
            `🍁━━━[ *أوامر القناة* ]━━━🍁\n\n` +
            `📢 *القناة:* ${CHANNEL_NAME}\n` +
            `📌 *الحالة:* ${status}\n\n` +
            `*.انضم_القناة* → الانضمام للقناة\n` +
            `*.تفاعل_القناة on* → تفعيل التفاعل\n` +
            `*.تفاعل_القناة off* → إيقاف التفاعل\n\n` +
            `🍁 ${CHANNEL_LINK}`
        );
    }
};

handler.command  = ['انضم_القناة', 'join_channel', 'تفاعل_القناة', 'channel_react'];
handler.usage    = ['انضم_القناة', 'تفاعل_القناة on/off'];
handler.owner    = true;
handler.category = 'settings';
export default handler;