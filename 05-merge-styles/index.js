const {readdir, readFile} = require("fs/promises");
const fs = require("fs");
const path = require("path");

let styles = [];

fs.writeFile(path.join(__dirname, "project-dist", "bundle.css"), "", err => {
	if(err) {
		console.log(err);
	}
})


readdir(path.join(__dirname, "styles"), {withFileTypes:true}).then(data => {
	data.forEach(item => {
		if(item.isFile() && path.extname(item.name) === ".css" ) {
			readFile(path.join(__dirname, "styles", item.name), {encoding:"utf-8"}).then((getText) => {
				styles.push(getText)
				fs.writeFile(path.join(__dirname, "project-dist", "bundle.css"), styles.join(" "), err => {
					if(err) return
				})
			})
		}
	})
})

