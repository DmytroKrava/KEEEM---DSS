import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { TUBE_URl } from '../../utils/constants';

import { post, get, put } from '../../utils/httpService';

import { VerticallyCenteredModal } from '../modals/modal';

const initialState = {
  form: {
    brushColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    lineThickness: 1,
    name: '',
    type: 'tube',
    description: '',
  },
};

export const AddTubeModal = ({
  show,
  onHide,
  coordinates,
  user,
  setShouldFetchData,
  tubeId,
  settubeId,
  isEditTubeMode,
  setisEditTubeMode,
  setnewTubeCordinates,
}) => {
  const [lineThickness, setLineThickness] = useState(
    initialState.form.lineThickness
  );

  const [color, setColor] = useState(initialState.form.brushColor);
  const [name, setName] = useState(initialState.form.name);
  const [description, setDescription] = useState(initialState.form.description);

  const hide = () => {
    onHide();
    clearForm();
  };

  const clearForm = () => {
    setLineThickness(initialState.form.lineThickness);
    setColor(initialState.form.brushColor);
    setName(initialState.form.name);
    setDescription(initialState.form.description);
    setisEditTubeMode(false);
    settubeId(null);
  };

  useEffect(() => {
    if (tubeId && isEditTubeMode) {
      get(`${TUBE_URl}/${tubeId}`).then(({ data }) => {
        setLineThickness(data.line_thickness);
        setColor({
          r: data.line_collor_r,
          g: data.line_color_g,
          b: data.line_color_b,
          a: data.line_alfa,
        });
        setName(data.name);
        setDescription(data.description);
      });
    }
  }, [tubeId, isEditTubeMode]);

  const addTube = (emission) => {
    if (lineThickness && name && user && user.id_of_user) {
      post(TUBE_URl, {
        line_collor_r: color.r,
        line_color_g: color.g,
        line_color_b: color.b,
        line_alfa: color.a,
        line_thickness: Number(lineThickness),
        name,
        id_of_user: Number(user.id_of_user),
        type: initialState.form.type,
        description,
        points: coordinates.map((point, index) => ({
          latitude: point.lat,
          longitude: point.lng,
          order123: index + 1,
        })),
      })
        .then(() => {
          hide();
          setShouldFetchData(true);
        })
        .catch((error) => {
          alert('Помилка при додаванні даних.');
          console.log(error);
          setShouldFetchData(false);
        });
    } else {
      alert(
        'Запомніть такі поля:\n-назва\n-ширина лінії\nТа увійдіть в систему'
      );
    }
  };

  const editTube = (emission) => {
    put(`${TUBE_URl}/${tubeId}`, {
      brush_color_r: color.r,
      bruch_color_g: color.g,
      brush_color_b: color.b,
      brush_alfa: color.a,
      line_collor_r: color.r,
      line_color_g: color.g,
      line_color_b: color.b,
      line_alfa: color.a,
      line_thickness: Number(lineThickness),
      name,
      description,
    })
      .then(() => {
        clearForm();
        onHide();
        setnewTubeCordinates([]);
        setShouldFetchData(true);
        setisEditTubeMode(false);
        settubeId(null);
      })
      .catch((error) => {
        alert('Помилка при редагуванні даних.');
        console.log(error);
        setisEditTubeMode(false);
        settubeId(null);
        setnewTubeCordinates([]);
        setShouldFetchData(false);
      });
  };

  return (
    <VerticallyCenteredModal
      size='lg'
      show={show}
      onHide={() => hide()}
      header={!isEditTubeMode ? 'Додати трубу' : 'Редагувати трубу'}
    >
      <Form>
        <Form.Group>
          <Form.Label>Оберіть колір труби та товщину лінії</Form.Label>
          <Form.Control
            type='number'
            value={lineThickness}
            min={1}
            onChange={(e) => setLineThickness(e.target.value)}
          />
          <br />
          <SketchPicker
            color={color}
            onChangeComplete={({ rgb }) => setColor(rgb)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Введіть ім'я труби</Form.Label>
          <Form.Control
            type='input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Додайте опис труби</Form.Label>
          <Form.Control
            as='textarea'
            rows='3'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        {isEditTubeMode ? (
          <Button size={'sm'} onClick={() => editTube()}>
            Редагувати трубу
          </Button>
        ) : (
          <Button size={'sm'} onClick={() => addTube()}>
            Додати трубу
          </Button>
        )}
      </Form>
    </VerticallyCenteredModal>
  );
};
