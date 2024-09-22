import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import "./modal.css";

export const VerticallyCenteredModal = (props) => (
  <Modal
    {...props}
    size={props.size || 'lg'}
    style={{zIndex:2000}}
    dialogClassName="modalAdaptive"
    aria-labelledby='contained-modal-title-vcenter'
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id='contained-modal-title-vcenter'>
        {props.header}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.children}</Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onHide}>Закрити</Button>
    </Modal.Footer>
  </Modal>
);
