import { Link } from "react-router-dom"

const ProfileCard = ({user}) => {
    return(
        <div className="profile-card">
          <Link to={`/profile/${user.userLogin.user?.id}`}>
            <img 
              src={user.currentUser.user?.photoUrl} 
              alt="Profile" 
              className="profile-avatar"
            />
          </Link>
          <div className="profile-info">
            <h4>{user.userLogin.user?.firstName} {user.userLogin.user?.familyName}</h4>
            <p>@{user.userLogin.user?.firstName.toLowerCase()}_{user.userLogin.user?.familyName.toLowerCase()}</p>
          </div>
        </div>
    )
}

export default ProfileCard