const multer  = require('multer');
const path = require('path');

function randomFilename() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 40; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '/../public/assets'));
	},
	filename: function(req, file, cb){
		let fileExtension = file.mimetype.split('').splice(file.mimetype.indexOf('/') + 1, file.mimetype.length).join('');
		if(fileExtension == 'quicktime'){
			fileExtension = 'mov';
		}
		cb(null, randomFilename() + '.' + fileExtension);
	}
});

module.exports = () => multer({ storage });