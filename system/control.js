// ======================================================
// المطورين وبياناتهم - ISAGI TENGEN BOT
// ======================================================
const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const DEVELOPER = 'تنغن كيرا';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';
const MAIN_IMAGE = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

const OWNERS_DATA = [
    { name: 'تنغن كيرا',     jid: '3197010526252@s.whatsapp.net', displayName: 'تنغن كيرا' },
   
    { name: '𝐈𝐒𝐀𝐆𝐈',        jid: '212687411464@s.whatsapp.net', displayName: '𝐈𝐒𝐀𝐆𝐈' }
];

const getOwnerName = (jid) => {
    if (!jid) return null;
    const num = jid.split('@')[0].split(':')[0];
    const found = OWNERS_DATA.find(o =>
        o.jid.split('@')[0] === num || o.jid === jid
    );
    return found?.name || null;
};

// ======================================================
// رسائل الترحيب والوداع للمطور
// ======================================================
const makeOwnerWelcome = (ownerName) => [
    `🍁══════════════🍁
┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆
🍁══════════════🍁

╭─❖
│ 👑 *دخل المطور ${ownerName}*
│
│ يا كبير... النظام تحت أمرك 🍁
│ الجروب بقى في أمان 🔥
╰───────────────

🍁 "القوة ليست في العضلات، بل في الروح."
⚽ "وكرة القدم ليست مجرد لعبة، بل هي حياة."`,
    
    `*🍁 المطور نزل على الجروب*\n\nاستعدوا... ${ownerName} هنا 👑🔥⚽`,
    
    `*🔥 تحذير - دخول المطور*\n\n${ownerName} دخل الجروب 🍁⚽`
];

const makeOwnerBye = (ownerName) => [
    `🍁══════════════🍁
┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆
🍁══════════════🍁

*👑 المطور ${ownerName} غادر الجروب*

> النظام في وضع الحراسة الذاتية 🍁
> المهرجان مستمر بدونه! ⚽🔥`,
    
    `*🍁 المطور خرج*\n\n${ownerName} قرر يمشي... من يجرؤ الآن؟ 🔥⚽`
];

const makeBotReply = (ownerName) =>
    `🍁══════════════🍁
┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆
🍁══════════════🍁

╭─❖
│ 👑 *أهلاً ${ownerName}* 🔥
│ البوت شغال وجاهز 🍁
│ المهرجان مستمر ⚽
╰───────────────

🍁 *${ownerName}*`;

const SUPPORT_TEAM = [
    { name: 'تنغن كيرا', url: 'https://wa.me/3197010526252' },
    { name: '𝐈𝐒𝐀𝐆𝐈',  url: 'https://wa.me/212687411464' }
];

