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
        const savedUser =
          localStorage.getItem("nexoraUser");

        return savedUser
          ? JSON.parse(savedUser)
          : null;
      } catch {
        return null;
      }
    })();

  const currentUserName =
    loggedUser?.name ||
    loggedUser?.email?.split("@")[0] ||
    "Nexora User";

  // STORAGE SEPARAT PENTRU FIECARE USER
  const messagesStorageKey = loggedUser?.id
    ? `nexoraMessages_${loggedUser.id}`
    : `nexoraMessages_${
        loggedUser?.email || "guest"
      }`;

  // INCARCAM PRIETENII REALI DIN FRIENDS PAGE
  const [friends, setFriends] = useState(() => {
    try {
      const savedFriends =
        localStorage.getItem(
          "nexoraFriendsPage"
        );

      if (savedFriends) {
        return JSON.parse(savedFriends);
      }
    } catch (error) {
      console.log(
        "Could not load friends:",
        error
      );
    }

    return [];
  });

  const [selectedFriend, setSelectedFriend] =
    useState(() => {
      try {
        const savedFriends =
          localStorage.getItem(
            "nexoraFriendsPage"
          );

        if (savedFriends) {
          const parsedFriends =
            JSON.parse(savedFriends);

          return parsedFriends[0] || null;
        }
      } catch (error) {
        console.log(
          "Could not select first friend:",
          error
        );
      }

      return null;
    });

  const [messageText, setMessageText] =
    useState("");

  // INCARCAM MESAJELE SALVATE
  const [messages, setMessages] = useState(
    () => {
      try {
        const savedMessages =
          localStorage.getItem(
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

      return [];
    }
  );

  // SALVAM MESAJELE
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

  // SINCRONIZAM PRIETENII
  useEffect(() => {
    const loadFriends = () => {
      try {
        const savedFriends =
          localStorage.getItem(
            "nexoraFriendsPage"
          );

        const parsedFriends = savedFriends
          ? JSON.parse(savedFriends)
          : [];

        setFriends(parsedFriends);

        setSelectedFriend(
          (currentFriend) => {
            if (!parsedFriends.length) {
              return null;
            }

            const stillExists =
              parsedFriends.find(
                (friend) =>
                  String(friend.id) ===
                  String(currentFriend?.id)
              );

            return (
              stillExists ||
              parsedFriends[0]
            );
          }
        );
      } catch (error) {
        console.log(
          "Could not sync friends:",
          error
        );
      }
    };

    loadFriends();

    window.addEventListener(
      "storage",
      loadFriends
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadFriends
      );
    };
  }, []);

  // MESAJELE CONVERSATIEI SELECTATE
  const conversationMessages =
    selectedFriend
      ? messages.filter(
          (message) =>
            String(message.friendId) ===
            String(selectedFriend.id)
        )
      : [];

  // TRIMITE MESAJ
  const handleSendMessage = () => {
    if (
      !messageText.trim() ||
      !selectedFriend
    ) {
      return;
    }

    const newMessage = {
      id: Date.now(),

      friendId: selectedFriend.id,
      friendName: selectedFriend.name,

      sender: currentUserName,
      senderId: loggedUser?.id,
      senderEmail: loggedUser?.email,

      text: messageText.trim(),

      createdAt:
        new Date().toLocaleTimeString([], {
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
      <div
        className={styles.messagesContainer}
      >
        {/* FRIENDS PANEL */}
        <aside
          className={styles.friendsPanel}
        >
          <div
            className={styles.panelHeader}
          >
            <h2>💬 Messages</h2>

            <span>{currentUserName}</span>
          </div>

          <div
            className={styles.friendsList}
          >
            {friends.length === 0 ? (
              <div
                className={styles.emptyChat}
              >
                <span>👥</span>

                <h3>No friends yet</h3>

                <p>
                  Add some friends to start
                  messaging.
                </p>
              </div>
            ) : (
              friends.map((friend) => (
                <button
                  type="button"
                  key={friend.id}
                  className={`${
                    styles.friendItem
                  } ${
                    String(
                      selectedFriend?.id
                    ) === String(friend.id)
                      ? styles.activeFriend
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedFriend(friend)
                  }
                >
                  <img
                    src={
                      friend.avatar ||
                      profile
                    }
                    alt={friend.name}
                  />

                  <div
                    className={
                      styles.friendInfo
                    }
                  >
                    <strong>
                      {friend.name}
                    </strong>

                    <span>
                      Open conversation
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* CHAT PANEL */}
        <section
          className={styles.chatPanel}
        >
          {selectedFriend ? (
            <>
              {/* CHAT HEADER */}
              <div
                className={
                  styles.chatHeader
                }
              >
                <img
                  src={
                    selectedFriend.avatar ||
                    profile
                  }
                  alt={
                    selectedFriend.name
                  }
                />

                <div>
                  <h3>
                    {
                      selectedFriend.name
                    }
                  </h3>

                  <span>
                    ● Nexora Friend
                  </span>
                </div>
              </div>

              {/* MESSAGES */}
              <div
                className={
                  styles.messagesList
                }
              >
                {conversationMessages.length ===
                0 ? (
                  <div
                    className={
                      styles.emptyChat
                    }
                  >
                    <span>💬</span>

                    <h3>
                      Start a conversation
                      with{" "}
                      {
                        selectedFriend.name
                      }
                    </h3>

                    <p>
                      Send your first
                      message below.
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
                              src={
                                selectedFriend.avatar ||
                                profile
                              }
                              alt={
                                selectedFriend.name
                              }
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
                              {
                                message.text
                              }
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
              <div
                className={
                  styles.messageInput
                }
              >
                <input
                  type="text"
                  placeholder={`Message ${selectedFriend.name}...`}
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                />

                <button
                  type="button"
                  onClick={
                    handleSendMessage
                  }
                  disabled={
                    !messageText.trim()
                  }
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div
              className={styles.emptyChat}
            >
              <span>👥</span>

              <h3>No conversation selected</h3>

              <p>
                Add a friend from the Friends
                page to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;