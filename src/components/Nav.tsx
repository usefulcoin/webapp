import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import {
    BET,
    EXERCISE_EXPIRE,
    STAKE,
    REWARDS
} from "../constants";

const SNav = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-direction: row;
`

interface INavProps {
    currentPage: string
    setPage: (page: string) => void
}

const Nav = (props: INavProps) => {

    function navLink(page: string, currentPage: string) {
        return (
            <div onClick={() => setPage(page)} style={{
                cursor: "pointer",
                fontWeight: page === currentPage ? "bold" : "normal"
            }}>
                {page}
            </div>
        );
    }

    const { currentPage, setPage } = props;
    return (
        <SNav>
            {navLink(BET, currentPage)}
            {navLink(STAKE, currentPage)}
            {navLink(EXERCISE_EXPIRE, currentPage)}
            {navLink(REWARDS, currentPage)}
        </SNav>
    )
}


Nav.propTypes = {
    setPage: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired
}

export default Nav;