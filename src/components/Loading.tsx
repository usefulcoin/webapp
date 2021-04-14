import * as React from 'react'
import styled from 'styled-components'
import logo from "../assets/logo.png";




const SLoading = styled.div`
    background: url(${logo}) no-repeat;
    background-size: cover;
    background-position: center;
    height:60vh;
    width:40vh;
    margin: 0 auto;
    -webkit-animation: spin 4s infinite linear;
`



const Loading = () => {
  return (
    <div>
    <SLoading
    />
   
    </div>
  )
}




export default Loading
