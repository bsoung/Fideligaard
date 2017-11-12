import React from "react";
import { Grid, Form, Dropdown, Message } from "semantic-ui-react";
import Showable from "../elements/Showable";

const buildDrop = ({ options, value, onChange }) => (
  <Dropdown selection options={options} value={value} onChange={onChange} />
);

const Trade = ({ prices, trade, actions, valid }) => {
  const symbolOptions = {
    options: trade.symbols.map(symbol => ({ text: symbol, value: symbol })),
    value: trade.symbol,
    onChange: actions.onChangeSymbol
  };

  const actionOptions = {
    options: ["Buy", "Sell"].map(option => ({ text: option, value: option })),
    value: trade.action,
    onChange: actions.onChangeAction
  };

  return (
    <Form onSubmit={actions.onPlaceOrder}>
      <Form.Group>
        <Form.Field width={6}>
          <label>Action</label>
          {buildDrop(actionOptions)}
        </Form.Field>
        <Form.Field width={6}>
          <label>Symbol</label>
          {buildDrop(symbolOptions)}
        </Form.Field>
        <Form.Input
          type="number"
          value={trade.quantity}
          onChange={actions.onChangeQuantity}
          label="Quantity"
          width={4}
        />
      </Form.Group>
      <Grid verticalAlign="middle">
        <Grid.Column width={6}>
          <Form.Field>
            <label>Available Balance: ${prices.balance}</label>
            <label>Balance After trade: ${prices.balanceAfter}</label>
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={4}>
          <Form.Field>
            <label>Price: ${prices.price}</label>
            <label>Total: ${prices.total}</label>
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={6} textAlign="right">
          <Showable condition={valid.length}>
            <Message negative>
              <Message.Header>Invalid Order</Message.Header>
              <p>{valid}</p>
            </Message>
          </Showable>
          <Showable condition={!valid.length}>
            <Form.Button color="green">{trade.action}</Form.Button>
          </Showable>
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default Trade;
