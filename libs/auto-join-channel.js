// 🍁 auto-join-channel.js - الانضمام للقناة - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';
const CHANNEL_JID = '120363428650036031@newsletter';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbD2LYO3mFY2L9H5lB3u';

const autoJoinChannel = async (client, channelJid = CHANNEL_JID) => {
    // ✅ لا انضمام تلقائي - فقط عرض معلومات القناة
    console.log(`${EMOJI} [AutoJoin] الانضمام التلقائي للقناة معطل (امتثالاً لسياسة واتساب)`);
    
    // ✅ إرجاع معلومات القناة بدلاً من الانضمام
    return {
        success: false,
        message: 'الانضمام التلقائي معطل',
        channel: {
            jid: CHANNEL_JID,
            link: CHANNEL_LINK,
            name: BOT_NAME
        }
    };
};

export default autoJoinChannel;