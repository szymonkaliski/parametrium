import React from 'react';

import './index.css';

const Modal = ({ open, children }) => (
  <div className={`modal ${open ? 'modal--open' : 'modal--closed'}`}>
    <div className="modal__content">
      {open && children}
    </div>
  </div>
);

export default Modal;
