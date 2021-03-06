import React from "react";
import { Divider, Segment, Header, Dropdown, Grid } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import capitalize from "../../lib/capitalize";
import PortfolioContainer from "./PortfolioContainer";
import TransactionsContainer from "./TransactionsContainer";
import TradeContainer from "./TradeContainer";

export const resources = {
  portfolio: <PortfolioContainer />,
  transactions: <TransactionsContainer />,
  trade: <TradeContainer />
};

export const resourceNames = Object.keys(resources);

const options = resourceNames.map(resource => ({
  text: capitalize(resource),
  value: resource
}));

// displays the type of resource displaying below the big date slider
export const ResourceContainer = withRouter(({ type, history }) => (
  <Segment>
    <Grid>
      <Grid.Column width={8}>
        <Header as="h2">{capitalize(type)}</Header>
      </Grid.Column>
      <Grid.Column width={8} textAlign={"right"}>
        <Dropdown
          value={type}
          onChange={(e, { value }) => history.push(`/${value}`)}
          options={options}
        />
      </Grid.Column>
    </Grid>
    <Divider />
    {resources[type]}
  </Segment>
));
