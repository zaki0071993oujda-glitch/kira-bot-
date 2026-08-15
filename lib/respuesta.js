// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD (تم تعديلها لقناة تنغن) ---
const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '👑 قناة ملك المهرجانات تنغن الرسمية 🎶'; // <--- تم التعديل
const packname = '👑 𝐊𝐢𝐧𝐠 𝐓𝐚𝐧𝐠𝐡𝐚𝐧 𝐁𝐨𝐭 🎶'; // <--- تم التعديل

// Array de miniaturas
const iconos = [
'https://files.catbox.moe/sbf5to.jpeg',
'https://files.catbox.moe/kpp1sc.jpeg',
'https://files.catbox.moe/99g8lx.jpeg',
'https://files.catbox.moe/wmviz6.jpeg',
'https://files.catbox.moe/rthyyb.jpeg',
'https://files.catbox.moe/rg8yub.jpeg',
'https://red-fire-138.linkyhost.com',
'https://crimson-sound-593.linkyhost.com',
'https://files.catbox.moe/ye0kqt.jpeg',
'https://files.catbox.moe/fqrphu.jpeg',
'https://files.catbox.moe/n1pbfn.jpeg',
'https://files.catbox.moe/lwx3n3.jpeg',
'https://files.catbox.moe/zjttew.jpeg',
'https://files.catbox.moe/6kycg4.jpeg',
'https://files.catbox.moe/po3abt.jpeg'
];

// Función para obtener una aleatoria
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 */
const handler = (type, conn, m, comando) => {
  const msg = {
  // تم تعديل رسالة مالك البوت
  rowner: '*「👑」 عذراً، هذه الوظيفة مخصصة لمالكي البوت فقط. \n\n> ملك المهرجانات تنغن.*',
  // تم تعديل رسالة المطورين
  owner: '*「👑」 عذراً، هذا الأمر مخصص للمطورين والمالك (تنغن) فقط!* 💻',
  mods: '「🌟」 *Uguu~ هذا مخصص للمطورين السحريين فقط~!* 🔮',
  premium: '「🍡」 *Ehh~? هذه الوظيفة حصرية للمستخدمين المميزين~!* ✨\n\n💫 *لست مميزاً بعد؟ احصل عليه الآن باستخدام:*\n> ✨ *.comprarpremium 2 dias* (أو استبدل "2 dias" بالمدة المطلوبة).',
  group: '「🐾」 *أوني-تشان~! لا يمكن استخدام هذا الأمر إلا في المجموعات~!* 👥',
  private: '「🎀」 *ششش~ هذا الأمر خاص لك ولي فقط، في الخاص~* 💌',
  admin: '「🧸」 *كياه~! يمكن للمشرفين-سينباي فقط استخدام هذه الميزة~!* 🛡️',
  botAdmin: '「🔧」 *انتظر! يجب أن أكون مشرفاً ليعمل هذا الأمر بشكل صحيح.*\n\n🔧 *اجعلني مشرفاً وسأطلق كل قوتي~*',
  // إضافة رابط القناة هنا
  unreg: `🍥 𝑶𝒉 𝒏𝒐~! *أنت لم تسجل بعد~!* 😿\nأحتاج للتعرف عليك لاستخدام أوامري~ ✨\n\n📝 من فضلك سجل باستخدام:\n */reg اسمك.عمرك*\n\n🎶 مثال:\n */reg ${m.name || 'ملك_المهرجانات'}.25*\n\n💖 هكذا سأتمكن من التعرف عليك~! (⁎˃ᴗ˂⁎)\n\n📢 *قناة المطور:* https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V`,
  restrict: '「📵」 *أوه~! هذه الوظيفة نائمة حالياً~* 💤'
  }[type];

  if (msg) {
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: 'I🎀 𓈒꒰ 𝐘𝐚𝐲~ 𝐇𝐨𝐥𝐚𝐚𝐚! (≧∇≦)/',
        thumbnailUrl: getRandomIcono(), // ← aleatoria
        sourceUrl: global.channel || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V', // التأكد من استخدام قناتك
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('✖️'));
  }

  return true;
};

export default handler;