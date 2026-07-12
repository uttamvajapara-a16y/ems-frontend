import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import createSocketConnection from "../utils/socket";
import {
    Search,
    Send,
    ArrowLeft,
    Loader2,
    MessageCircle,
    Building2,
} from "lucide-react";

const roleBadgeColor = {
    Admin: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
    HR: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Manager: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Employee: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

const ChatPage = () => {
    const currentUser = useSelector((store) => store.user);

    const [contactGroups, setContactGroups] = useState({});
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const messagesContainerRef = useRef(null);
    const socketRef = useRef(null);

    // fetch the directory once on mount
    const fetchContacts = async () => {
        setLoadingContacts(true);
        try {
            const res = await axiosInstance.get("/chat/contacts");
            setContactGroups(res.data.data);
        } catch (err) {
            console.error("Failed to load contacts:", err.message);
        } finally {
            setLoadingContacts(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchConversation = async (contactId) => {
        try {
            const res = await axiosInstance.get(`/chat/conversation/${contactId}`);
            setMessages(res.data.data);
        } catch (err) {
            console.error("Failed to load conversation:", err.message);
        }
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!selectedContact) return;

        setLoadingMessages(true);
        fetchConversation(selectedContact._id).finally(() => setLoadingMessages(false));

        socketRef.current = createSocketConnection();
        socketRef.current.emit("joinChat", {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            senderId: currentUser._id,
            receiverId: selectedContact._id,
            senderModel: currentUser.role,
            receiverModel: selectedContact.role
        });

        socketRef.current.on("messageReceived", ({
            senderId,
            receiverId,
            senderModel,
            receiverModel,
            text,
        }) => {
            setMessages((messages) => [...messages, {
                senderId,
                receiverId,
                senderModel,
                receiverModel,
                text
            }])
        })

        return () => {
            socketRef.current?.disconnect();
        };

    }, [selectedContact]);

    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedContact) return;

        setSending(true);
        try {
            socketRef.current.emit("sendMessage", {
                senderId: currentUser._id,
                receiverId: selectedContact._id,
                senderModel: currentUser.role,
                receiverModel: selectedContact.role,
                text: text.trim()
            })
            setText("");
        } catch (err) {
            console.error("Failed to send message:", err.message);
        } finally {
            setSending(false);
        }
    };


    // filter contacts across all department groups based on search input
    const filteredGroups = Object.entries(contactGroups).reduce((acc, [dept, people]) => {
        const filtered = people.filter((p) =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) acc[dept] = filtered;
        return acc;
    }, {});


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-[calc(100vh-10rem)] flex overflow-hidden">
                {/* LEFT PANE - directory */}
                <div className={`w-full sm:w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col ${selectedContact ? "hidden sm:flex" : "flex"}`}>
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Team Chat</h2>
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search people..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loadingContacts ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="animate-spin text-indigo-500" size={22} />
                            </div>
                        ) : Object.keys(filteredGroups).length === 0 ? (
                            <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-10">No contacts found</p>
                        ) : (
                            Object.entries(filteredGroups).map(([deptName, people]) => (
                                <div key={deptName}>
                                    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                                        <Building2 size={12} className="text-slate-400" />
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            {deptName}
                                        </span>
                                    </div>
                                    {people.map((person) => (
                                        <button
                                            key={person._id}
                                            onClick={() => setSelectedContact(person)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${selectedContact?._id === person._id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                                                }`}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                                {person.firstName?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                                    {person.firstName} {person.lastName}
                                                </p>
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleBadgeColor[person.role]}`}>
                                                    {person.role}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANE - conversation */}
                {/* <div className={`flex-1 flex-col ${selectedContact ? "flex" : "hidden sm:flex"}`}> */}
                <div className={`flex-1 min-h-0 flex flex-col ${selectedContact ? "flex" : "hidden sm:flex"}`}>
                    {!selectedContact ? (
                        <div className="flex-1 flex items-center justify-center flex-col text-slate-400 dark:text-slate-600">
                            <MessageCircle size={40} />
                            <p className="text-sm mt-2">Select someone to start chatting</p>
                        </div>
                    ) : (
                        <>
                            {/* conversation header */}
                            {/* <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800"> */}
                            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                                <button onClick={() => setSelectedContact(null)} className="sm:hidden text-slate-500 dark:text-slate-400">
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                                    {selectedContact.firstName?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {selectedContact.firstName} {selectedContact.lastName}
                                    </p>
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleBadgeColor[selectedContact.role]}`}>
                                        {selectedContact.role}
                                    </span>
                                </div>
                            </div>

                            {/* messages */}
                            {/* <div className="flex-1 overflow-y-auto p-4 space-y-3"> */}
                            <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="animate-spin text-indigo-500" size={22} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10">
                                        No messages yet — say hello!
                                    </p>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = msg.senderId === currentUser._id;
                                        return (
                                            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`max-w-xs sm:max-w-sm px-4 py-2 rounded-2xl text-sm ${isMine
                                                        ? "bg-indigo-600 text-white rounded-br-sm"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                                                        }`}
                                                >
                                                    {msg.text}
                                                    <p className={`text-[10px] mt-1 ${isMine ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* message input */}
                            {/* <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-slate-100 dark:border-slate-800"> */}
                            <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !text.trim()}
                                    className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatPage
