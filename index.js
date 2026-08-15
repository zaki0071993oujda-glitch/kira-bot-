import { Client } from 'esewsub';
import http from 'http';
import https from 'https';
import autoJoinChannel from './libs/auto-join-channel.js';
import BotDetector from './libs/bot-detector.js';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import keepServerAlive from './system/keep_alive.js';
import sub from './sub.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================================================
   🚫 منع الرسائل الخاصة تماماً
   ============================================================ */

// ✅ اعتراض جميع محاولات إرسال رسائل خاصة
const originalSendMessage = Client.prototype.sendMessage;
Client.prototype.sendMessage = function(jid, content, options = {}) {
    if (jid && typeof jid === 'string' && jid.includes('@s.whatsapp.net') && !jid.includes('@g.us')) {
        console.log(`🚫 تم منع إرسال رسالة خاصة إلى: ${jid}`);
        return Promise.resolve({
            key: {
                remoteJid: jid,
                fromMe: true,
                id: 'blocked_private_' + Date.now()
            },
            message: {
                conversation: '🚫 البوت لا يرسل رسائل خاصة'
            }
        });
    }
    return originalSendMessage.call(this, jid, content, options);
};

console.log('🍁 ✅ تم تعطيل الرسائل الخاصة تماماً');

/* ============================================================
   📦 قاعدة البيانات
   ============================================================ */

if (!global.db) global.db = new UltraDB();

if (!global.db.data) global.db.data = {};
if (!global.db.data.antiLink) global.db.data.antiLink = {};
if (!global.db.data.antiLinkStats) global.db.data.antiLinkStats = {};

/* ============================================================
   🤖 إعدادات العميل
   ============================================================ */

const client = new Client({
    phoneNumber: '3197010526269',
    prefix: ['.', '/', '!'],
    fromMe: false,
    owners: [
        { name: 'تنغن كيرا',    lid: '275561477836913@lid', jid: '3197010536701@s.whatsapp.net' },
        { name: 'تنغن',    lid: '275561477836913@lid', jid: '3197058047924@s.whatsapp.net' },
        { name: 'تنغن كيرا',    lid: '275561477836913@lid', jid: '3197010526699@s.whatsapp.net' },
        { name: '𝐈𝐒𝐀𝐆𝐈',      lid: '221307316789354@lid', jid: '212687411464@s.whatsapp.net' }
    ],
    settings: {},
    commandsPath: './plugins',
    autoReconnect:        true,
    reconnectDelay:       3000,
    maxReconnectAttempts: 999999,
});

/* ============================================================
   🔒 نظام صلاحيات المطورين
   ============================================================ */

function isOwner(userId) {
    return client.config.owners.some(o => 
        userId === o.jid || userId === o.lid
    );
}

console.log('🍁 ✅ تم تفعيل نظام صلاحيات المطورين');

/* ============================================================
   🛡️ منع إيقاف السيرفر
   ============================================================ */

process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');
process.removeAllListeners('SIGHUP');

process.on('SIGINT',  () => console.log('🍁 SIGINT received - تم تجاهلها'));
process.on('SIGTERM', () => console.log('🍁 SIGTERM received - تم تجاهلها'));
process.on('SIGHUP',  () => console.log('🍁 SIGHUP received - تم تجاهلها'));

/* ============================================================
   👥 تحميل المطورين الإضافيين
   ============================================================ */

try {
    const extra = global.db?.data?.extraOwners || [];
    if (extra.length) {
        const cleaned = extra.map(({ secondary, ...rest }) => rest);
        client.config.owners.push(...cleaned);
    }
} catch {}

try {
    client.config.owners = client.config.owners.map(({ secondary, ...rest }) => rest);
} catch {}

client.onGroupEvent(group);
client.onCommandAccess(access);

/* ============================================================
   ⚙️ إعدادات البوت
   ============================================================ */

client.config.info = {
    nameBot:     '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆',
    nameChannel: '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆',
    idChannel:   '120363428650036031@newsletter',
    urls: {
        repo:    'https://github.com/your-repo/ISAGI-TENGEN-BOT',
        api:     'https://api.example.com'
       
    },
    copyright: { pack: '🍁 ISAGI TENGEN', author: 'تنغن كيرا' },
    images: [
        'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg'
    ]
};

/* ============================================================
   🌐 خادم Keep-Alive
   ============================================================ */

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🍁 ISAGI TENGEN BOT - Online ✅');
});

