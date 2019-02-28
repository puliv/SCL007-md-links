// module.exports = () => {
//   // ...
// };

const fs = require("fs");
const mdDocument = process.argv[2];
const fetch = require("node-fetch");
const pathModule = require("path");
const markdownLinkExtractor = require('markdown-link-extractor'); //Modulo que captura los links 

const mdLinks = (path, option) => {

	const absolutePath = pathModule.resolve(mdDocument); //Var que guarda la ruta absoluta del archivo ingresado
	const fileExtension = pathModule.extname(mdDocument); //Var que identifica extension del archivo ingresado

	//Condicion para que solo acepte archivos .md 
	if (fileExtension != ".md") {
		console.log("Solo se permiten archivos con extensión .md")
	} else {
		fs.readFile(mdDocument, "utf-8", (err, data) => {
			if (err) {
				console.log(err)
			} else {
				const links = markdownLinkExtractor(data);
				// console.log(links);

				const arrFetch = []; //Recorro los links para pasarlos al fetch y que guarde los objetos dentro de este arr
				for (let i = 0; i < links.length; i++) {
					const linksExtracted = links[i];

					//con el Fetch le pido que me muestre como objeto datos especificos
					const fetchLinks = fetch(links[i]).then(res => {
						const objectLinks = {
							url: res.url,
							statusLinks: res.status,
							statusText: res.statusText,
							path: absolutePath
						};
						// console.log(objectLinks);
						return objectLinks;
					})
						.catch(error => {
							const objectErr = {
								urlErr: linksExtracted,
								statusErr: error
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
	}
};

mdLinks(process.argv[2]);


