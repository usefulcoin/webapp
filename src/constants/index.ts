export * from './actions'
export * from './contracts'
export * from './functions'
export * from './tooltips'

export const DEFAULT_LANG = "EN🇨🇦";

// pages
export const BUY_BIOP = "Buy BIOP";
export const STAKE = "Stake";
export const HOME_PAGE = "Home";
export const BUY_SELL = "Exchange";
export const TRADE = "Trade";
export const EXERCISE_EXPIRE = "Settle";
export const GOVERNANCE = "Governance";


// time frames
export const HOUR = "HOUR";
export const MINUTE = "MINUTE";

// price pairs
export const enabledPricePairs = [
    {
        symbol: "LINK",
        name: "chainlink",
        pair: "LINKUSDT",// switched to TradingView pair syntax
        address: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0"// "0x9326BFA02ADD2366b30bacB125260Af641031331"// "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    },
    /* {
        symbol: "BTC",
        name: "wrapped-bitcoin",
        pair: "BTC/USD",
        address: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
    }, */
]


