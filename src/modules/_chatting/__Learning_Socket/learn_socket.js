// 6 pack programmer yt channel 
/********************* https://www.youtube.com/watch?v=_h7Pc1woq-I&t=911s
 * 
 * emit
 * on
 * broadcast -> ThisEvent(data)
 * 
 *  socket.broadcast.emit('ThisEvent', data); 
 *  // This will send the event to all clients except the sender 
 * 
 * to -> to trigger event for a particular room
 *  
 *  socket.to(socketId).emit('ThisEvent', data);
 *  // This will send the event to a specific client identified by socketId
 *  // to means room Id .. 
 * 
 * join -> to join people in a room .. 
 * 
 *  socket.join(roomId);
 *  // This will add the socket to a room identified by roomId
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * *********************  Time Stamp :: 25:10  */ 