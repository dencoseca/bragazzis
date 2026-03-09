import React from "react"
import { Link } from "gatsby"

function pageNotFound() {
  return (
    <div className="page-not-found">
      <Link className="logo" to="/" aria-label="home">
        BRAGAZZI'S
      </Link>
      <h1 className="text--initial">Ooops...</h1>
      <p className="text--md">Looks like that page doesn't exist!</p>
      <Link to="/" aria-label="home">
        <svg
          className="back-button"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.00025 26.0178C1.0101 39.8249 12.211 51.0098 26.0181 51C39.8252 50.9901 51.0101 39.7893 51.0002 25.9822C50.9904 12.1751 39.7895 0.990156 25.9824 0.999998C12.1753 1.00984 0.990412 12.2107 1.00025 26.0178ZM12.4135 24.5955L18.9945 18.005L20.4098 19.4182L14.828 25.008L41.9995 24.9886L42.001 26.9886L14.8294 27.008L20.4192 32.5898L19.006 34.005L12.4155 27.4239L12.001 27.01L11.0003 26.0107L11.9995 25.01L12.4135 24.5955Z"
            fill="#1d1d1d"
          />
        </svg>
      </Link>
    </div>
  )
}

export default pageNotFound
