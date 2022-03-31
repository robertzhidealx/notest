import { compiler } from '../../lib/engine/compiler';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialBlock = {
  id: uid(),
  tag: 'p',
  raw: '',
  html: '',
  ast: compiler.parse(''),
};

export { initialBlock };
