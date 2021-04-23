import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

interface IColumnStyleProps {
  spanHeight: boolean
  maxWidth: number
  center: boolean
}

interface IColumnProps extends IColumnStyleProps {
  children: React.ReactNode
}

const SColumn = styled.div<IColumnStyleProps>`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  max-width: ${({ maxWidth }) => (maxWidth !== 0? `${maxWidth}px` : '100%')};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`

const Column = (props: IColumnProps) => {
  const { children} = props
  return (
    <SColumn
      {...props}
    >
      {children}
    </SColumn>
  )
}

Column.propTypes = {
  children: PropTypes.node.isRequired,
  spanHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  center: PropTypes.bool
}

Column.defaultProps = {
  spanHeight: false,
  maxWidth: 0,
  center: false
}

export default Column
