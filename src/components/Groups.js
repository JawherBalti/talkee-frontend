import { Link } from "react-router-dom"

const Groups = ({user}) => {
    return(
        <div className="groups-section">
          <div className="section-header">
            <h3>Your Groups</h3>
            <Link to="/groups">See All</Link>
          </div>
          <div className="groups-list">
            {user.groups?.slice(0, 3).map(group => (
              <Link to={`/group/${group.id}`} key={group.id} className="group-item">
                <img 
                  src={group.coverImage} 
                  alt={group.name} 
                  className="group-avatar"
                />
                <div className="group-info">
                  <h4>{group.name}</h4>
                  <p>{group.memberCount} members</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
    )
}

export default Groups