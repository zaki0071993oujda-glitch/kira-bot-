// 🍁 ملف: Rpg•رانك.js - مجلس الحكم الملكي (ترتيب الشخصيات) - ISAGI TENGEN BOT

import { ensureUser } from '../bank/نظام_البنك.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

const handler = async (m, { conn, args }) => {
    const user = ensureUser(m.sender);
    
    // 1. التحقق من وجود شخصيات للمنافسة
    if (!user.personajes || !user.personajes.length) {
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ⚠️ *تحتاج إلى امتلاك شخصيات للمنافسة في مجلس الحكم الملكي.*`
        }, { quoted: m });
    }

    // 2. تهيئة قاعدة بيانات مجلس الحكم
    if (!global.db.reinado) global.db.reinado = {};

    // 3. التحقق من المالك (Owner)
    const isOwner = m.sender === '212723062183@s.whatsapp.net' || 
                    m.sender === '212687411464@s.whatsapp.net';

    // 4. أمر إعادة تعيين المجلس
    if (args[0] === 'reset') {
        if (!isOwner) {
            return conn.sendMessage(m.chat, {
                text: `${EMOJI} ❌ *لا تملك الإذن لإعادة تعيين مجلس الحكم الملكي.*`
            }, { quoted: m });
        }
        global.db.reinado = {};
        return conn.sendMessage(m.chat, {
            text: `${EMOJI} ✅ *تم إعادة تعيين مجلس الحكم الملكي بنجاح.*`
        }, { quoted: m });
    }

    // 5. حساب القوة السحرية للمستخدم
    const personajesGlobal = [...(global.personajesTop || []), ...(global.personajesNormales || [])];

    const poder = user.personajes.reduce((acc, nombrePj) => {
        const pj = personajesGlobal.find(p => p.nombre?.toLowerCase() === nombrePj.toLowerCase());
        return acc + (pj?.precio || 100000);
    }, 0) + Math.floor(Math.random() * 50000);

    // 6. تسجيل قوة المستخدم في مجلس الحكم
    global.db.reinado[m.sender] = poder;

    // 7. إنشاء قائمة الترتيب
    const ranking = Object.entries(global.db.reinado)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // 8. بناء رسالة الترتيب
    const textoRanking = await Promise.all(ranking.map(async ([jid, poder], i) => {
        const isJidOwner = jid === '212723062183@s.whatsapp.net' || 
                          jid === '212687411464@s.whatsapp.net';

        let nombre;
        if (isJidOwner) {
            nombre = '👑 *الملك الساحر* (Owner)';
        } else {
            try {
                nombre = await conn.getName(jid) || '@' + jid.split('@')[0];
            } catch {
                nombre = '@' + jid.split('@')[0];
            }
        }

        const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹';
        return `${medalla} *${i + 1}.* ${nombre} — القوة: *${poder.toLocaleString()}*`;
    }));

    // 9. معرفة مركز المستخدم
    const posUsuario = ranking.findIndex(([jid]) => jid === m.sender);

    const texto = `${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
    *👑 مَجْلِسُ الْحُكْمِ الْمَلَكِيِّ*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}

*أقوى 10 في السحر:*

${textoRanking.join('\n')}

${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}
📌 *مركزك الحالي:* ${posUsuario + 1 || 'خارج الترتيب'}
🔮 *قوتك السحرية:* ${(poder || 0).toLocaleString()}

💡 *استخدم هذه القوة لتثبت تفوقك السحري.*
${EMOJI} *${BOT_NAME}*
${EMOJI}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${EMOJI}`;

    await conn.sendMessage(m.chat, {
        text: texto,
        mentions: ranking.map(([jid]) => jid)
    }, { quoted: m });
};

handler.command = ['مجلس', 'رانك'];
handler.category = 'rpg';

export default handler;