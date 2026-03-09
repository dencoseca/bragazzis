import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="page-not-found">
            <Link to="/" className="logo">
                Bragazzi's
            </Link>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to="/" className="back-button">
                ← Back to Home
            </Link>
        </div>
    );
}
