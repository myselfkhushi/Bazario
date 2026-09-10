import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";


const initialState={
    loading:false,
    dashboard:{},
    recentOrders: [],
    orders:[],
    error:null,
}

export const getSellerDashboard = createAsyncThunk(
    "seller/getDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/seller/dashboard");

            return data.dashboard;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);


export const getRecentOrders = createAsyncThunk(
    "seller/recentOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/seller/recent-orders"
            );

            return data.orders;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);

export const getSellerOrders = createAsyncThunk(
    "seller/getSellerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/seller/orders"
            );

            return data.orders;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);

const sellerSlice = createSlice({

    name: "seller",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(
            getSellerDashboard.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        ).addCase(
            getSellerDashboard.fulfilled,
            (state, action) => {
                state.loading = false;

                state.dashboard = action.payload;

                // dashboard API already returns recentOrders
                state.recentOrders =
                    action.payload.recentOrders || [];
            }
        )

        .addCase(
            getSellerDashboard.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        ) .addCase(
            getRecentOrders.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        )

        .addCase(
            getRecentOrders.fulfilled,
            (state, action) => {
                state.loading = false;
                state.recentOrders = action.payload;
            }
        )

        .addCase(
            getRecentOrders.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        ).addCase(
            getSellerOrders.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        )

        .addCase(
            getSellerOrders.fulfilled,
            (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            }
        )

        .addCase(
            getSellerOrders.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        );

    },
});

export default sellerSlice.reducer;