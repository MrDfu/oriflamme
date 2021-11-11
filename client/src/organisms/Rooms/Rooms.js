import React, { useState, useEffect, useContext } from 'react';

import './Rooms.css';
import PlayerNameForm from '../PlayerNameForm/PlayerNameForm';
import RoomItem from '../../molecules/RoomItem/RoomItem';
import Loading from '../../atoms/Loading/Loading';
import NoRooms from '../../atoms/NoRooms/NoRooms';
import Button from '../../atoms/Button/Button';

import { SOCKET_EVENTS } from '../../config/socket.constants';
import StorageService from '../../services/storage.service';
import { UserContext } from '../../context/user.context';

const { LOBBY } = SOCKET_EVENTS;

const storageService = StorageService();

export default function Rooms(props) {

  const { activeRoomId, joinRoom, leaveRoom, socket } = props;

  // "METHODS"

  const togglePlayerNameForm = () => {
    setShowPlayerNameForm(!showPlayerNameForm);
  }

  const handleAddPlayerName = (playerName) => {
    storageService.set('user.name', playerName);
    setUser({
      ...user,
      name: playerName
    });
    togglePlayerNameForm();
  }

  const handleNewRoom = () => {
    if (!user.name) {
      togglePlayerNameForm();
    }
    else {
      // listen for acknowledgement of room create so we can set it as active
      socket.registerOneShotListener(
        LOBBY.CREATE_ROOM_SUCCESS,
        (roomId) => joinRoom(roomId, user)
      );
      // create the room
      socket.createRoom({
        ownerId: user.id,
        ownerName: user.name,
        roomName: `${user.name}'s game`,
      });
    }
  }

  const handleJoinRoom = (roomId) => {
    if (!user.name) {
      togglePlayerNameForm();
    } else {
      joinRoom(roomId, user);
    }
  }

  const handleRoomsChanged = (rooms) => {
    setRooms(rooms);
    if (loading) {
      setLoading(false);
    }
  }

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [showPlayerNameForm, setShowPlayerNameForm] = useState(false);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    socket.registerListener(LOBBY.ROOMS_CHANGED, handleRoomsChanged);
    socket.getRooms();
    // TODO: change to cleanup useEffect to unregister listener
    return function cleanup() {
      socket.unregisterListener(LOBBY.ROOMS_CHANGED);
    }
  }, [])

  return (
    <div className="rooms">
      {
        showPlayerNameForm ?
          <PlayerNameForm
            onSubmit={handleAddPlayerName}
            show={showPlayerNameForm}
            toggleModal={togglePlayerNameForm}
          /> :
          null
      }
      {
        loading ?
          <Loading message={"Loading rooms"} /> :
          null
      }
      {
        !loading && !rooms.length ?
          <div className="rooms__list">
            <NoRooms />
          </div> :
          null
      }
      {
        !loading && rooms.length ?
          <div className="rooms__list">
            {
              rooms.map((room, idx) => {
                return (
                  <RoomItem
                    isActiveRoom={room.roomId === activeRoomId}
                    joinRoom={handleJoinRoom}
                    key={`room-item-${idx}`}
                    room={room}
                  />
                )
              })
            }
          </div> :
          null
      }
      {
        !loading ?
          <div className="rooms__buttons">
            <Button
              disabled={!!activeRoomId}
              onClick={handleNewRoom}
              text="New Room">
            </Button>
          </div> :
          null
      }
    </div>
  );
}
