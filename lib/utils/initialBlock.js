import { compiler } from '../engine/compiler';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialBlock = {
  id: uid(),
  tag: 'p',
  raw: '',
  html: '<p style="color: rgb(148 163 184); margin-bottom: 0px;">Start writing here...</p>',
  ast: compiler.parse(''),
};

export { initialBlock };