// ======================================================
// group - أحداث المجموعات مع الترحيب والوداع الفخم
// ======================================================
const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;

        const users = participants.length
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ')
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        // ✅ رسائل الترحيب والوداع الفخمة
        const getGroupName = async (chatId) => {
            try {
                const meta = await ctx.sock.groupMetadata(chatId);
                return meta.subject || 'المجموعة';
            } catch {
                return 'المجموعة';
            }
        };

        const groupName = await getGroupName(event.chat);
        const now = new Date();
        const timeString = now.toLocaleString('ar-EG', {
            timeZone: 'Africa/Casablanca',
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const messages = {
            add: (participantsList) => {
                const firstUser = participantsList[0] || '';
                const displayName = firstUser.split('@')[0] || 'مستخدم';
                
                return `╔═══════════════════════════════════════╗
   🍎💀『 ${BOT_NAME} 』💀🍎
╚═══════════════════════════════════════╝

🎉 *مرحباً بك في مجموعتنا!*

👤 *المستخدم:* @${displayName}
🏷️ *المجموعة:* ${groupName}
⏰ *الوقت:* ${timeString}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *خُذْ رَاحَتَكَ هُنَا...*
🌸 *وَحُرِّيَّتُكَ تَنْتَهِي عِنْدَ بَدْءِ حُرِّيَّةِ الآخَرِينَ.*

🍃 *جَوٌّ عَائِلِيٌّ وَلَطِيفٌ* 🍃
⚽ *وَكُرَةُ الْقَدَمِ لَيْسَتْ مُجَرَّدَ لَعْبَةٍ، بَلْ هِيَ حَيَاةٌ.* 🎪

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 ${CHANNEL_LINK}

🎌 *نتمنى لك وقتاً ممتعاً معنا!* 🎌`;
            },
            remove: (participantsList) => {
                const firstUser = participantsList[0] || '';
                const displayName = firstUser.split('@')[0] || 'مستخدم';
                
                return `╔═══════════════════════════════════════╗
   🍎💀『 ${BOT_NAME} 』💀🍎
╚═══════════════════════════════════════╝

💔 *وداعاً... نتمنى رؤيتك قريباً!*

👤 *المغادر:* @${displayName}
🏷️ *المجموعة:* ${groupName}
⏰ *وقت المغادرة:* ${timeString}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 *نَاقِصٌ وَاحِدٌ...*
😄 *نَاقِصٌ مَشَاكِلَهُ!*

⚽ *الْمَلْعَبُ يَنْتَظِرُ أَبْطَالاً جُدُداً!* 🎪

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 ${CHANNEL_LINK}

🌹 *نتمنى لك الخير في رحلتك!* 🌹`;
            },
            promote: (participantsList) => {
                const firstUser = participantsList[0] || '';
                const displayName = firstUser.split('@')[0] || 'مستخدم';
                return `🍁 مـبـروك الادمـن @${displayName}\nby ${authorTag}`;
            },
            demote: (participantsList) => {
                const firstUser = participantsList[0] || '';
                const displayName = firstUser.split('@')[0] || 'مستخدم';
                return `🍁 بـقـيـت عـضـو @${displayName}\nby ${authorTag}`;
            }
        };

        const txt = messages[eventType] ? messages[eventType](participants) : null;
        if (!txt) return null;

        const disabled = global._gs?.[event.chat]?.welcomeDisabled;
        if (disabled) return 9999;

        // 👑 لو المطور اللي دخل أو خرج
        if (['add', 'remove'].includes(eventType) && participants.length) {
            const owners = ctx.config?.owners || [];
            const isOwnerAffected = participants.some(p =>
                owners.some(o => p === o.jid || p === o.lid)
            );

            if (isOwnerAffected) {
                const ownerParticipant = participants.find(p =>
                    owners.some(o => p === o.jid || p === o.lid)
                );
                const ownerEntry = owners.find(o =>
                    ownerParticipant === o.jid || ownerParticipant === o.lid
                );
                const ownerName = ownerEntry?.name || getOwnerName(ownerParticipant) || 'تنغن كيرا';

                const msgs = eventType === 'add' ? makeOwnerWelcome(ownerName) : makeOwnerBye(ownerName);
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                await new Promise(r => setTimeout(r, 3000));
                await ctx.sock.sendMessage(event.chat, { text: msg, mentions: participants });
                return null;
            }
        }

        const img = ['remove', 'add'].includes(eventType)
            ? (event.userUrl || MAIN_IMAGE)
            : MAIN_IMAGE;

        const mentions = author ? [author, ...participants] : participants;

        await new Promise(r => setTimeout(r, 3000));

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: BOT_NAME,
            body: `🍁 بوت واتساب من تطوير ${DEVELOPER} | ⚽ المهرجان مستمر`,
            mentions,
            newsletter: { name: CHANNEL_NAME, jid: CHANNEL_JID },
            big: ['remove', 'add'].includes(eventType)
        });

    } catch (e) { console.error('[group event]', e.message); }
    return null;
};

