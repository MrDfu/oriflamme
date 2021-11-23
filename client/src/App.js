import React, { useState, useEffect } from "react";

import "./App.css";
import Game from "./views/Game/Game";
import Rooms from "./organisms/Rooms/Rooms";
import Nav from "./molecules/Nav/Nav";
import Loading from "./atoms/Loading/Loading";
import Splash from "./atoms/Splash/Splash";

import Socket from "./services/socket.service";
import StorageService from "./services/storage.service";
import { SocketProvider } from "./context/socket.context";
import { UserProvider } from "./context/user.context";
import { SOCKET_EVENTS } from "./config/socket.constants";
const { LOBBY } = SOCKET_EVENTS;

const storageService = StorageService();
export let socket;

function App() {
  // "METHODS"

  const joinRoom = (roomId, player) => {
    socket.registerOneShotListener(LOBBY.GAME_STARTING, handleGameStarting);
    socket.joinRoom(roomId, player);
    setActiveRoomId(roomId);
  };

  const leaveRoom = (roomId, player) => {
    socket.leaveRoom(roomId, player);
    setActiveRoomId(null);
  };

  const startGame = (roomId) => {
    socket.startGame(roomId);
  };

  const handleGameStarting = () => {
    setGameStarted(true);
  };

  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ id: null, name: null });
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    Socket()
      .then((wrappedSocket) => {
        socket = wrappedSocket;
        const userId = storageService.get("user.id");
        const userName = storageService.get("user.name");
        const socketId = socket.getSocketId();

        if (!userId) {
          storageService.set("user.id", socketId);
        }
        setUser({
          id: userId || socketId,
          name: userName,
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(socket);
  return (
    <div className="app" id="app">
      {showSplash ? (
        <Splash show={showSplash} dismiss={() => setShowSplash(false)} />
      ) : null}
      <SocketProvider value={socket}>
        <UserProvider value={[user, setUser]}>
          <Nav />
          {loading ? <Loading message={"Connecting"} /> : null}
          {!loading && !gameStarted ? (
            <Rooms
              activeRoomId={activeRoomId}
              joinRoom={joinRoom}
              leaveRoom={leaveRoom}
              setActiveRoomId={setActiveRoomId}
              startGame={startGame}
            />
          ) : null}
          {!loading && gameStarted ? (
            <Game activeRoomId={activeRoomId} leaveRoom={leaveRoom} />
          ) : null}
        </UserProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
