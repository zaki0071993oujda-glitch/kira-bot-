const handler = async (m, { conn, text }) => {
  if (!text) return conn.msgUrl(m.chat,
    '*📚 أمر بحث المانجا*',
    {
      img: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
      title: '🔍 بحث مانجا',
      body: 'اكتب اسم المانجا جنب الأمر',
      big: false,
      mentions: [m.sender],
      newsletter: {
        name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363422581600030@newsletter'
      }
    },
    m
  );

  m.react('⏳');

  try {
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(text)}&limit=6&availableTranslatedLanguage[]=ar&availableTranslatedLanguage[]=en&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[relevance]=desc`
    );
    const { data: results } = await searchRes.json();

    let mangas = results;
    if (!mangas || mangas.length === 0) {
      const fallbackRes = await fetch(
        `https://api.mangadex.org/manga?title=${encodeURIComponent(text)}&limit=6&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[relevance]=desc`
      );
      const fallback = await fallbackRes.json();
      mangas = fallback.data;
    }

    if (!mangas || mangas.length === 0) {
      m.react('❌');
      return m.reply(`*❌ ~ مفيش مانجا اسمها " ${text} "، جرب كلمة تانية*`);
    }

    const cards = mangas.map((manga) => {
      const attr = manga.attributes;

      const title =
        attr.title?.ar ||
        attr.title?.en ||
        Object.values(attr.title || {})[0] ||
        'بدون اسم';

      const rawDesc =
        attr.description?.ar ||
        attr.description?.en ||
        Object.values(attr.description || {})[0] ||
        'لا يوجد وصف';

      const desc = rawDesc.length > 120 ? rawDesc.slice(0, 120) + '...' : rawDesc;

      const statusMap = {
        ongoing: '🟢 مستمرة',
        completed: '✅ مكتملة',
        hiatus: '⏸️ متوقفة مؤقتاً',
        cancelled: '❌ ملغاة',
      };
      const status = statusMap[attr.status] || attr.status || 'غير معروف';
      const chapters = attr.lastChapter ? `📖 ${attr.lastChapter} فصل` : '📖 غير محدد';
      const year = attr.year ? `📅 ${attr.year}` : '';

      const coverRel = manga.relationships?.find(r => r.type === 'cover_art');
      const coverFile = coverRel?.attributes?.fileName;
      const imageUrl = coverFile
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}.256.jpg`
        : 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg';

      const mangaUrl = `https://mangadex.org/title/${manga.id}`;

      return {
        imageUrl,
        bodyText: `*📚 ${title}*\n\n${desc}\n\n${status} | ${chapters}${year ? ' | ' + year : ''}`,
        footerText: `🔖 MangaDex`,
        buttons: [
          { name: 'cta_url', params: { display_text: '🌐╎ قراءة المانجا', url: mangaUrl } },
          { name: 'cta_copy', params: { display_text: '📋╎ نسخ الرابط', copy_code: mangaUrl } }
        ]
      };
    });

    m.react('✅');

    return await conn.sendCarousel(m.chat, {
      headerText: `📚 نتائج البحث عن ❝ *${text}* ❞`,
      globalFooterText: '← اسحب لرؤية المزيد • MangaDex',
      cards,
      mentions: [m.sender],
      newsletter: {
        name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363422581600030@newsletter'
      }
    }, m);

  } catch (e) {
    console.error('[manga]', e.message);
    m.react('❌');
    return m.reply('*❌ حصل خطأ في البحث، حاول تاني بعد شوية*');
  }
};

handler.usage    = ['مانجا'];
handler.category = 'search';
handler.command  = ['مانجا', 'manga', 'بحث_مانجا'];
handler.cooldown = 5000;
handler.disabled = false;

export default handler;