import React from "react"
import { storiesOf } from "@storybook/react"
import { withKnobs, boolean, text } from "@storybook/addon-knobs"
import { Theme } from "./styles/StyleComponents"
import { Card } from "../src/components/cards"
import Modal from "../src/components/cards/Modal"
import { Button } from "../src/components/buttons"
import { H4, P } from "../src/components/typography"
import { Stack, Tab } from "../src/components/layouts"

const Buttons = () => {
	const { toggle } = Modal.useModal()

	return (
		<React.Fragment>
			<H4>Modals</H4>
			<P>Click either buttons to launch the modal (popup)</P>
			<Button style={{ marginRight: ".5rem" }} onClick={() => toggle("keep")}>
				Launch Modal
			</Button>
			<Button onClick={() => toggle("guest")}>Launch Second</Button>
		</React.Fragment>
	)
}

const stories = storiesOf("Modal", module).addDecorator(withKnobs)
stories.add("Example", () => (
	<Theme>
		<Modal.Provider>
			<Buttons />
			<Modal name="keep" size={text("Modal Size", "sm")}>
				<Stack>
					<Card.Header>The Card Heading</Card.Header>
					<P>
						{text(
							"Text",
							"The way out of here is to find true love that distracts you from it."
						)}
					</P>
					<Tab>
						<Button primary>Click Me</Button>
						<Button primary outline>
							Try Me
						</Button>
					</Tab>
				</Stack>
			</Modal>
			<Modal name="guest" size="lg">
				<H4>Heading</H4>
				<P>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, odit,
					repellat laudantium omnis perspiciatis consectetur vel nostrum sequi
					consequatur, at suscipit delectus aut accusantium dolorum mollitia
					officia neque! Quod, aperiam!
				</P>
			</Modal>
		</Modal.Provider>
	</Theme>
))

stories.add("Simple Modal", () => {
	// const [state, setState] = React.useState(false);

	return (
		<Theme>
			<Modal
				size={text("Modal Size", "sm")}
				show={boolean("Show Modal", true)}
				onClose={() => alert("Am closing")}
			>
				<Stack>
					<Card.Header>Modal Heading</Card.Header>
					<P>
						{text(
							"Text",
							"Click on the backdrop will call the [onClose] Function"
						)}
					</P>
					<Tab>
						<Button primary>Click Me</Button>
						<Button primary outline>
							Try Me
						</Button>
					</Tab>
				</Stack>
			</Modal>
		</Theme>
	)
}) 
