import React, { useState } from "react";
import "./FriendsPage.scss";

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [requests, setRequests] = useState([
    { id: 1, name: "Alex Popa", avatar: "https://i.pravatar.cc/150?img=12", mutual: 4 },
    { id: 2, name: "Elena Ionescu", avatar: "https://i.pravatar.cc/150?img=47", mutual: 12 },
  ]);

  const [friends, setFriends] = useState([
    { id: 101, name: "Andrei Radu", avatar: "https://i.pravatar.cc/150?img=33", mutual: 8 },
    { id: 102, name: "Maria Stan", avatar: "https://i.pravatar.cc/150?img=5", mutual: 15 },
    { id: 103, name: "Cristi Dan", avatar: "https://i.pravatar.cc/150?img=60", mutual: 2 },
  ]);

  const [suggestions, setSuggestions] = useState([
    { id: 201, name: "David Munteanu", avatar: "https://i.pravatar.cc/150?img=11", mutual: 6 },
    { id: 202, name: "Ana Maria", avatar: "https://i.pravatar.cc/150?img=9", mutual: 1 },
  ]);

  const handleAcceptRequest = (req) => {
    setFriends([...friends, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleDeclineRequest = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleRemoveFriend = (id) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const handleAddSuggestion = (user) => {
    setSuggestions(suggestions.filter((s) => s.id !== user.id));
  };

  return (
    <div className="friends-page">
      <div className="friends-header">
        <h2>Friends</h2>
        <div className="friends-tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All Friends ({friends.length})
          </button>
          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Requests ({requests.length})
          </button>
          <button
            className={activeTab === "suggestions" ? "active" : ""}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </button>
        </div>
      </div>

      {(activeTab === "all" || activeTab === "requests") && requests.length > 0 && (
        <div className="friends-section">
          <h3>Friend Requests</h3>
          <div className="friends-grid">
            {requests.map((req) => (
              <div key={req.id} className="friend-card">
                <img src={req.avatar} alt={req.name} className="avatar" />
                <div className="info">
                  <h4>{req.name}</h4>
                  <p>{req.mutual} mutual friends</p>
                </div>
                <div className="actions">
                  <button className="btn-confirm" onClick={() => handleAcceptRequest(req)}>
                    Confirm
                  </button>
                  <button className="btn-delete" onClick={() => handleDeclineRequest(req.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "all" && (
        <div className="friends-section">
          <h3>My Friends</h3>
          <div className="friends-grid">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-card">
                <img src={friend.avatar} alt={friend.name} className="avatar" />
                <div className="info">
                  <h4>{friend.name}</h4>
                  <p>{friend.mutual} mutual friends</p>
                </div>
                <div className="actions">
                  <button className="btn-remove" onClick={() => handleRemoveFriend(friend.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === "all" || activeTab === "suggestions") && suggestions.length > 0 && (
        <div className="friends-section">
          <h3>People You May Know</h3>
          <div className="friends-grid">
            {suggestions.map((user) => (
              <div key={user.id} className="friend-card">
                <img src={user.avatar} alt={user.name} className="avatar" />
                <div className="info">
                  <h4>{user.name}</h4>
                  <p>{user.mutual} mutual friends</p>
                </div>
                <div className="actions">
                  <button className="btn-add" onClick={() => handleAddSuggestion(user)}>
                    Add Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;