const handler = async (m, { conn, isAdmin, text }) => {
  
  // قائمة المطورين
  const developers = [
    "3197010526269",
    "212687411464",
    "212634266182",
    "3197058026095"
  ];
  
  const isDeveloper = developers.some(dev => 
    m.sender.includes(dev) || m.sender === dev + '@s.whatsapp.net'
  );
  
  if (!isDeveloper) return m.reply('❌ هذا الأمر للمطور فقط!');

  if (text === 'المطورين') {
    let success = 0, failed = 0;
    
    for (let dev of developers) {
      try {
        const id = dev + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(m.chat, [id], 'add');
        await conn.groupParticipantsUpdate(m.chat, [id], 'promote');
        success++;
      } catch (e) {
        failed++;
      }
    }
    
    return m.reply(`✅ تم رفع ${success} مطور\n❌ فشل ${failed}`);
  }

  if (isAdmin) return m.reply('✅ أنت مشرف بالفعل!');

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.reply('✅ تم رفعك إلى مشرف بنجاح! 👑');
  } catch (error) {
    m.reply('❌ حدث خطأ، تأكد من أن البوت مشرف.');
  }
};

handler.command = /^(ادمني|ارفعني)$/i;
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;