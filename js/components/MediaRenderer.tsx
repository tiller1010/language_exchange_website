import * as React from 'react';

export default function MediaRenderer(props) {

  const { src, thumbnailSrc } = props;

  let fileExtension = props.fileExtension;
  if (src && !fileExtension) {
    fileExtension = src.split('.').reverse()[0];
  }

  switch(fileExtension){
    case 'svg':
    case 'png':
    case 'jpg':
    case 'jpeg':
      return (
        <div className="img-container">
          <img src={src}/>
        </div>
      );
    case 'mov':
    case 'mp4':
      return (
        <video className="video-preview lozad" height="225" width="400" poster={
          thumbnailSrc || "/images/videoPlaceholder.png"
        } controls src={src}>
        </video>
      );
    case 'mp3':
    case 'wav':
      return (
        <div style={{
          height: '225px',
          width: '400px',
          backgroundImage: `url('${thumbnailSrc || "/images/videoPlaceholder.png"}')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          borderRadius: '25px',
            overflow: 'hidden',
            maxWidth: '100%',
        }}>
          <audio className="lozad" controls src={src}>
          </audio>
        </div>
      );
    case '':
      return '';
    default:
      return (
        <video className="video-preview lozad" height="225" width="400" poster={
          thumbnailSrc || "/images/videoPlaceholder.png"
        } controls src={src}>
        </video>
      );
  }
}
