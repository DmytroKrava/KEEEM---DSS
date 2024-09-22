import React, { useState, useEffect, useRef } from 'react';

import { CarouselView } from './carousel';
import { Col, Container, Row } from 'react-bootstrap';
import { KEEMPrinciples } from './KEEMPrinciples';
//import { Button, NavDropdown , Navbar} from 'react-bootstrap';
import { /*tooltip,*/ modal_window, audio, changeRegime } from '../interactive-hints/interactive-hints.js';
import "../interactive-hints/style.css"
import sound from "./home-page-audio.m4a";


export const Home = () => {
  useEffect(() => {
    changeRegime(document.getElementById("interactive-mode").checked);
    audio("home-page-audio");
  }, []);

  return (
    <React.Fragment>
      <CarouselView />
      <Container>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <Row className='justify-content-center mt-5 mb-5'>

          <button name="home-page-audio" 
            className="fas fa-play show-element" 
            data-arg1={sound}></button>
          <br/><br/>
          
          <button 
            className="btn btn-info modal-window-button" 
            data-content="<p>На головній сторінці контента частина складається з каруселі зображені 
              та описом основних принципів еколого-економічного моніторингу, які описують головне призначення 
              системи.</p>" 
              onClick={modal_window}
            >
            <i className="fa fa-icon">і</i>
          </button>
          
          <Col xs={12}>
            <KEEMPrinciples />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
