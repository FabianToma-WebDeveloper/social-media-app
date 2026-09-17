import { useEffect, useState } from "react";
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

  /*
   * Fiecare utilizator logat are propriul lui
   * storage pentru mesaje.
   */
  const messagesStorageKey = loggedUser?.id
    ? `nexoraMessages_${loggedUser.id}`
    : `nexoraMessages_${loggedUser?.email || "guest"}`;

  // PRIETENI DEMO
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

  const [selectedFriend, setSelectedFriend] = useState(
    friends[0]
  );

  const [messageText, setMessageText] = useState("");

  /*
   * Incarcam mesajele salvate.
   * Daca nu exista, pornim cu mesajele demo.
   */
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem(
        messagesStorageKey
      );

      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (error) {
      console.log(
        "Could not load messages:",
        error
      );
    }

    return [
      {
        id: 1,
        friendId: 1,
        sender: "Alex",
        text: "Salut! 👋",
        createdAt: "10:30",
      },
      {
        id: 2,
        friendId: 1,
        sender: currentUserName,
        text: "Salut! Ce faci? 😄",
        createdAt: "10:31",
      },
    ];
  });

  /*
   * De fiecare data cand se modifica messages,
   * salvam conversatiile in localStorage.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        messagesStorageKey,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.log(
        "Could not save messages:",
        error
      );
    }
  }, [messages, messagesStorageKey]);

  // MESAJELE CONVERSATIEI SELECTATE
  const conversationMessages = messages.filter(
    (message) =>
      message.friendId === selectedFriend.id
  );

  // TRIMITE MESAJ
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      friendId: selectedFriend.id,

      sender: currentUserName,
      senderId: loggedUser?.id,
      senderEmail: loggedUser?.email,

      text: messageText.trim(),

      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      newMessage,
    ]);

    setMessageText("");
  };

  // ENTER = SEND
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.messagesPage}>
      <div className={styles.messagesContainer}>
        {/* LEFT SIDE - FRIENDS */}
        <aside className={styles.friendsPanel}>
          <div className={styles.panelHeader}>
            <h2>💬 Messages</h2>

            <span>{currentUserName}</span>
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
                onClick={() =>
                  setSelectedFriend(friend)
                }
              >
                <img
                  src={profile}
                  alt={friend.name}
                />

                <div className={styles.friendInfo}>
                  <strong>{friend.name}</strong>

                  <span>
                    Open conversation
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE - CHAT */}
        <section className={styles.chatPanel}>
          {/* CHAT HEADER */}
          <div className={styles.chatHeader}>
            <img
              src={profile}
              alt={selectedFriend.name}
            />

            <div>
              <h3>
                {selectedFriend.name}
              </h3>

              <span>● Online</span>
            </div>
          </div>

          {/* MESSAGES */}
          <div className={styles.messagesList}>
            {conversationMessages.length === 0 ? (
              <div className={styles.emptyChat}>
                <span>💬</span>

                <h3>
                  Start a conversation with{" "}
                  {selectedFriend.name}
                </h3>

                <p>
                  Send your first message below.
                </p>
              </div>
            ) : (
              conversationMessages.map(
                (message) => {
                  const isMine =
                    message.sender ===
                    currentUserName;

                  return (
                    <div
                      key={message.id}
                      className={`${
                        styles.messageRow
                      } ${
                        isMine
                          ? styles.myMessageRow
                          : styles.friendMessageRow
                      }`}
                    >
                      {!isMine && (
                        <img
                          src={profile}
                          alt={message.sender}
                          className={
                            styles.messageAvatar
                          }
                        />
                      )}

                      <div
                        className={`${
                          styles.messageBubble
                        } ${
                          isMine
                            ? styles.myMessage
                            : styles.friendMessage
                        }`}
                      >
                        <p>
                          {message.text}
                        </p>

                        <span>
                          {
                            message.createdAt
                          }
                        </span>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>

          {/* MESSAGE INPUT */}
          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder={`Message ${selectedFriend.name}...`}
              value={messageText}
              onChange={(event) =>
                setMessageText(
                  event.target.value
                )
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