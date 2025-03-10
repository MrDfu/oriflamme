import React, { useState, useEffect, useContext } from "react";

import { GameState, Card } from "../../types/index";
import { gameStateMocks } from "../../mocks/gameState.mocks";
import "./Game.css";
import OpponentArea from "../../molecules/OpponentArea/OpponentArea";
import Queue from "../../organisms/Queue/Queue";
import PlayerArea from "../../molecules/PlayerArea/PlayerArea";
import Round from "../../atoms/Round/Round";
import Loading from "../../atoms/Loading/Loading";
import SideBar from "./SideBar";

import { SOCKET_EVENTS } from "../../config/socket.constants";
import { SocketContext } from "../../context/socket.context";
import { UserContext } from "../../context/user.context";
import { CardsProvider } from "../../context/cards.context";

// TODO: remove cards to server?
import { CARDS as cards } from "../../config/cards.constants";

const { LOBBY, GAME } = SOCKET_EVENTS;

export default function Game() {
  //  const { activeRoomId, leaveRoom } = props;

  // "METHODS"

  const handleGameStateChanged = (newGameState: GameState) => {
    console.log("EVENT RECEIVED: ", GAME.GAMESTATE_CHANGED);

    setGameState(newGameState);
    if (loading) {
      setLoading(false);
    }
  };

  const handlePlayerCardClicked = (card: Card) => {
    // set to null to deselect if same card clicked
    let val: Card | null = card;
    val = selectedPlayerCard && selectedPlayerCard.id === card.id ? null : val;

    if (val) setSelectedPlayerCard(val);
  };

  // STATE, CONTEXT etc

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState(gameStateMocks.placeholder);
  // TODO: review this, implement messages
  const [messages, setMessages] = useState([]);
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<Card | null>(
    null
  );

  const socket = useContext(SocketContext);
  const [user] = useContext(UserContext);

  useEffect(() => {
    // socket.registerListener(GAME.ROUND_START, handleRoundStart);
    // TODO: change to cleanup useEffect to unregister listener
    socket.registerListener(GAME.GAMESTATE_CHANGED, handleGameStateChanged);
    socket.registerOneShotListener(LOBBY.GAME_STARTED, () => {
      socket.getGameState();
    });

    return function teardownListeners() {
      // TODO: all the others
      socket.unregisterListeners(GAME.GAMESTATE_CHANGED);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="game">
      {loading ? <Loading message={"Starting game..."} /> : null}
      {!loading && gameState ? (
        <CardsProvider
          value={{ cards, selectedPlayerCard, handlePlayerCardClicked }}
        >
          <div className="game__table">
            <div className="game__top-bar">
              <Round round={gameState.round} />
              <OpponentArea
                activePlayerId={gameState.activePlayerId}
                players={gameState.players}
                turnOrder={gameState.turnOrder}
              />
            </div>
            <div className="game__queue">
              <Queue
                gameState={gameState}
                selectedPlayerCard={selectedPlayerCard}
                setSelectedPlayerCard={setSelectedPlayerCard}
              />
            </div>
            <div className="game__bottom-bar">
              <PlayerArea
                activePlayerId={gameState.activePlayerId}
                phase={gameState.phase}
                players={gameState.players}
              />
            </div>
          </div>
          <SideBar
            gameState={gameState}
            messages={messages}
            selectedPlayerCard={selectedPlayerCard}
            user={user}
          />
        </CardsProvider>
      ) : null}
    </div>
  );
}
