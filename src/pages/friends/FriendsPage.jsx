import React, { useEffect, useMemo, useState } from "react";
import "./FriendsPage.scss";

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [requests, setRequests] = useState(() => {
    try {
      const savedRequests = localStorage.getItem(
        "nexoraFriendRequests"
      );

      if (savedRequests) {
        return JSON.parse(savedRequests);
      }
    } catch (error) {
      console.log("Could not load friend requests:", error);
    }

    return [
      {
        id: 1,
        name: "Alex Popa",
        avatar: "https://i.pravatar.cc/150?img=12",
        mutual: 4,
      },
      {
        id: 2,
        name: "Elena Ionescu",
        avatar: "https://i.pravatar.cc/150?img=47",
        mutual: 12,
      },
    ];
  });

  const [friends, setFriends] = useState(() => {
    let savedFriends = [];

    try {
      const storedFriends = localStorage.getItem(
        "nexoraFriendsPage"
      );

      if (storedFriends) {
        savedFriends = JSON.parse(storedFriends);
      }
    } catch (error) {
      console.log("Could not load friends:", error);
    }

    if (savedFriends.length === 0) {
      savedFriends = [
        {
          id: 101,
          name: "Andrei Radu",
          avatar: "https://i.pravatar.cc/150?img=33",
          mutual: 8,
        },
        {
          id: 102,
          name: "Maria Stan",
          avatar: "https://i.pravatar.cc/150?img=5",
          mutual: 15,
        },
        {
          id: 103,
          name: "Cristi Dan",
          avatar: "https://i.pravatar.cc/150?img=60",
          mutual: 2,
        },
      ];
    }

    try {
      const homeFriends = JSON.parse(
        localStorage.getItem("nexoraFriends") || "[]"
      );

      const addedFromHome = homeFriends
        .filter((friend) => friend.added)
        .map((friend) => ({
          id: `home-${friend.id}`,
          homeFriendId: friend.id,
          name: friend.name,
          avatar: `https://i.pravatar.cc/150?u=nexora-${friend.id}`,
          mutual: 0,
        }));

      addedFromHome.forEach((homeFriend) => {
        const alreadyExists = savedFriends.some(
          (friend) =>
            friend.homeFriendId === homeFriend.homeFriendId ||
            friend.name.toLowerCase() ===
              homeFriend.name.toLowerCase()
        );

        if (!alreadyExists) {
          savedFriends.unshift(homeFriend);
        }
      });
    } catch (error) {
      console.log(
        "Could not sync Home friends with Friends page:",
        error
      );
    }

    return savedFriends;
  });

  const [suggestions, setSuggestions] = useState(() => {
    try {
      const savedSuggestions = localStorage.getItem(
        "nexoraFriendSuggestions"
      );

      if (savedSuggestions) {
        return JSON.parse(savedSuggestions);
      }
    } catch (error) {
      console.log("Could not load suggestions:", error);
    }

    return [
      {
        id: 201,
        name: "David Munteanu",
        avatar: "https://i.pravatar.cc/150?img=11",
        mutual: 6,
      },
      {
        id: 202,
        name: "Ana Maria",
        avatar: "https://i.pravatar.cc/150?img=9",
        mutual: 1,
      },
      {
        id: 203,
        name: "Robert Matei",
        avatar: "https://i.pravatar.cc/150?img=15",
        mutual: 9,
      },
      {
        id: 204,
        name: "Bianca Pavel",
        avatar: "https://i.pravatar.cc/150?img=44",
        mutual: 5,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      "nexoraFriendRequests",
      JSON.stringify(requests)
    );
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(
      "nexoraFriendsPage",
      JSON.stringify(friends)
    );
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(
      "nexoraFriendSuggestions",
      JSON.stringify(suggestions)
    );
  }, [suggestions]);

  const updateHomeFriendStatus = (homeFriendId, added) => {
    if (!homeFriendId) {
      return;
    }

    try {
      const homeFriends = JSON.parse(
        localStorage.getItem("nexoraFriends") || "[]"
      );

      const updatedHomeFriends = homeFriends.map((friend) =>
        friend.id === homeFriendId
          ? {
              ...friend,
              added,
            }
          : friend
      );

      localStorage.setItem(
        "nexoraFriends",
        JSON.stringify(updatedHomeFriends)
      );
    } catch (error) {
      console.log(
        "Could not update Home friend status:",
        error
      );
    }
  };

  const handleAcceptRequest = (request) => {
    setFriends((currentFriends) => [
      {
        ...request,
        id: Date.now(),
      },
      ...currentFriends,
    ]);

    setRequests((currentRequests) =>
      currentRequests.filter(
        (item) => item.id !== request.id
      )
    );
  };

  const handleDeclineRequest = (id) => {
    setRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== id
      )
    );
  };

  const handleRemoveFriend = (friend) => {
    setFriends((currentFriends) =>
      currentFriends.filter(
        (item) => item.id !== friend.id
      )
    );

    updateHomeFriendStatus(
      friend.homeFriendId,
      false
    );

    setSuggestions((currentSuggestions) => {
      const alreadyExists = currentSuggestions.some(
        (item) =>
          item.name.toLowerCase() ===
          friend.name.toLowerCase()
      );

      if (alreadyExists) {
        return currentSuggestions;
      }

      return [
        {
          ...friend,
          id: Date.now(),
        },
        ...currentSuggestions,
      ];
    });
  };

  const handleAddSuggestion = (user) => {
    setFriends((currentFriends) => [
      {
        ...user,
        id: user.homeFriendId
          ? `home-${user.homeFriendId}`
          : Date.now(),
      },
      ...currentFriends,
    ]);

    updateHomeFriendStatus(
      user.homeFriendId,
      true
    );

    setSuggestions((currentSuggestions) =>
      currentSuggestions.filter(
        (item) => item.id !== user.id
      )
    );
  };

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      friend.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) =>
      request.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((user) =>
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [suggestions, searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="friends-page">
      <div className="friends-top">
        <div>
          <span className="friends-eyebrow">
            Nexora Community
          </span>

          <h1>Friends</h1>

          <p>
            Manage your friends, requests and discover
            new people.
          </p>
        </div>

        <div className="friends-summary">
          <div>
            <strong>{friends.length}</strong>
            <span>Friends</span>
          </div>

          <div>
            <strong>{requests.length}</strong>
            <span>Requests</span>
          </div>

          <div>
            <strong>{suggestions.length}</strong>
            <span>Suggestions</span>
          </div>
        </div>
      </div>

      <div className="friends-toolbar">
        <div className="friends-search">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>

        <div className="friends-tabs">
          <button
            type="button"
            className={
              activeTab === "all" ? "active" : ""
            }
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            type="button"
            className={
              activeTab === "friends"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("friends")
            }
          >
            Friends ({friends.length})
          </button>

          <button
            type="button"
            className={
              activeTab === "requests"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("requests")
            }
          >
            Requests ({requests.length})
          </button>

          <button
            type="button"
            className={
              activeTab === "suggestions"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("suggestions")
            }
          >
            Suggestions
          </button>
        </div>
      </div>

      {(activeTab === "all" ||
        activeTab === "requests") && (
        <section className="friends-section">
          <div className="section-heading">
            <div>
              <h2>Friend Requests</h2>

              <p>
                People who want to connect with you.
              </p>
            </div>

            <span>{filteredRequests.length}</span>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="friends-grid">
              {filteredRequests.map((request) => (
                <article
                  key={request.id}
                  className="friend-card request-card"
                >
                  <div className="friend-main">
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="avatar"
                    />

                    <div className="info">
                      <h3>{request.name}</h3>

                      <p>
                        {request.mutual} mutual{" "}
                        {request.mutual === 1
                          ? "friend"
                          : "friends"}
                      </p>
                    </div>
                  </div>

                  <div className="actions two-actions">
                    <button
                      type="button"
                      className="btn-confirm"
                      onClick={() =>
                        handleAcceptRequest(request)
                      }
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() =>
                        handleDeclineRequest(
                          request.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div>👋</div>

              <h3>No friend requests</h3>

              <p>
                {searchTerm
                  ? "No requests match your search."
                  : "You're all caught up for now."}
              </p>
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" ||
        activeTab === "friends") && (
        <section className="friends-section">
          <div className="section-heading">
            <div>
              <h2>Your Friends</h2>

              <p>
                People you are connected with on
                Nexora.
              </p>
            </div>

            <span>{filteredFriends.length}</span>
          </div>

          {filteredFriends.length > 0 ? (
            <div className="friends-grid">
              {filteredFriends.map((friend) => (
                <article
                  key={friend.id}
                  className="friend-card"
                >
                  <div className="friend-main">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="avatar"
                    />

                    <div className="info">
                      <h3>{friend.name}</h3>

                      <p>
                        {friend.mutual} mutual{" "}
                        {friend.mutual === 1
                          ? "friend"
                          : "friends"}
                      </p>
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() =>
                        handleRemoveFriend(friend)
                      }
                    >
                      Remove Friend
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div>👥</div>

              <h3>No friends found</h3>

              <p>
                {searchTerm
                  ? "Try searching for another name."
                  : "Start connecting with people from Suggestions."}
              </p>
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" ||
        activeTab === "suggestions") && (
        <section className="friends-section">
          <div className="section-heading">
            <div>
              <h2>People You May Know</h2>

              <p>
                Discover new people from the Nexora
                community.
              </p>
            </div>

            <span>{filteredSuggestions.length}</span>
          </div>

          {filteredSuggestions.length > 0 ? (
            <div className="friends-grid">
              {filteredSuggestions.map((user) => (
                <article
                  key={user.id}
                  className="friend-card"
                >
                  <div className="friend-main">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="avatar"
                    />

                    <div className="info">
                      <h3>{user.name}</h3>

                      <p>
                        {user.mutual} mutual{" "}
                        {user.mutual === 1
                          ? "friend"
                          : "friends"}
                      </p>
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn-add"
                      onClick={() =>
                        handleAddSuggestion(user)
                      }
                    >
                      Add Friend
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div>✨</div>

              <h3>No suggestions found</h3>

              <p>
                {searchTerm
                  ? "No people match your search."
                  : "Check back later for new suggestions."}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default FriendsPage;