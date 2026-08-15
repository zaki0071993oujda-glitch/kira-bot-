const CLAUDE_API = 'https://super-fire.vercel.app/api/claude?text=';

// بنجرب أكتر من اسم حقل شائع لأننا مش متأكدين من شكل رد الـ API بالظبط
function extractAnswer(data) {
    if (typeof data === 'string') return data;
    return data?.result || data?.message || data?.response || data?.answer
        || data?.text || data?.data?.result || data?.data?.message || null;
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('🤖 ~ حط سؤالك أو رسالتك جنب الأمر ~\n\nمثال: .كلود من أنت؟');

    const loadingMsg = await conn.sendMessage(m.chat, {
        text: '```⏳ جـاري تـجـهـيـز الـرد...```',
        contextInfo: context(m.sender)
    }, { quoted: m });

    try {
        const url = CLAUDE_API + encodeURIComponent(text.trim());
        const res = await fetch(url, { signal: AbortSignal.timeout(30000) });

        const raw = await res.text();
        console.log('[claude.js] رد الـ API (خام):', raw.slice(0, 300));

        if (!res.ok) throw new Error(`السيرفر رجع خطأ ${res.status}`);

        let data;
        try { data = JSON.parse(raw); } catch { data = raw; }

        const answer = extractAnswer(data);
        if (!answer) throw new Error('الـ API رجع رد فاضي أو شكل مش متوقع');

        await conn.sendMessage(m.chat, {
            text: answer,
            edit: loadingMsg.key,
            contextInfo: context(m.sender)
        });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `*❌ حصل خطأ:* ${e.message}`,
            edit: loadingMsg.key,
            contextInfo: context(m.sender)
        });
    }
};

handler.usage    = ['كلود'];
handler.category = 'ai';
handler.command  = ['كلود', 'claude'];

export default handler;

const context = (jid) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422581600030@newsletter',
        newsletterName: '⚜️ 𝐎𝐑𝐀𝐂𝐋𝐄 | 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐒𝐲𝐬𝐭𝐞𝐦',
        serverMessageId: 0
    },
    externalAdReply: {
        title: '🤖 Claude AI | كلود',
        body: '𝙰𝚗𝚝𝚑𝚛𝚘𝚙𝚒𝚌 𝙲𝚕𝚊𝚞𝚍𝚎 ~ 𝙾𝚛𝚊𝚌𝚕𝚎 𝙱𝚘𝚝',
        thumbnailUrl: 'https://i.postimg.cc/NMLN73FQ/328bf8cccafe63879d903f2b99d835a0.jpg',
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});
