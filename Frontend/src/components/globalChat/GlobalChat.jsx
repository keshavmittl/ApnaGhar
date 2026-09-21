import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./globalChat.scss";
import Chat from "../chat/Chat";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/authContext";
import { useNotificationStore } from "../../lib/notificationStore";

const GlobalChat = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const unreadCount = useNotificationStore((state) => state.number);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const autoOpenUserId = searchParams.get("chatWith");

  useEffect(() => {
    if (autoOpenUserId && currentUser) {
      setIsOpen(true);
      // Optional: remove query param after opening so it doesn't reopen on refresh
      // searchParams.delete("chatWith");
      // setSearchParams(searchParams, { replace: true });
    }
  }, [autoOpenUserId, currentUser]);

  const fetchChats = async () => {
    try {
      const res = await apiRequest.get("/chats");
      setChats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && isOpen && isLoading) {
      fetchChats();
    }
    // Also fetch on mount to get initial chats if we want to show badges inside, 
    // but the global navbar already fetches the unread count. We'll fetch chats
    // in the background once so they are ready.
    if (currentUser && !isOpen && chats.length === 0) {
        fetchChats();
    }
  }, [currentUser, isOpen, isLoading, chats.length]);

  if (!currentUser) return null;

  return (
    <div className="globalChat">
      {isOpen ? (
        <div className="globalChat__window">
          <button 
            className="globalChat__closeBtn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close Chat"
          >
            ✕
          </button>
          <div className="globalChat__content">
            {isLoading ? (
              <p className="globalChat__loading">Loading chats...</p>
            ) : (
              <Chat chats={chats} autoOpenUserId={autoOpenUserId} />
            )}
          </div>
        </div>
      ) : (
        <button className="globalChat__trigger" onClick={() => setIsOpen(true)}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
            <path
              d="M21 12 C21 16.4 17 20 12 20 C10.8 20 9.6 19.8 8.5 19.4 L4 21 L5.4 16.9 C4.5 15.6 4 14.1 4 12.5 C4 8.1 8 4.5 12 4.5 C16 4.5 21 8.1 21 12 Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10 H15.5 M8.5 13.5 H12.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="globalChat__badge">{unreadCount}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default GlobalChat;
