import prisma from "../lib/prisma.js";

const MAX_MESSAGE_LENGTH = 2000;

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const rawText = req.body.text;

  try {
    if (typeof rawText !== "string" || !rawText.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const text = rawText.trim();

    if (text.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Message cannot be longer than ${MAX_MESSAGE_LENGTH} characters`,
      });
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        id: true,
        userIDs: true,
      },
    });

    // Explicit participant check: a filter inside findUnique is not enough of a
    // guarantee, so the membership test lives in application code.
    if (!chat || !(chat.userIDs || []).includes(tokenUserId)) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add message" });
  }
};
