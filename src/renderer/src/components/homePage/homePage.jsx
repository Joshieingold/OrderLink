import { Navbar } from "../General/navbar/navbar";

export const HomePage = () => {
    console.log("HomePage component rendered");
    return (
        <div className="home-page">
            <Navbar />
            <h1 className="home-title">Welcome to the Home Page</h1>
            <p className="home-subtitle">This is where you can manage your tasks and projects.</p>
            {/* Add more content here as needed */}
        </div>
    )
}