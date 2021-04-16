import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import DarkModeToggle from './DarkModeToggle';
import LocaleToggle from './LocaleToggle';
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
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
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
    padding: 5px;
`

const STogglie = styled.li` 
    padding: 5px;
    background-color: rgb(${colors.darkGrey});
    border-radius: 0 0 10px 0;
`

interface INavProps {
    currentPage: string
    setPage: (page: string) => void
    locale: string
}

const Nav = (props: INavProps) => {
    const [showPanel, setShowPanel] = React.useState(false);


    function navLink(page: string, currentPage: string, index: number, length: number) {
        return (
            <div onClick={() => setPage(page)} style={{
                border: `6px solid rgb(${colors.darkGrey})`,
                borderTop: "0px",
                cursor: "pointer",
                fontWeight: page === currentPage ? "bold" : "normal",
                color: `white`,
                padding: "6px",
                fontSize: "1.10rem",
                borderRadius: index === 0 ? '0 0 0 10px' : "0",
                backgroundColor: `rgb(${page === currentPage ? colors.grey : colors.darkGrey})`
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
        BET,
        STAKE,
        EXERCISE_EXPIRE,
        REWARDS,
        BUY_BIOP,
    ]
    if (width > height) {
        return (

            <SNav>
                {pages.map((page, i) => navLink(page, currentPage, i, pages.length))}

                <STogglie><LocaleToggle /></STogglie>
                <div style={{paddingLeft: "25px"}}><DarkModeToggle /></div>
            </SNav>
        )
    } else {
        return (<div>

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
                                style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
                            >
                                {page}
                            </SMobileNavItem>
                        })}

                        <LocaleToggle />
                        <DarkModeToggle />
                    </ul>


                </SMobileContainer>
                : <Button
                    onClick={() => setShowPanel(!showPanel)}
                ><span
                    style={{ color: `white` }}>{i18n[locale].MENU}</span></Button>
            }
        </div>
        )
    }


}


Nav.propTypes = {
    setPage: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired
}

export default Nav;