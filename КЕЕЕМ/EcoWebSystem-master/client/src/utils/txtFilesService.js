const createDate = (dateString) => {
  const [day, month, year] = dateString.split('.');

  return new Date(year, month - 1, day);
};

const mapPlainText = (text) => {
  return text
    .split('\n')
    .filter((row) => !!row && row.length)
    .map((row) => {
      const [columnName, ...values] = row.match(/\S+/gi);
      if (columnName === 'DATE') {
        return [columnName, createDate(values[0])];
      }
      return [columnName, values.join(' ')];
    });
};

export const preparedDataPromise = async (plainText) => {
  return mapPlainText(plainText);
};
