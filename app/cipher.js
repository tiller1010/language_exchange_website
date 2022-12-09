function cipher(salt) {
    function textToChars(text) {
      return text.split('').map(function(c) { return c.charCodeAt(0); });
    }
    function byteHex(n) {
      return ("0" + Number(n).toString(16)).substr(-2);
    }
    function applySaltToChar(code) {
      return textToChars(salt).reduce(function(a,b) { return a ^ b; }, code);
    }

    return function(text) {
      return text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
    }
}

var myCipher = cipher(process.env.PROP_SALT);

module.exports = { myCipher };