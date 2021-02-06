import * as React from 'react'
import styled from "styled-components";
import OptionDirection from "./OptionDirection";
import Button from "./Button";
import { colors } from 'src/styles';

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
`

const STrOdd = styled.tr`
background-color: rgb(${colors.white});
`

const OptionTable = (props: any) => {

    function renderExpireExercise(option: any) {
        const { currentPrice, handleExercise, handleExpire } = props;
        if (option.expired) {
            return<Button disabled outline={true} color={`rgb(${colors.black})`}>Expired</Button>;
        } else if (option.exercised) {
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>Exercised</Button>;
        } if (option.complete) {
            return <Button disabled outline={true} color={`rgb(${colors.black})`}>Completed</Button>;
        } else if (option.timestamp + (3600 * 1000) < new Date().getTime()) {
            // option ready to expire
            return <Button onClick={() => handleExpire(option.id)}>Expire</Button>;
        } else if (option.type === false && option.strikePrice > currentPrice) {
            // put option ready to exercise

            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise</Button>;
        } else if (option.type === true && option.strikePrice < currentPrice) {
            // call option ready to exercise
            // tslint:disable-next-line:no-console
            console.log(`${option.strikePrice} stik ${currentPrice} current`);
            return <Button onClick={() => handleExercise(option.id)}>Exercise</Button>;
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
            return <STh>{web3.utils.fromWei(`${option.lockedValue*0.005}`, "ether")}  ETH</STh>
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
                        <STh>Fee</STh>
                        : 
                        <>
                        <STh>Value (your bet + house)</STh>{/* 
                        <STh>Strike</STh> */}
                        </>
                        }
                        <STh>Action</STh>
                    </tr>
                </thead>
                <tbody>
                {options.map((option: any, index: number)=>{
                    if (index % 2 === 0) {
                        return <STrEven key={ index }>
                            <STh>{option.id}</STh>
                            <STh><OptionDirection optionType={option.type}/></STh>
                            {renderFeeOrCost(option)}
                            <STh>{renderExpireExercise(option)}</STh>
                        </STrEven>;
                    } else {
                        return <STrOdd key={ index }>
                            <STh>{option.id}</STh>
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
            <p>A moment please, the current options are loading...:)</p>
        )
    }
   
}


export default OptionTable