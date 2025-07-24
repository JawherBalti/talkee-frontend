const Trending = () => {
    return (
    <div className="trending-card">
        <h3>Trends for you</h3>
        <div className="trend-item">
            <span className="trend-category">Technology · Trending</span>
            <h4>#WebDevelopment</h4>
            <span className="trend-count">5,245 posts</span>
        </div>
        <div className="trend-item">
            <span className="trend-category">Sports · Trending</span>
            <h4>FIFA World Cup 2022</h4>
            <span className="trend-count">2,252 posts</span>
        </div>
        {/* Add more trend items */}
    </div>
    )
}

export default Trending