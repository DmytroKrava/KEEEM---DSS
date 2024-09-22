import {
  ELEMENTS_URL,
  GDK_URL,
  ENVIRONMENTS_URL,
  TYPE_OF_OBJECT_URL,
  TAX_VALUES_URL,
  TABLE_NAMES,
} from './constants';

export const URL_FROM_TABLE_NAME_MAP = new Map([
  [TABLE_NAMES.elements, ELEMENTS_URL],
  [TABLE_NAMES.gdk, GDK_URL],
  [TABLE_NAMES.environment, ENVIRONMENTS_URL],
  [TABLE_NAMES.type_of_object, TYPE_OF_OBJECT_URL],
  [TABLE_NAMES.tax_values, TAX_VALUES_URL],
]);
