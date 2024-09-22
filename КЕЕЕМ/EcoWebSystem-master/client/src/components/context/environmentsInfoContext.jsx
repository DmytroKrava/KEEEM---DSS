import React, { createContext } from 'react';

export const environmentsInfoInitialState = {
  selected: null,
  environments: [],
};

export const EnvironmentsInfoContext = createContext(
  environmentsInfoInitialState
);