// ======================================================
// access - رسائل التحقق من الصلاحيات
// ======================================================
const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    if (!checkType && !msg.isOwner) {
        const sys = global._gs?.__system;
        if (sys && (sys.disabledCommands?.length || sys.disabledCategories?.length)) {
            const body = (msg.body || msg.text || '').trim();
            const { command: msgCmd, category: msgCat } = _extractMsgCmd(body, msg._bot || conn);

            if (msgCmd && sys.disabledCommands?.includes(msgCmd)) {
                await conn?.sendMessage(msg.chat, {
                    text: `*${EMOJI} الامـر دا مـوقـف مـؤقـتاً*`
                });
                return false;
            }

            if (msgCat && sys.disabledCategories?.includes(msgCat)) {
                await conn?.sendMessage(msg.chat, {
                    text: `*${EMOJI} الـقـسـم دا مـوقـف مـؤقـتاً*`
                });
                return false;
            }
        }
    }

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*${EMOJI} استنى ${time ? Math.ceil(time / 1000) : 'بعض كام'} ثانية*`,
        owner:    `*${EMOJI} الامـر دا بـتـاع المـطـوريـن فـقـط*`,
        group:    `*${EMOJI} الأمر ده في الجروبات بس*`,
        admin:    `*${EMOJI} الامـر دا بـتـاع الادمـن بـس*`,
        private:  `*${EMOJI} الامـر دا فـي الـخـاص بـس*`,
        botAdmin: `*${EMOJI} ارفـعـني مـشـرف وبـعـدين نـفـز الامـر*`,
        noSub:    `*${EMOJI} الأمر ده في البوت الأساسي فقط*`,
        disabled: `*${EMOJI} الامـر دا مـوقـف مـؤقـتاً*`,
        error:    `*${EMOJI} الأمر فيه خطأ، تواصل مع تنغن كيرا*`
    };

    if (conn && messages[checkType]) {
        try {
            if (checkType === 'error') {
                await conn.sendButton(msg.chat, {
                    imageUrl: MAIN_IMAGE,
                    bodyText: messages[checkType],
                    footerText: `${EMOJI} ${BOT_NAME}`,
                    buttons: SUPPORT_TEAM.map(s => ({
                        name: 'cta_url',
                        params: { display_text: `${EMOJI} ${s.name}`, url: s.url }
                    })),
                    mentions: [msg.sender],
                    newsletter: { name: CHANNEL_NAME, jid: CHANNEL_JID },
                    interactiveConfig: { buttons_limits: 2 }
                }, quoted);
            } else {
                await conn.msgUrl(msg.chat, messages[checkType], {
                    img: MAIN_IMAGE,
                    title: `${EMOJI} ${BOT_NAME}`,
                    body: `🍁 تنبيهات البوت | ⚽ المهرجان مستمر`,
                    newsletter: { name: CHANNEL_NAME, jid: CHANNEL_JID },
                    big: false
                }, quoted);
            }
        } catch {
            await conn.sendMessage(msg.chat, { text: messages[checkType] });
        }
        return false;
    }
    return null;
};

// helper - استخراج command + category من body
let __cmdMap = null;
let __cmdMapAt = 0;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _buildMap = (base) => {
    const now = Date.now();
    if (__cmdMap && now - __cmdMapAt < 60_000) return __cmdMap;
    const map = {};
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const item of fs.readdirSync(dir)) {
            const p = path.join(dir, item);
            try {
                const st = fs.statSync(p);
                if (st.isDirectory()) { walk(p); continue; }
                if (!item.endsWith('.js')) continue;
                const content = fs.readFileSync(p, 'utf8');
                const catM = content.match(/\.category\s*=\s*['"]([^'"]+)['"]/);
                const cat = catM?.[1] || path.basename(path.dirname(p));
                const arr = content.match(/\.command\s*=\s*\[([^\]]*)\]/);
                if (arr) arr[1].split(',').forEach(s => {
                    const v = s.trim().replace(/^['"]|['"]$/g, '');
                    if (v) map[v.toLowerCase()] = cat;
                });
                const single = content.match(/\.command\s*=\s*['"]([^'"]+)['"]/);
                if (single) map[single[1].toLowerCase()] = cat;
            } catch {}
        }
    };
    walk(base);
    __cmdMap = map;
    __cmdMapAt = now;
    return map;
};

const _extractMsgCmd = (body, connOrBot) => {
    if (!body) return { command: null, category: null };
    const prefixes = connOrBot?.config?.prefix || ['.', '/', '!'];
    const pfxArr = Array.isArray(prefixes) ? prefixes : [prefixes];
    for (const p of pfxArr) {
        if (body.startsWith(p)) {
            const cmd = body.slice(p.length).split(/\s+/)[0]?.toLowerCase() || null;
            const base = connOrBot?.config?.commandsPath || './plugins';
            const map = _buildMap(base);
            return { command: cmd, category: cmd ? map[cmd] : null };
        }
    }
    return { command: null, category: null };
};

export { access, group, makeBotReply, getOwnerName };