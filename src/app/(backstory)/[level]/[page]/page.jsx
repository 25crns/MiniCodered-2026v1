import Image from "next/image";
import Link from "next/link";
import { promises as fs } from 'fs';

/* 
	TODO: switch to CSS modules
	TODO: replace as much of the stylesheet as possible with Tailwind
*/


export async function generateStaticParams() {
	const pageRoutes = await fs.readFile(process.cwd() + '/src/app/(backstory)/backstory_routes.json', 'utf8');

	try {
		return JSON.parse(pageRoutes).backstoryPageRoutes.map(
			(page) => ({
				level: page.level,
				page: page.page,
			})
		)
	} catch (error) {
		console.error('Error:', error);
		return [];
	}
}


export default async function Backstory({ params, }) {
	const { level, page } = await params;

	const backstoryData = JSON.parse(await fs.readFile(process.cwd() + `/src/app/(backstory)/content/${level}.json`, 'utf8'));
	console.log(backstoryData.pages[page])
	// const nextPageUrl = Object.keys(backstoryData.pages).indexOf[page]
	const title = backstoryData.pages[page].title
	backstoryData.pages[page].accentColor ||= "orange"

	let charCount = 0;

	function getAnimatedWords(content) {
		return content.split(/(\s+)/).filter(Boolean).map((word, ind) => {
			let delay = charCount;
			charCount += word.length;
			return (
				<div
					key={ind}
					className="word-container"
					style={
						{
							"--n": word.length,
							"--delay": delay,
						}
					}>
					<span className="word">{word}</span>
				</div>
			);
		})
	}

	return (
		<main className="backstory-main">
			<Image
				src={`/assets/images/${backstoryData.pages[page].backgroundImageName}`}
				alt=""
				fill
				style={{ objectFit: "fill" }}
				priority
			/>

			<div className="backstory-text-scrambled-scrollbar-wrapper">
				<div className="backstory-text-scrambled" style={{ "color": backstoryData.pages[page].accentColor }}>
					<h1 className="backstory-title">{getAnimatedWords(title)}</h1>
					{
						backstoryData.pages[page].paragraphs.map((content, idx) => {
							return <div key={idx} className="backstory-paragraph">{getAnimatedWords(content)}</div>
						})
					}
				</div>
			</div>

			<div className="backstory-button-container" style={{ "--accent-color": backstoryData.pages[page].accentColor }}>
				{
					(backstoryData.pages[page].prevUrl) ? (
						<Link href={backstoryData.pages[page].prevUrl}
							className="prev-btn">
							Prev
						</Link>
					) : <button disabled> Prev </button>
				}
				{
					(backstoryData.pages[page].nextUrl) ? (
						<Link href={backstoryData.pages[page].nextUrl}
							className="next-btn">
							Next
						</Link>
					) : <button className="next-btn" disabled> Next </button>
				}
			</div>
		</main>
	);
}

