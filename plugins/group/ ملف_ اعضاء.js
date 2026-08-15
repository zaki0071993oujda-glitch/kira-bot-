// 🍁 ملف: اعضاء.js - عرض أعضاء المجموعة - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// 🖼️ قائمة الصور العشوائية
const IMAGES = [
    'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg',
    'https://i.postimg.cc/Ls393WJK/mntnmanlanlamlt.jpg',
    'https://i.postimg.cc/cLd4h99Q/1ec6d4d9d187860bebecd5655c2130a7.jpg',
    'https://i.postimg.cc/L5m0w1r1/6539a3ddd4b8e9804e2235afa2928e4a.jpg',
    'https://i.postimg.cc/BQHBH6yw/49361b48a01156b70d4e94f5a954aa3f.jpg',
    'https://i.postimg.cc/J7JkdFqB/fe5a547f50ff075c6697d8802c96f31f.jpg',
    'https://i.postimg.cc/T1CG4GHh/c4bac4df1cf0be95920442ceae42fa8e.jpg',
    'https://i.postimg.cc/tTBM0TpC/c8c75a230d652e70a57f364f2c3c20b9.jpg',
    'https://i.postimg.cc/L8FvbfL5/bb5f15bce9d3efdb69edae96cd559cb9.jpg',
    'https://i.postimg.cc/nhnSLBrZ/41187c79fcad726d466fa80e90a51207.jpg',
    'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg',
    'https://i.postimg.cc/JnTyPJ74/telechargement-(4).jpg',
    'https://i.postimg.cc/XJx2L2ys/anime-7-63864269925437.jpg'
];

// 🎲 دالة اختيار صورة عشوائية
function getRandomImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

let handler = async (m, { conn, participants }) => {
    const randomImage = getRandomImage();

    // ✅ تفاعل
    try {
        await conn.sendMessage(m.chat, { react: { text: '👥', key: m.key } });
    } catch {}

    // ✅ التحقق من أن البوت في جروب
    if (!m.isGroup) {
        return m.reply(`${EMOJI} ❌ هذا الأمر للمجموعات فقط`);
    }

    // ✅ تصنيف الأعضاء
    const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    const members = participants.filter(p => !p.admin);

    // ✅ بناء النص
    let text = `${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}
*👥 أعضاء المجموعة*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}

📊 *المجموع:* ${participants.length}
👑 *الأدمنية:* ${admins.length}
👤 *الأعضاء:* ${members.length}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}
*👑 الأدمنية*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}

`;

    // ✅ عرض الأدمنية
    if (admins.length > 0) {
        for (const admin of admins) {
            const role = admin.admin === 'superadmin' ? '🌟' : '👑';
            text += `${role} @${admin.id.split('@')[0]}\n`;
        }
    } else {
        text += `📭 لا يوجد أدمنية\n`;
    }

    text += `\n${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}
*👤 الأعضاء*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}

`;

    // ✅ عرض الأعضاء (أول 50)
    if (members.length > 0) {
        const showMembers = members.slice(0, 50);
        for (const member of showMembers) {
            text += `⚡ @${member.id.split('@')[0]}\n`;
        }
        if (members.length > 50) {
            text += `\n... و ${members.length - 50} عضو آخر`;
        }
    } else {
        text += `📭 لا يوجد أعضاء عاديين\n`;
    }

    text += `\n${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}
🍁 ${BOT_NAME}
${EMOJI}━━━━━━━━━━━━━━━━━━━━━${EMOJI}`;

    // ✅ إرسال القائمة مع صورة عشوائية
    const mentions = participants.map(p => p.id);

    try {
        await conn.sendMessage(m.chat, {
            image: { url: randomImage },
            caption: text,
            mentions: mentions,
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
    } catch (error) {
        // إذا فشل إرسال الصورة، نرسل النص فقط
        await conn.sendMessage(m.chat, {
            text: text,
            mentions: mentions,
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
    }
};

handler.help = ['اعضاء'];
handler.tags = ['group'];
handler.command = /^(اعضاء|اعضا|members|listmembers|الأعضاء|المجموعة)$/i;
handler.group = true;

export default handler;