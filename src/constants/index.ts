export * from './actions'
export * from './contracts'
export * from './functions'

// pages
export const HOME_PAGE = "Home";
export const BUY_SELL = "Exchange";
export const STAKE = "Sell (293% APY)";
export const BET = "Trade";
export const EXERCISE_EXPIRE = "Exercise/Expire";
export const REWARDS = "Rewards";


// time frames
export const HOUR = "HOUR";
export const MINUTE = "MINUTE";

// price pairs
export const enabledPricePairs = [
    {
        symbol: "LINK",
        name: "link",
        pair: "LINK/USD",
        address: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0"
    },
    /* {
        symbol: "BTC",
        name: "wrapped-bitcoin",
        pair: "BTC/USD",
        address: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
    }, */
]
