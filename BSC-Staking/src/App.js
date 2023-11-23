import './App.css';
import { useState } from 'react';
import { BigNumber, ethers } from 'ethers'

import HelloWorld from './artifacts/contracts/HelloWorld.sol/HelloWorld.json'

const HelloWorldAddress = "0xB579E85ee47a56E445b9269Abcf6E584D579A5Cf"

function App() {
  const [ids, setIDs] = useState([])
  const [info, setInfo] = useState('')
  const [existingId, setExistingId] = useState('')
  const [foundInfo, setFoundInfo] = useState('')

  function stringToHex(input) {
    let hexString = '';
    for (let i = 0; i < input.length; i++) {
      const hexValue = input.charCodeAt(i).toString(16);
      hexString += hexValue;
    }
    return hexString;
  }
  
  function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  function getInfoFromId() {
    if (ids.indexOf(existingId) == -1) {
      alert('The id is not existing now');
      return;
    }
    setFoundInfo(hexToString(existingId.substr(66)));
  }
  

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getCurrentInfo() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(HelloWorldAddress, HelloWorld.abi, provider)
      const currentInfo = await contract.message();
      alert(currentInfo);
    }
  }

  async function generateNewId() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      
      try {
        let contract = new ethers.Contract(HelloWorldAddress, HelloWorld.abi, signer)
        let transaction = await contract.update(info)
        let resp = await transaction.wait()

        console.log('here', resp);
        let curIds = [...ids];
        let newId = resp.transactionHash + stringToHex(info);
        curIds.push(newId);
        setIDs(curIds);
        // alert(newId);
      } catch (err) {
        console.log('Error', err);
        alert('Error' + err.reason)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getCurrentInfo}>Get Current Information in Network </button>
        <br />

        Additional Information:
        <input type="text" value={info} onChange={(e) => (setInfo(e.target.value))} size="50" />
        <br />

        <button onClick={generateNewId}>Generate</button>
        <br />

        Generated Ids:
        <textarea value={ids.join('\n')} rows="10" cols="100" />
        <br />

        <button onClick={getInfoFromId}> Get Additional Information from exisiting ID</button>
        <input type="text" value={existingId} onChange={(e) => setExistingId(e.target.value)} size="100" />
        <input type="text" value={foundInfo} size="50" disabled />

      </header>
    </div>
  );
}

export default App;
