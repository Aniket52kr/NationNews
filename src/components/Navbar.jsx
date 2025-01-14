import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top" id='Nav'>
                <div className="container">
                    <Link className="navbar-brand px-3 text-light" to="/">
                        <span className="fs-3">NationNews</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto fs-6">
                            <Link to="/" className="nav-link text-light mx-0.8" aria-current="page">Home</Link>
                            <Link to="/business" className="nav-link text-light mx-0.8">Business</Link>
                            <Link to="/entertainment" className="nav-link text-light mx-0.8">Entertainment</Link>
                            <Link to="/health" className="nav-link text-light mx-0.8">Health</Link>
                            <Link to="/science" className="nav-link text-light mx-0.8">Science</Link>
                            <Link to="/sports" className="nav-link text-light mx-0.8">Sports</Link>
                            <Link to="/technology" className="nav-link text-light mx-0.8">Technology</Link>
                            <Link to="/about" className="nav-link text-light mx-0.8">About</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;