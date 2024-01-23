import ApiService from '../../services/ApiService';

class Deposit extends React.Component {
  state = {
    mt5_deposit: 1,
    amount: 1000,
    from_mt5: "MTR1000",
    to_binary: "CR100001"
  };

  handleAmountChange = (event) => {
    const amount = parseInt(event.target.value, 10); // ensure parsed int
    this.setState({ amount });
  };

  handleDepositSubmit = async () => {
    const updatedProposeData = {
        mt5_deposit: 1,
        from_mt5: "MTR1000",
        to_binary: "CR100001",//This will be users details
        amount: this.state.amount,
    };
    await ApiService.postDeposit(updatedProposeData);
    this.setState({ proposalSubmitted: true });
  };

  render() {
    const { amount, proposalSubmitted, error } = this.state;

    if (proposalSubmitted) {
      return (
        <div>
          <h2>Proposal Sent!</h2>
        </div>
      );
    }

    if (error) {
      return (
        <div>
          <h2>Error!</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    return (
      <div>//Please enter deposit amount...
        <input
            min={0}
            type="number"
            value={amount}
            onChange={this.handleAmountChange}
        />
        <button onClick={this.handleDepositSubmit}>Submit Deposit</button>
      </div>
    );
  }
}

export default Deposit;