httpServer.listen(PORT, () => {
    console.log(`🍁 Keep-Alive server running on port ${PORT}`);
});

const APP_URL = process.env.APP_URL || '';

if (APP_URL) {
    setInterval(() => {
        const mod = APP_URL.startsWith('https') ? https : http;
        mod.get(APP_URL, (res) => {
            console.log(`🍁 Self-ping OK [${res.statusCode}]`);
        }).on('error', () => {
            console.log('🍁 Self-ping failed');
        });
    }, 4 * 60 * 1000);
    console.log(`🍁 Self-ping enabled → ${APP_URL}`);
} else {
    console.log('🍁 APP_URL غير محدد');
}

/* ============================================================
   🔑 إشعار رمز الاقتران
   ============================================================ */

const OWNER_PHONE = '3197010536701';

const sendPairingNotification = async (code) => {
    console.log('\n' + '='.repeat(50));
    console.log(`🔑 PAIRING CODE: ${code}`);
    console.log(`📱 FOR NUMBER: 212723062183`);
    console.log('='.repeat(50) + '\n');

    try {
        if (client.sock?.user) {
            const ownerJid = OWNER_PHONE + '@s.whatsapp.net';
            await client.sock.sendMessage(ownerJid, {
                text: `🍁 *ISAGI TENGEN BOT - Pairing Code*\n\n\`${code}\`\n\n📱 للرقم: 212723062183`
            });
        }
    } catch {}
};

const checkPairingCode = setInterval(async () => {
    try {
        const sock = client.sock;
        if (!sock) return;
        sock.ev?.on?.('connection.update', async (update) => {
            if (update?.qr || update?.pairingCode) {
                const code = update.pairingCode || update.qr;
                if (code && code.length > 3) {
                    clearInterval(checkPairingCode);
                    await sendPairingNotification(code);
                }
            }
        });
        clearInterval(checkPairingCode);
    } catch {}
}, 1000);

/* ============================================================
   🚀 بدء التشغيل
   ============================================================ */

client.start();
setTimeout(() => { try { if (client.commandSystem) sub(client); } catch {} }, 3000);

/* ============================================================
   💤 منع النوم
   ============================================================ */

keepServerAlive(client, {
    connection: { checkEveryMs: 15000, maxDisconnectedMs: 90000 },
    memory:     { checkEveryMs: 60000, maxHeapMB: 700 },
    ping:       { everyMs: 240000 },
});

/* ============================================================
   📚 المكتبات الإضافية
   ============================================================ */

setTimeout(() => autoJoinChannel(client), 5000);

setTimeout(() => {
    try {
        const botDetector = new BotDetector(client, {
            ownerJid:     '3197010536701@s.whatsapp.net',
            autoWarn:     true,
            autoKick:     false,
            antiBotMode:  false,
            sessionPaths: ['./sessions', './auth_info'],
        });
        botDetector.start();
        global._botDetector = botDetector;
    } catch {}
}, 5000);

/* ============================================================
   📂 نظام قراءة الملفات الإضافية
   ============================================================ */

function loadExtraFiles() {
    const extraDirs = ['./extra', './addons', './plugins/extra'];
    const loadedFiles = [];
    
    extraDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                if (file.endsWith('.js')) {
                    try {
                        const filePath = path.join(dir, file);
                        const fileUrl = new URL(`file://${filePath}`);
                        import(fileUrl.href).then(module => {
                            if (module.default && typeof module.default === 'function') {
                                module.default(client);
                                loadedFiles.push(file);
                                console.log(`🍁 Loaded extra file: ${file}`);
                            }
                        }).catch(err => {
                            console.log(`🍁 Failed to load ${file}: ${err.message}`);
                        });
                    } catch (err) {
                        console.log(`🍁 Failed to load ${file}: ${err.message}`);
                    }
                }
            });
        }
    });
    
    return loadedFiles;
}

setTimeout(() => {
    const loaded = loadExtraFiles();
    console.log(`🍁 تم تحميل ${loaded.length} ملف إضافي`);
}, 7000);

/* ============================================================
   👀 مراقبة التغييرات في الملفات
   ============================================================ */

