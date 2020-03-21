import React, { useCallback, useState } from "react"
import styled, { css } from "styled-components"
import { curryN } from "ramda"
import { themeOr, withProp, propIs } from "../helpers"
import t from "prop-types"

const theme = themeOr({
	check: {
		active: "#705DF5",
		labelBg: "whitesmoke",
		labelColor: "#705DF5"
	}
})

const isFalse =  x => x == false

const baseStyle = css`
	width: 100%;
	display: flex;
	margin: 1rem 0;
	align-items: center;

 ${withProp("disabled", css`
 		opacity: .4;
 	`)}

	@media screen and (min-width: 640px) {
		flex-direction: row;
	}

	& > button {
		font-family: var(--input-font, inherit);

		&:focus {
			color: ${theme("primary")};
			/* box-shadow: 0px 0 0 2px var(--redAccent); */
		}

		${propIs("disabled", isFalse, css`
			&:hover {
				cursor: pointer;
				color: ${theme("check.active")};
				transition: all 0.2s ease-in-out;
			}
		`)}
	}

	& > * > span {
		position: relative;
		z-index: 3;
	}

	& > {
		* {
			padding: 1rem 1.5rem;
			text-align: center;
			flex-shrink: 0;
			color: #333333;
			position: relative;
			line-height: 20px;
			border-radius: 0;
			border: solid 1px ${theme("whitesmoke")};
			background: transparent;
			min-height: 40px;
			font-size: 1rem;
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

		label {
			border: none;
			flex: 0 0 20ch;
			font-size: 0.9em;
			text-align: right;
			color: ${theme("check.labelColor")};
			background-color: ${theme("check.labelBg")};
		}
	}

	@media screen and (max-width: 600px) {
		flex-wrap: wrap;
		border-radius: 12px;
		overflow: hidden;
		border: solid 1px ${theme("border.gray")};

		label {
			text-align: left;
			text-transform: uppercase;
			flex: 0 0 100%;
			letter-spacing: 3px;
			font-size: 0.8rem;
		}

		> * {
			flex-grow: 1;
			border-right-width: 1px !important;
			border-radius: 0 !important;
		}
	}
`

export default function Checker(props) {
	const [index, setIndex] = useState(-1)
	const updateIndex = useCallback(
		curryN(2, idx => {
			if (props.disabled) return
			const value = props.buttons[idx]
			setIndex(idx)
			props.onChange && props.onChange(value, idx)
		}),
		[setIndex]
	)
	const isActive = useCallback(idx => idx == index)
	const Wrapper = props.style || DotStyle

	return (
		<Wrapper disabled={props.disabled}>
			<label>{props.label}</label>
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
			{props.debug && (
				<button type="button" onClick={() => props.onChange("", -1)}>
					CLEAR
				</button>
			)}
		</Wrapper>
	)
}

Checker.defaultProps = {
	debug: false,
	disabled: false,
}

Checker.propTypes = {
	onChange: t.func.isRequired,
	label: t.string.isRequired,
	buttons: t.array.isRequired,
	debug: t.bool,
	disabled: t.bool,
	style: t.oneOf([DotStyle, FlatStyle])
}

const FlatStyle = styled.div`
	${baseStyle}
	& button.active {
		overflow: hidden;
		color: white;
	}

	& button::after {
		content: "";
		position: absolute;
		inset: 0;
		left: 100%;
		background-color: ${theme("check.active")};
		transition: all 0.3s ease-in-out;
	}

	& button.active::after {
		inset: 0;
	}
`
const DotStyle = styled.div`
	${baseStyle}
	
	button {
		overflow: hidden;

		span {
			display: block;
			padding-left: 0;
			transition: padding 0.3s ease;
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
		transition: all 0.3s ease-out .2s;
	}

	button.active {
		color: ${theme("check.active")};
		span { padding-left: 1rem; }

		&::after {
			opacity: 1;
			transform: translate(0, -50%);
		}
	}
`
Checker.Styles = { Dot: DotStyle, Flat: FlatStyle }