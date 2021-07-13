import { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Web3 from "web3";
import usdAbi from "./abis/Usd.json";
import potatoAbi from "./abis/Potato.json";
import simpleChefAbi from "./abis/SimpleChef.json";
import addresses from "./utils/addresses.json";
import Vault from "./components/vault";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      usdToken: {},
      potatoToken: {},
      simpleChef: {},
      usdTokenBalance: "0",
      potatoTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
      usdAllowanceApproved: false,
      showUsdMintButton: false,
      web3: null,
    };
  }
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.checkAllowance();
    await this.checkUsdBalance();
  }
  async loadWeb3() {
    if (window.ethereum) {
      this.state.web3 = new Web3(window.ethereum);
      window.web3 = this.state.web3;
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    if (networkId !== 3)
      window.alert("Please switch to the Roposten Network from Metamask");

    // Load usdToken
    const usdToken = new web3.eth.Contract(usdAbi.abi, addresses.usd);
    this.setState({ usdToken });
    let usdTokenBalance = await usdToken.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ usdTokenBalance: usdTokenBalance.toString() });

    // // Load potatoToken
    const potatoToken = new web3.eth.Contract(potatoAbi.abi, addresses.potato);
    this.setState({ potatoToken });
    let potatoTokenBalance = await potatoToken.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ potatoTokenBalance: potatoTokenBalance.toString() });

    // Load simpleChef
    const simpleChef = new web3.eth.Contract(
      simpleChefAbi.abi,
      addresses.simpleChef
    );
    this.setState({ simpleChef });
    let stakingBalance = await simpleChef.methods
      .stakingBalance(this.state.account)
      .call();
    this.setState({ stakingBalance: stakingBalance.toString() });

    this.setState({ loading: false });
  }

  async checkAllowance() {
    let usdTokenAllowance = await this.state.usdToken.methods
      .allowance(this.state.account, addresses.simpleChef)
      .call();
    console.log("usdTokenAllowance");
    console.log(usdTokenAllowance);
    if (usdTokenAllowance >= this.state.usdTokenBalance)
      this.setState({ usdAllowanceApproved: true });
  }
  checkUsdBalance() {
    if (this.state.stakingBalance > 0)
      return this.setState({ showUsdMintButton: false });
    if (this.state.usdTokenBalance > 0)
      return this.setState({ showUsdMintButton: false });
    return this.setState({ showUsdMintButton: true });
  }
  approveUsdTokensAllowance = async () => {
    await this.state.usdToken.methods
      .approve(this.state.simpleChef._address, this.state.usdTokenBalance)
      .send({ from: this.state.account })
      .on("transactionHash", () => {
        this.setState({ usdAllowanceApproved: true });
      });
  };
  stakeTokens = async (amount) => {
    if (!this.state.usdAllowanceApproved)
      await this.approveUsdTokensAllowance();
    this.state.simpleChef.methods
      .deposit(amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {});
  };

  unstakeTokens = async (amount) => {
    if (!this.state.usdAllowanceApproved)
      await this.approveUsdTokensAllowance();
    this.state.simpleChef.methods
      .wihdraw(amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {});
  };
  handleMintUsd = async (e) => {
    this.state.usdToken.methods
      .mint(this.state.account, this.state.web3.utils.toWei("1000", "Ether"))
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ showUsdMintButton: false });
      });
  };
  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Vault
          usdTokenBalance={this.state.usdTokenBalance}
          potatoTokenBalance={this.state.potatoTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.stakeTokens}
          unstakeTokens={this.unstakeTokens}
        />
      );
    }
    return (
      <div className="App">
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row col-6 offset-3">
            {this.state.showUsdMintButton ? (
              <button
                className="btn btn-success btn-block btn-lg0"
                onClick={this.handleMintUsd}
              >
                Mint Test USD
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="row">
            <div className="content mr-auto ml-auto">{content}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