function watchExtraFolders() {
    const extraDirs = ['./extra', './addons', './plugins/extra'];
    let loadedFiles = new Set();
    
    extraDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            fs.watch(dir, (eventType, filename) => {
                if (filename && filename.endsWith('.js') && eventType === 'change') {
                    setTimeout(() => {
                        try {
                            const filePath = path.join(dir, filename);
                            if (!loadedFiles.has(filePath)) {
                                loadedFiles.add(filePath);
                                const fileUrl = new URL(`file://${filePath}?t=${Date.now()}`);
                                import(fileUrl.href).then(module => {
                                    if (module.default && typeof module.default === 'function') {
                                        module.default(client);
                                        console.log(`🍁 تم تحميل ملف جديد: ${filename}`);
                                    }
                                }).catch(err => {
                                    console.log(`🍁 فشل تحميل ${filename}: ${err.message}`);
                                });
                                setTimeout(() => loadedFiles.delete(filePath), 5000);
                            }
                        } catch (err) {
                            console.log(`🍁 فشل تحميل ${filename}: ${err.message}`);
                        }
                    }, 1000);
                }
            });
        }
    });
}

setTimeout(watchExtraFolders, 10000);

/* ============================================================
   📨 استقبال الملفات والأوامر
   ============================================================ */

setTimeout(() => {
    try {
        const sock = client.sock;
        if (!sock) return;
        
        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const msg = messages[0];
                if (!msg || !msg.message) return;
                
                const from = msg.key.remoteJid;
                const body = msg.message.conversation || 
                            msg.message.extendedTextMessage?.text || 
                            msg.message.imageMessage?.caption ||
                            '';
                
                if (!body) return;
                const text = body.trim();
                
                if (text.startsWith('.load ')) {
                    const fileName = text.replace('.load ', '').trim();
                    if (fileName.endsWith('.js')) {
                        const possiblePaths = [
                            `./extra/${fileName}`,
                            `./addons/${fileName}`,
                            `./plugins/extra/${fileName}`,
                            `./${fileName}`
                        ];
                        
                        let loaded = false;
                        for (const filePath of possiblePaths) {
                            if (fs.existsSync(filePath)) {
                                try {
                                    const fileUrl = new URL(`file://${filePath}?t=${Date.now()}`);
                                    const module = await import(fileUrl.href);
                                    if (module.default && typeof module.default === 'function') {
                                        module.default(client);
                                        await sock.sendMessage(from, {
                                            text: `🍁 تم تحميل الملف: ${fileName}`
                                        });
                                        loaded = true;
                                        break;
                                    }
                                } catch (err) {
                                    console.log(`🍁 فشل تحميل ${fileName}: ${err.message}`);
                                }
                            }
                        }
                        
                        if (!loaded) {
                            await sock.sendMessage(from, {
                                text: `🍁 لم يتم العثور على الملف: ${fileName}`
                            });
                        }
                    }
                }
            } catch (err) {
                console.log('🍁 خطأ في معالجة الرسالة:', err.message);
            }
        });
        
        console.log('🍁 تم تفعيل استقبال الرسائل بنجاح');
    } catch (err) {
        console.log('🍁 فشل تفعيل استقبال الرسائل:', err.message);
    }
}, 5000);

/* ============================================================
   🍁 نظام مضاد الروابط وجهات الاتصال (صارم وفوري)
   ============================================================ */

function getGroupAntiLinkStatus(chatId) {
    if (!global.db.data.antiLink) global.db.data.antiLink = {};
    return global.db.data.antiLink[chatId] || false;
}

function setGroupAntiLinkStatus(chatId, status) {
    if (!global.db.data.antiLink) global.db.data.antiLink = {};
    global.db.data.antiLink[chatId] = status;
    try {
        global.db.save?.();
    } catch (e) {}
    console.log(`🍁 [مضاد الروابط] ${chatId} → ${status ? 'مفعل' : 'مطفأ'}`);
}

function incrementKickStats(chatId) {
    if (!global.db.data.antiLinkStats) global.db.data.antiLinkStats = {};
    if (!global.db.data.antiLinkStats[chatId]) {
        global.db.data.antiLinkStats[chatId] = { total: 0, today: 0, lastReset: Date.now() };
    }
    global.db.data.antiLinkStats[chatId].total++;
    global.db.data.antiLinkStats[chatId].today++;
    try { global.db.save?.(); } catch (e) {}
}

// ============================================================
// ✅ ✅ ✅ دالة مضاد الروابط الرئيسية (صارمة وفورية)
// ============================================================

