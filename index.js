const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { fromBuffer } = require('pdf2pic');
const Calipers = require('calipers')('pdf', 'png', 'jpeg');
const Tesseract = require('tesseract.js');

const allowedExtensions = ['pdf', 'png', 'jpeg', 'jpg'];
const allowedLanguages = ['spa', 'eng'];

const getFileDimentions = async (filePath) => {
	let dimentions = await Calipers.measure(filePath)
		.then(result => {
			return result.pages[0];
		})

	return dimentions;
}

const getPdfAsImagePath = async (pdfPath) => {
	// tomar dimensiones del archivo
	let dimentions = await getFileDimentions(pdfPath);
	let pdfBuffer = fs.readFileSync(pdfPath);
	
	const options = {
	  density: 100,
	  saveFilename: "tmp",
	  savePath: "./files",
	  format: "png",
	  ...dimentions
	};


	let storeAsImage = fromBuffer(pdfBuffer, options);
	const pageToConvertAsImage = 1;

	let imagePath = await storeAsImage(pageToConvertAsImage)
		.then(resolve => path.resolve(__dirname, resolve.path))

	return imagePath;
}

const getTextFromImagePath = async (imagePath, imageLang) => {
	let logger = { logger: m => console.log(m) };
	let text = await Tesseract.recognize(imagePath, imageLang, logger)
		.then(result => {
			return result.data.text;
		})

		return text
}

const validateArgs = () => {
	let fileExt = getFileExtension(process.argv[2]);
	let extensionAllowed = allowedExtensions.includes(fileExt);
	
	if (!process.argv[2] || !extensionAllowed) {
		console.error(chalk.yellow('ERROR: Especifica un archivo .pdf, .png, o .jpg'));
		process.exit();
	}

	if (process.argv[3] && !allowedLanguages.includes(process.argv[3])) {
		console.error(chalk.yellow('ERROR: Idioma no soportado. Idiomas soportados:', allowedLanguages));
		process.exit();
	}
}

const getFileExtension = (filePath) => {
	let fileExt = filePath
		.split('.')
		.pop();

	return fileExt;
}


const run = async () => {

	console.time(chalk.green('Tiempo'))

	validateArgs();

	const fileLang = process.argv[3] || 'spa';
	const filePath = path.resolve(__dirname, process.argv[2]);

	let fileExt = getFileExtension(filePath);
	
	let imagePath;

	switch (fileExt) {
		case 'pdf':
			imagePath = await getPdfAsImagePath(filePath);
			break;
		case 'jpg':
		case 'jpeg':
		case 'png':
			imagePath = filePath;
			break;
		default:
			console.error(chalk.red('Extension de archivo no soportada'));
			process.exit();
			break;
	}

	let text = await getTextFromImagePath(imagePath, fileLang);
	
	console.clear();
	console.timeEnd(chalk.green('Tiempo'))
	console.group(chalk.green('Texto encontrado'))
	console.log(text)
	
	return text;

}

run();