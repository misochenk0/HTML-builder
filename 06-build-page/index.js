const {readFile, readdir, writeFile, mkdir, unlink, copyFile} = require("fs/promises");
const fs = require("fs")
const path = require("path");

let templateData = "";

function mergeStyles(sourceFold, distFold, fileName) {
	let styles = [];
	
	
	
	fs.writeFile(path.join(__dirname, distFold, fileName), "", err => {
		if(err) {
			console.log(err);
		}
	})
	
	
	readdir(path.join(__dirname, sourceFold), {withFileTypes:true}).then(data => {
		data.forEach(item => {
			if(item.isFile() && path.extname(item.name) === ".css" ) {
				readFile(path.join(__dirname, sourceFold, item.name), {encoding:"utf-8"}).then((getText) => {
					styles.push(getText)
					fs.writeFile(path.join(__dirname, distFold, fileName), styles.join(" "), err => {
						if(err) return
					})
				})
			}
		})
	})
}

function checkFolder(folderName, folderCopyName) {
	mkdir(path.join(__dirname, folderCopyName), {recursive: true})
	readdir(path.join(__dirname, folderName), {withFileTypes: true}).then(data => {
		let arr = []
		Object.entries(data).forEach(item => {
			arr.push(item[1].name)
		})
		readdir(path.join(__dirname, folderCopyName)).then(dataCopied => {
			dataCopied.forEach(item => {
				if(!arr.some(i => i ===item)) {
					unlink(path.join(__dirname, folderCopyName, item), err => {
						if(err) return 
					})

				}
			})
		}).catch(err => {
			return
		})
		data.forEach(item => {
			if(item.isDirectory()) {
				return checkFolder(folderName+"/"+item.name, folderCopyName+"/"+item.name)
			} else {
				copyFile(path.join(__dirname, folderName, item.name), path.join(__dirname, folderCopyName, item.name));
			}
		})
	})
	
}

readFile(path.join(__dirname, "template.html"), {encoding: "utf-8"}).then((data) => {
	templateData = data;
	let components = [];
	// console.log(data);
	function findComponent(text) {
		if(text.indexOf("{{") > 0 && text.indexOf("}}") > 0) {
			let comp = text.substring(text.indexOf("{{") + 2, text.indexOf("}}"));
			components.push(comp);
			findComponent(text.substring(text.indexOf("}}") + 2))
		}
	}
	findComponent(data)

	readdir(path.join(__dirname, "components"), {withFileTypes: true}).then(data => {
		data.forEach(item => {
			if(item.isFile() && path.extname(item.name) === ".html") {
				readFile(path.join(__dirname, "components", item.name), {encoding: "utf-8"}).then((compData) => {
					if(components.some(com => com.indexOf(item.name.replace(path.extname(item.name), "")) >= 0)) {
						components = components.filter(com => {
							if(com == item.name.replace(path.extname(item.name), "")) {
								const reg = new RegExp(`{{${com}}}`, "g")
								templateData = templateData.replace(reg, compData)
								return null
							} else {
								return item
							}
						})
					}

					mkdir(path.join(__dirname, "project-dist"), {recursive: true})
					writeFile(path.join(__dirname, "project-dist", "index.html"), templateData);
					checkFolder("assets", "project-dist/assets")
					mergeStyles("styles", "project-dist", "style.css")
				})
				
			}
		})
	})

})
