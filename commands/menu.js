const getGreeting = require('../utils/timeGreeting');

module.exports = async (client, msg) => {
    const greeting = getGreeting();
    const menu = `
${greeting}!

I'm *YAMA*, your WhatsApp bot.
Here are my commands:

• .tagall – Mention everyone in the group  
• .kick – Kick someone (reply to their message)  
• .kickall – Kick everyone except admins  
• .readstatus – React to all statuses  
• .menu – Show this help menu

Created by Emperor Sukuna  
[Bot Channel](https://whatsapp.com/channel/0029Vb6J7O684Om8DdNfvL2N)
    `;

    await msg.reply(menu);
};
