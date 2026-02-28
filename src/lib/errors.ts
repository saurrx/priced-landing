export function friendlyError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message;
  if (msg.includes("User rejected")) return "Transaction cancelled by wallet.";
  if (msg.includes("insufficient")) return "Insufficient funds for this transaction.";
  if (msg.includes("blockhash")) return "Transaction expired. Please try again.";
  if (msg.includes("network")) return "Network error. Check your connection.";
  if (msg.includes("401")) return "Session expired. Please reconnect your wallet.";
  if (msg.includes("403")) return "Rate limited. Please wait a moment and try again.";
  if (msg.includes("429")) return "Too many requests. Please wait a moment and try again.";
  return msg;
}
