import {extname} from 'path';
export const fileFilter = (req,file, callback) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/)){
      return callback(new Error('only image file are allowed'))
  }
  callback(null, true);
};

export const editFile = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
