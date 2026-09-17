import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MessagesPage.module.scss";
import profile from "../assets/profile.webp";
import { selectUser } from "../redux/selectors";

const MessagesPage = () => {
  const auth = useSelector(selectUser);

  const loggedUser =
    auth.user ||
    (() => {
      try {
        const savedUser = localStorage.getItem("nexoraUser");
        return savedUser ? JSON.parse(savedUser) : null;
      } catch {
        return null;
      }
    })();

  const currentUserName =
    loggedUser?.name ||
    loggedUser?.email?.split("@")[0] ||
    "Nexora User";

  const [selectedFriend, setSelectedFriend] = useState({
    id: 1,
    name: "Alex",
  });

  const [messageText, setMessageText] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex",
      text: "Salut! 👋",
    },
    {
      id: 2,
      sender: currentUserName,
      text: "Salut! Ce faci? 😄",
    },
  ]);

  const friends = [
    {
      id: 1,
      name: "Alex",
    },
    {
      id: 2,
      name: "Maria",
    },
    {
      id: 3,
      name: "David",
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: currentUserName,
      text: messageText.trim(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      newMessage,
    ]);

    setMessageText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.messagesPage}>
      <div className={styles.messagesContainer}>
        {/* FRIENDS */}
        <aside className={styles.friendsPanel}>
          <div className={styles.panelHeader}>
            <h2>Messages</h2>
          </div>

          <div className={styles.friendsList}>
            {friends.map((friend) => (
              <button
                type="button"
                key={friend.id}
                className={`${styles.friendItem} ${
                  selectedFriend.id === friend.id
                    ? styles.activeFriend
                    : ""
                }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <img
                  src={profile}
                  alt={friend.name}
                />

                <div>
                  <strong>{friend.name}</strong>
                  <span>Click to open chat</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* CHAT */}
        <section className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <img
              src={profile}
              alt={selectedFriend.name}
            />

            <div>
              <h3>{selectedFriend.name}</h3>
              <span>Online</span>
            </div>
          </div>

          <div className={styles.messagesList}>
            {messages.map((message) => {
              const isMine =
                message.sender === currentUserName;

              return (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${
                    isMine
                      ? styles.myMessageRow
                      : styles.friendMessageRow
                  }`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      isMine
                        ? styles.myMessage
                        : styles.friendMessage
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder={`Message ${selectedFriend.name}...`}
              value={messageText}
              onChange={(event) =>
                setMessageText(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;