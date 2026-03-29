import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
export default function NotFound() {
    return (
        <div className="page-not-found">
            <Helmet>
                <title>404 — Page Not Found | Bragazzi's</title>
                <meta name="robots" content="noindex" />
            </Helmet>
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
