export function simulateNetworkDelay(min = 150, max = 400) {
  const ms = min + Math.random() * (max - min);
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
