import { Card } from "../types/index";

type CardMocks = {
  [key: string]: Card;
};

export const cardMocks: CardMocks = {
  placeholder: {
    id: "placeholder",
    name: "Conspiracy",
    text: "Gain double the influence accumulated on Conspiracy when it is revealed. Discard Conspiracy.",
  },
  simple: {
    id: "conspiracy",
    name: "Conspiracy",
    text: "Gain double the influence accumulated on Conspiracy when it is revealed. Discard Conspiracy.",
  },
  hidden: {
    id: "assassination",
    name: "Assassination",
    text: "Eliminate any card in the Queue. Discard Assassination.",
    revealed: false,
  },
};
