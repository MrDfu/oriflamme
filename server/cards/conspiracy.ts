const { CARD_EFFECTS } = require("../config/game.constants");
import { CardDetail } from "../types/index";
import { Card } from "../types/index";

export const conspiracy: CardDetail = {
  id: "conspiracy",
  name: "Conspiracy",
  text: "Gain double the influence accumulated on Conspiracy when it is revealed. Discard Conspiracy.",
  getInfluenceGainOnReveal: (conspiracyCard: Card) => {
    // usually influence stored on card, but cater for exceptions here e.g. Conspiracy / Ambush
    return conspiracyCard.influence * 2;
  },
  getTargets: () => {
    // return an empty array if no targets or "self-target" e.g. such as Heir, Lord
    // this enables card highlighting in UI etc
    return {
      targets: [],
      targetsNothing: true,
    };
  },
  getAction: () => {
    // cards like Heir and Lord will need the queue to determine influence gain
    // return influenceChange prop if this occurs
    return {
      type: CARD_EFFECTS.NONE,
    };
  },
  getDiscardAfterResolution: () => true,
  getActionOnElimination: () => null,
};
