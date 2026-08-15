// 🍁 ملف: لينك.js - رابط المجموعة مع أزرار مثل بوت_ومطور

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

const handler = async (m, { conn }) => {
    // التأكد من أن الأمر في مجموعة
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: `❌ *هذا الأمر في المجموعات فقط*`
        }, { quoted: m });
    }

    try {
        const chatId = m.chat;

        // ─── جلب رابط المجموعة ──────────────────────────
        const link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(chatId);

        // ─── جلب بيانات المجموعة ──────────────────────────
        const groupMetadata = await conn.groupMetadata(chatId);
        const groupName = groupMetadata.subject || 'المجموعة';

        // ─── محاولة جلب صورة المجموعة ──────────────────
        let groupImage;
        try {
            groupImage = await conn.profilePictureUrl(chatId, 'image');
        } catch (e) {
            groupImage = MAIN_IMAGE;
        }

        // ─── رد فعل مؤقت ──────────────────────────────────
        await conn.sendMessage(chatId, {
            react: { text: '🔗', key: m.key }
        });

        // ─── إرسال الصورة مع الأزرار (مثل بوت_ومطور) ──
        await conn.sendButton(chatId, {
            imageUrl: groupImage,
            bodyText: `🔗 *${groupName}*\n\n📌 اضغط على الزر لنسخ الرابط`,
            footerText: `${EMOJI} ${BOT_NAME}`,
            buttons: [
                {
                    name: 'cta_copy',
                    params: {
                        display_text: '📋 نسخ الرابط',
                        copy_code: link
                    }
                },
                {
                    name: 'cta_url',
                    params: {
                        display_text: '🔗 فتح الرابط',
                        url: link
                    }
                }
            ],
            mentions: [m.sender],
            newsletter: {
                name: CHANNEL_NAME,
                jid: CHANNEL_JID
            },
            interactiveConfig: { buttons_limits: 2 }
        }, m);

    } catch (error) {
        console.error('❌ خطأ في أمر لينك:', error);
        await conn.sendMessage(m.chat, {
            text: `❌ *حدث خطأ في جلب الرابط*\n📌 ${error.message || 'يرجى المحاولة مرة أخرى'}`
        }, { quoted: m });
    }
};

// ────────────────[إعدادات الأمر]────────────────
handler.usage = ['لينك'];
handler.category = 'group';
handler.command = ['لينك', 'link', 'رابط', 'invite'];
handler.description = '🔗 عرض رابط المجموعة مع زر النسخ';

export default handler;