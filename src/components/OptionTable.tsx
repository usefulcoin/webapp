import * as React from 'react'
import styled from "styled-components";
import OptionDirection from "./OptionDirection";
import Button from "./Button";
import { colors } from 'src/styles';
import {convertToDecimals, add, smallerThan} from "../helpers/bignumber";


const STable = styled.table`
border-collapse: collapse;
width: 100%;
`
const STh = styled.th`
border: 1px solid rgb(${colors.lightGrey});
text-align: left;
padding: 8px;
`

const STrEven = styled.tr`
background-color: rgb(${colors.lightGrey});
color: rgb(${colors.white});
`

const STrOdd = styled.tr`
background-color: rgb(${colors.white});
color: rgb(${colors.black});
`

const OptionTable = (props: any) => {

    function renderExpireExercise(option: any) {
        const { currentPrice, handleExercise, handleExpire, currentRound } = props;

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
            return <b>Loss</b>;
        } else if (option.exercised) {
            return <b>Win</b>;
        } else if (add(option.exp,option.purchaseRound)  < currentRound) {
            // option ready to expire
            return <Button onClick={() => handleExpire(option.id)}>Expire ({convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH) {option.type ? "Call" : "Put"}</Button>;
        } else if (option.type === false && option.strikePrice > currentPrice && smallerThan(option.purchaseRound,currentRound)) {
            // put option ready to exercise

            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise ({convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH) Put</Button>;
        } else if (option.type === true && option.strikePrice < currentPrice && smallerThan(option.purchaseRound, currentRound)) {
            // call option ready to exercise
            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise ({convertToDecimals(web3.utils.fromWei(`${option.lockedValue}`, "ether"), 3)}  ETH) {option.type ? "Call" : "Put"}</Button>;
        } else {
            // optionwith no action available
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>None</Button>;
        }
    }

    function renderFeeOrCost(option: any) {
        const {showFee} = props;
        if (showFee) {
            // tslint:disable-next-line:no-console
            console.log(`showing fee value ${web3.utils.fromWei(`${option.lockedValue*0.005}`, "ether")} ${web3.utils.fromWei(`${option.lockedValue}`, "ether")}`);
            return <STh>{web3.utils.fromWei(`${option.lockedValue*0.005}`, "ether")}  ETH </STh>
        } else {

            // tslint:disable-next-line:no-console
            console.log(`showing locked value`);
            return <>
                <STh>{web3.utils.fromWei(`${option.lockedValue}`, "ether")}  ETH</STh>{/*
                <STh>{web3.utils.fromWei(`${option.strikePrice}`, "ether")}  ETH</STh> */}
            </>

        }
    }

    const {options, web3, showFee} = props;
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
                        <STh>Direction</STh>
                        {showFee ?
                        <STh>Settlement Fee</STh>
                        :
                        <>
                        <STh>Option Value</STh>{/*
                        <STh>Strike</STh> */}
                        </>
                        }
                        <STh>Action</STh>
                    </tr>
                </thead>
                <tbody>
                {options.map((option: any, index: number)=>{
                    function details() {
                        alert(`Created: Oracle Round ${option.purchaseRound}. Expire: Oracle Round ${add(option.exp, option.purchaseRound)}`);
                    }

                    if (index % 2 === 0) {
                        return <STrEven key={ index } >
                                <STh >{option.id} <span style={{cursor: "pointer"}} onClick={() => details()}>ⓘ</span></STh>
                                <STh><OptionDirection optionType={option.type}/></STh>
                                {renderFeeOrCost(option)}
                                <STh>{renderExpireExercise(option)}</STh>
                            </STrEven>;
                    } else {
                        return <STrOdd key={ index }>
                            <STh >{option.id} <span style={{cursor: "pointer"}} onClick={() => details()}>ⓘ</span></STh>
                            <STh><OptionDirection optionType={option.type}/></STh>
                            {renderFeeOrCost(option)}
                             <STh>{renderExpireExercise(option)}</STh>
                        </STrOdd>;
                    }

                  })}
                  </tbody>
            </STable>
        )
    } else {
        return (
            <p>One moment please. Options are loading.</p>
        )
    }

}


export default OptionTable
