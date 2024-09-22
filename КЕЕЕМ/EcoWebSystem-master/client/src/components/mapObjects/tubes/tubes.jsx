import React, { useState } from 'react';
import { Polyline, Popup, Marker, Tooltip } from 'react-leaflet';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { EmissionsChartModal } from '../../charts/emissionsChartModal';

import '../popup.css';

const initialState = {
  showEmissionsChartModal: false,
  emissionCalculations: [],
  CorArr: [],
};

const ReturnLastData = ({ emissions }) => {
  let arr = emissions.slice();
  if (arr.length >= 4) {
    arr = arr.slice(arr.length - 4, arr.length);
  }

  return arr.map(
    ({ short_name, ValueAvg, ValueMax, Year, Month, day, Measure }, key) => (
      <tr key={key}>
        <td title={short_name}>{short_name}</td>
        <td title={ValueAvg}>{ValueAvg}</td>
        <td title={ValueMax}>{ValueMax}</td>
        <td title={Year}>{Year}</td>
        <td title={Month}>{Month}</td>
        <td title={day}>{day}</td>
        <td title={Measure}>{Measure}</td>
      </tr>
    )
  );
};

const Tube = ({ tube, handleClick }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Polyline
      positions={[tube.polygonPoints]}
      color={`rgba(${tube.lineCollorR}, ${tube.lineColorG}, ${tube.lineColorB}, 1)`}
      weight={tube.lineThickness}
    >
      <Popup maxWidth='auto'>
        {sessionStorage.getItem('user') && (
          <FontAwesomeIcon
            icon={faPencilAlt}
            onClick={() => handleClick(tube.poligonId)}
            className='edit-pencil-icon'
          />
        )}
        {tube.name && (
          <div>
            <strong>Назва:</strong>
            {tube.name}
          </div>
        )}
        {tube.user_name && (
          <div>
            <strong>Експерт який поставив:</strong>
            {tube.user_name}
          </div>
        )}
        {tube.emissions && tube.emissions.length > 0 && (
          <>
            <Table striped bordered hover size='sm' className='emissions-table'>
              <thead>
                <tr>
                  <th title='Хімічний елемент'>Хімічний елемент</th>
                  <th title='Середнє значення'>Середнє значення</th>
                  <th title='Максимальне значення'>Максимальне значення</th>
                  <th title='Рік'>Рік</th>
                  <th title='Місяць'>Місяць</th>
                  <th title='День'>День</th>
                  <th title='Одиниця виміру'>Одиниця виміру</th>
                </tr>
              </thead>
              <tbody>
                <ReturnLastData emissions={tube.emissions} />
              </tbody>
            </Table>
            <Button size='sm' onClick={() => setModalShow(true)}>
              Відобразити графіки викидів
            </Button>
            <EmissionsChartModal
              id={tube.poligonId}
              emissions={tube.emissions}
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </>
        )}
      </Popup>
    </Polyline>
  );
};

export const Tubes = ({
  tubeArr,
  settubeId,
  setisEditTubeMode,
  setshowTubeModal,
}) => {
  const handleClick = (tubeid) => {
    settubeId(tubeid);
    setisEditTubeMode(true);
    setshowTubeModal(true);
  };

  return (
    <>
      {tubeArr.map((el) => {
        if (el.polygonPoints) {
          return (
            <Tube key={el.poligonId} tube={el} handleClick={handleClick} />
          );
        }
      })}
    </>
  );
};

const DragPoint = ({
  position,
  DeleteMarker,
  index,
  newTubeCordinates,
  setnewTubeCordinates,
}) => {
  const markerRef = React.useRef(null);

  const DragHandler = () => {
    initialState.CorArr = [...newTubeCordinates];
    initialState.CorArr[index] = markerRef.current.leafletElement._latlng;
    setnewTubeCordinates(initialState.CorArr);
  };

  return (
    <Marker
      ondrag={DragHandler}
      key={'AddingN' + index}
      draggable={true}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <div>
          <Button
            size='sm'
            onClick={() => {
              DeleteMarker(index);
            }}
          >
            Видалити точку
          </Button>
        </div>
      </Popup>
      <Tooltip> {index + 1} </Tooltip>
    </Marker>
  );
};

export const AddingTube = ({ newTubeCordinates, setnewTubeCordinates }) => {
  const DeleteMarker = (index) => {
    initialState.CorArr = [...newTubeCordinates];

    initialState.CorArr.splice(
      initialState.CorArr.findIndex((el, i) => i === index),
      1
    );
    setnewTubeCordinates(initialState.CorArr);
  };

  return (
    <Polyline positions={newTubeCordinates}>
      {newTubeCordinates.map((el, i) => {
        return (
          <DragPoint
            key={i}
            position={el}
            DeleteMarker={DeleteMarker}
            index={i}
            newTubeCordinates={newTubeCordinates}
            setnewTubeCordinates={setnewTubeCordinates}
          />
        );
      })}
    </Polyline>
  );
};
