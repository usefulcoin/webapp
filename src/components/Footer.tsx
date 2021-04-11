import * as React from 'react'
import styled from 'styled-components'
import DarkModeToggle from './DarkModeToggle';
import {colors} from "../styles";

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
`



const Footer = (props: any) => (
  <SFooter
   
    {...props}
  >
    <SLinks>
         <SLink href="https://docs.biopset.com/" target="_">Docs</SLink>
         <SLink href="https://twitter.com/biopset" target="_">Twitter</SLink>
         <SLink href="https://discord.gg/4SRYBNdE3r" target="_">Discord</SLink>
         <SLink href="https://t.me/BIOPset" target="_">Telegram</SLink>
     </SLinks>
     <DarkModeToggle/>
     <p style={{color: `rgb(${colors.black})`}}>BIOPset © 2021. Do not use 🙅‍♀️ in countries where binary options are regulated.</p>
    
   
  </SFooter>
)

export default Footer
