// 🍁 reaction_sub.js - إدارة اشتراكات التفاعلات - ISAGI TENGEN BOT

import {
    addSub, removeSub, getSub, getSubsByUser, getAllSubs,
    parseChannelJid, formatExpiry
} from '../../system/reaction_db.js';

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

// 🍁 الإيموجي المسموح بها
const VALID_EMOJIS = ['❤️','🔥','😂','😍','👏','😢','😮','🎉','💯','🙏','👍','💪','⚡','🌹','✅','🍁','👑','⭐','✨','🎯'];

// 🍁 مدد الاشتراك
const DURATIONS = {
    '1':    { label: 'يوم واحد',   ms: 86400000 },
    '3':    { label: '3 أيام',     ms: 259200000 },
    '7':    { label: 'أسبوع',      ms: 604800000 },
    '14':   { label: 'أسبوعين',    ms: 1209600000 },
    '30':   { label: 'شهر',        ms: 2592000000 },
    'يوم':  { label: 'يوم واحد',   ms: 86400000 },
    'اسبوع':{ label: 'أسبوع',      ms: 604800000 },
    'شهر':  { label: 'شهر',        ms: 2592000000 },
};

// 🍁 حالة المحادثة لكل مستخدم
if (!global.__reactionWizard) global.__reactionWizard = {};

const handler = async (m, { conn, command, text, bot }) => {
    // ✅ التحقق من المطور
    const isOwner = bot?.config?.owners?.some(o => 
        m.sender === o.jid || 
        m.sender === o.lid ||
        m.sender?.split('@')[0] === o.jid?.split('@')[0]
    );
    
    if (!isOwner) {
        return m.reply(`${EMOJI} *الأمر ده للمطورين فقط*`);
    }

    const sender = m.sender;
    const wizard = global.__reactionWizard;

    // ═══════════════════════════════════════
    // 🍁 أمر: رشق_جديد — يبدأ wizard الإضافة
    // ═══════════════════════════════════════
    if (command === 'رشق_جديد' || command === 'reaction_add') {
        wizard[sender] = { step: 'channel' };
        return m.reply(
            `${EMOJI}━━━[ *إضافة اشتراك تفاعلات* ]━━━${EMOJI}\n\n` +
            `📌 *الخطوة 1/4*\n` +
            `📢 أرسل رابط القناة أو JID\n\n` +
            `📝 *مثال:*\n` +
            `https://whatsapp.com/channel/xxx\n` +
            `أو: 12345@newsletter\n\n` +
            `${EMOJI} اكتب *.رشق_إلغاء* للإلغاء`
        );
    }

    // ═══════════════════════════════════════
    // 🍁 إلغاء الـ wizard
    // ═══════════════════════════════════════
    if (command === 'رشق_إلغاء' || command === 'reaction_cancel') {
        delete wizard[sender];
        return m.reply(`${EMOJI} *✅ تم إلغاء العملية*`);
    }

    // ═══════════════════════════════════════
    // 🍁 عرض جميع الاشتراكات
    // ═══════════════════════════════════════
    if (command === 'رشق_قائمة' || command === 'reaction_list') {
        const subs = getAllSubs();
        if (!subs.length) {
            return m.reply(`${EMOJI} *📋 مفيش اشتراكات نشطة دلوقتي*`);
        }

        const lines = subs.map((s, i) => {
            const remaining = formatExpiry(s.expiresAt);
            return (
                `*${i+1}.* 📢 \`${s.channelJid.split('@')[0]}\`\n` +
                `    👤 ${s.ownerName || s.owner?.split('@')[0] || 'مجهول'}\n` +
                `    ${s.emojis?.join(' ') || '😍'} × ${s.count || 3}\n` +
                `    ⏳ متبقي: ${remaining}\n` +
                `    🆔 \`${s.id}\``
            );
        }).join('\n\n');

        return m.reply(`${EMOJI} *الاشتراكات النشطة (${subs.length}):*\n\n${lines}`);
    }

    // ═══════════════════════════════════════
    // 🍁 حذف اشتراك
    // ═══════════════════════════════════════
    if (command === 'رشق_حذف' || command === 'reaction_remove') {
        const id = text?.trim();
        if (!id) {
            return m.reply(`${EMOJI} *استخدم:* .رشق_حذف <id>`);
        }
        const sub = getSub(id);
        if (!sub) {
            return m.reply(`${EMOJI} *❌ الاشتراك ده مش موجود أو منتهي*`);
        }
        removeSub(id);
        return m.reply(`${EMOJI} *✅ تم حذف الاشتراك:*\n📢 ${sub.channelJid}`);
    }

    // ═══════════════════════════════════════
    // 🍁 معالجة خطوات الـ wizard
    // ═══════════════════════════════════════
    if (!wizard[sender]) return;

    const step = wizard[sender].step;
    const input = m.body?.trim() || text?.trim() || '';

    // ─ خطوة 1: القناة ─
    if (step === 'channel') {
        const jid = parseChannelJid(input);
        if (!jid) {
            return m.reply(
                `${EMOJI} *❌ الرابط غلط*\n\n` +
                `📢 أرسل رابط القناة:\n` +
                `https://whatsapp.com/channel/xxx\n` +
                `أو: 12345@newsletter`
            );
        }

        // محاولة الانضمام للقناة
        try {
            await conn.newsletterFollow?.(jid).catch(() => {});
        } catch {}

        wizard[sender].channelJid = jid;
        wizard[sender].step = 'duration';

        return m.reply(
            `${EMOJI} *الخطوة 2/4*\n` +
            `⏳ اختار مدة الاشتراك:\n\n` +
            `*1* ← يوم واحد\n` +
            `*3* ← 3 أيام\n` +
            `*7* ← أسبوع\n` +
            `*14* ← أسبوعين\n` +
            `*30* ← شهر\n\n` +
            `✍️ أو اكتب عدد الأيام مباشرة (مثل: 15)`
        );
    }

    // ─ خطوة 2: المدة ─
    if (step === 'duration') {
        let durMs;
        let durLabel;

        if (DURATIONS[input]) {
            durMs    = DURATIONS[input].ms;
            durLabel = DURATIONS[input].label;
        } else {
            const days = parseInt(input);
            if (!days || days < 1 || days > 365) {
                return m.reply(`${EMOJI} *❌ مدة غلط* — اكتب رقم الأيام (1 - 365)`);
            }
            durMs    = days * 86400000;
            durLabel = `${days} يوم`;
        }

        wizard[sender].expiresAt = Date.now() + durMs;
        wizard[sender].durLabel  = durLabel;
        wizard[sender].step = 'count';

        return m.reply(
            `${EMOJI} *الخطوة 3/4*\n` +
            `🔢 كام تفاعل على كل رسالة؟\n\n` +
            `✍️ (رقم من 1 إلى 50)`
        );
    }

    // ─ خطوة 3: عدد التفاعلات ─
    if (step === 'count') {
        const count = parseInt(input);
        if (!count || count < 1 || count > 50) {
            return m.reply(`${EMOJI} *❌ العدد غلط* — اكتب رقم من 1 إلى 50`);
        }

        wizard[sender].count = count;
        wizard[sender].step  = 'emoji';

        return m.reply(
            `${EMOJI} *الخطوة 4/4*\n` +
            `😍 أرسل الإيموجي اللي عايز تتفاعل بيها\n` +
            `(ممكن ترسل أكتر من واحد مع بعض)\n\n` +
            `📌 *الإيموجي المتاحة:*\n${VALID_EMOJIS.join(' ')}\n\n` +
            `📝 *مثال:* ❤️ 🔥 😍`
        );
    }

    // ─ خطوة 4: الإيموجي ─
    if (step === 'emoji') {
        const emojiRegex = /\p{Emoji}/gu;
        const found = [...new Set((input.match(emojiRegex) || []))];

        if (!found.length) {
            return m.reply(
                `${EMOJI} *❌ مش لاقي إيموجي في رسالتك*\n\n` +
                `😍 ابعت إيموجي من دول:\n${VALID_EMOJIS.join(' ')}`
            );
        }

        // ✅ فلتر الإيموجي الصالحة فقط
        const validEmojis = found.filter(e => VALID_EMOJIS.includes(e));
        if (!validEmojis.length) {
            return m.reply(
                `${EMOJI} *❌ الإيموجي غير مسموح*\n\n` +
                `😍 استخدم من دول:\n${VALID_EMOJIS.join(' ')}`
            );
        }

        // ✅ حفظ الاشتراك
        const sub = addSub({
            channelJid: wizard[sender].channelJid,
            owner:      sender,
            ownerName:  m.pushName || sender.split('@')[0],
            expiresAt:  wizard[sender].expiresAt,
            durLabel:   wizard[sender].durLabel,
            count:      wizard[sender].count,
            emojis:     validEmojis,
            chat:       m.chat,
        });

        delete wizard[sender];

        return m.reply(
            `${EMOJI}━━━[ *✅ تم إضافة الاشتراك* ]━━━${EMOJI}\n\n` +
            `📢 *القناة:* \`${sub.channelJid.split('@')[0]}\`\n` +
            `⏳ *المدة:* ${sub.durLabel}\n` +
            `🔢 *التفاعلات:* ${sub.count} لكل رسالة\n` +
            `😍 *الإيموجي:* ${sub.emojis.join(' ')}\n\n` +
            `🆔 \`${sub.id}\`\n\n` +
            `${EMOJI} *.رشق_حذف ${sub.id}* لإيقاف الاشتراك`
        );
    }
};

// 🍁 before hook: استقبال خطوات الـ wizard
handler.before = async (m, ctx) => {
    if (!m?.sender) return false;
    const w = global.__reactionWizard?.[m.sender];
    if (!w) return false;
    
    const prefix = ctx?.bot?.config?.prefix || '.';
    if (m.body?.startsWith(prefix)) return false;
    
    await handler(m, { ...ctx, command: '__wizard__', text: m.body });
    return true;
};

handler.command  = ['رشق_جديد', 'رشق_قائمة', 'رشق_حذف', 'رشق_إلغاء', 
                    'reaction_add', 'reaction_list', 'reaction_remove', 'reaction_cancel'];
handler.usage    = ['رشق_جديد'];
handler.category = 'owner';
handler.owner    = true;

export default handler;