module.exports = async (client, msg) => {
    const chat = await msg.getChat();

    if (!chat.isGroup) {
        return msg.reply("This command only works in groups.");
    }

    let text = '*Tagging everyone:* \n\n';
    let mentions = [];

    for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
        text += `@${contact.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
};
