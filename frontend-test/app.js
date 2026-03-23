const CONTRACT_ADDRESS = "0xfE47a82635F44167f26775DFd4fBB7B7cAee5566";
const SEPOLIA_CHAIN_ID = "0xaa36a7";
const READONLY_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

const ABI = [
  "function getCandidatesCount() view returns (uint256)",
  "function getVotes(uint256) view returns (uint256)",
  "function vote(uint256 candidateIndex)",
  "function hasVoted(address) view returns (bool)",
  "function candidates(uint256) view returns (string name, uint256 voteCount)"
];

const els = {
  contractAddress: document.getElementById("contractAddress"),
  connectBtn: document.getElementById("connectBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  voteBtn: document.getElementById("voteBtn"),
  candidateIndex: document.getElementById("candidateIndex"),
  walletStatus: document.getElementById("walletStatus"),
  networkStatus: document.getElementById("networkStatus"),
  candidates: document.getElementById("candidates"),
  logs: document.getElementById("logs")
};

let browserProvider;
let signer;
let contract;
let activeAddress;
let readOnlyProvider;
let readOnlyContract;

function log(message) {
  const stamp = new Date().toLocaleTimeString();
  els.logs.textContent = `[${stamp}] ${message}\n${els.logs.textContent}`;
}

function formatError(err) {
  if (!err) return "Unknown error";
  if (err.shortMessage) return err.shortMessage;
  if (err.reason) return err.reason;
  if (err.message) return err.message;
  return String(err);
}

async function ensureWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Install extension and reload.");
  }

  browserProvider = new ethers.BrowserProvider(window.ethereum);
  const network = await browserProvider.getNetwork();
  const chainHex = `0x${network.chainId.toString(16)}`;
  let switched = false;

  if (chainHex !== SEPOLIA_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }]
      });
      switched = true;
    } catch (switchError) {
      if (switchError && switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia",
              nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [READONLY_SEPOLIA_RPC],
              blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }
          ]
        });
        switched = true;
      } else {
        throw new Error("Please switch MetaMask network to Sepolia.");
      }
    }
  }

  // Re-create provider/signer after network switch to avoid stale network references.
  if (switched) {
    browserProvider = new ethers.BrowserProvider(window.ethereum);
  }

  signer = await browserProvider.getSigner();
  activeAddress = await signer.getAddress();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const voted = await contract.hasVoted(activeAddress);
  els.walletStatus.textContent = `Wallet: ${activeAddress} | hasVoted: ${voted}`;
  els.networkStatus.textContent = `Network: ${network.name} (chainId ${network.chainId})`;
}

function ensureReadOnlyContract() {
  if (!readOnlyProvider) {
    readOnlyProvider = new ethers.JsonRpcProvider(READONLY_SEPOLIA_RPC);
    readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, readOnlyProvider);
  }

  return readOnlyContract;
}

async function renderCandidates() {
  const activeContract = contract || ensureReadOnlyContract();

  const count = Number(await activeContract.getCandidatesCount());
  const cards = [];

  for (let i = 0; i < count; i++) {
    let name = `Candidate ${i}`;
    let votes = 0;

    try {
      const c = await activeContract.candidates(i);
      name = c.name;
      votes = Number(c.voteCount);
    } catch {
      votes = Number(await activeContract.getVotes(i));
    }

    cards.push(`
      <article class="card">
        <h3>#${i} - ${name}</h3>
        <p>Votes: ${votes}</p>
        <button data-vote="${i}">Vote for #${i}</button>
      </article>
    `);
  }

  els.candidates.innerHTML = cards.join("");

  document.querySelectorAll("button[data-vote]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      els.candidateIndex.value = btn.dataset.vote;
      await castVote();
    });
  });
}

async function castVote() {
  try {
    const index = Number(els.candidateIndex.value);
    if (Number.isNaN(index) || index < 0) {
      throw new Error("Enter a valid candidate index.");
    }

    await ensureWallet();
    log(`Submitting vote for candidate index ${index}...`);
    const tx = await contract.vote(index);
    log(`Tx sent: ${tx.hash}`);
    await tx.wait();
    log("Vote confirmed on-chain.");
    await renderCandidates();

    const voted = await contract.hasVoted(activeAddress);
    els.walletStatus.textContent = `Wallet: ${activeAddress} | hasVoted: ${voted}`;
  } catch (err) {
    log(`Vote failed: ${formatError(err)}`);
  }
}

els.contractAddress.textContent = CONTRACT_ADDRESS;

els.connectBtn.addEventListener("click", async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    await ensureWallet();
    await renderCandidates();
    log("Wallet connected successfully.");
  } catch (err) {
    log(`Connect failed: ${formatError(err)}`);
  }
});

els.refreshBtn.addEventListener("click", async () => {
  try {
    await ensureWallet();
    await renderCandidates();
    log("Data refreshed.");
  } catch (err) {
    log(`Refresh failed: ${formatError(err)}`);
  }
});

els.voteBtn.addEventListener("click", castVote);

if (window.ethereum) {
  window.ethereum.on("chainChanged", async () => {
    contract = null;
    signer = null;
    activeAddress = null;
    els.walletStatus.textContent = "Wallet: Reconnecting after network change...";

    try {
      await ensureWallet();
      await renderCandidates();
      log("Network changed and wallet reconnected.");
    } catch (err) {
      log(`Network change handling failed: ${formatError(err)}`);
    }
  });

  window.ethereum.on("accountsChanged", async () => {
    contract = null;
    signer = null;
    activeAddress = null;
    els.walletStatus.textContent = "Wallet: Reconnecting after account change...";

    try {
      await ensureWallet();
      await renderCandidates();
      log("Account changed and wallet reconnected.");
    } catch (err) {
      log(`Account change handling failed: ${formatError(err)}`);
    }
  });
}

renderCandidates().catch((err) => {
  log(`Initial load failed: ${formatError(err)}`);
});
