// import { io } from "socket.io-client" ;

// const createSocketConnection = () => {
//     const SOCKET_URL = import.meta.env.BASE_URL.replace("/api", "") ;

//     const socket = io(SOCKET_URL, {
//         transports: ["websocket", "polling"], // 🔥 TRY WEBSOCKET FIRST
//         withCredentials: true,
//         reconnection: true,
//         reconnectionAttempts: 10,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//     })
//     return socket ;
// }

// export default createSocketConnection ;


import { io } from "socket.io-client";

const createSocketConnection = () => {
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:6050";

    const socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });
    return socket;
};

export default createSocketConnection;