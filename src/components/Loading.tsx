import * as React from 'react'
import styled from 'styled-components'
import loading from "../assets/loading.gif";




const SLoading = styled.div`
    background: url(${loading}) no-repeat;
    background-size: cover;
    background-position: center;
    width:433px;
    height:333px;
    margin: 0 auto;
`

const Loading = () => {
  return (
    <SLoading
    />
  )
}




export default Loading
