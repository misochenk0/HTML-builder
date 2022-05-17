const fs = require("fs");

const {readdir} = require("fs/promises");
const path = require("path")

function checkFolder(folderName) {
	readdir(path.join(__dirname, folderName), {withFileTypes: true}).then(data => {
		data.forEach(item => {
			if(item.isDirectory()) {
				return null
			} else {
				fs.stat(path.join(__dirname,folderName, item.name), (err,stats) => {
					console.log(`${item.name.replace(path.extname(item.name), "")} - ${path.extname(item.name).replace('.', "")} - ${stats.size /1000}kb`);
				})
			}
		})
	})
	
}

checkFolder("secret-folder")

