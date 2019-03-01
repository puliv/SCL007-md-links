// module.exports = () => {
//   // ...
// };

const fs = require("fs");
const path = process.argv[2];
const fetch = require("node-fetch");
const pathModule = require("path");
const markdownLinkExtractor = require('markdown-link-extractor'); //Modulo que captura los links 
const options = process.argv[3];

const mdLinks = (path, option) => {

	const stat = fs.statSync(path);
	const absolutePath = pathModule.resolve(path);
	const fileExtension = pathModule.extname(path);


	if (fileExtension === ".md") {
		fs.readFile(path, "utf-8", (err, data) => {
			if (err) {
				console.log(err)
			} else {
				const links = markdownLinkExtractor(data);
				// console.log(links);

				const arrFetch = []; //Recorro los links para pasarlos al fetch y que guarde los objetos dentro de este arr
				for (let i = 0; i < links.length; i++) {
					const linksExtracted = links[i];
					const text = links[i].text;

					//con el Fetch le pido que me muestre como objeto datos especificos
					const fetchLinks = fetch(links[i]).then(res => {
						if (options === "--validate") {
							const objectLinks = {
								url: res.url,
								path: absolutePath,
								text: text,
								statusLinks: res.status,
								statusText: res.statusText
							}
							return objectLinks

						} else {
							const objectLink = {
								href: res.url,
								text: text,
								path: absolutePath
							}
							return objectLink;
						}
					})
						.catch(error => {
							const objectErr = {
								url: linksExtracted,
								statusLinks: "error",
								text: text
							}
							// console.log(objectErr)
							return objectErr;
						});
					arrFetch.push(fetchLinks);
				}
				//guardo las promesas para mostrarlas todas juntas con el promise.all
				Promise.all(arrFetch)
					.then((res) => console.log(res));
			}
		});
	} else if (stat.isDirectory() === true) {
		let recursive = fs.readdirSync(path);
		return (Promise.all(recursive.map(elemento => {
			let otherVar = pathModule.join(absolutePath, elemento);
			return mdLinks(otherVar);
		})))
	} else {
		console.log("You should try with a .md file")
	}
};

mdLinks(path);


