import React, { Component } from "react";
import usd from "../img/usd.png";

class Vault extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Potato Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
                USD
              </td>
              <td>
                {window.web3.utils.fromWei(
                  this.props.potatoTokenBalance,
                  "Ether"
                )}{" "}
                Potato
              </td>
            </tr>
          </tbody>
        </table>


        <div className="row">
          <div className="col-6">
            <div className="card mb-4">
              <div className="card-body">
                <form
                  className="mb-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    let amount;
                    amount = this.depositInput.value.toString();
                    amount = window.web3.utils.toWei(amount, "Ether");
                    this.props.stakeTokens(amount);
                  }}
                >
                  <div>
                    <label className="float-left">
                      <b>Deposit</b>
                    </label>
                    <span className="float-right text-muted">
                      Balance:{" "}
                      {window.web3.utils.fromWei(
                        this.props.usdTokenBalance,
                        "Ether"
                      )}
                    </span>
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      ref={(depositInput) => {
                        this.depositInput = depositInput;
                      }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      required
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={usd} height="32" alt="" />
                        &nbsp;&nbsp;&nbsp; USD
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                  >
                    Deposit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card mb-4">
              <div className="card-body">
                <form
                  className="mb-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    let amount;
                    amount = this.withdrawInput.value.toString();
                    amount = window.web3.utils.toWei(amount, "Ether");
                    this.props.unstakeTokens(amount);
                  }}
                >
                  <div>
                    <label className="float-left">
                      <b>Withdraw</b>
                    </label>
                    <span className="float-right text-muted">
                      Balance:{" "}
                      {window.web3.utils.fromWei(
                        this.props.stakingBalance,
                        "Ether"
                      )}
                    </span>
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      ref={(withdrawInput) => {
                        this.withdrawInput = withdrawInput;
                      }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      required
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={usd} height="32" alt="" />
                        &nbsp;&nbsp;&nbsp; USD
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger btn-block btn-lg"
                  >
                    Withdraw
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <button
            onClick={(event) => {
              event.preventDefault();
              this.props.stakeTokens(0);
            }}
            className="btn btn-success btn-block btn-lg"
          >
            Harvest
          </button>
        </div>
      </div>
    );
  }
}

export default Vault;
