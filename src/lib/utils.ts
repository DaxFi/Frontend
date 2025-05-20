// Joins class names
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}


const ETH_PRICE_USD = 2560.27; // TODO: replace with live price

export function formatEthAmount(amount: bigint, decimals: number = 18): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const integerPart = amount / factor;
  const fractionalPart = amount % factor;

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");

  const formatted =
    fractionalStr.length > 0
      ? `${integerPart.toString()}.${fractionalStr}`
      : integerPart.toString();

  return `${formatted} ETH`;
}

export function formatEthToUSD(
  amount: bigint,
  ethPriceUSD: number = ETH_PRICE_USD,
  decimals: number = 18,
): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const ethAmount = Number(amount) / Number(factor);
  const usdValue = ethAmount * ethPriceUSD;
  return `US$${usdValue.toFixed(2)}`;
}

export function convertUSDToEth(
  amount: number,
  ethPriceUSD: number = ETH_PRICE_USD,
  decimals: number = 18,
): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const ethAmount = amount / ethPriceUSD;
  return BigInt(Math.round(ethAmount * Number(factor))).toString();
}
