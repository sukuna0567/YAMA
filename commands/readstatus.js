const emojis = ['🔥', '❤️', '😂', '😱', '💯', '😎'];

module.exports = async (client) => {
    const statuses = await client.getStatus();

    for (let contact of statuses) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        try {
            await client.sendMessage(contact.id._serialized, emoji);
        } catch (err) {
            console.log("Error reacting to status:", err);
        }
    }

    console.log("Statuses reacted with emojis.");
};
