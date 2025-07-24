import { Link } from "react-router-dom"

const ActiveFriends = ({user}) => {
    return (
        <div className="friends-section">
            <div className="section-header">
              <h3>Active Friends</h3>
              <Link to="/friends">See All</Link>
            </div>
            <div className="friends-list">
              {user.user?.user?.following?.slice(0, 4).map(friend => (
                <Link to={`/profile/${friend.id}`} key={friend.id} className="friend-item">
                  <div className="friend-avatar-container">
                    <img 
                      src={friend.photoUrl} 
                      alt={friend.firstName} 
                      className="friend-avatar"
                    />
                    <span className={`status-dot ${friend.isOnline ? 'online' : ''}`}></span>
                  </div>
                  <span className="friend-name">{friend.firstName} {friend.familyName}</span>
                </Link>
              ))}
            </div>
          </div>
    )
}

export default ActiveFriends