//import "../interactive-hints/style.css";
import React, {useEffect} from 'react';
import { useContext } from 'react';
import { Button, NavDropdown , Navbar} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { useHistory, useLocation } from 'react-router-dom';
import { TABLE_NAMES } from '../../utils/constants';
import { Login } from '../auth/login';
import { EnvironmentsInfoContext } from '../context/environmentsInfoContext';
import { useState } from 'react';
import { RadioWidget } from '../radiowidget/radiowidget';
import "../interactive-hints/style.css";
import {tooltip, changeRegime} from "../interactive-hints/interactive-hints.js";
import { DSS } from "../DSS/DSS.jsx";



import "./menu.css"


const TABLE_NAMES_ON_IU = {
  [TABLE_NAMES.elements]: 'Елементи',
  [TABLE_NAMES.gdk]: 'ГДК',
  [TABLE_NAMES.environment]: 'Середовища',
  [TABLE_NAMES.type_of_object]: 'Типи об`єктів',
  //[TABLE_NAMES.tax_values]: 'Податки',
};

export const MenuView = ({ user, setUser, dictionary, setDictionary }) => {
  const history = useHistory();

  const location = useLocation();

  const { environmentsInfo, setEnvironmentsInfo } = useContext(
    EnvironmentsInfoContext
  );

  const [ isSpecial, setIsSpecial] = useState(false);

  const [showRadioModal, setshowRadioModal] = useState(false);

  const hideRadio = () => setshowRadioModal(false);
  const showRadio = () => setshowRadioModal(true);

  const logOut = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const selectEnvironment = (id, name, setMapChosenType) => {
    const selectedEnvironment = environmentsInfo.environments.find(
      ({ id: environmentId }) => +environmentId === +id
    );

    setEnvironmentsInfo({
      selected: selectedEnvironment,
      environments: environmentsInfo.environments,
    });

    setDictionary(null)

    setIsSpecial(false);

    history.push('/earth');
  };

  const openAdvancedMap = ()=>{
    
    setEnvironmentsInfo({
      selected: null,
      environments: environmentsInfo.environments,
    });

    setDictionary(null);

    setIsSpecial(true);

    history.push('/advancedmap');
  }

  const selectDictionary = (name) => {
    setDictionary(name);

    setEnvironmentsInfo({
      selected: null,
      environments: environmentsInfo.environments,
    });


    setIsSpecial(false);
    history.push('/dictionary');
  };

  const isActive = (id) => {
    const { selected } = environmentsInfo;
    if (selected) {
      return id === selected.id;
    }

    return false;
  };

  const navigateToHome = () => {
    setEnvironmentsInfo({
      selected: null,
      environments: environmentsInfo.environments,
    });
    setIsSpecial(false);
    setDictionary(null);
    
    history.push('/');
  };

  const openInstruction = () => {
    setEnvironmentsInfo({
      selected: null,
      environments: environmentsInfo.environments,
    });
    setIsSpecial(false);
    setDictionary(null);

    history.push('/instruction');
  };


  const openDSS = () => {
    setEnvironmentsInfo({
      selected: null,
      environments: environmentsInfo.environments,
    });
    setIsSpecial(false);
    setDictionary(null);

    history.push('/DSS');
  };


  useEffect(() => {
    changeRegime(document.getElementById("interactive-mode").checked);

    let interactiveMode = document.getElementById("interactive-mode");
    interactiveMode.addEventListener('change', function() {
      changeRegime(interactiveMode.checked);
    });
  }, []);

  return (
    <Navbar bg="light" className="z-index"  expand="lg">
      <Navbar.Toggle  aria-controls="menu-nav"/>
        <Navbar.Collapse id="menu-nav" className="" >
          <Nav className='d-flex align-items-center container'>
            <Nav.Item>
              <Nav.Link data-content="Натисніть, щоб перейти на домашню сторінку" onMouseMove={tooltip} style={primaryColorObject} onClick={() => navigateToHome()}>
                Домашня сторінка
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <NavDropdown title={<span className="text-primary" data-content="Натисніть, щоб перейти на карту викидів" onMouseMove={tooltip}>Карта викидів</span>}>
                  {environmentsInfo.environments.map(({ id, name }) => (
                    <NavDropdown.Item
                      onClick={() => selectEnvironment(id, name)}
                      key={id}
                      name="map-of-emissions"
                      active={isActive(id)}
                    >
                      {name}
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Item 
                    name="spec-map"
                    onClick={() => openAdvancedMap()}
                    active={isSpecial}
                    data-content="Натисніть, щоб перейти спецмапу"
                    onMouseMove={tooltip}
                  >
                    Спец мапа
                  </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>

            {user && user.id_of_expert === 0 && (
                <Nav.Item>
                  <NavDropdown  title={<span data-content="Натисніть, щоб перейти в довідники" onMouseMove={tooltip} className="text-primary">Довідники</span>}>
                    {Object.values(TABLE_NAMES).map((name, index) => (
                      <NavDropdown.Item
                        onClick={() => selectDictionary(name)}
                        key={index}
                        active={dictionary === name}
                      >
                        {TABLE_NAMES_ON_IU[name]}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </Nav.Item>
                )}
                {(location.pathname === '/earth' || location.pathname === '/advancedmap' ) && (
                  <Nav.Item>
                    <Nav.Link style={primaryColorObject} onClick={showRadio}>Радіаційний моніторинг</Nav.Link>
                    <RadioWidget
                      showRadioModal={showRadioModal}
                      hideRadio={hideRadio}
                    />
                  </Nav.Item>
                )}

            {user && user.id_of_expert === 0 && (
              <Nav.Item>
                <Nav.Link style={primaryColorObject} onClick={() => openDSS()}>СППР</Nav.Link>
              </Nav.Item>
            )}




            <Nav.Item className="menu_togler">
              {user ? (
                <div className='d-flex align-items-center justify-content-center'>
                  <h5 className='mr-2 mb-0'>
                    Вітаємо, {user.FIO} ({user.expert_name})
                  </h5>
                  <Button variant='outline-secondary' size='md' onClick={logOut}>
                    Вийти
                  </Button>
                </div>
              ) : (
                <Login setUser={setUser} />
              )}
              
            </Nav.Item>
          </Nav>
          
          <span style={{marginRight: 20}} data-content="Після того як ви вимкнете цей режим, перестануть з'являтись різні типи підказок" onMouseMove={tooltip}>
            <input type="checkbox" 
              id="interactive-mode" 
              name="interactive-mode" 
              data-content="Після того як ви вимкнете цей режим, перестануть з'являтись різні типи підказок" 
              onMouseMove={tooltip} /> Інтерактивне навчання
          </span>

          <Button  variant='info' name="info" data-content="Інструкція з використання КЕЕЕМ" onMouseMove={tooltip} onClick={() => openInstruction()}>
            ?
          </Button>

        </Navbar.Collapse>
    </Navbar>
  );  
};


const primaryColorObject = {
  color:"#0275d8",
}
