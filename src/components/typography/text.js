import styled, { css }  from "styled-components"

const ParagraphStyle = styled.p`
  font-family: var(--text-font), 'Lato', sans-serif;
  font-size: 16px;

  ${props =>
		props.small &&
    css`
      font-size: 13px;
    `}
`

export const P = ParagraphStyle
