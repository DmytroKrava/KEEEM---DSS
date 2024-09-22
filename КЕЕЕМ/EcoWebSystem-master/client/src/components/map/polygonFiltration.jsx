import React, { useState } from 'react';
import { Form, DropdownButton, Dropdown } from 'react-bootstrap';

const initTitle = 'Загальні полігони';

export const PolygonFiltration = ({ setmapMode, ...props }) => {
  const [title, setTitle] = useState(initTitle);

  const selectHanler = (title, type) => {
    setTitle(title);
    setmapMode(type);
  };

  return (
    <Form>
      <Form.Label>Виберіть тип полігонів</Form.Label>
      <DropdownButton title={title}>
        <Dropdown.Item
          eventKey='base'
          onClick={() => {
            selectHanler(initTitle, null);
          }}
        >
          Загальні полігони
        </Dropdown.Item>
        <Dropdown.Item
          eventKey='region'
          onClick={() => {
            selectHanler('Області', 'region');
          }}
        >
          Області
        </Dropdown.Item>
        <Dropdown.Item
          eventKey='tubes'
          onClick={() => {
            selectHanler('Трубопровід', 'tubes');
          }}
        >
          Трубопровід
        </Dropdown.Item>
      </DropdownButton>
    </Form>
  );
};
