import PlayerHand from "./PlayerHand";
import { Props } from "./PlayerHand";
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";

let props: Props;
beforeEach(() => {
  props = {
    cardColor: "red",
    hand: ["assassination", "conspiracy"],
    isActive: false,
  };
});

test("PlayerHand instantiates PlayerCard elements", () => {
  const { getAllByTestId } = render(<PlayerHand {...props} />);
  expect(getAllByTestId("player-card__card")).not.toHaveLength(0);
});

test("PlayerHand instantiates none if hand empty", () => {
  const { queryByTestId } = render(<PlayerHand {...{ ...props, hand: [] }} />);
  expect(queryByTestId("player-card__card")).toBeNull();
});
