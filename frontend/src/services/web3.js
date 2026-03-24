export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not available.");
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0] || null;
}