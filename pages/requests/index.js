import React, { Component } from "react";
import { Button, Table, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import Campaign from "../../ethereum/campaign";
import RequestRow from "../../components/RequestRow";

class RequestIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
    }
  }

  // Create callback function and pass to RequestRow (child) as props
  // Child component will call this and pass data back to parent
  updateErrorMessage = (childData) => {
    this.setState({ errorMessage: childData });
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);

    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    // workaround as solidity doesnt have support for getting array of structs
    const requests = await Promise.all(
      // array.fill - returns array with 1 empty index
      // Array constructor expects number not a string, so need to parse
      Array(parseInt(requestCount))
        .fill()
        // say to count from array index up to request count
        .map((element, index) => {
          // returns instance of each request
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
          updateErrorMessage={this.updateErrorMessage}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
        <Message hidden={!this.state.errorMessage} error header="Error" content={this.state.errorMessage} style={{ overflowWrap: "break-word" }} />
      </Layout>
    );
  }
}

export default RequestIndex;
