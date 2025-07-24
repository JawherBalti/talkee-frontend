const FollowSuggestions = () => {
    return (
        <div className="follow-suggestions">
            <h3>Who to follow</h3>
            {/* Sample suggestion */}
            <div className="suggestion-item">
                <img src="https://res.cloudinary.com/dv1lhvgjr/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733130700/rc4ehgdckeancgybr4dd.jpg" alt="Suggested user" />
                <div className="suggestion-info">
                <h4>Jane Doe</h4>
                <p>@janedoe</p>
                </div>
                <button className="follow-btn">Follow</button>
            </div>
            <div className="suggestion-item">
                <img src="https://res.cloudinary.com/dv1lhvgjr/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733000771/1728213571268_lrmzme.jpg" alt="Suggested user" />
                <div className="suggestion-info">
                <h4>John Doe</h4>
                <p>@johndoe</p>
                </div>
                <button className="follow-btn">Follow</button>
            </div>
            {/* Add more suggestions */}
        </div>
    )
}

export default FollowSuggestions