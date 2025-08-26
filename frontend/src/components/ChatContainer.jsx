import React from 'react';

import {useChatStore} from "../store/useChatStore";
import {useEffect} from 'react';

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput"

const ChatContainer = () => {
    const {getMessages, isMessagesLoading, selectedUser} = useChatStore();

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser?._id, getMessages]);

    if(isMessagesLoading) return <div>Loading...</div>

    return (
        <div> 
            <ChatHeader />
            <p>messages...</p>
            <MessageInput/>
        </div>
    )
}

export default ChatContainer;