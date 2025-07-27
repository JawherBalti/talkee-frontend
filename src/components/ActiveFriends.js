import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendsModal from "./FriendsModal";

const ActiveFriends = ({ user }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFriendClick = (friend) => {
        navigate('/messages', { state: { selectedUserId: friend.id } });
    };

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="friends-section">
            <div className="section-header">
                <h3>Active Friends</h3>
                <a href="#" onClick={openModal} className="see-all-link">
                    See All
                </a>
            </div>
            <div className="friends-list">
                {user.user?.user?.following?.slice(0, 4).map(friend => (
                    <div
                        onClick={() => handleFriendClick(friend)}
                        key={friend.id}
                        className="friend-item"
                    >
                        <div className="friend-avatar-container">
                            <img 
                                src={friend.photoUrl} 
                                alt={friend.firstName} 
                                className="friend-avatar"
                            />
                            <span className={`status-dot ${friend.isOnline ? 'online' : ''}`}></span>
                        </div>
                        <span className="friend-name">{friend.firstName} {friend.familyName}</span>
                    </div>
                ))}
            </div>
            <FriendsModal
                userId={user.user?.user?.id}
                isOpen={isModalOpen}
                onClose={closeModal}
                onFriendClick={handleFriendClick}
            />
        </div>
    );
};

export default ActiveFriends;