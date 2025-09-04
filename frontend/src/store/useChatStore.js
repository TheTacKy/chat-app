import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	selectUser: (user) => set({ selectedUser: user }),

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			console.log("Fetching users...");
			const res = await axiosInstance.get("/messages/users");
			console.log("Users response:", res.data);
			set({ users: res.data });
		} catch (error) {
			console.error("Error fetching users:", error);
			toast.error(error?.response?.data?.message || "Failed to load users");
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to load messages");
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		const {selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
			set({messages:[...messages, res.data]});
		} catch (error) {
			toast.error(error.response.data.message);
			throw error; // Re-throw to be caught by the calling component
		} 
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),

	subscribeToMessage: () => {
		const {selectedUser} = get();
		if(!selectedUser) return;

		const {socket} = useAuthStore.getState().socket;
		socket.on("newMessage", (message) => {
			set({
				messages:[...get().messages, message],
			});
		});

	},
	unsubscribeToMessage: () => {
		const {socket} = useAuthStore.getState().socket;
		socket.off("newMessage");
	}  
}));