async function antiLinkHandler(m, sock) {
    try {
        if (m.isBaileys && m.fromMe) return false;
        
        const chatId = m.key.remoteJid;
        if (!chatId?.endsWith('@g.us')) return false;
        
        const sender = m.key.participant || m.key.remoteJid;
        
        let text = '';
        if (m.message.conversation) text = m.message.conversation;
        else if (m.message.extendedTextMessage?.text) text = m.message.extendedTextMessage.text;
        else if (m.message.imageMessage?.caption) text = m.message.imageMessage.caption;
        else if (m.message.videoMessage?.caption) text = m.message.videoMessage.caption;
        else if (m.message.documentMessage?.caption) text = m.message.documentMessage.caption;
        
        if (m.message.contactMessage || m.message.vcardMessage) {
            text = 'contact_or_vcard';
        }
        
        if (!text) return false;
        const body = text.trim();
        
        // ============================================================
        // ✅ ✅ ✅ أوامر التحكم في مضاد الروابط (خاصة وعامة)
        // ============================================================
        
        // ✅ ✅ ✅ أمر التفعيل الخاص (للمطورين فقط)
        if (body === '.تفعيل_خاص' || body === 'تفعيل_خاص') {
            const isDev = isOwner(sender);
            if (!isDev) {
                await sock.sendMessage(chatId, {
                    text: `🔒 *هذا الأمر للمطورين فقط*`
                });
                return true;
            }
            
            // ✅ تفعيل مضاد الروابط في المجموعة الحالية
            setGroupAntiLinkStatus(chatId, true);
            await sock.sendMessage(chatId, {
                text: `🍁 ✅ *تم تفعيل مضاد الروابط وجهات الاتصال* (خاص)\n\n📌 سيتم طرد أي عضو يرسل رابط أو جهة اتصال فوراً`
            });
            return true;
        }
        
        // ✅ ✅ ✅ أمر التفعيل العام (للمشرفين والمطورين)
        if (body === '.تفعيل_عام' || body === 'تفعيل_عام') {
            let isAdmin = false;
            try {
                const metadata = await sock.groupMetadata(chatId);
                const participant = metadata?.participants?.find(p => 
                    (p.id || p.jid) === sender
                );
                isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            } catch (e) {}
            
            const isDev = isOwner(sender);
            
            if (!isAdmin && !isDev) {
                await sock.sendMessage(chatId, {
                    text: `🔒 *هذا الأمر للمشرفين والمطورين فقط*`
                });
                return true;
            }
            
            // ✅ تفعيل مضاد الروابط في المجموعة الحالية
            setGroupAntiLinkStatus(chatId, true);
            await sock.sendMessage(chatId, {
                text: `🍁 ✅ *تم تفعيل مضاد الروابط وجهات الاتصال* (عام)\n\n📌 سيتم طرد أي عضو يرسل رابط أو جهة اتصال فوراً`
            });
            return true;
        }
        
        // ✅ ✅ ✅ أمر إيقاف التفعيل (للمشرفين والمطورين)
        if (body === '.ايقاف_مضاد' || body === 'ايقاف_مضاد') {
            let isAdmin = false;
            try {
                const metadata = await sock.groupMetadata(chatId);
                const participant = metadata?.participants?.find(p => 
                    (p.id || p.jid) === sender
                );
                isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            } catch (e) {}
            
            const isDev = isOwner(sender);
            
            if (!isAdmin && !isDev) {
                await sock.sendMessage(chatId, {
                    text: `🔒 *هذا الأمر للمشرفين والمطورين فقط*`
                });
                return true;
            }
            
            setGroupAntiLinkStatus(chatId, false);
            await sock.sendMessage(chatId, {
                text: `🍁 ✅ *تم إيقاف مضاد الروابط وجهات الاتصال*`
            });
            return true;
        }
        
        // ✅ ✅ ✅ أمر حالة مضاد الروابط (للجميع)
        if (body === '.حالة_مضاد' || body === 'حالة_مضاد') {
            const status = getGroupAntiLinkStatus(chatId);
            const stats = global.db.data.antiLinkStats?.[chatId] || { total: 0, today: 0 };
            await sock.sendMessage(chatId, {
                text: `🍁 *حالة مضاد الروابط:* ${status ? '🟢 مفعل' : '🔴 غير مفعل'}\n\n` +
                      `📊 *الإحصاءات:*\n` +
                      `• إجمالي المطرودين: ${stats.total || 0}\n` +
                      `• اليوم: ${stats.today || 0}\n\n` +
                      `📌 للتفعيل الخاص: .تفعيل_خاص (للمطورين فقط)\n` +
                      `📌 للتفعيل العام: .تفعيل_عام (للمشرفين والمطورين)\n` +
                      `📌 للإيقاف: .ايقاف_مضاد`
            });
            return true;
        }
        
        // ============================================================
        // ✅ التحقق من التفعيل
        // ============================================================
        const isEnabled = getGroupAntiLinkStatus(chatId);
        if (!isEnabled) return false;
        
        // ============================================================
        // ✅ ✅ ✅ استثناء البوتات الأخرى
        // ============================================================
        
        const botKeywords = ['bot', 'بوت', '🧠', '🤖', '⚡', '🔰', 'automated'];
        const botJids = ['120363', 'status@broadcast', 'broadcast', 'newsletter'];
        
        let senderName = '';
        try {
            const metadata = await sock.groupMetadata(chatId);
            const participant = metadata?.participants?.find(p => 
                (p.id || p.jid) === sender
            );
            senderName = participant?.name || participant?.pushname || '';
        } catch (e) {}
        
        const isOtherBot = 
            botKeywords.some(keyword => 
                body.toLowerCase().includes(keyword.toLowerCase()) ||
                senderName.toLowerCase().includes(keyword.toLowerCase())
            ) || 
            botJids.some(jid => sender?.includes(jid)) ||
            sender?.includes('120363');
        
        if (isOtherBot) {
            console.log(`🍁 تم تجاهل بوت آخر: ${sender}`);
            return false;
        }
        
        // ============================================================
        // ✅ أنماط الكشف (جهات الاتصال فقط + الروابط)
        // ============================================================

        const linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i;
        const contactRegex = /BEGIN:VCARD|END:VCARD|vcard|contact|TEL;|FN:|item1\.TEL|item1\.FN|X-ABLabel|N:|ORG:/i;

        const isLink = linkRegex.test(body);
        const isContact = contactRegex.test(body) || 
                          m.message.contactMessage || 
                          m.message.vcardMessage;

        if (!isLink && !isContact) return false;
        
        // ============================================================
        // ✅ استثناء رابط المجموعة الحالية
        // ============================================================
        try {
            const inviteCode = await sock.groupInviteCode(chatId);
            if (inviteCode) {
                const thisGroupLink = `https://chat.whatsapp.com/${inviteCode}`;
                if (body.includes(thisGroupLink)) return false;
            }
        } catch (e) {}
        
        // ============================================================
        // ✅ ✅ ✅ التحقق من صلاحيات المرسل (مشرف أو مطور - صامت)
        // ============================================================
        
        let isAdmin = false;
        let isSuperAdmin = false;
        try {
            const metadata = await sock.groupMetadata(chatId);
            const participant = metadata?.participants?.find(p => 
                (p.id || p.jid) === sender
            );
            isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            isSuperAdmin = participant?.admin === 'superadmin';
        } catch (e) {}
        
        const isDev = isOwner(sender);
        
        if (isAdmin || isSuperAdmin || isDev) {
            console.log(`🍁 تم تجاهل مشرف/مطور: ${sender}`);
            return true;
        }
        
        // ============================================================
        // ✅ تحديد نوع المخالفة
        // ============================================================
        let reason = 'رابط ممنوع';
        if (isContact && isLink) {
            reason = 'رابط جهة اتصال';
        } else if (isContact) {
            reason = 'جهة اتصال';
        }
        
        // ============================================================
        // ✅ ✅ ✅ نظام منع التكرار
        // ============================================================
        
        if (!global._lastKickMessages) global._lastKickMessages = {};
        const kickKey = `kick_${chatId}_${sender}`;
        const lastKickTime = global._lastKickMessages[kickKey] || 0;
        const now = Date.now();
        
        // ============================================================
        // ✅ ✅ ✅ حذف رسالة المخالفة فوراً
        // ============================================================
        try {
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: m.key.id,
                    participant: sender
                }
            });
            console.log(`🍁 ✅ تم حذف ${reason} من ${sender}`);
        } catch (e) {
            console.log('🍁 فشل حذف الرسالة:', e.message);
        }
        
        // ============================================================
        // ✅ ✅ ✅ طرد فوري وصارم
        // ============================================================
        try {
            await sock.groupParticipantsUpdate(chatId, [sender], 'remove');
            console.log(`🍁 ✅ تم طرد ${sender} بسبب نشر ${reason}`);
            
            incrementKickStats(chatId);
            
            if (now - lastKickTime > 300000) {
                global._lastKickMessages[kickKey] = now;
                
                await sock.sendMessage(chatId, {
                    text: `⛔ *تم طرد @${sender.split('@')[0]}* (نشر ${reason})`,
                    mentions: [sender]
                });
            } else {
                console.log(`🍁 تم طرد ${sender} ولكن تم تجاهل الرسالة المكررة`);
            }
            
        } catch (e) {
            console.log('🍁 فشل الطرد:', e.message);
            
            const failKey = `fail_${chatId}`;
            const lastFailTime = global._lastKickMessages?.[failKey] || 0;
            
            if (now - lastFailTime > 600000) {
                if (!global._lastKickMessages) global._lastKickMessages = {};
                global._lastKickMessages[failKey] = now;
                
                await sock.sendMessage(chatId, {
                    text: `⚠️ *تنبيه للمشرفين*\n\n` +
                          `البوت ليس لديه صلاحية الطرد في هذه المجموعة\n` +
                          `📌 الرجاء ترقية البوت إلى مشرف`
                });
            }
        }
        
        return true;
    } catch (error) {
        console.error('🍁 خطأ في مضاد الروابط:', error);
        return false;
    }
}

