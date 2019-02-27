// module.exports = () => {
//   // ...
// };

const fs = require("fs");
const anyDocument = process.argv[2];
const fetch = require("node-fetch");

const mdLinks = () => {
	//Modulo que captura los links 
	const markdownLinkExtractor = require('markdown-link-extractor');

	fs.readFile(anyDocument, "utf-8", (err, data) => {
		if (err) {
			console.log(err)
		} else {
			const links = markdownLinkExtractor(data);
			// console.log(links);

			for (let i = 0; i < links.length; i++) {
				const linksExtracted = links[i];
				
				fetch(links[i]).then(res => {
					const objectLinks = {
						url: res.url,
						statusLinks: res.status,
						statusText: res.statusText
					};
					console.log(objectLinks);
					return objectLinks;
				})
				.catch(error => {
					const objectErr = {
						urlErr: linksExtracted,
						statusErr: error
					}
					console.log(objectErr)
					return objectErr;
				});
			}
		}
	});
};

mdLinks();


