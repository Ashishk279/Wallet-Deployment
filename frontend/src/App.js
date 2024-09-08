import './App.css';
import React, { useState } from 'react'
import { ethers } from 'ethers';
import axios from 'axios';
import { url } from './constants/url';

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [signer, setSigner] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (typeof web3 !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [selectedAccount, 'latest']
        });

        const signer = await provider.getSigner(selectedAccount);
        setSigner(signer);

        const response = await axios.post(`${url}/connect`, {
          address: selectedAccount,
          balance: ethers.formatEther(balance)
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setAddress(response.data.data.address);
        setBalance(response.data.data.balance);
        
        alert(`Successfully connected with Metamask: ${selectedAccount}`);
      } catch (error) {
        alert(`Error connecting with Metamask: ${error.message}`);
      }
    } else {
      alert("Please install Metamask!");
    }
  };

  const transferEther = async () => {
    if (!recipient || !amount) {
      alert("Please enter a valid recipient address and amount.");
      return;
    }
    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });

        await tx.wait();
      alert(`Transaction successful! Hash: ${tx.hash}`);

      const transaction=await axios.post(`${url}/transfer`, {
        fromAddress: address,
        toAddress: recipient,
        amount,
        txHash: tx.hash
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setRecipient("");
      setAmount("");

      alert(`SuccessFully transfer ethers: ${transaction.data.data.transactions.txHash}`)
    } catch (error) {
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="title">Ethereum Wallet</div>
        <button onClick={connectWallet}>Connect Wallet</button>
        <p>Address: {address}</p>
        <p>Balance: {balance} ETH</p>

        <div>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={transferEther}>Transfer Ethers</button>
        </div>
      </div>
    </div>
  );
}

export default App;
