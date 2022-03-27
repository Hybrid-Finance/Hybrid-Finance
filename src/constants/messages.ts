export const messages = {
    please_connect: "Please connect your wallet to Ethereum network to use Hybrid Finance!",
    please_connect_wallet: "Please connect your wallet!",
    try_bond_more: (value: string) => `You're trying to bond more than the maximum payout available! The maximum bond payout is ${value} Hybrid.`,
    before_bonding: "Before bonding enter a value.",
    bond_more_than_balance: "You are trying to bond more than your current balance. If your balance needs to be updated, please refresh.",
    existing_bond:
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
    before_stake: "Before staking enter a value.",
    before_unstake: "Before unstaking enter a value.",
    tx_successfully_send: "Transaction was successfully sent",
    your_balance_updated: "Your balance was successfully updated",
    nothing_to_claim: "Nothing to claim",
    something_wrong: "Something went wrong",
    switch_to_ethereum: "Switch to Avalanche Network?",
};
