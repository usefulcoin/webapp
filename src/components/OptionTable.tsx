import * as React from 'react'
import styled from "styled-components";
import OptionDirection from "./OptionDirection";
import Button from "./Button";
import Loading from "./Loading";
import { colors } from 'src/styles';
import {convertToDecimals, add, smallerThan, greaterThan} from "../helpers/bignumber";


const STable = styled.table`
border-collapse: collapse;
width: 100%;
`
const STh = styled.th`
border: 1px solid rgb(${colors.lightGrey});
text-align: left;
padding: 8px;
color: rgb(${colors.black});
`

const STrEven = styled.tr`
background-color: rgb(${colors.lightGrey});
color: white;
`

const STrOdd = styled.tr`
background-color: rgb(${colors.grey});
color: white;
`

const OptionTable = (props: any) => {

    function renderExpireExercise(option: any) {
        const { currentPrice, handleComplete, currentRound } = props;

            // tslint:disable-next-line:no-console
            console.log(`${add(option.exp,option.purchaseRound)} exp round ${currentRound} current round ${currentPrice} for option `);
            // tslint:disable-next-line:no-console
            console.log(option);
            // tslint:disable-next-line:no-console
            console.log(option.strikePrice > currentPrice);
            // tslint:disable-next-line:no-console
            console.log(`${typeof(option.strikePrice)} ${typeof(currentPrice)}`);
            // tslint:disable-next-line:no-console
            console.log(option.type === false);
            // tslint:disable-next-line:no-console
            console.log(`${typeof(option.type)} `);
            // tslint:disable-next-line:no-console
            console.log(smallerThan(option.purchaseRound,currentRound));
            // tslint:disable-next-line:no-console
            console.log(`${typeof(option.purchaseRound)} ${typeof(currentRound)}`);
        if (option.expired) { 
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>Settled for {convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH</Button>;
        } else if (option.exercised) {
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>Settled for {convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH</Button>;
        } else if (greaterThan(currentRound, add(option.exp,option.purchaseRound))) {
            // option ready to expire
            return <Button  onClick={() => handleComplete(option.id)}><span style={{color: "white"}}>Settle for {convertToDecimals(web3.utils.fromWei(`${option.lockedValue*0.005}`.split(".")[0], "ether"), 3)}  ETH </span></Button>;
        } /* else if (option.type === false && option.strikePrice > currentPrice && smallerThan(option.purchaseRound,currentRound)) {
            // put option ready to exercise

            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise ({convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH) Put</Button>;
        } else if (option.type === true && option.strikePrice < currentPrice && smallerThan(option.purchaseRound, currentRound)) {
            // call option ready to exercise
            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise ({convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH) {option.type ? "Call" : "Put"}</Button>;
        } */ else {
            // optionwith no action available
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>None</Button>;
        }
    }

  
    const {options, web3, currentRound} = props;

    const width = window.innerWidth;
    const height = window.innerHeight;
    if (options.length > 0) {
        // tslint:disable-next-line:no-console
        console.log("showing options!!!");
        // tslint:disable-next-line:no-console
        console.log(options);
        return (
            <STable>
                <thead>
                    <tr>
                        <STh>ID</STh>
                        <STh>Moneyness</STh>
                        {width > height ?  
                        <STh>Value(ETH)</STh> : <></>}
                        <STh>Settlement</STh>
                    </tr>
                </thead>
                <tbody>
                {options.map((option: any, index: number)=>{
                    function details() {
                        alert(`Created: Oracle Round ${option.purchaseRound}. Expire: Oracle Round ${add(option.exp, option.purchaseRound)}. current: Oracle Round ${currentRound}`);
                    }

                    if (index % 2 === 0) {
                        return <STrEven key={ index } >
                                <STh >{option.id} <span style={{cursor: "pointer"}} onClick={() => details()}>ⓘ</span></STh>
                                <STh><OptionDirection optionType={option.type}/> {option.complete ? (option.exercised ? "ITM" : "OTM") : "Pending"}</STh>
                                { width > height ?  <STh>{web3.utils.fromWei(`${option.lockedValue}`, "ether")}</STh> : <></>}
                                <STh>{renderExpireExercise(option)}</STh>
                            </STrEven>;
                    } else {
                        return <STrOdd key={ index }>
                            <STh >{option.id} <span style={{cursor: "pointer"}} onClick={() => details()}>ⓘ</span></STh>
                                <STh><OptionDirection optionType={option.type}/> {option.complete ? (option.exercised ? "ITM" : "OTM") : "Pending"}</STh>
                                { width > height ?  <STh>{web3.utils.fromWei(`${option.lockedValue}`, "ether")}</STh> : <></>}
                             <STh>{renderExpireExercise(option)}</STh>
                        </STrOdd>;
                    }

                  })}
                  </tbody>
            </STable>
        )
    } else {
        return (
            <>
            <p style={{color: `rgb(${colors.black})`}}>One moment please. Options are loading.</p>
            <Loading/>
            </>
        )
    }

}


export default OptionTable
