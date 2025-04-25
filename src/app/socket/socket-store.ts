// import { Server } from "socket.io";
// // Import the print helper that's being used

// // map instance to store connected users
// const connectedUsers = new Map();
// //socket server instance
// let io: Server;
// // set socket server instance
// const setSocketServerInstance = (ioInstance: Server) => {
//     io = ioInstance;
// };
// // get socket server instance
// const getSocketServerInstance = () => {
//     return io;
// };
// // add new connected user
// const addNewConnectedUser = async ({
//     socketId,
//     userId,
//     role,
// }: {
//     socketId: string;
//     userId: any;
//     role: string;
// }) => {
//     connectedUsers.set(socketId, { userId, role });
//     print.yellow("user connected 💥" + socketId);

//     // Check if the user is already in connectedUsers map to update their lastSeen
//     const existingUser = [...connectedUsers.values()].find(user => user.userId === userId);

//     if (existingUser) {

//         try {
//         } catch (error) {
//             print.red(`Error updating last seen for user ${userId}: `, error);
//         }
//     } else {
//         // If user is new, add to connectedUsers map
//         connectedUsers.set(socketId, { userId, role });
//         print.yellow("User connected 💥" + socketId);
//     }
// };

// // remove connected user
// const removeConnectedUser = async (socketId: string) => {
//     if (connectedUsers.has(socketId)) {
//         const user = connectedUsers.get(socketId);
//         if (user) {
//             try {
         

//             } catch (error) {
//                 print.red(
//                     `Error updating last seen for user ${user.userId}: `,
//                     error
//                 );
//             }
//         }

//         connectedUsers.delete(socketId);
//         print.yellow("user disconnected 💥" + socketId);
//     }
// };

// // Function to get online users
// const getOnlineUsers = () => {
//     const onlineUsers: {
//         socketId: string;
//         userId: number;
//         role: string;
//         email: string;
//     }[] = [];

//     connectedUsers.forEach((value, key) => {
//         onlineUsers.push({
//             socketId: key,
//             userId: value.userId,
//             role: value.role,
//             email: value.email,
//         });
//     });

//     return onlineUsers;
// };

// // Function to get socket ID by user ID
// const getSocketIdByUserId = (userId: any) => {
//     for (const [socketId, user] of connectedUsers.entries()) {
//         if (user.userId === userId) {
//             return socketId;
//         }
//     }
//     return null;
// };

// // Function to get user ID by socket ID
// const getUserIdBySocketId = (socketId: string) => {
//     const user = connectedUsers.get(socketId);
//     return user ? user.userId : null;
// };

// // Function to emit when a new movie is added
// const emitMovieAdded = (movieData: any) => {
//     if (io) {
//         io.emit('movie-added', movieData);
//         print.green('Emitted movie-added event with data:', movieData);
//     } else {
//         print.red('Socket server instance not initialized');
//     }
// };

// // Function to emit when a movie rating is updated
// const emitRatingUpdated = (ratingData: any) => {
//     if (io) {
//         io.emit('rating-updated', ratingData);
//         print.green('Emitted rating-updated event with data:', ratingData);
//     } else {
//         print.red('Socket server instance not initialized');
//     }
// };

// // socket store
// const socketStore = {
//     addNewConnectedUser,
//     removeConnectedUser,
//     setSocketServerInstance,
//     getSocketServerInstance,
//     getOnlineUsers,
//     getSocketIdByUserId,
//     getUserIdBySocketId,
//     emitMovieAdded,
//     emitRatingUpdated,
// };

// export default socketStore;