import axios from 'axios';

const handler = async (m, { conn, command, text }) => {
    const parts = (text || '').trim().split(/\s+/);

    if (command === 'سورة') {
        const num = parseInt(parts[0], 10);
        if (!num || num < 1 || num > 114) {
            return m.reply('*⚠️ اكتب رقم السورة من 1 لـ 114*\n> مثال: `سورة 1` (الفاتحة)\n> عشان تجيب اية بعينها استخدم: `اية <رقم السورة> <رقم الاية>`');
        }
        try {
            const { data } = await axios.get(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`, { timeout: 10000 });
            if (data.code !== 200) return m.reply('*❌ معرفتش أجيب السورة دي*');

            const surah = data.data;
            const ayahsToShow = surah.ayahs.slice(0, 5);
            const text2 = ayahsToShow.map(a => `${a.text} ﴿${a.numberInSurah}﴾`).join('\n');

            return conn.sendMessage(m.chat, {
                text:
                    `╭─┈─┈─⟞📖⟝─┈─┈─╮\n┃ *سورة ${surah.name} (${surah.englishName})*\n╰─┈─┈─⟞🕋⟝─┈─┈─╯\n\n` +
                    `${text2}\n\n` +
                    (surah.numberOfAyahs > 5 ? `> _السورة فيها ${surah.numberOfAyahs} اية، دي أول 5 بس. لو عايز اية معينة استخدم:_ \`بحث_اية ${num} رقم_الاية\`` : '')
            }, { quoted: m });
        } catch {
            return m.reply('*❌ حصلت مشكلة في جلب السورة، حاول تاني*');
        }
    }

    if (command === 'بحث_اية') {
        const surahNum = parseInt(parts[0], 10);
        const ayahNum = parseInt(parts[1], 10);
        if (!surahNum || !ayahNum) {
            return m.reply('*⚠️ اكتب رقم السورة ورقم الاية*\n> مثال: `بحث_اية 2 255` (اية الكرسي)');
        }
        try {
            const { data } = await axios.get(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/quran-uthmani`, { timeout: 10000 });
            if (data.code !== 200) return m.reply('*❌ معرفتش أجيب الاية دي، تأكد من الأرقام*');

            const a = data.data;
            return conn.sendMessage(m.chat, {
                text: `📖 *${a.surah.name} - اية ${a.numberInSurah}*\n\n${a.text}`
            }, { quoted: m });
        } catch {
            return m.reply('*❌ حصلت مشكلة في جلب الاية، حاول تاني*');
        }
    }
};

handler.usage    = ['سورة', 'بحث_اية'];
handler.category = 'religion';
handler.command  = ['سورة', 'بحث_اية'];
handler.cooldown = 3000;

export default handler;
