import {Link} from "react-router-dom";
import { FaBoxOpen,FaShoppingBag,FaRupeeSign,FaUsers} from "react-icons/fa";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDashboard } from "../../features/seller/sellerSlice";


function SellerDashboared(){

    const dispatch=useDispatch();

    const {dashboard,loading,error} =useSelector((state)=>state.seller);


    useEffect(()=>{
        dispatch(getSellerDashboard());
    },[dispatch]);


   
    const cards=[
       {
            title:"Total Products",
            value:dashboard.totalProducts || 0,
            icon:<FaBoxOpen size={28} />,
            color:"bg-blue-500",
        },
        {
            title:"Total Orders",
            value:dashboard.totalOrders || 0,
            icon:<FaShoppingBag size={28}/>,
            color:"bg-green-500",
        },
        {
            title:"Totall Revenue",
            value:`₹${dashboard.totalRevenue || 0}`,
            icon:<FaUsers size={28}/>,
            color:"bg-purple-500",
        },
        {
           title:"Low Stock",
           value:dashboard.lowStockProducts || 0,
           color:"bg-red-500",
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Seller Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card,index)=>(
                    <div key={index} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">{card.title}</p>
                            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                        </div>

                        <div className={`${card.color} text-white p-4 rounded-full`}>
                            {card.icon}
                        </div>

                    </div>
                ))}

            </div>
            

            <div className="bg-white rounded-xl shadow-md mt-8 p-6">
                   <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left p-3">Customer</th>
                                    <th className="text-left p-3">Product</th>
                                    <th className="text-left p-3">Quantity</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-left p-3">Amount</th> 
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard.recentOrders?.map((order)=>(
                                    <tr key={order._id} className="border-b">
                                        <td className="p-3">{order.user?.name}</td>
                                        <td className="p-3">{order.orderitem[0]?.product?.title}</td>
                                        <td className="p-3">{order.orderitem[0]?.quantity}</td>
                                        <td>
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                                {order.orderstatus}
                                            </span>
                                        </td>
                                        <td className="p-3 font-semibold">₹{order.totalamount}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
           </div>
       </div>
    );
    
}

export default SellerDashboared;