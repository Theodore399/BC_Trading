import ApiService from '../../services/ApiService';

class Withdraw extends React.Component {
  state = {
    mt5_withdrawal: 1,
    amount: 1000,
    from_mt5: "MTR1000",
    to_binary: "CR100001"
  };

  handleAmountChange = (event) => {
    const amount = parseInt(event.target.value, 10); // ensure parsed int
    this.setState({ amount });
  };

  handleWithdrawSubmit = async () => {
    const updatedProposeData = {
        mt5_withdrawal: 1,
        from_mt5: "MTR1000",
        to_binary: "CR100001",//This will be users details
        amount: this.state.amount,
    };
    await ApiService.postWithdraw(updatedProposeData);
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
      <div>//Please enter your Withdraw amount ...
        <input
            min={0}
            type="number"
            value={amount}
            onChange={this.handleAmountChange}
        />
        <button onClick={this.handleWithdrawSubmit}>Submit Withdraw</button>
      </div>
    );
  }
}

export default Withdraw;
