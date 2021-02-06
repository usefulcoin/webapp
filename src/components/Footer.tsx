import * as React from 'react'
import styled from 'styled-components'

const SFooter = styled.div`
  margin-top: 100px;
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const SLinks = styled.div`
    display: flex;
    flex-direction: row;
    margin: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`

const SLink = styled.a`
    margin: 10px;
`



const Footer = (props: any) => (
  <SFooter
   
    {...props}
  >
    <SLinks>
         <SLink href="https://docs.biopset.com/">Docs</SLink>
         <SLink href="https://twitter.com/biopset">Twitter</SLink>
         <SLink href="https://discord.gg/4SRYBNdE3r">Discord</SLink>
     </SLinks>
     <p>BIOPset © 2021. Do not use 🙅‍♀️ in countries where binary options are regulated.</p>
    
   
  </SFooter>
)

export default Footer
