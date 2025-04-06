module.exports = async (client, msg) => {
    const chat = await msg.getChat();

    if (!chat.isGroup) {
        return msg.reply("This command only works in groups.");
    }

    const ownId = (await client.getMe()).id._serialized;

    try {
        for (let participant of chat.participants) {
            const userId = participant.id._serialized;

            // Ne pas kick soi-même ou les admins
            if (userId !== ownId && !participant.isAdmin) {
                await chat.removeParticipants([userId]);
            }
        }

        msg.reply("All non-admin members have been kicked.");
    } catch (err) {
        console.error(err);
        msg.reply("Error while trying to kick members. Make sure I’m admin.");
    }
};
