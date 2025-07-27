import { useEffect } from "react";
import { getFollowedUsers } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const FriendsModal = ({ userId, isOpen, onClose, onFriendClick }) => {
  const dispatch = useDispatch();
  const {
    followedUsers,
    followedUsersPagination,
    getFollowedUsersLoading,
    getFollowedUsersError
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen) {
      dispatch(getFollowedUsers({ userId, page: 1 }));
    }
  }, [isOpen, dispatch, userId]);

  const handleLoadMore = () => {
    if (followedUsersPagination.hasNextPage) {
      dispatch(getFollowedUsers({ 
        userId, 
        page: followedUsersPagination.currentPage + 1 
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="friends-modal dark-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>All Friends ({followedUsersPagination?.totalCount})</h3>
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
        <div className="friends-modal-content">
          {getFollowedUsersLoading && followedUsersPagination?.currentPage === 1 ? (
            <div>Loading...</div>
          ) : getFollowedUsersError ? (
            <div className="error-message">{getFollowedUsersError}</div>
          ) : (
            <>
              {followedUsers?.map(friend => (
                <div
                  onClick={() => {
                    onFriendClick(friend);
                    onClose();
                  }}
                  key={friend.id}
                  className="friend-item"
                >
                  <div className="friend-avatar-container">
                    <img 
                      src={friend.photoUrl} 
                      alt={`${friend.firstName} ${friend.familyName}`} 
                      className="friend-avatar"
                    />
                    <span className={`status-dot ${friend.isOnline ? 'online' : ''}`}></span>
                  </div>
                  <span className="friend-name full-name">
                    {friend.firstName} {friend.familyName}
                  </span>
                </div>
              ))}
              {getFollowedUsersLoading && followedUsersPagination?.currentPage > 1 ? (
                <div>Loading more...</div>
              ) : followedUsersPagination?.hasNextPage && (
                <button 
                  onClick={handleLoadMore} 
                  className="load-more-btn"
                  disabled={getFollowedUsersLoading}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsModal