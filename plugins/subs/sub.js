// 🍁 ملف: تنصيب.js - تنصيب البوتات الفرعية - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const MAIN_IMAGE = 'https://i.postimg.cc/cLd4h99Q/1ec6d4d9d187860bebecd5655c2130a7.jpg';

const run = async (m, { args, conn, bot }) => {
    // ✅ التحقق من نظام البوتات الفرعية
    if (!global.subBots) {
        return m.reply(`${EMOJI} *نظام البوتات الفرعية غير متاح*`);
    }

    // ✅ التحقق من عدد البوتات (اختياري)
    try {
        const subList = global.subBots.list?.() || [];
        if (subList.length >= 30) {
            return m.reply(`${EMOJI} *تم الوصول للحد الأقصى (30 بوت)*`);
        }
    } catch {}

    // ✅ التحقق من تعطيل التنصيب العام
    if (global.db?.noSub) {
        return m.reply(`${EMOJI} *المطور قفل التنصيب مؤقتاً*`);
    }

    // ✅ التحقق من تعطيل التنصيب في هذه المجموعة
    const chatId = m.chat;
    if (chatId.includes('@g.us')) {
        if (!global._subSettings) global._subSettings = {};
        const settings = global._subSettings[chatId];
        
        // ✅ إذا كان التنصيب موقفاً في هذه المجموعة
        if (settings?.noSub === true) {
            return m.reply(
                `${EMOJI} *🚫 التنصيب موقف في هذه المجموعة*\n\n` +
                `📌 للتواصل مع المطور: .المطور`
            );
        }
    }

    try {
        const num = m.sender.split("@")[0].replace(/[+\s-]/g, '');

        if (!/^\d+$/.test(num)) {
            return m.reply(`${EMOJI} *⚠️ رقم الهاتف غير صالح*`);
        }

        const sub = global.subBots;
        if (!sub) {
            return m.reply(`${EMOJI} *❌ نظام البوتات الفرعية غير متاح*`);
        }

        const init = await m.reply(`${EMOJI} *⏳ جاري تنصيب بوت للرقم* +${num}...`);

        let state = { uid: null, pairDone: false, resolved: false, pending: null };

        const { images } = bot.config.info || {};
        const img = Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : MAIN_IMAGE;

        const cleanup = () => {
            sub.off('pair', handlers.pair);
            sub.off('ready', handlers.ready);
            sub.off('error', handlers.error);
        };

        const handlers = {
            pair: (id, code) => {
                if (state.pairDone) return;
                if (!state.uid) { 
                    state.pending = { id, code }; 
                    return; 
                }
                if (id !== state.uid) return;
                state.pairDone = true;
                Func.pair(conn, code, num, m, init);
            },
            ready: (id) => {
                if (id !== state.uid || state.resolved) return;
                state.resolved = true;
                Func.ready(conn, num, m, img);
                cleanup();
            },
            error: (id, err) => {
                if (id !== state.uid || state.resolved) return;
                state.resolved = true;
                Func.error(conn, num, err, m);
                cleanup();
            },
        };

        sub.on('pair', handlers.pair);
        sub.on('ready', handlers.ready);
        sub.on('error', handlers.error);

        state.uid = await sub.add(num);

        if (state.pending?.id === state.uid && !state.pairDone) {
            state.pairDone = true;
            Func.pair(conn, state.pending.code, num, m, init);
        }

        setTimeout(() => {
            if (state.resolved) return;
            state.resolved = true;
            Func.timeout(conn, m, state.pairDone);
            cleanup();
        }, 120000);

    } catch (error) {
        console.error(`${EMOJI} خطأ في التنصيب:`, error);
        await m.reply(`${EMOJI} *❌ حدث خطأ:* ${error.message}`);
    }
};

run.command = ["تنصيب", "install", "setup"];
run.category = "sub";
run.usage = ["تنصيب"];

export default run;

// 🍁 دوال مساعدة
const Func = {
    pair: async (conn, code, num, m, reply_status) => {
        try {
            await conn.sendButton(m.chat, {
                imageUrl: MAIN_IMAGE,
                bodyText: `${EMOJI}━━━[ *نظام البوتات الفرعية* ]━━━${EMOJI}

📱 *الرقم:* +${num}
🔑 *كود الاقتران:* \`${code}\`

━━━━━━━━━━━━━━━━━━━━━━
📌 *الخطوات:*
1️⃣ افتح واتساب
2️⃣ اذهب إلى الإعدادات > الأجهزة المرتبطة
3️⃣ اختر "ربط جهاز برقم الهاتف"
4️⃣ أدخل الكود أعلاه

${EMOJI} *${BOT_NAME}*`,
                footerText: `${EMOJI} ${BOT_NAME}`,
                buttons: [
                    { 
                        name: "cta_copy", 
                        params: { 
                            display_text: `${EMOJI} نسخ الكود`, 
                            copy_code: code 
                        } 
                    }
                ],
                mentions: [m.sender],
                interactiveConfig: {
                    buttons_limits: 10,
                    list_title: `${EMOJI} ${BOT_NAME}`,
                    button_title: "Click Here",
                    canonical_url: `https://code.com/${code}`
                }
            }, global.reply_status);
        } catch (e) {
            console.error(`${EMOJI} فشل إرسال زر النسخ:`, e);
            await conn.sendMessage(m.chat, {
                text: `${EMOJI} *كود الاقتران*\n\n🔑 \`${code}\`\n📱 +${num}`
            });
        }
    },

    ready: async (conn, num, m, img) => {
        try {
            await m.react("✅");
        } catch {}

        await conn.sendMessage(m.chat, {
            text: `${EMOJI}━━━[ *✅ تم الاتصال بنجاح* ]━━━${EMOJI}

📱 *الرقم:* +${num}
🟢 *الحالة:* متصل

${EMOJI} *البوت جاهز للاستخدام الآن*

━━━━━━━━━━━━━━━━━━━━━━
👑 *${BOT_NAME}*`,
            contextInfo: {
                externalAdReply: {
                    title: `${EMOJI} ${BOT_NAME}`,
                    body: `👑 من تطوير ${DEVELOPER}`,
                    thumbnailUrl: img || MAIN_IMAGE,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    },

    error: async (conn, num, err, m) => {
        await m.reply(`${EMOJI} *❌ فشل الاقتران!*\n\n📱 *الرقم:* +${num}\n⚠️ *الخطأ:* ${err?.message || 'غير معروف'}\n\n${EMOJI} حاول مرة أخرى`);
    },

    timeout: async (conn, m, pairDone) => {
        await m.reply(pairDone
            ? `${EMOJI} *⏰ تم إرسال الكود لكن لم يتم تأكيد الاتصال.*\n\n📌 تأكد من إدخال الكود في واتساب خلال 120 ثانية`
            : `${EMOJI} *⏰ لم يتم استلام كود الاقتران خلال 120 ثانية.*\n\n📌 الرجاء المحاولة مرة أخرى`
        );
    }
};