// ============================================================
// ✅ تفعيل مضاد الروابط - متوافق مع Safari
// ============================================================

// ✅ دالة بديلة لـ arguments.callee المتوافقة مع Safari
function retryAntiLinkSetup() {
    try {
        const sock = client.sock;
        if (!sock) {
            console.log('🍁 [مضاد الروابط] انتظار الاتصال...');
            setTimeout(retryAntiLinkSetup, 5000);
            return;
        }
        
        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const m = messages[0];
                if (!m || !m.message) return;
                
                await antiLinkHandler(m, sock);
            } catch (error) {
                if (!error.message?.includes('rate-overlimit')) {
                    console.error('🍁 خطأ في مضاد الروابط:', error);
                }
            }
        });
        
        console.log('🍁 ✅ تم تفعيل مضاد الروابط وجهات الاتصال بنجاح');
        console.log('🍁 📌 أوامر التفعيل:');
        console.log('🍁 🔒 .تفعيل_خاص - للمطورين فقط');
        console.log('🍁 🌐 .تفعيل_عام - للمشرفين والمطورين');
        console.log('🍁 📌 .ايقاف_مضاد - لإيقاف التفعيل');
        console.log('🍁 📌 .حالة_مضاد - لعرض الحالة والإحصاءات');
        console.log('🍁 🚫 تم تعطيل الرسائل الخاصة تماماً');
        console.log('🍁 🔒 مضاد الروابط يعمل بصمت مع المشرفين والمطورين');
        console.log('🍁 ⚡ طرد فوري وصارم للأعضاء العاديين');
        console.log('🍁 🌐 متوافق مع Safari وأحدث المتصفحات');
    } catch (error) {
        console.error('🍁 فشل تفعيل مضاد الروابط:', error);
        setTimeout(retryAntiLinkSetup, 10000);
    }
}

