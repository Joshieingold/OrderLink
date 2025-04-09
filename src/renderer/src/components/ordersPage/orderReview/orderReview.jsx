import "./orderReview.css";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { Navbar } from "../../General/navbar/navbar";
export const OrderReview = () => {

    return (
        <div className="order-review-page">
            <Navbar/>
            <OrdersNavbar/>
            <h1 className='main-title-text'>Order Review</h1>
            <div className="review-button-container">
                <button className="review-button">Create Orders</button>                
            </div>
            <div className="card-container">
                <div className="bubble"></div>
            </div>
        </div>
    );
}