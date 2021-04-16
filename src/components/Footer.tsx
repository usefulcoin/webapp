import * as React from 'react'
import styled from 'styled-components'
import { BiBookAlt } from 'react-icons/bi';
import { RiTwitterLine, RiTelegramLine, RiDiscordLine } from 'react-icons/ri';
import {colors} from "../styles";
import LocaleToggle from './LocaleToggle';

const SFooter = styled.div`
  margin-top: 100px;
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SLinks = styled.div`
    display: flex;
    flex-direction: row;
    margin: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    color: rgb(${colors.black})
`

const SLink = styled.a`
    margin: 10px;
    font-size: xx-large;
`



const Footer = (props: any) => (
  <SFooter
   
    {...props}
  >
    <SLinks>
         <SLink href="https://docs.biopset.com/" target="_"><BiBookAlt/></SLink>
         <SLink href="https://twitter.com/biopset" target="_"><RiTwitterLine/></SLink>
         <SLink href="https://discord.gg/4SRYBNdE3r" target="_"><RiDiscordLine/></SLink>
         <SLink href="https://t.me/BIOPset" target="_"><RiTelegramLine/></SLink>
     </SLinks>
     {props.connected ? <></>:<LocaleToggle/>}
     <p style={{color: `rgb(${colors.black})`}}>BIOPset © 2021 </p>
    
   
  </SFooter>
)

export default Footer
