import { useState } from 'react';
import './navbar.css'; // Make sure this CSS is present
import Logo from "../../../assets/logo.png"; // Adjust the path to your logo image

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="logo-container" onClick={toggleMenu}>
                <img src={Logo} alt="Logo" className="logo" />
            </div>
            <div className={`nav-links ${isOpen ? 'show' : ''}`}>
                <a href="/Home" className="nav-link">Home</a>
                <a href="/Settings" className="nav-link">Settings</a>
                <a href="/Profile" className="nav-link">Profile</a>
            </div>
        </div>
    );
};
