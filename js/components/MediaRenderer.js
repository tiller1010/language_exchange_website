"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function MediaRenderer(props) {
    var src = props.src, thumbnailSrc = props.thumbnailSrc;
    var fileExtension = props.fileExtension;
    if (src && !fileExtension) {
        fileExtension = src.split('.').reverse()[0];
    }
    switch (fileExtension) {
        case 'svg':
        case 'png':
        case 'jpg':
        case 'jpeg':
            return (React.createElement("div", { className: "img-container" },
                React.createElement("img", { src: src })));
        case 'mov':
        case 'mp4':
            return (React.createElement("video", { className: "video-preview lozad", height: "225", width: "400", poster: thumbnailSrc || "/images/videoPlaceholder.png", controls: true, src: src }));
        case 'mp3':
        case 'wav':
            return (React.createElement("div", { style: {
                    height: '225px',
                    width: '400px',
                    backgroundImage: "url('".concat(thumbnailSrc || "/images/videoPlaceholder.png", "')"),
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    borderRadius: '25px',
                    overflow: 'hidden',
                    maxWidth: '100%',
                } },
                React.createElement("audio", { className: "lozad", controls: true, src: src })));
        case '':
            return '';
        default:
            return React.createElement("p", null, "Invalid media");
    }
}
exports.default = MediaRenderer;
