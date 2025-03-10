import React, { useState, useContext, SetStateAction, Dispatch } from "react";
import "./Queue.css";
import QueueCard from "../QueueCard/QueueCard";
import EmptyQueue from "../../atoms/EmptyQueue/EmptyQueue";
import { SocketContext } from "../../context/socket.context";
import { UserContext } from "../../context/user.context";
import { PHASES } from "../../config/game.constants";
import { GameState, Card } from "../../types";

export type Props = {
  gameState: GameState;
  selectedPlayerCard: Card | null;
  setSelectedPlayerCard: Dispatch<SetStateAction<Card | null>>;
};

export default function Queue({
  gameState,
  selectedPlayerCard,
  setSelectedPlayerCard,
}: Props) {
  const {
    abilityInterrupted,
    activePlayerId,
    phase,
    players,
    queue,
    queueResolutionIndex: qri,
    resolvingCardToBeDiscarded,
    targets,
    targetsNoneValid,
    targetsSelf,
  } = gameState;

  const filteredQueue = queue
    .map((stack) => stack.filter((card) => card.id !== "placeholder"))
    .filter((stack) => stack.length);
  const [playerColor, setPlayerColor] = useState<string>("");
  const socket = useContext(SocketContext);
  const [user] = useContext(UserContext);
  const isPlayerTurn = activePlayerId === user.id;

  const handleCardPlayed = (position: number) => {
    setSelectedPlayerCard((_: Card | null) => null);
    let color = playerColor;

    if (!playerColor) {
      const player = players[user.id];
      color = player.color;
      setPlayerColor(player.color);
    }
    const card = {
      ...selectedPlayerCard,
      influence: 0,
      ownerColor: color,
      ownerId: user.id,
      revealed: false,
    };
    socket.playCard(card, position);
  };

  return (
    <div className="queue">
      <div className="queue__endzone queue__endzone--left">
        {selectedPlayerCard ? (
          <span
            className="queue__arrow icon-arrow-left"
            onClick={() => handleCardPlayed(0)}
          />
        ) : null}
      </div>
      <div className="queue__centrezone">
        {filteredQueue.length ? (
          <div className="queue__cards">
            {filteredQueue.map((stack, idx) => {
              const topCard = stack[stack.length - 1];
              const isResolving = phase === PHASES.RESOLUTION && qri === idx;
              const isTarget = targets && targets.includes(idx);
              return (
                <QueueCard
                  abilityInterrupted={abilityInterrupted}
                  card={topCard}
                  indexInQueue={idx}
                  isPlayerTurn={isPlayerTurn}
                  isResolving={isResolving}
                  isTarget={isTarget}
                  qri={qri}
                  resolvingCardToBeDiscarded={resolvingCardToBeDiscarded}
                  targetsNoneValid={targetsNoneValid}
                  targetsSelf={targetsSelf}
                  key={`queue-card-${idx}`}
                />
              );
            })}
          </div>
        ) : (
          <EmptyQueue />
        )}
      </div>
      <div className="queue__endzone queue__endzone--right">
        {selectedPlayerCard ? (
          <span
            className="queue__arrow icon-arrow-right"
            onClick={() => handleCardPlayed(queue.length)}
          />
        ) : null}
      </div>
    </div>
  );
}
