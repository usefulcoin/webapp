import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import { colors } from "../styles";
import {
    BET,
    EXERCISE_EXPIRE,
    STAKE,
    REWARDS,
    BUY_BIOP
} from "../constants";
import Button from './Button';
import i18n from "../i18n";

const SNav = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 16px;
  flex-direction: row;
`

const SMobileContainer = styled.div`
    background-color: rgb(${colors.white});
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    padding-top: 10%;
    margin-top: 0%;
    font-size: x-large;
    cursor: pointer;
`

const SMobileNavItem = styled.li`
    color: rgb(${colors.black});
`

interface INavProps {
    currentPage: string
    setPage: (page: string) => void
    locale: string
}

const Nav = (props: INavProps) => {
    const [showPanel, setShowPanel] = React.useState(false);


    function navLink(page: string, currentPage: string) {
        return (
            <div onClick={() => setPage(page)} style={{
                cursor: "pointer",
                fontWeight: page === currentPage ? "bold" : "normal",
                color: `rgb(${colors.black})`
            }} 
            key={page}>
                {page}
            </div>
        );
    }

    const { currentPage, setPage, locale } = props;


    const width = window.innerWidth;
    const height = window.innerHeight;

    
    const pages = [
        BUY_BIOP,
        BET,
        STAKE,
        EXERCISE_EXPIRE,
        REWARDS
    ]
    if (width > height) {
        return (

            <SNav>
                {pages.map(page => navLink(page, currentPage))}
            </SNav>
        )
    } else {
        return ( <div>
              
                {showPanel ?
                <SMobileContainer > 
                <ul>
                    
                {pages.map(page => {
                    return <SMobileNavItem 
                            key={page}
                            onClick={() => {
                                setPage(page);
                                setShowPanel(false);
                            }}
                            style={{fontWeight: page === currentPage ? "bold":"normal"}}
                            >
                                {page}
                            </SMobileNavItem>
                    })}
                </ul>
                
                
                </SMobileContainer>
                :  <Button 
                onClick={()=>setShowPanel(!showPanel)}
                ><span 
                style={{color: `white`}}>{i18n[locale].MENU}</span></Button>
            }
            </div>
      )}

  
}


Nav.propTypes = {
    setPage: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired
}

export default Nav;