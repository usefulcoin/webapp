import * as React from 'react'

import Up from "../assets/up.png";
import Down from "../assets/down.png";
interface IBetButtonProps {
    up: boolean
    onClick: any
    active: boolean
  }

const BetButton = (props: IBetButtonProps) => {
    const {up, onClick, active} = props;
    const wideGirl = window.innerWidth > window.innerHeight;
    return (
        <div style={{
            width: wideGirl ? "45px" : "90px",
            height: wideGirl ? "45px" : "66px",
            background: `url(${up ? Up : Down}) no-repeat`,
            backgroundSize: `cover`,
            backgroundPosition: 'center',
            margin: '3px',
            cursor: "pointer",
            color: "white",
            fontSize: '0.65rem',
            fontWeight: 'bold',
            verticalAlign: 'middle',
            opacity: active ? "100%" : "40%"
        }}
        onClick={() => onClick()}
      >
        {wideGirl ?
        
        <div style={{paddingTop: up ? "30px" : "2px"}}>{up ? "UP" : "DOWN"}</div>
        :
        
        <div style={{paddingTop: up ? "40px" : "0px", fontSize: "medium"}}>{up ? "UP" : "DOWN"}</div>
        }
        </div>
       
    )
} 
export default BetButton;