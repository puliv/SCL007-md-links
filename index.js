// module.exports = () => {
//   // ...
// };


/*Use readFile para leer README.md y me mostro su contenido, por que use el parametro 
utf-8 para que use ese codigo al mostrarlo*/

// const path = require("path");

// const basenamePath= path.basename("README.md")
// 	console.log(basenamePath)

// const extensionPath = path.extname("README.md")
//     console.log(extensionPath)

// const readline = require("readline");


const fs = require("fs");
const anyDocument = process.argv[2];
const fetch = require("node-fetch");
let dataLinks = []; 


const mdLinks = () => {
	//Modulo que captura los links 
	const markdownLinkExtractor = require('markdown-link-extractor');

	fs.readFile(anyDocument, "utf-8", (err, data) => {
		if (err) {
			console.log(err)
		} else {
			const links = markdownLinkExtractor(data);
				console.log(links);
				dataLinks.push(links); //Aqui guardo el resultado para usarlo con fetch
		}
	});
};

// mdLinks();

fetch("README.md").then((res) => {	
	console.log(res)
}); 

