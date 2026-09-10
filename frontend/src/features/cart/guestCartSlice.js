import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage on startup
const loadGuestCart = () => {
    try {
        const serialized = localStorage.getItem("bazario_guest_cart");
        return serialized ? JSON.parse(serialized) : [];
    } catch {
        return [];
    }
};

const saveGuestCart = (items) => {
    try {
        localStorage.setItem("bazario_guest_cart", JSON.stringify(items));
    } catch {}
};

const guestCartSlice = createSlice({
    name: "guestCart",
    initialState: {
        items: loadGuestCart(),
    },
    reducers: {
        addGuestItem: (state, action) => {
            const product = action.payload;
            const existing = state.items.find((i) => i.product._id === product._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ product, quantity: 1 });
            }
            saveGuestCart(state.items);
        },
        removeGuestItem: (state, action) => {
            state.items = state.items.filter((i) => i.product._id !== action.payload);
            saveGuestCart(state.items);
        },
        clearGuestCart: (state) => {
            state.items = [];
            localStorage.removeItem("bazario_guest_cart");
        },
        updateGuestQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((i) => i.product._id === productId);
            if (item) {
                item.quantity = quantity;
                saveGuestCart(state.items);
            }
        },
    },
});

export const { addGuestItem, removeGuestItem, clearGuestCart, updateGuestQuantity } =
    guestCartSlice.actions;

export default guestCartSlice.reducer;
