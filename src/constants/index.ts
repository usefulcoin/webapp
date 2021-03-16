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
        symbol: "ETH",
        name: "ethereum",
        pair: "ETH/USD",
        address: "0x9326BFA02ADD2366b30bacB125260Af641031331"// "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    },
    /* {
        symbol: "BTC",
        name: "wrapped-bitcoin",
        pair: "BTC/USD",
        address: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
    }, */
]
