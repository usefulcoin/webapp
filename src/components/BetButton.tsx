import * as React from 'react'

import Up from "../assets/up.png";
import Down from "../assets/down.png";
interface IBetButtonProps {
    up: boolean
    onClick: any
  }

const BetButton = (props: IBetButtonProps) => {
    const {up, onClick} = props;
    return (
        <div style={{
            width: "120px",
            height: "120px",
            background: `url(${up ? Up : Down}) no-repeat`,
            backgroundSize: `cover`,
            backgroundPosition: 'center',
            margin: '15px',
            cursor: "pointer",
            color: "white",
            fontSize: '1.25rem',
            fontWeight: 'bold',
            verticalAlign: 'middle'
        }}
        onClick={() => onClick()}
      >

        <div style={{paddingTop: up ? "50px" : "30px"}}>{up ? "UP" : "DOWN"}</div>
        </div>
       
    )
} 
export default BetButton;