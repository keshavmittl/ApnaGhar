import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// Only ever expose these fields for a user other than the caller.
const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  avatar: true,
  createdAt: true,
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: PUBLIC_USER_SELECT,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { username, email, avatar, password } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorised!" });
  }

  let updatedPassword = null;

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Explicit allow list: a client must never be able to rewrite ids,
    // timestamps or relation fields through this endpoint.
    const data = {
      ...(typeof username === "string" &&
        username.trim() && { username: username.trim() }),
      ...(typeof email === "string" &&
        email.trim() && { email: email.trim().toLowerCase() }),
      ...(avatar !== undefined && { avatar }),
      ...(updatedPassword && { password: updatedPassword }),
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorised!" });
  }
  try {
    const ownedPosts = await prisma.post.findMany({
      where: { userId: id },
      select: { id: true },
    });
    const postIds = ownedPosts.map((post) => post.id);

    // MongoDB has no cascading deletes, so dependants go first and the whole
    // clean-up runs as one transaction.
    await prisma.$transaction([
      prisma.postDetail.deleteMany({ where: { postId: { in: postIds } } }),
      prisma.savedPost.deleteMany({ where: { postId: { in: postIds } } }),
      prisma.boughtPost.deleteMany({ where: { postId: { in: postIds } } }),
      prisma.payment.deleteMany({ where: { postId: { in: postIds } } }),
      prisma.post.deleteMany({ where: { id: { in: postIds } } }),
      prisma.savedPost.deleteMany({ where: { userId: id } }),
      prisma.boughtPost.deleteMany({ where: { userId: id } }),
      prisma.payment.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });

      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save post" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  const now = new Date();

  try {
    // Get userPosts with buyers info
    const userPostsRaw = await prisma.post.findMany({
      where: { userId: tokenUserId },
      include: {
        buyers: true,
      },
    });

    const userPosts = userPostsRaw.map((post) => ({
      ...post,
      isBought: post.buyers.length > 0,
      comingSoon: post.availableFrom && new Date(post.availableFrom) > now,
    }));

    // Get savedPosts with buyers info
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: {
          include: {
            buyers: true,
          },
        },
      },
    });

    const savedPosts = saved.map((item) => ({
      ...item.post,
      isBought: item.post.buyers.length > 0,
      comingSoon:
        item.post.availableFrom && new Date(item.post.availableFrom) > now,
    }));

    // Get boughtPosts (already bought, so isBought is true)
    const bought = await prisma.boughtPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: {
          include: {
            // Seller details only, never the credentials of the seller.
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            postDetail: true,
          },
        },
      },
    });

    const boughtPosts = bought.map((item) => ({
      ...item.post,
      isBought: true,
      comingSoon:
        item.post.availableFrom && new Date(item.post.availableFrom) > now,
    }));

    res.status(200).json({ userPosts, savedPosts, boughtPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    // Count unseen chats in the database instead of pulling every chat row.
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
        messages: {
          some: {
            userId: {
              not: tokenUserId,
            },
          },
        },
      },
    });

    res.status(200).json({ number });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};
