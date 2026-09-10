import { createSlice } from "@reduxjs/toolkit";

const loadGuestWishlist = () => {
    try {
        const serialized = localStorage.getItem("bazario_guest_wishlist");
        return serialized ? JSON.parse(serialized) : [];
    } catch {
        return [];
    }
};

const saveGuestWishlist = (items) => {
    try {
        localStorage.setItem("bazario_guest_wishlist", JSON.stringify(items));
    } catch {}
};

const guestWishlistSlice = createSlice({
    name: "guestWishlist",
    initialState: {
        items: loadGuestWishlist(),
    },
    reducers: {
        addGuestWishlistItem: (state, action) => {
            const product = action.payload;
            const exists = state.items.some((i) => (i.product?._id || i._id) === (product._id || product.product?._id));
            if (!exists) {
                state.items.push({ _id: `guest_${product._id}`, product });
                saveGuestWishlist(state.items);
            }
        },
        removeGuestWishlistItem: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((i) => (i.product?._id || i._id) !== productId);
            saveGuestWishlist(state.items);
        },
        clearGuestWishlist: (state) => {
            state.items = [];
            localStorage.removeItem("bazario_guest_wishlist");
        },
    },
});

export const { addGuestWishlistItem, removeGuestWishlistItem, clearGuestWishlist } =
    guestWishlistSlice.actions;

export default guestWishlistSlice.reducer;
