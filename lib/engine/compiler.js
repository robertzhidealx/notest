const parse = (s) => {
  s = s.trim();
  const n = s.length;
  if (s[0] === '{' && s[1] === '{' && s[n - 2] === '}' && s[n - 1] === '}')
    return {
      type: 'question',
      value: { type: 'string', value: s.slice(2, n - 2) },
    };
  if (s[0] === '(' && s[1] === '(' && s[n - 2] === ')' && s[n - 1] === ')')
    return {
      type: 'answer',
      value: { type: 'string', value: s.slice(2, n - 2) },
    };

  return { type: 'string', value: s };
};

export const compiler = { parse };
