import { Outlet, Link } from "react-router-dom";
import {
  FaBox,
  FaPlus,
  FaShoppingBag,
  FaChartLine,
} from "react-icons/fa";

console.log("sellerLayout")

function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex">

        <aside className="w-64 min-h-screen bg-white shadow-md">

          <nav className="p-5 space-y-3">

            <Link to="/seller/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100"> <FaChartLine />Dashboard</Link>

            <Link to="/seller/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100"> <FaBox />My Products</Link>

            <Link to="/seller/add-product" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100"> <FaPlus/>Add Product</Link>

            <Link to="/seller/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100"><FaShoppingBag/>Orders</Link>
             
          </nav>

        </aside>

        <main className="flex-1 p-8"><Outlet/></main>

      </div>

    </div>
  );
}

export default SellerLayout;