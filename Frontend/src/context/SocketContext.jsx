import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";
import { SocketContext } from "./socketContext";

let hasWarnedAboutMissingSocket = false;

const warnOnce = (message) => {
  if (hasWarnedAboutMissingSocket) return;
  hasWarnedAboutMissingSocket = true;
  console.warn(message);
};

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const isProduction = import.meta.env.PROD;
    const isLocalSocketUrl =
      socketUrl &&
      /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(socketUrl);

    if (!socketUrl || (isProduction && isLocalSocketUrl)) {
      warnOnce(
        !socketUrl
          ? "Apna Ghar: VITE_SOCKET_URL is not set, so chat will work but will not update in realtime. Messages still send and appear after a reload."
          : "Apna Ghar: VITE_SOCKET_URL points at localhost in a production build, so no realtime connection was opened. Chat will work but will not update in realtime until VITE_SOCKET_URL points at the deployed socket server."
      );
      setSocket(null);
      return undefined;
    }

    // Keep a single shared socket connection for the whole app session.
    const socketInstance = io(socketUrl);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    // Let the socket server know who just came online after auth state settles.
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};