import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [etherBalance, setEtherBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  let web3;
  let dex;
  const dexContractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';  // Replace with your deployed contract address
  const tokenContractAddress = 'YOUR_TOKEN_ADDRESS_HERE';  // Replace with your deployed token contract address

  useEffect(() => {
    async function loadWeb3AndData() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        web3 = window.web3;
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        dex = new web3.eth.Contract(/* YOUR_CONTRACT_ABI */, dexContractAddress);

        const etherBal = await dex.methods.etherBalance(accounts[0]).call();
        setEtherBalance(etherBal);

        const token = new web3.eth.Contract(/* YOUR_TOKEN_CONTRACT_ABI */, tokenContractAddress);
        const tokenBal = await token.methods.balanceOf(accounts[0]).call();
        setTokenBalance(tokenBal);
      } else {
        alert('Install MetaMask or use a web3-enabled browser.');
      }
    }

    loadWeb3AndData();
  }, []);

  const buyTokens = async () => {
    await dex.methods.buyTokens(buyAmount).send({ from: account });
    // Refresh balances after buying (for simplicity, fetching again)
    const etherBal = await dex.methods.etherBalance(account).call();
    setEtherBalance(etherBal);

    const token = new web3.eth.Contract(/* YOUR_TOKEN_CONTRACT_ABI */, tokenContractAddress);
    const tokenBal = await token.methods.balanceOf(account).call();
    setTokenBalance(tokenBal);
  };

  const sellTokens = async () => {
    await dex.methods.sellTokens(sellAmount).send({ from: account });
    // Refresh balances after selling (for simplicity, fetching again)
    const etherBal = await dex.methods.etherBalance(account).call();
    setEtherBalance(etherBal);

    const token = new web3.eth.Contract(/* YOUR_TOKEN_CONTRACT_ABI */, tokenContractAddress);
    const tokenBal = await token.methods.balanceOf(account).call();
    setTokenBalance(tokenBal);
  };

  return (
    <div className="App">
      <h1>Simple DEX</h1>
      <p>Account: {account}</p>
      <p>Ether Balance: {web3.utils.fromWei(etherBalance.toString(), 'ether')}</p>
      <p>Token Balance: {web3.utils.fromWei(tokenBalance.toString(), 'ether')}</p>
      <div>
        <h2>Buy Tokens</h2>
        <input value={buyAmount} onChange={e => setBuyAmount(e.target.value)} placeholder="Amount" />
        <button onClick={buyTokens}>Buy</button>
      </div>
      <div>
        <h2>Sell Tokens</h2>
        <input value={sellAmount} onChange={e => setSellAmount(e.target.value)} placeholder="Amount" />
        <button onClick={sellTokens}>Sell</button>
      </div>
    </div>
  );
}

export default App;
