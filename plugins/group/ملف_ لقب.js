// 🍁 ملف: لقب.js - نظام الألقاب - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

const CHANNEL_INFO = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_JID,
            newsletterName: CHANNEL_NAME,
            serverMessageId: -1
        }
    }
};

// ─── قاعدة البيانات الداخلية ──────────────────────────
if (!global.db) global.db = {};
if (!global.db.data) global.db.data = {};
if (!global.db.data.nicknames) global.db.data.nicknames = {};

// ─── دالة استخراج الرقم الحقيقي ──────────────────────
const getRealId = (userId) => {
    if (!userId) return null;
    // إزالة @s.whatsapp.net أو @lid
    let cleanId = userId.replace('@s.whatsapp.net', '').replace('@lid', '');
    return cleanId;
};

const handler = async (m, { conn, text, command, isAdmin, isSuperAdmin }) => {
  try {
    const chatId = m.chat;
    const senderId = m.sender.split("@")[0];
    const isGroup = m.isGroup;

    if (!isGroup) {
      return conn.sendMessage(chatId, {
        text: `${EMOJI} هذا الأمر في المجموعات فقط`
      }, { quoted: m });
    }

    // ─── دالة مساعدة للحصول على ألقاب المجموعة ──────────
    const getGroupNicknames = (groupId) => {
      if (!global.db.data.nicknames[groupId]) {
        global.db.data.nicknames[groupId] = {};
      }
      return global.db.data.nicknames[groupId];
    };

    // ─── عرض جميع الألقاب ──────────────────────────────
    if (command === "الالقاب") {
      if (!isAdmin && !isSuperAdmin) {
        return conn.sendMessage(chatId, {
          text: `🔒 *للمشرفين فقط*`
        }, { quoted: m });
      }

      const groupData = getGroupNicknames(chatId);
      const entries = Object.entries(groupData);

      if (entries.length === 0) {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} لا يوجد ألقاب مسجلة`
        }, { quoted: m });
      }

      let response = `━━━━━━━━━━━━━━━━━━\n`;
      response += `🏷️ *الألقاب المسجلة*\n`;
      response += `━━━━━━━━━━━━━━━━━━\n\n`;
      response += `📊 *الإجمالي:* ${entries.length}\n\n`;

      const mentions = [];
      entries.forEach(([userId, nickname], index) => {
        const realNumber = index + 1;
        const realId = getRealId(userId);
        response += `${realNumber}. ${nickname} → @${realId}\n`;
        mentions.push(userId);
      });

      response += `\n━━━━━━━━━━━━━━━━━━`;

      return conn.sendMessage(chatId, {
        text: response,
        mentions: mentions,
        ...CHANNEL_INFO
      }, { quoted: m });
    }

    // ─── تسجيل لقب ──────────────────────────────────────
    if (command === "تسجيل") {
      if (!isAdmin && !isSuperAdmin) {
        return conn.sendMessage(chatId, {
          text: `🔒 *للمشرفين فقط*`
        }, { quoted: m });
      }

      if (!m.mentionedJid || !text || text.trim() === "") {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} .تسجيل @مستخدم [اللقب]`
        }, { quoted: m });
      }

      const mentionedUser = m.mentionedJid[0].replace('@s.whatsapp.net', '').replace('@lid', '');
      const nickname = text.trim().split(" ").slice(1).join(" ");

      if (!nickname) {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} .تسجيل @مستخدم [اللقب]`
        }, { quoted: m });
      }

      const groupData = getGroupNicknames(chatId);

      // التحقق من وجود اللقب
      const existingNickname = Object.entries(groupData).find(
        ([userId, nick]) => nick.toLowerCase() === nickname.toLowerCase()
      );

      if (existingNickname) {
        const [userId] = existingNickname;
        const realId = getRealId(userId);
        return conn.sendMessage(chatId, {
          text: `${EMOJI} ❌ "${nickname}" مستخدم من @${realId}`,
          mentions: [userId],
          ...CHANNEL_INFO
        }, { quoted: m });
      }

      // تسجيل اللقب
      groupData[mentionedUser] = nickname;

      // حفظ في قاعدة البيانات
      if (global.db.save) {
        await global.db.save();
      }

      const realId = getRealId(mentionedUser);
      return conn.sendMessage(chatId, {
        text: `${EMOJI} ✅ *${nickname}* → @${realId}`,
        mentions: [mentionedUser + "@s.whatsapp.net"],
        ...CHANNEL_INFO
      }, { quoted: m });
    }

    // ─── حذف لقب ──────────────────────────────────────
    if (command === "حذف_لقب") {
      if (!isAdmin && !isSuperAdmin) {
        return conn.sendMessage(chatId, {
          text: `🔒 *للمشرفين فقط*`
        }, { quoted: m });
      }

      if (!text || text.trim() === "") {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} .حذف_لقب [اللقب]`
        }, { quoted: m });
      }

      const nicknameToDelete = text.trim();
      const groupData = getGroupNicknames(chatId);

      let found = false;
      let deletedUser = null;

      for (const [userId, nick] of Object.entries(groupData)) {
        if (nick.toLowerCase() === nicknameToDelete.toLowerCase()) {
          delete groupData[userId];
          found = true;
          deletedUser = userId;
          break;
        }
      }

      if (!found) {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} ❌ "${nicknameToDelete}" غير موجود`
        }, { quoted: m });
      }

      if (global.db.save) {
        await global.db.save();
      }

      return conn.sendMessage(chatId, {
        text: `${EMOJI} 🗑️ تم حذف "${nicknameToDelete}"`,
        ...CHANNEL_INFO
      }, { quoted: m });
    }

    // ─── لقبي ──────────────────────────────────────────
    if (command === "لقبي") {
      const groupData = getGroupNicknames(chatId);
      const userNickname = groupData[senderId];

      if (userNickname) {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} 🏷️ *لقبك:* ${userNickname}`,
          ...CHANNEL_INFO
        }, { quoted: m });
      } else {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} ليس لديك لقب`
        }, { quoted: m });
      }
    }

    // ─── لقبه ──────────────────────────────────────────
    if (command === "لقبه") {
      if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} .لقبه @مستخدم`
        }, { quoted: m });
      }

      const targetUser = m.mentionedJid[0].replace('@s.whatsapp.net', '').replace('@lid', '');
      const groupData = getGroupNicknames(chatId);
      const targetNickname = groupData[targetUser];

      if (targetNickname) {
        const realId = getRealId(targetUser);
        return conn.sendMessage(chatId, {
          text: `${EMOJI} 🏷️ *لقب @${realId}:* ${targetNickname}`,
          mentions: [targetUser + "@s.whatsapp.net"],
          ...CHANNEL_INFO
        }, { quoted: m });
      } else {
        const realId = getRealId(targetUser);
        return conn.sendMessage(chatId, {
          text: `${EMOJI} @${realId} ليس لديه لقب`,
          mentions: [targetUser + "@s.whatsapp.net"]
        }, { quoted: m });
      }
    }

    // ─── التحقق من اللقب ──────────────────────────────
    if (command === "لقب") {
      if (!text || text.trim() === "") {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} .لقب [اللقب]`
        }, { quoted: m });
      }

      const nicknameToCheck = text.trim();
      const groupData = getGroupNicknames(chatId);

      const existingNickname = Object.entries(groupData).find(
        ([userId, nick]) => nick.toLowerCase() === nicknameToCheck.toLowerCase()
      );

      if (existingNickname) {
        const [userId] = existingNickname;
        const realId = getRealId(userId);
        return conn.sendMessage(chatId, {
          text: `${EMOJI} ❌ "${nicknameToCheck}" مستخدم من @${realId}`,
          mentions: [userId],
          ...CHANNEL_INFO
        }, { quoted: m });
      } else {
        return conn.sendMessage(chatId, {
          text: `${EMOJI} ✅ "${nicknameToCheck}" متاح`,
          ...CHANNEL_INFO
        }, { quoted: m });
      }
    }

  } catch (error) {
    console.error("🍁 ❌ خطأ:", error);
    const chatId = m.chat;
    if (chatId) {
      await conn.sendMessage(chatId, {
        text: `${EMOJI} حدث خطأ!`
      }, { quoted: m });
    }
  }
};

handler.command = ["الالقاب", "تسجيل", "لقبي", "لقبه", "حذف_لقب", "لقب"];
handler.tags = ["BK9"];

export default handler;