export const uploadedFileTypes = {
  txt: 'txt',
  xlsx: 'xlsx',
};

const excelTypes = {
  acceptString:
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  extension: uploadedFileTypes.xlsx,
};

const txtTypes = {
  acceptString: 'text/plain',
  extension: uploadedFileTypes.txt,
};

const txtComparer = (fileExtension, type) =>
  fileExtension.toLowerCase() === uploadedFileTypes.txt.toLowerCase() &&
  txtTypes.acceptString.includes(type);

const excelComparer = (fileExtension, type) =>
  fileExtension.toLowerCase() === uploadedFileTypes.xlsx.toLowerCase() &&
  excelTypes.acceptString.includes(type);

export const getUploadedFileType = (file) => {
  const { type, name } = file;

  const fileExtension = name.split('.').slice(-1)[0];

  if (txtComparer(fileExtension, type)) {
    return uploadedFileTypes.txt;
  }

  if (excelComparer(fileExtension, type)) {
    return uploadedFileTypes.xlsx;
  }

  throw new Error('Неправильний тип файлу');
};
