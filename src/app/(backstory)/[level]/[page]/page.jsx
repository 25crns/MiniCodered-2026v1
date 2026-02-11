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


export default async function Backstory( { params, }){
	const { level, page } = await params;
	
	const backstoryData = JSON.parse(await fs.readFile(process.cwd() + `/src/app/(backstory)/content/${level}.json`, 'utf8'));
	console.log(backstoryData.pages[page])
	// const nextPageUrl = Object.keys(backstoryData.pages).indexOf[page]
	const title = backstoryData.pages[page].title
	backstoryData.pages[page].accentColor ||= "orange"

	let charCount = 0;

	function getScrambledText(len) {
		let scrambledStrs = ["", "", "", ""];
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~';
		let charactersLength = characters.length;
		for (let i = 0; i < len; i++) {
			scrambledStrs[0] += characters.charAt(Math.floor(Math.random() * charactersLength));
			scrambledStrs[1] += characters.charAt(Math.floor(Math.random() * charactersLength));
			scrambledStrs[2] += characters.charAt(Math.floor(Math.random() * charactersLength));
			scrambledStrs[3] += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
	
		return scrambledStrs;
	} 

	function getAnimatedWords(content) {
		return content.split(/(?<=\s)/gm).map((word, ind) => {
			let delay = charCount;
			charCount += word.length;
			let scrambledStrs = getScrambledText(word.length);
			return (
				<div
					className="word-container"
					style={
						{
							"--n": word.length,
							"--delay": delay,
							"--prev-n": ind != 0 ? content[ind - 1].length : 0,
						}
					}>
					<span className="word">{word}</span>
					<span
						className="scrambled"
						data-scrm-1={scrambledStrs[0]}
						data-scrm-2={scrambledStrs[1]}
						data-scrm-3={scrambledStrs[2]}
						data-scrm-4={scrambledStrs[3]}></span>
				</div>
			);
		})
	}

	return (
		<>
			<Image
				src={  `/assets/images/${backstoryData.pages[page].backgroundImageName}` }
				alt=""
				fill
				style={{ objectFit: "fill" }}
				priority
			/>
			
			<div className="backstory-text-scrambled-scrollbar-wrapper">
				<div className="backstory-text-scrambled" style={{"color": backstoryData.pages[page].accentColor}}>
					<h1 className="backstory-title">{getAnimatedWords(title)}</h1>
						{ 
							backstoryData.pages[page].paragraphs.map((content) => {
								return <div className="backstory-paragraph">{getAnimatedWords(content)}</div>
							})
						} 
				</div>
			</div>

			<div className="backstory-button-container" style={{"--accent-color": backstoryData.pages[page].accentColor}}>
				{ 
					(backstoryData.pages[page].prevUrl)? (
						<Link href={backstoryData.pages[page].prevUrl}
							className="prev-btn">
								Prev
						</Link>
					) : <button disabled> Prev </button>
				}
				{ 
					(backstoryData.pages[page].nextUrl)? (
						<Link href={backstoryData.pages[page].nextUrl}
								className="next-btn">
								Next
						</Link>
					) : <button className="next-btn" disabled> Next </button>
				}
			</div>
		</>
	);
} 

