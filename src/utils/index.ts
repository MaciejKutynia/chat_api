const generateRandomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

export const generateRandomSegment = (length: number) => {
  let segment = '';
  for (let i = 0; i < length; i++) {
    segment += generateRandomChar();
  }
  return segment;
};

export const generateUUID = (length = 4, segments = 3) => {
  let url_key = '';

  for (let i = 1; i <= segments; i++) {
    url_key += `${generateRandomSegment(length)}-`;
  }

  return url_key.slice(0, -1);
};
