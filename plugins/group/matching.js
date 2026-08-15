const handler = async (m, { conn }) => {
    try {
        const { Scrapy } = await import('esewsub');
        const res = await Scrapy.Matching();
        const { data } = JSON.parse(res);

        // ✅ التحقق من صحة الروابط
        if (!data?.boy || !data?.girl) {
            throw new Error('روابط الصور غير موجودة');
        }

        // ✅ تحميل الصور أولاً ثم إرسالها (لحل مشكلة الروابط المخفية)
        const { default: axios } = await import('axios');
        
        // تحميل صورة الولد
        const boyResponse = await axios.get(data.boy, { 
            responseType: 'arraybuffer',
            timeout: 10000
        });
        const boyBuffer = Buffer.from(boyResponse.data);

        // تحميل صورة البنت
        const girlResponse = await axios.get(data.girl, { 
            responseType: 'arraybuffer',
            timeout: 10000
        });
        const girlBuffer = Buffer.from(girlResponse.data);

        // ✅ إرسال الصور كـ Buffer
        await conn.sendMessage(m.chat, {
            image: boyBuffer,
            caption: `👦 *صورة ولد*\n\n📌 مطابقة عشوائية`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            image: girlBuffer,
            caption: `👧 *صورة بنت*\n\n📌 مطابقة عشوائية`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true
            }
        }, { quoted: m });

    } catch (error) {
        console.error('خطأ في التطقيم:', error);
        await m.reply('❌ *حدث خطأ، حاول مرة أخرى*\n' + error.message);
    }
};

handler.usage = ['تطقيم'];
handler.category = 'group';
handler.command = ['ماتشينج', 'تطقيم', 'match'];
export default handler;