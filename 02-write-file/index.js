const fs = require("fs");
const path = require("path")
const {stdin, stdout} = process;

const stream = fs.createWriteStream(path.join(__dirname, "text.txt"));

stdout.write("Hey! Please write your text below \n");

stdin.on("data", (data) => {
	if(data.toString().trim() == "exit") {
		process.exit()
	} else {
		let newData = data.toString();
		stream.write(newData)
	}
})

process.on("SIGINT", function() {
	process.exit()
})

process.on('exit', () => {
	stdout.write("Bye!")
});