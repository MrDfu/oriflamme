import { render, screen } from "@testing-library/react";
import RoomItem from "./RoomItem";
import * as React from "react";
import userEvent from "@testing-library/user-event";

describe("RoomItem component", () => {
  const btnFunc = jest.fn();
  const prop = {
    activeRoomId: "a54966c0-495d-11ec-b4c4-25889b714c05",
    joinRoom: (roomId: string) => {},
    leaveRoom: btnFunc,
    playerIsOwner: true,
    room: {
      ownerId: "2",
      roomId: "2",
      ownerName: "test",
      roomName: "test name",
      players: [
        {
          name: "First",
          id: "2",
          socketId: "3",
        },
        {
          name: "Second",
          id: "3",
          socketId: "4",
        },
      ],
      started: false,
    },
    startGame: btnFunc,
  };
  test("Should show player info", () => {
    const { getByText } = render(
      <RoomItem
        activeRoomId={prop.activeRoomId}
        joinRoom={prop.joinRoom}
        leaveRoom={prop.leaveRoom}
        playerIsOwner={prop.playerIsOwner}
        room={prop.room}
        startGame={prop.startGame}
      />
    );

    expect(getByText("2 players (First, Second)")).toBeTruthy();
  });
  test("Should show the Leave button if activeRoomId===roomId", async () => {
    render(
      <RoomItem
        activeRoomId={"2"}
        joinRoom={prop.joinRoom}
        leaveRoom={prop.leaveRoom}
        playerIsOwner={prop.playerIsOwner}
        room={prop.room}
        startGame={prop.startGame}
      />
    );
    const testButton = screen.getByRole("button", { name: /leave/i });
    await userEvent.click(testButton);
    expect(btnFunc).toHaveBeenCalledTimes(1);
  });
  test("Should show the Start button if activeRoomId===roomId and playerIsOwner", async () => {
    render(
      <RoomItem
        activeRoomId={"2"}
        joinRoom={prop.joinRoom}
        leaveRoom={prop.leaveRoom}
        playerIsOwner={prop.playerIsOwner}
        room={prop.room}
        startGame={prop.startGame}
      />
    );
    const testButton = screen.getByRole("button", { name: /start/i });
    await userEvent.click(testButton);
    expect(btnFunc).toHaveBeenCalledTimes(2);
  });
  test("Should not show the Start button if activeRoomId===roomId and !playerIsOwner", async () => {
    render(
      <RoomItem
        activeRoomId={"2"}
        joinRoom={prop.joinRoom}
        leaveRoom={prop.leaveRoom}
        playerIsOwner={false}
        room={prop.room}
        startGame={prop.startGame}
      />
    );
    const testButton = screen.queryByRole("button", { name: /start/i });
    expect(testButton).toBeNull();
  });
  test("Should  show the Join button if !activeRoomId && !room.started", async () => {
    render(
      <RoomItem
        activeRoomId={""}
        joinRoom={prop.joinRoom}
        leaveRoom={prop.leaveRoom}
        playerIsOwner={false}
        room={prop.room}
        startGame={prop.startGame}
      />
    );
    const testButton = screen.queryByRole("button", { name: /join/i });
    expect(testButton).toBeTruthy();
  });
});
