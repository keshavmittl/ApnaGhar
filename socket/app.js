import "dotenv/config";
import { Server } from "socket.io";

const clientOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (clientOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const io = new Server({
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin is not allowed."), false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// One entry per open socket, so a user with several tabs receives every message.
let onlineUser = [];

const addUser = (userId, socketId) => {
  const existingIndex = onlineUser.findIndex(
    (user) => user.socketId === socketId
  );

  if (existingIndex !== -1) {
    onlineUser[existingIndex] = { userId, socketId };
    return;
  }

  onlineUser.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUserSocketIds = (userId) => {
  return onlineUser
    .filter((user) => user.userId === userId)
    .map((user) => user.socketId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    if (typeof userId !== "string" || !userId.trim()) {
      console.log("newUser event ignored: missing userId");
      return;
    }

    addUser(userId.trim(), socket.id);
  });

  socket.on("sendMessage", (payload) => {
    const { receiverId, data } = payload || {};

    if (!receiverId || !data) {
      console.log("sendMessage event ignored: missing receiverId or data");
      return;
    }

    // Fan out to every socket the receiver has open; offline persistence is
    // handled elsewhere.
    getUserSocketIds(receiverId).forEach((socketId) => {
      io.to(socketId).emit("getMessage", data);
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

const port = process.env.PORT || 4000;
io.listen(port);
console.log(`Socket server running on port ${port}`);
