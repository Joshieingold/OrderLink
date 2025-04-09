import "./orderHistory.css";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { Navbar } from "../../General/navbar/navbar";
export const OrderHistory = () => {

    return (
        
        <div className="order-history-page">
            <Navbar/>
            <OrdersNavbar/>
            <h1 className='main-title-text'>Order History</h1>
        </div>
    );
}