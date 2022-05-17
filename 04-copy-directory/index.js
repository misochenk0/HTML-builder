
const {copyFile, mkdir, unlink} = require("fs/promises");
const path = require("path");
const {readdir} = require("fs/promises");



mkdir(path.join(__dirname, "files-copy"), {recursive: true})



function checkFolder(folderName, folderCopyName) {
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

checkFolder("files", "files-copy")
