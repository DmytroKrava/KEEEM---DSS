export const LOGIN_URL = '/login';
export const POLYGONS_URL = '/polygons';
export const POLYGON_URL = '/polygon';
export const REGIONS_URL = '/regions';
export const POINTS_URL = '/points';
export const POINT_URL = '/point';
export const TYPE_OF_OBJECT_URL = '/typeofobjects';
export const EXPERTS_URL = '/experts';
export const ENVIRONMENTS_URL = '/environments';
export const ELEMENTS_URL = '/elements';
export const GDK_URL = '/gdk';
export const GDK_FIND_URL = '/gdk/find';
export const EMISSIONS_CALCULATIONS_URL = '/emissionscalculations';
export const OWNER_TYPES_URL = '/ownertypes';
export const TAX_VALUES_URL = '/taxvalues';
export const COMPARE_EMISSIONS = '/compareEmissions';
export const TASK_URL = '/tasks';
export const TUBE_URl = '/tube';
export const FORMULA_CALCULATIONS_URL = '/getcalculationsinfo';
export const GET_POSSIBLE_ISSUES = '/issuegetter';
export const ADVANCED_POINTS_URL = '/advancedpoints';
export const ADVANCED_POLYGONS_URL = '/advancedpolygons';

export const GET_PARAMS_URL = '/getParams';
export const GET_MED_STAT_BY_PARAMS = '/getMedStatByParams';
export const GET_MED_STAT_VALUES = '/getMedStatValues';

// export const AGES_URL = '/ages';

export const MAP_CENTER_COORDS = [49.0139, 31.2858];
export const OPEN_STREET_MAP_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

export const TABLE_NAMES = {
  elements: 'elements',
  gdk: 'gdk',
  environment: 'environment',
  type_of_object: 'type_of_object',
  tax_values: 'tax_values',
};

export const DICTIONARY_MODES = {
  search: 'search',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
};

export const getLegendDescription = (type, envId) => {
  return {
    points: {
      1: 'Розрахунок забруднення атмосфери',
      2: 'Розрахунок забруднення питної води',
      3: 'Розрахунок забруднення технічної води',
      4: 'Розрахунок забруднення грунтів',
      5: 'Розрахунок забруднення господарських грунтів',
      6: 'Розрахунок забруднення поверхневих вод',
      8: 'Розрахунок забруднення стратосфери',
    },
    region: {
      1: 'Комплексний індекс забруднення атмосфери',
      2: 'Індекс забрудненості питної води',
      3: 'Індекс забрудненості технічної води',
      4: 'Розрахунок забруднення грунтів',
      5: 'Розрахунок забруднення господарських грунтів',
      6: 'Індекс забрудненості поверхневих вод',
      8: 'Розрахунок забруднення стратосфери',
    },
  }[type][envId];
};

export const DENGEROUS_LVL_DEFAULT = [
  {
    lvl: 1,
    min: -Infinity,
    max: 1.5,
    color: '#51e459',
  },
  {
    lvl: 2,
    min: 1.5,
    max: 2,
    color: 'darkgreen',
  },
  {
    lvl: 3,
    min: 2,
    max: 2.5,
    color: '#e4ed37',
  },
  {
    lvl: 4,
    min: 2.5,
    max: 3,
    color: '#FFAA00',
  },
  {
    lvl: 5,
    min: 3,
    max: Infinity,
    color: '#DB4437',
  },
];

export const DENGEROUS_LVL_ATMOSPHERE = [
  {
    lvl: 1,
    min: -Infinity,
    max: 2.5,
    color: '#51e459',
  },
  {
    lvl: 2,
    min: 2.5,
    max: 7.5,
    color: 'darkgreen',
  },
  {
    lvl: 3,
    min: 7.5,
    max: 12.5,
    color: '#e4ed37',
  },
  {
    lvl: 4,
    min: 12.5,
    max: 22.5,
    color: '#FFAA00',
  },
  {
    lvl: 5,
    min: 22.5,
    max: 52.5,
    color: '#E88617',
  },
  {
    lvl: 6,
    min: 52.5,
    max: Infinity,
    color: '#DB4437',
  },
];

export const DENGEROUS_LVL_WATER = [
  {
    lvl: 1,
    min: -Infinity,
    max: 0.2,
    color: '#51e459',
  },
  {
    lvl: 2,
    min: 0.2,
    max: 1,
    color: 'darkgreen',
  },
  {
    lvl: 3,
    min: 1,
    max: 2,
    color: '#e4ed37',
  },
  {
    lvl: 4,
    min: 2,
    max: 4,
    color: '#858a21',
  },
  {
    lvl: 5,
    min: 4,
    max: 6,
    color: '#FFAA00',
  },
  {
    lvl: 6,
    min: 6,
    max: 10,
    color: '#E88617',
  },
  {
    lvl: 7,
    min: 10,
    max: Infinity,
    color: '#DB4437',
  },
];

export const DENGEROUS_LVL_POINT = [
  {
    lvl: 1,
    min: 1,
    max: 1.5,
    color: 'rgba(0, 200, 0, 1)',
  },
  {
    lvl: 2,
    min: 1.5,
    max: 2,
    color: 'rgba(0, 110, 0, 1)',
  },
  {
    lvl: 3,
    min: 2,
    max: 2.5,
    color: 'rgba(255, 255, 102,1)',
  },
  {
    lvl: 4,
    min: 2.5,
    max: 3,
    color: 'rgba(179, 179, 0,1)',
  },
  {
    lvl: 5,
    min: 3,
    max: Infinity,
    color: 'rgba(242, 54, 7, 1)',
  },
];

export const getDataForLegendPoint = (idEnvironment) => {
  return {
    1: DENGEROUS_LVL_POINT,
    2: DENGEROUS_LVL_POINT,
    3: DENGEROUS_LVL_POINT,
    4: DENGEROUS_LVL_POINT,
    5: DENGEROUS_LVL_POINT,
    6: DENGEROUS_LVL_POINT,
    8: DENGEROUS_LVL_POINT,
  }[idEnvironment];
};

export const getDataForLegendRegion = (idEnvironment) => {
  return {
    1: DENGEROUS_LVL_ATMOSPHERE,
    2: DENGEROUS_LVL_WATER,
    3: DENGEROUS_LVL_WATER,
    4: DENGEROUS_LVL_DEFAULT,
    5: DENGEROUS_LVL_DEFAULT,
    6: DENGEROUS_LVL_WATER,
    8: DENGEROUS_LVL_DEFAULT,
  }[idEnvironment];
};
