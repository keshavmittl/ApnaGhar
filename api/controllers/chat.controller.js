import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    const hydratedChats = await Promise.all(
      chats.map(async (chat) => {
        const participantIds = [...new Set(chat.userIDs || [])];
        const receiverId = participantIds.find((id) => id !== tokenUserId);

        // Skip malformed chats instead of crashing the entire inbox.
        if (!receiverId) {
          return null;
        }

        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });

        if (!receiver) {
          return null;
        }

        return {
          ...chat,
          receiver,
        };
      })
    );

    res.status(200).json(hydratedChats.filter(Boolean));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Only participants may read a chat, and a missing chat must not answer 200.
    if (!chat || !(chat.userIDs || []).includes(tokenUserId)) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    if (!receiverId) {
      return res.status(400).json({ message: "receiverId is required" });
    }

    if (receiverId === tokenUserId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Optional: Prevent duplicate chats
    const existing = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (existing) {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      return res.status(200).json({
        ...existing,
        messages: [],
        receiver,
      });
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId], // initial seen state
      },
    });

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res.status(200).json({
      ...newChat,
      messages: [],
      receiver,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const existing = await prisma.chat.findUnique({
      where: { id: req.params.id },
      select: { id: true, userIDs: true },
    });

    // Without this check any logged-in user could mark someone else's chat read.
    if (!existing || !(existing.userIDs || []).includes(tokenUserId)) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to read chat" });
  }
};
