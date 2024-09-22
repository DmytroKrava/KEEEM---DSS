import React from 'react';
import { Form } from 'react-bootstrap';
import { DICTIONARY_MODES } from '../../utils/constants';

export const DictionaryModes = ({ setSelectedMode, user }) => {
  return [
    {
      mode: DICTIONARY_MODES.search,
      displayName: 'Пошук',
      visible: true,
    },
    {
      mode: DICTIONARY_MODES.add,
      displayName: 'Додати',
      visible: user && user.id_of_expert === 0,
    },
    {
      mode: DICTIONARY_MODES.edit,
      displayName: 'Редагувати',
      visible: user && user.id_of_expert === 0,
    },
    {
      mode: DICTIONARY_MODES.delete,
      displayName: 'Видалити',
      visible: user && user.id_of_expert === 0,
    },
  ]
    .filter(({ visible }) => !!visible)
    .map(({ mode, displayName }) => (
      <Form.Group>
        <Form.Check
          type='radio'
          id={mode}
          label={displayName}
          name='mode'
          onClick={() => setSelectedMode(mode)}
        />
      </Form.Group>
    ));
};
