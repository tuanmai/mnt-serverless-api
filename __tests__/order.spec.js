import { map } from "lodash/fp";
import AWS from "aws-sdk-mock";

import { addToCard } from "../order";
import Order from "../db/order";
let orders = [];

describe("Add to card", () => {
  describe("There is no pending order", () => {
    it("creates new order", () => {});
  });
});
