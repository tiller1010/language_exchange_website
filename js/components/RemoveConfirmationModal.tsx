import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faLongArrowAltRight, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const RemoveConfirmationModal = (props) => {

  let [forceClosed, setForceClosed] = React.useState(false);

  let {
    buttonText,
    buttonAnchor,
    modalTitle,
    modalContent,
    handleDelete,
  } = props;

  return (
    <section className="modal--show" id={buttonAnchor} tabIndex={-1} role="dialog" aria-labelledby="modal-label" aria-hidden="true" style={forceClosed ? { display: 'none' } : {}}>
      <div className="modal-inner">
        <header id="modal-label">
          <h2>{ modalTitle }</h2>
        </header>
        <div className="modal-content">
          { modalContent }
        </div>
        <footer className="flex x-space-around">
          <a className="button" href="#!" onClick={handleDelete}>
            { buttonText }
            <FontAwesomeIcon icon={faTrash}/>
          </a>
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

export default RemoveConfirmationModal;
