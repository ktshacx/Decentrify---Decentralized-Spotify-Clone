import './App.css';
import Web3 from 'web3';
import Decentrify from "./abi/Decentrify.json"
import { useEffect, useState } from 'react';
import * as IPFS from 'ipfs-core';

function App() {
  const [name, setName] = useState();
  const [title, setTitle] = useState();
  const [file, setFile] = useState();
  const [hash, setHash] = useState();
  const [ipfs, setIpfs] = useState();
  const [wallet, setWallet] = useState();
  const [musics, setMusics] = useState();
  const [contract, setContract] = useState();

  async function captureFile(event){
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    }
  }

  async function uploadData(){
    if(wallet){
      console.log('uploading')
      const res = await ipfs.add(file);
      const hash = await res.path;
      contract.methods.uploadMusic(hash, title, name).send({from: wallet}).on('transactionHash', (hash) => {
        window.location.reload()
      })
      .on('error', (error) => {
        alert(error)
      })
    }else{
      alert('Please Connect Your Wallet To Upload')
    }
  }

  function handleTitleInput(event){
    setTitle(event.target.value)
  }

  function handleNameInput(event){
    setName(event.target.value)
  }

  async function connectWallet(){
    window.location.reload();
  }

  useEffect(async () => {
    setIpfs(await IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }))
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    var web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    setWallet(accounts[0])
    var contract = new web3.eth.Contract(Decentrify, process.env.REACT_APP_CONTRACT_ADDRESS);
    setContract(contract);
    var MusicCount = await contract.methods.MusicCount().call();
    var MusicArray = [];
    for(var i = 1; i <= MusicCount; i++){
      MusicArray.push(await contract.methods.musics(i).call())
    }
    setMusics(await MusicArray);
  }, [])
  return (
    <div className='cont'>
      <form className='form' onSubmit={
        (event) => {
          event.preventDefault();
          uploadData()
        }
      }>
        <h2>Upload Music</h2>
        <input type="text" placeholder="Enter Your Name" value={name} onChange={handleNameInput}/> 
        <input type="text" placeholder="Enter Music Title" value={title} onChange={handleTitleInput}/> 
        <input type="file" onChange={captureFile}/>
        <button className='btn'>Upload</button>
      </form>
      <h1>{wallet ? wallet : <button className='btn' onClick={connectWallet}>Connect</button>}</h1>
      {musics ? musics.map(music => <div className='music-cont'><span className='title'>{music[1]}</span><audio controls><source src={"http://ipfs.io/ipfs/"+music[2]} type="audio/mp3"/></audio> {music[3]}</div>) : "Loading..."} 
    </div>
  );
}

export default App;
