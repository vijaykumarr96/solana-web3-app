import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const TEST_GIFS = [
  "https://media.giphy.com/media/rj12FejFUysTK/giphy.gif",
  "https://media.giphy.com/media/dUlhTFxtCbspPZVTKS/giphy.gif",
  "https://media.giphy.com/media/idST45hKtuhJt35Ejx/giphy.gif",
  "https://media.giphy.com/media/8xomIW1DRelmo/giphy.gif",
];
// Constants
const TWITTER_HANDLE = "Imthevk";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      console.log(solana);
      if (solana?.isPhantom) {
        console.log("phantom wallet found");
        // * The solana object gives us a function that will allow us to connect
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(response.publicKey.toString());
      } else {
        alert("Solana object not found! Get a phantom wallet now");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching Gif list...");
      setGifList(TEST_GIFS);
    }
  });
  console.log(gifList);
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const onInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link", inputValue);
    } else {
      console.log("Empty input.Try again");
    }
  };
  const renderNotconnectedContainer = () => {
    return (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    );
  };

  const renderConnectedContainer = () => {
    return (
      <div className="conneccted-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
          {TEST_GIFS.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 Avengers Portal</p>
          <p className="sub-text">
            View your Avengers GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotconnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
