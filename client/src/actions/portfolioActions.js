export const TRADE = "TRADE";

export const makeTrade = (ticker, quantity, cost) => {
  [quantity, cost] = [+quantity, +cost];
  return {
    type: TRADE,
    data: { ticker, quantity, cost }
  };
};
