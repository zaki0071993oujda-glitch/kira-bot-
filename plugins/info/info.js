// 🍁 ملف: معلومات.js - عرض معلومات البوت - ISAGI TENGEN BOT

import os from 'os';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

// 🍁 سياق الرسالة - تم التحديث
const getContext = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_JID,
        newsletterName: CHANNEL_NAME,
        serverMessageId: 0
    },
    externalAdReply: {
        title: `${EMOJI} ${BOT_NAME}`,
        body: `👑 من تطوير ${DEVELOPER}`,
        thumbnailUrl: img || MAIN_IMAGE,
        sourceUrl: CHANNEL_LINK,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const handler = async (m, { conn, bot, config }) => {
    // ✅ معلومات الذاكرة
    const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const heapTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
    
    // ✅ معلومات المعالج
    const cpuCores = os.cpus().length;
    const cpuModel = os.cpus()[0]?.model || 'Unknown';
    const cpuSpeed = (os.cpus()[0]?.speed / 1000).toFixed(1) || '0';
    const cpuUsage = (os.loadavg()[0] * 100).toFixed(1);
    
    // ✅ معلومات النظام
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    
    // ✅ مدة التشغيل
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMins = Math.floor((uptime % 3600) / 60);
    const uptimeSecs = Math.floor(uptime % 60);
    
    // ✅ معلومات المجموعات
    let groupCount = 0;
    try {
        const groups = await conn.groupFetchAllParticipating();
        groupCount = Object.values(groups).length;
    } catch (e) {
        console.log('🍁 فشل جلب المجموعات:', e);
    }
    
    // ✅ معلومات البوتات الفرعية
    const subBots = global.subBots;
    const subCount = subBots?.list?.()?.length || 0;
    const subConnected = subBots?.list?.()?.filter(b => b.connected).length || 0;
    
    // ✅ معلومات البوت
    const botName = conn.user?.name || BOT_NAME;
    const botNumber = conn.user?.id?.split(':')[0] || 'غير معروف';
    
    // ✅ المطورين
    const owners = bot?.config?.owners || [];
    const mainOwner = owners[0] || { name: DEVELOPER, jid: '212723062183@s.whatsapp.net' };
    
    // ✅ بناء الرسالة
    const msg = `${EMOJI}━━━[ *معلومات البوت* ]━━━${EMOJI}

——> *الـبـوت 🤖*
- *الاسم:* ${botName}
- *الرقم:* wa.me/${botNumber}
- *شغال منذ:* ${String(uptimeHours).padStart(2, '0')}:${String(uptimeMins).padStart(2, '0')}:${String(uptimeSecs).padStart(2, '0')}

——> *الـنـظـام 💻*
- *النظام:* ${platform} ${arch}
- *الجهاز:* ${hostname}
- *المعالج:* ${cpuModel.slice(0, 30)}...
- *النوى:* ${cpuCores} نواة @ ${cpuSpeed}GHz
- *الحمل:* ${cpuUsage}%

——> *الـذاكـرة 🧠*
- *الرام المستخدم:* ${usedRam}MB / ${totalRam}GB
- *الرام الفارغ:* ${freeRam}GB
- *Heap:* ${heapUsed}MB / ${heapTotal}MB

——> *احـصـائـيـات 📊*
- *المجموعات:* ${groupCount}

——> *الـبـوتـات الـفـرعـيـه 🤖*
- *الإجمالي:* ${subCount}
- *المتصل:* ${subConnected}
- *المنفصل:* ${subCount - subConnected}

——> *الـمـالـكـيـن 👑*
- *العدد:* ${owners.length}
- *الرئيسي:* ${mainOwner.name || DEVELOPER} (${mainOwner.jid?.split('@')[0] || '212723062183'})

${EMOJI} *${BOT_NAME}* | الإصدار 3.0`;

    // ✅ إرسال الرسالة
    await conn.sendMessage(m.chat, {
        text: msg,
        contextInfo: getContext(m.sender, MAIN_IMAGE)
    }, { quoted: m });
};

handler.command = ["معلومات", "info", "botinfo", "حالة", "stats"];
handler.category = "info";
handler.usage = ["معلومات"];

export default handler;