import { Component, useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import LogoLoader from "./component/common/LogoLoader.jsx";
import { useDispatch } from "react-redux";
import { getProfile } from "./features/auth/authAPI.js";
import { setUser } from "./features/auth/authSlice.js";
import { getMyWishlist } from "./features/wishlist/wishlistAPI";
import { setWishlist } from "./features/wishlist/wishlistSlice";
import { getMyCart } from "./features/cart/cartAPI";
import { setCart } from "./features/cart/cartSlice";
import { Toaster } from "react-hot-toast";

// 🛡️ Enterprise Global React Error Boundary (Zero Blank White Screen Guarantee)
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Render fallback UI on next pass
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Telemetry & console logging for debugging
    console.error("GlobalErrorBoundary intercepted unhandled runtime exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* System Guard Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              Bazario System Guard
            </div>

            {/* Error Graphic Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
              We encountered an unexpected technical issue. Don't worry, your cart items, addresses, and orders remain completely safe.
            </p>

            {/* Technical Details Accordion (for debugging/development) */}
            {this.state.error && (
              <details className="text-left mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 cursor-pointer">
                <summary className="font-bold text-slate-700 hover:text-purple-600">
                  Technical Details (Click to inspect)
                </summary>
                <div className="mt-2 font-mono text-[11px] text-rose-600 overflow-x-auto p-2.5 bg-white rounded-xl border border-slate-200 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              </details>
            )}

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest shadow-md shadow-purple-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest border border-slate-200 hover:border-slate-300 shadow-sm transition-all cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getProfile();
        dispatch(setUser(response.user));

        // Wishlist & Cart are secondary and non-blocking
        try {
          const wishlistResponse = await getMyWishlist();
          dispatch(setWishlist(wishlistResponse?.wishlist || []));
        } catch {
          // Non-critical
        }

        try {
          const cartResponse = await getMyCart();
          dispatch(setCart(cartResponse?.cart || []));
        } catch {
          // Non-critical
        }
      } catch (error) {
        // Only clear token if profile authentication failed with 401
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setIsAppLoading(false);
      }
    };
    loadUser();
  }, [dispatch]);

  if (isAppLoading) {
    return <LogoLoader />;
  }

  return (
    <GlobalErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: "#ffffff",
            color: "#0F0A1E",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "var(--font-heading)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(108, 62, 244, 0.12)",
            border: "1px solid rgba(108, 62, 244, 0.15)",
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#6C3EF4",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <AppRoutes />
    </GlobalErrorBoundary>
  );
}

export default App;
