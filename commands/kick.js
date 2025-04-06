module.exports = async (client, msg) => {
    const chat = await msg.getChat();

    if (!chat.isGroup) {
        return msg.reply("This command only works in groups.");
    }

    if (!msg.hasQuotedMsg) {
        return msg.reply("Reply to the message of the person you want to kick.");
    }

    const quotedMsg = await msg.getQuotedMessage();
    const userId = quotedMsg.author || quotedMsg.from;

    try {
        await chat.removeParticipants([userId]);
        msg.reply("User has been kicked.");
    } catch (err) {
        console.error(err);
        msg.reply("Failed to kick the user. Make sure I have admin rights.");
    }
};
