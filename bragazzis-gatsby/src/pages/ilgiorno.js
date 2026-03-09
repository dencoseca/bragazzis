import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

// Components
import Layout from '../components/Layout'

function Ilgiorno({ location }) {
	return (
		<Layout pageTitle="Il Giorno" location={location}>
			<div className="ilgiorno__title text--page-title">IL GIORNO</div>
			<div className="ilgiorno__gallery">
				<div className="ilgiorno__caption ilgiorno__caption--aperto text--display">
					Aperto
				</div>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/aperto.jpg"
					alt="sandwich board sign outside cafe"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/sandwich-prep-duo.jpg"
					alt="people making sandwiches"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/sandwich-board-plan.jpg"
					alt="sandwich ingredients list"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/olive-oil-bread.jpg"
					alt="olive oil on bread"
				/>
				<StaticImage
					className="image image--70"
					onContextMenu={e => e.preventDefault()}
					src="../images/sangers-in-baskets.jpg"
					alt="baskets full of sandwiches"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/writing-cake-labels.jpg"
					alt="writing the cake labels"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/tom-and-joe-serving.jpg"
					alt="barista serving customer"
				/>
				<StaticImage
					className="image image--45"
					onContextMenu={e => e.preventDefault()}
					src="../images/leon-serving-deli-stuff.jpg"
					alt="serving at the deli counter"
				/>
				<StaticImage
					className="image image--70"
					onContextMenu={e => e.preventDefault()}
					src="../images/chicken-run-conversation.jpg"
					alt="customers conversing"
				/>
				<StaticImage
					className="image image--70"
					onContextMenu={e => e.preventDefault()}
					src="../images/shelves-wide-shot.jpg"
					alt="shelves full of italian dry goods"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/panettone.jpg"
					alt="panettone"
				/>
				<StaticImage
					className="image image--40"
					onContextMenu={e => e.preventDefault()}
					src="../images/pasta-stacked.jpg"
					alt="stacked pasta"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/sofa-through-window.jpg"
					alt="customers talking"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/joe-espresso-cup.jpg"
					alt="serving an espresso"
				/>
				<StaticImage
					className="image image--65"
					onContextMenu={e => e.preventDefault()}
					src="../images/kid-opening-fridge.jpg"
					alt="child choosing soft drink"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/busy-through-the-window.jpg"
					alt="busy cafe through the window"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/family-on-armchairs.jpg"
					alt="family drinking coffee"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/kitchen-trio.jpg"
					alt="working in the kitchen"
				/>
				<StaticImage
					className="image image--45"
					onContextMenu={e => e.preventDefault()}
					src="../images/steve-and-jules-through-door.jpg"
					alt="customers browsing the shelves"
				/>
				<StaticImage
					className="image image--40"
					onContextMenu={e => e.preventDefault()}
					src="../images/farfalle.jpg"
					alt="farfalle"
				/>
				<StaticImage
					className="image image--70"
					onContextMenu={e => e.preventDefault()}
					src="../images/moped.jpg"
					alt="moped"
				/>

				<StaticImage
					className="image image--55"
					onContextMenu={e => e.preventDefault()}
					src="../images/tom-and-joe-laughing.jpg"
					alt="barista laughing hard"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/maldini-sipping-coffee.jpg"
					alt="customer sipping coffee"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/customers-walking-by.jpg"
					alt="customers looking in through the window"
				/>
				<StaticImage
					className="image image--70"
					onContextMenu={e => e.preventDefault()}
					src="../images/cafe-view.jpg"
					alt="view of the busy cafe"
				/>
				<StaticImage
					className="image image--55"
					onContextMenu={e => e.preventDefault()}
					src="../images/tomatoes.jpg"
					alt="tomatoes"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/carrots.jpg"
					alt="carrots"
				/>
				<StaticImage
					className="image image--40"
					onContextMenu={e => e.preventDefault()}
					src="../images/cutting-parma.jpg"
					alt="cutting parma ham"
				/>
				<StaticImage
					className="image image--40"
					onContextMenu={e => e.preventDefault()}
					src="../images/slicing-parma.jpg"
					alt="slicing parma ham"
				/>
				<StaticImage
					className="image image--65"
					onContextMenu={e => e.preventDefault()}
					src="../images/salad-plated.jpg"
					alt="plating the salad"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/feeding-cake.jpg"
					alt="couple feed each other cake"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/joe-getting-milk.jpg"
					alt="barista on a milk run"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/jokes-in-kitchen.jpg"
					alt="fun in the kitchen"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/last-goodbyes-monochrome.jpg"
					alt="saying goodbye to customers"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/joe-sweeping-overspill.jpg"
					alt="sweeping the shop floor"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/tom-filling-bucket.jpg"
					alt="barista steaming the machine"
				/>
				<StaticImage
					className="image image--55"
					onContextMenu={e => e.preventDefault()}
					src="../images/jt-brings-in-chairs.jpg"
					alt="bringing in the outside chairs"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/clearing-table-detritus.jpg"
					alt="clearing last table"
				/>
				<StaticImage
					className="image image--65"
					onContextMenu={e => e.preventDefault()}
					src="../images/empty-cafe-ior.jpg"
					alt="empty cafe"
				/>
				<StaticImage
					className="image image--55"
					onContextMenu={e => e.preventDefault()}
					src="../images/tired-tom.jpg"
					alt="tired barista"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/tired-leon.jpg"
					alt="tired barista"
				/>
				<StaticImage
					className="image image--45"
					onContextMenu={e => e.preventDefault()}
					src="../images/tired-jt.jpg"
					alt="tired server"
				/>
				<StaticImage
					className="image image--45"
					onContextMenu={e => e.preventDefault()}
					src="../images/tired-matteo.jpg"
					alt="tired owner"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/tired-joe.jpg"
					alt="tired server"
				/>
				<StaticImage
					className="image image--55"
					onContextMenu={e => e.preventDefault()}
					src="../images/laughing-tom.jpg"
					alt="laughing barista"
				/>
				<StaticImage
					className="image image--60"
					onContextMenu={e => e.preventDefault()}
					src="../images/laughing-jt.jpg"
					alt="laughing server"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/laughing-joe-and-leon.jpg"
					alt="laughing barista and server"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/leaning-matteo.jpg"
					alt="shot of matteo ready to leave"
				/>
				<StaticImage
					className="image image--50"
					onContextMenu={e => e.preventDefault()}
					src="../images/empty-cafe-closing.jpg"
					alt="empty cafe at the end of the day"
				/>
				<div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">
					Chiuso
				</div>
			</div>
		</Layout>
	)
}

export default Ilgiorno
