import * as React from 'react'
import styled from 'styled-components'
import loading from "../assets/loading.gif";




const SLoading = styled.div`
    background: url(${loading}) no-repeat;
    background-size: cover;
    background-position: center;
    width:60vh;
    height:40vh;
    margin: 0 auto;
`

const Loading = () => {
  return (
    <SLoading
    />
  )
}




export default Loading