setTimeout(retryAntiLinkSetup, 15000);

/* ============================================================
   🛡️ معالجة الأخطاء
   ============================================================ */

const IGNORE = [
    'rate-overlimit', 'Connection Closed', 'timed out',
    'ECONNRESET', 'ENOTFOUND', 'fetch failed',
    'Socket connection timeout', 'stream errored',
    'Unexpected server response', 'invalid session'
];

process.on('uncaughtException', (e) => {
    if (e && e.message && IGNORE.some(x => e.message.includes(x))) return;
    console.error('[uncaughtException]', e?.message || e);
});

process.on('unhandledRejection', (e) => {
    if (e && e.message && IGNORE.some(x => e.message.includes(x))) return;
    console.error('[unhandledRejection]', e?.message || e);
});

process.exit = (code) => {
    console.log(`🍁 process.exit(${code}) blocked`);
};

console.log('🍁 ✅ تم تشغيل البوت بنجاح!');
console.log('🍁 🚫 الرسائل الخاصة ممنوعة تماماً');
console.log('🍁 🔒 مضاد الروابط يعمل بصمت مع المشرفين والمطورين');
console.log('🍁 ⚡ طرد فوري وصارم للأعضاء العاديين');
console.log('🍁 🌐 متوافق مع Safari وأحدث المتصفحات');
console.log('🍁 📱 يعمل على iPhone/iPad بأحدث إصدارات Safari');
console.log('🍁 📌 أوامر التفعيل:');
console.log('🍁 🔒 .تفعيل_خاص - للمطورين فقط');
console.log('🍁 🌐 .تفعيل_عام - للمشرفين والمطورين');
