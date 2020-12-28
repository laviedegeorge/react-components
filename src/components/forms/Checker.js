import React, { useCallback, useState } from "react"
import styled, { css } from "styled-components"
import { curryN } from "ramda"
import { themeOr, withProp, propIs } from "../../libs/styled.helpers"
import t from "prop-types"

const theme = themeOr({
	font: {
		sans: "sans-serif",
	},
	check: {
		active: "#705DF5",
		borderColor: "#F0F0F9",
	}
})

const isFalse = x => x == false

const baseStyle = css`
  margin: 1rem 0;
  align-items: center;
  display: inline-flex;

  ${withProp(
		"disabled",
		css`
			pointer-events: none;
      opacity: 0.5;
    `
	)}

  @media screen and (min-width: 640px) {
    flex-direction: row;
  }

  & > div {
  	display: flex;
  }

  & > div > button {
  	margin: 0;
    overflow: hidden;
    font-family: var(${theme("font.sans")}, inherit);

    &:focus {
      color: ${theme("primary")};
      /* box-shadow: 0px 0 0 2px var(--redAccent); */
    }

    ${propIs(
		"disabled",
		isFalse,
		css`
	      &:hover {
	        cursor: pointer;
	        color: ${theme("check.active")};
	        transition: all 0.2s ease-in-out;
	      }`)
  	}
  }

  & > div > * > span {
    position: relative;
    z-index: 3;
  }

  & > div > {
    *:not(input) {
      padding: 1rem 1.5rem;
      text-align: center;
      flex-shrink: 0;
      color: #333333;
      position: relative;
      line-height: 20px;
      border-radius: 0;
      border: solid 1px ${theme("check.borderColor")};
      background: transparent;
      min-height: 40px;
      font-size: 1em;
      width: auto;
      min-width: 100px;
      box-sizing: border-box;
      outline: none !important;

      &:not(:last-child) {
        border-right-width: 0;
      }

      &:last-child {
        border-radius: 0 12px 12px 0;
      }

      &:first-child {
        border-radius: 12px 0 0 12px;
      }
    }
  }

  .reset {
  	font-size: x-small;
  	letter-spacing: 3px;
  	text-transform: uppercase;
  } 

  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
    border-radius: 12px;
    overflow: hidden;

    > * {
      flex-grow: 1;
      border-right-width: 1px !important;
      border-radius: 0 !important;
    }
  }


  ${withProp(
		"compact",
		css`
			& > div > {
		    *:not(input) {
		    	padding: .4rem .8rem;
		    }
		  }
    `
	)}
`

const FlatStyle = styled.div`
  ${baseStyle}

  & button.active {
    color: white !important;
    border: solid 1px ${theme("check.active")};
  }

  & button::after {
    inset: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    position: absolute;
    left: 100%;
    background-color: ${theme("check.active")};
    transition: all 0.3s ease-in-out;
  }

  & button.active::after {
    inset: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`

const DotStyle = styled.div`
  ${baseStyle}

  button {
    overflow: hidden;

    span {
      display: block;
      padding-left: 0;
      transition: padding 0.3s ease .3s;
    }
  }

  button::after {
    content: "";
    position: absolute;
    width: 10px;
    left: 1.5rem;
    top: 50%;
    opacity: 0;
    height: 10px;
    border-radius: 50%;
    transform: translate(0, 200%);
    background-color: ${theme("check.active")};
    transition: all 0.3s ease-out 0.2s;

    ${withProp("compact", css`
				left: 1rem;
	   `)}
  }

  button.active {
    color: ${theme("check.active")};

    span {
    	transition-delay: 0s;
      padding-left: 1rem;
    }

    &::after {
      opacity: 1;
      transform: translate(0, -50%);
    }
  }

`

export const Checker = React.forwardRef(function _Checker(props, ref) {
	const [index, setIndex] = useState(-1)
	const updateIndex = useCallback(
		curryN(2, idx => {
			if (props.disabled) return
			const value = props.buttons[idx]
			setIndex(idx)
			props.onChange && props.onChange(value || null, idx)
		}),
		[setIndex]
	)
	const isActive = useCallback(idx => idx == index, [index])
	const Wrapper = props.style || DotStyle

	return (
		<Wrapper 
			disabled={props.disabled} 
			compact={props.compact}>
			<input ref={ref} type="hidden" name={props.name} />
			<div>
				{React.Children.map(props.buttons, (text, idx) => {
					return (
						<button
							type="button"
							key={idx}
							className={isActive(idx) ? "active" : ""}
							onClick={updateIndex(idx)}
						>
							<span>{text}</span>
						</button>
					)
				})}
				{props.canReset && (
					<button className="reset" 
						type="button" onClick={updateIndex(-1)}>
						Reset
					</button>
				)}
			</div>
		</Wrapper>
	)
})

Checker.defaultProps = {
	name: "",
	canReset: false,
	disabled: false
}

Checker.propTypes = {
	name: t.string,
	onChange: t.func.isRequired,
	buttons: t.arrayOf(t.string).isRequired,
	canReset: t.bool,
	disabled: t.bool,
	compact: t.bool,
	style: t.oneOf([DotStyle, FlatStyle])
}

Checker.Styles = { Dot: DotStyle, Flat: FlatStyle }

export default Checker
