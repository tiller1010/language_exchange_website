import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLongArrowAltRight, faTimes } from '@fortawesome/free-solid-svg-icons';

const NotificationModal = (props) => {

  let [forceClosed, setForceClosed] = React.useState(false);

  let {
    buttonAnchor,
    modalTitle,
    modalContent,
  } = props;

  return (
    <section className="modal--show is-active" id={buttonAnchor} tabIndex={-1} role="dialog" aria-labelledby="modal-label" aria-hidden="true" style={forceClosed ? { display: 'none' } : {}}>
      <div className="modal-inner">
        <header id="modal-label">
          <h2>{ modalTitle }</h2>
        </header>
        <div className="modal-content" dangerouslySetInnerHTML={{ __html: modalContent }}></div>
        <footer className="flex x-space-around">
          <a href="#!" onClick={() => setForceClosed(true)} className="button">
            Close
            <FontAwesomeIcon icon={faTimes}/>
          </a>
        </footer>
      </div>
      <a href="#!" onClick={() => setForceClosed(true)} className="modal-close" title="Close this modal" data-close="Close" data-dismiss="modal">?</a>
    </section>
  );
}

export default NotificationModal;
