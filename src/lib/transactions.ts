import {
  Connection,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

/**
 * Decode a base64 string to Uint8Array (browser-safe, no Buffer needed)
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign and submit a Jupiter transaction returned from our API routes.
 * Returns the transaction signature on success.
 */
export async function signAndSendTransaction(
  transactionBase64: string,
  wallet: WalletContextState,
  connection: Connection
): Promise<string> {
  if (!wallet.signTransaction) {
    throw new Error("Wallet does not support signing");
  }

  const bytes = base64ToUint8Array(transactionBase64);

  // Try VersionedTransaction first (Jupiter typically uses these)
  let signed: VersionedTransaction | Transaction;
  try {
    const versionedTx = VersionedTransaction.deserialize(bytes);
    signed = await wallet.signTransaction(versionedTx);
  } catch {
    // Fall back to legacy Transaction
    const legacyTx = Transaction.from(bytes);
    signed = await wallet.signTransaction(legacyTx);
  }

  const serialized = signed.serialize();
  const signature = await connection.sendRawTransaction(serialized, {
    skipPreflight: false,
    maxRetries: 3,
  });

  // Wait for confirmation
  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );

  return signature;
}

/**
 * Truncate a Solana public key for display: "7xKp...4mNq"
 */
export function truncateAddress(address: string): string {
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Get Solscan explorer URL for a transaction
 */
export function getSolscanUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}`;
}
