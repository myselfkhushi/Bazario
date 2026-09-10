import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyCart } from "../../features/cart/cartAPI";
import { setCart,setLoading,setError } from "../../features/cart/cartSlice";
import { updateCart,removeCartItem } from "../../features/cart/cartAPI";
import { Link } from "react-router-dom";


function Cart(){
    const dispatch=useDispatch();
    const {cart} =useSelector((state)=>state.cart);

    useEffect(()=>{
        const fetchCart=async()=>{
            try{
                dispatch(setLoading(true));
                const response=await getMyCart();
                dispatch(setCart(response.cart));
            }catch(error){
                dispatch(setError(error.response?.data?.message || "Something went wrong"));
            }finally{
                dispatch(setLoading(false));
            }
        }
    fetchCart();

    },[dispatch])

    const handleQuantity=async(createStaticHandler,quantity)=>{
        try{
            await updateCart(createStaticHandler,quantity);
            const response=await getMyCart();
            dispatch(setCart(response.cart));
        }catch(error){
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
        }
    }

    const handleRemove=async(cartId)=>{
        try{
            await removeCartItem(cartId);

            const response=await getMyCart();
            dispatch(setCart(response.cart));
        }catch(error){
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-10">
                Shopping Cart
            </h1>

            <p className="text-gray-500 mb-8">
                {cart.length} {cart.length === 1 ? "Item" : "Items"} in your cart
            </p>

           <div className="grid lg:grid-cols-3 gap-10">

    <div className="lg:col-span-2 space-y-8">

        {cart.length === 0 ? (

    <div className="lg:col-span-3 bg-white rounded-2xl shadow-md py-20 flex flex-col items-center">

        <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-44"
        />

        <h2 className="text-3xl font-bold mt-8">
            Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-3">
            Looks like you haven't added anything yet.
        </p>

        <Link to="/">
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
                Continue Shopping
            </button>
        </Link>

    </div>

) : (

    cart.map((item) => (

            <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center"
            >

                <div className="overflow-hidden rounded-2xl">

                    <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-40 h-40 object-cover rounded-2xl hover:scale-110 transition duration-500"
                    />

                </div>

                <div className="flex-1">

                    <h2 className="text-2xl font-bold line-clamp-1">
                        {item.product.title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {item.product.category}
                    </p>

                    <p className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        In Stock
                    </p>

                    <div className="mt-5">

                        <h3 className="text-3xl text-green-600 font-bold">
                            ₹{item.product.price}
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Total :
                            <span className="font-semibold text-black ml-2">
                                ₹{item.product.price * item.quantity}
                            </span>
                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-4 bg-gray-100 rounded-full px-3 py-2">

                    <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                            handleQuantity(item._id, item.quantity - 1)
                        }
                        className="w-10 h-10 rounded-full bg-white shadow hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        -
                    </button>

                    <span className="text-xl font-bold">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() =>
                            handleQuantity(item._id, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                        +
                    </button>

                </div>

                <button
                    onClick={() => handleRemove(item._id)}
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-xl transition"
                >
                    Remove
                </button>

            </div>

        )))}

    </div>

    <div className="bg-white rounded-2xl shadow-md p-8 h-fit sticky top-28 border border-gray-100">

        <h2 className="text-2xl font-bold mb-6">
            Order Summary
        </h2>

        <div className="space-y-4">

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">

                <h3 className="font-semibold text-blue-700">
                    Secure Checkout
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                    Your payment information is encrypted and processed securely.
                </p>

            </div>

            <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>
                    ₹
                    {cart.reduce(
                        (acc, item) =>
                            acc + item.product.price * item.quantity,
                        0
                    )}
                </span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">
                    Free
                </span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-600">GST</span>
                <span>₹0</span>
            </div>

            <hr />

            <div className="flex justify-between text-2xl font-bold">

                <span>Total</span>

                <span className="text-blue-600">
                    ₹
                    {cart.reduce(
                        (acc, item) =>
                            acc + item.product.price * item.quantity,
                        0
                    )}
                </span>

            </div>

       </div>

        <div className="flex justify-between mb-4">
            <span>Items</span>
            <span>{cart.length}</span>
        </div>

        <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span className="text-green-600">
                Free
            </span>
        </div>

        <hr className="my-5" />

        <div className="flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span>
                ₹
                {cart.reduce(
                    (acc, item) =>
                        acc + item.product.price * item.quantity,
                    0
                )}
            </span>

        </div>

        <Link to="/checkout">

            <button className="w-full mt-8 bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white py-4 rounded-xl font-semibold">

                Proceed To Checkout →

            </button>

        </Link>

    </div>

</div>
        </div>
    );


}
export default Cart;