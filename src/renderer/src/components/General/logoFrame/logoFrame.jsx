import logo from "../../../assets/logo.png"
import "./logoFrame.css";
const LogoFrame = () => {
    return (
        <div className="logo-main">
            <div className="logo-img-container">
                <img className="ctr-man"src={logo}></img>
            </div>
            <h1 className="logo-text">OrderLink</h1>
        </div>
    );
};

export default LogoFrame;