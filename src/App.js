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
    };
  }
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.checkAllowance();
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
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
          <div className="row">
            <vault
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>

                {content}
              </div>
            </vault>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
