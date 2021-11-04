const { config } = require('dotenv');
const { v1: uuidv1 } = require('uuid');

module.exports = function RoomsManager () {
  const _rooms = {};

  const _getNumberOfRooms = () => Object.keys(_rooms).length;

  const getRooms = () => {
    return Object.values(_rooms).map(room => {
      const { id, ownerId, ownerName, roomName, players } = room;
      return {
        id,
        ownerId,
        ownerName,
        roomName,
        players
      }
    });
  };

  const createRoom = (roomData) => {
    console.log('LobbyManager.createRoom()')
    const roomId = uuidv1();
    // roomData: { ownerId, ownerName, roomName }
    _rooms[roomId] = {
      ...roomData,
      id: roomId,
      players: [],
    };
    console.log('rooms now running: ', _getNumberOfRooms());
    return roomId;
  };

  const joinRoom = (roomId, socket, player) => {
    // TODO: limit adding if > 5 players
    console.log('LobbyManager.joinRoom()');
    const room = _rooms[roomId];
    socket.join(roomId);
    room.players.push({
      ...player,
      socketId: socket.id
    });
    console.log(`number of players now in room: ${room.players.length}`);
  };

  const leaveRoom = (roomId) => {

  };

  const leaveAllRooms = (socket) => {
    console.log(`LobbyManager.leaveAllRooms() for socket.id: ${socket.id}`);
    for (let roomId of socket.rooms) {
      if (roomId !== socket.id) {
        console.log(`leaving room ${roomId} ...`);
        socket.leave(roomId);
        const room = _rooms[roomId];
        if (room.players.length === 1) {
          delete _rooms[roomId];
        } else {
          console.log(`before removal, number of players in room: ${room.players.length}`);
          const playerIdx = room.players.findIndex(player => player.socketId === socket.id);
          console.log(`player found in room at index: ${playerIdx}`);
          room.players = room.players.filter((_, idx) => idx !== playerIdx);
          console.log(`player removed, number of players in room: ${room.players.length}`);
        }
      }
    }
  }

  return {
    getRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    leaveAllRooms
  }
};