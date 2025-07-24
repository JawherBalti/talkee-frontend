import { Link } from "react-router-dom"

const QuickSettings = () => {
return(
    <div className="settings-section">
          <div className="section-header">
            <h3>Quick Settings</h3>
          </div>
          <div className="settings-options">
            <button className="settings-option">
              <i className="fas fa-moon"></i> Dark Mode
            </button>
            <Link to="/settings" className="settings-option">
              <i className="fas fa-bell"></i> Notifications
            </Link>
            <Link to="/settings" className="settings-option">
              <i className="fas fa-lock"></i> Privacy
            </Link>
            <Link to="/settings" className="settings-option">
              <i className="fas fa-cog"></i> All Settings
            </Link>
          </div>
        </div>
)
}

export default QuickSettings