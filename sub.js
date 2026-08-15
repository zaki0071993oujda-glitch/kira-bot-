// 🍁 ملف: sub.js - نظام البوتات الفرعية - ISAGI TENGEN BOT

import { SubBots } from "esewsub";

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

async function sub(client) {
    try {
        global.subBots = new SubBots(client.commandSystem);
        
        // ✅ 🔧 إصلاح pairCode - مع الحفاظ على نفس السلوك
        try {
            if (typeof SubBots.pairCode === 'function') {
                SubBots.pairCode("ISAGI2024");
                console.log(`${EMOJI} [SubBots] ✅ تم تفعيل Pairing Code`);
            } else {
                // إذا كانت الدالة غير موجودة، نمررها كخاصية في الإعدادات
                console.log(`${EMOJI} [SubBots] ⚠️ pairCode غير مدعومة، يتم تمريرها كخاصية`);
                // تعيين pairCode كخاصية مباشرة
                global.subBots.pairCode = "ISAGI2024";
            }
        } catch (e) {
            console.log(`${EMOJI} [SubBots] ❌ فشل في pairCode:`, e.message);
        }

        const { config } = client;

        await global.subBots.setConfig({
            commandsPath: config.commandsPath || './plugins',
            owners:       config.owners,
            prefix:       config.prefix || ['.', '/', '!'],
            info: {
                nameBot:     BOT_NAME,
                nameChannel: config.info?.nameChannel || BOT_NAME,
                idChannel:   config.info?.idChannel || '120363428650036031@newsletter',
                urls:        config.info?.urls || { channel: CHANNEL_LINK },
                copyright:   config.info?.copyright || { pack: 'ISAGI TENGEN', author: DEVELOPER },
                images:      config.info?.images || ['https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg']
            },
            printQR:      false,  // ✅ كما كانت
            autoReconnect: true,
            reconnectDelay: 5000
        });

        // معالج الأخطاء
        global.subBots.on('error', (uid, error) => {
            const msg = error?.message || '';
            const ignoreErrors = [
                'rate-overlimit', 'Connection Closed', 'timed out',
                'ECONNRESET', 'ENOTFOUND', 'fetch failed',
                'Socket connection timeout', 'stream errored'
            ];
            if (ignoreErrors.some(e => msg.includes(e))) return;
            console.error(`${EMOJI} [SubBot ${uid}] خطأ:`, msg);
        });

        const loadedCount = await global.subBots.load();
        console.log(`${EMOJI} [SubBots] تم تحميل ${loadedCount} بوت فرعي`);

        global.subBots.on('ready', (uid) => {
            console.log(`${EMOJI} [SubBot ${uid}] ✅ متصل!`);
        });

        global.subBots.on('pair', (uid, code) => {
            console.log(`${EMOJI} [SubBot ${uid}] 🔑 رمز الاقتران: ${code}`);
            
            try {
                const ownerJid = config.owners?.[0]?.jid || '212723062183@s.whatsapp.net';
                const sock = client.sock;
                if (sock) {
                    sock.sendMessage(ownerJid, {
                        text: `${EMOJI} *رمز اقتران البوت الفرعي*\n\n` +
                              `🆔 *البوت:* ${uid}\n` +
                              `🔑 *الرمز:* \`${code}\`\n\n` +
                              `📢 ${CHANNEL_LINK}`
                    }).catch(() => {});
                }
            } catch {}
        });

        global.subBots.on('message', async (uid, msg) => {
            const body = getMessageText(msg);
            const bot = global.subBots.get(uid);
            const sock = bot?.sock;
            if (!sock || !body) return;

            try {
                if (body === 'تست' || body === 'test') {
                    await sock.sendMessage(msg.key.remoteJid, {
                        react: { text: '✅', key: msg.key }
                    });
                    return;
                }

                if (body === 'بوت' || body === 'bot') {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `${EMOJI} *${BOT_NAME}*\n\n` +
                              `👑 من تطوير *${DEVELOPER}*\n` +
                              `📢 ${CHANNEL_LINK}`
                    });
                    return;
                }

                if (body === 'حالة' || body === 'status') {
                    const uptime = process.uptime();
                    const hours = Math.floor(uptime / 3600);
                    const mins = Math.floor((uptime % 3600) / 60);
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `${EMOJI} *حالة البوت الفرعي*\n\n` +
                              `🆔 *UID:* ${uid}\n` +
                              `⏱️ *مدة التشغيل:* ${hours}h ${mins}m`
                    });
                    return;
                }

                if (body === 'اوامر' || body === 'commands' || body === 'help') {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `${EMOJI} *أوامر البوت الفرعي*\n\n` +
                              `• *تست* - اختبار البوت\n` +
                              `• *بوت* - معلومات البوت\n` +
                              `• *حالة* - حالة البوت\n` +
                              `• *اوامر* - عرض هذه الأوامر\n\n` +
                              `${EMOJI} ${BOT_NAME}`
                    });
                    return;
                }
            } catch (e) {
                console.log(`${EMOJI} [SubBot ${uid}] خطأ في معالجة الرسالة:`, e.message);
            }
        });

        global.subBots.on('close', (uid) => {
            console.log(`${EMOJI} [SubBot ${uid}] 🔌 تم قطع الاتصال`);
        });

        global.subBots.on('badSession', (uid) => {
            console.log(`${EMOJI} [SubBot ${uid}] ⚠️ جلسة غير صالحة - تم الحذف`);
        });

        global.subBots.on('reconnect', (uid) => {
            console.log(`${EMOJI} [SubBot ${uid}] 🔄 جاري إعادة الاتصال...`);
        });

        return global.subBots;

    } catch (e) {
        console.error(`${EMOJI} [SubBots] ❌ فشل تهيئة البوتات الفرعية:`, e.message);
        return null;
    }
}

function getMessageText(msg) {
    if (!msg?.message) return null;
    
    return msg.message.conversation ||
           msg.message.extendedTextMessage?.text ||
           msg.message.imageMessage?.caption ||
           msg.message.videoMessage?.caption ||
           msg.message.documentMessage?.caption ||
           msg.body ||
           null;
}

export default sub;