export const FEE_STRUCTURE = {
  'Two Wheeler': { platform: 50, deposit: 1950 },
  'Four Wheeler': { platform: 500, deposit: 4500 },
  'Heavy Vehicle': { platform: 1000, deposit: 9000 },
  'Property': { platform: 1000, deposit: 14000 },
  'Antiques': { platform: 100, deposit: 1500 }
};

export type AuctionCategory = keyof typeof FEE_STRUCTURE;

export function calculateFees(category: AuctionCategory) {
  const fees = FEE_STRUCTURE[category];
  return {
    platform: fees.platform,
    deposit: fees.deposit,
    total: fees.platform + fees.deposit
  };
}
