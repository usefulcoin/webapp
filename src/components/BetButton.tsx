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
    return (
        <div style={{
            width: "45px",
            height: "45px",
            background: `url(${up ? Up : Down}) no-repeat`,
            backgroundSize: `cover`,
            backgroundPosition: 'center',
            margin: '3px',
            cursor: "pointer",
            color: "white",
            fontSize: '0.65rem',
            fontWeight: 'bold',
            verticalAlign: 'middle',
            opacity: active ? "100%" : "50%"
        }}
        onClick={() => onClick()}
      >

        <div style={{paddingTop: up ? "30px" : "2px"}}>{up ? "UP" : "DOWN"}</div>
        </div>
       
    )
} 
export default BetButton;