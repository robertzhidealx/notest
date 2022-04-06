import { compiler } from '../engine/compiler';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialBlock = {
  id: uid(),
  tag: 'p',
  raw: 'Start writing here...',
  html: 'Start writing here...',
  ast: compiler.parse('Start writing here...'),
};

export { initialBlock };
