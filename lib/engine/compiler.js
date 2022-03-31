const parse = (s) => {
  const regex = /^(\{\{([^{}()]*)\}\}\(\(([^{}()]*)\)\))$/;
  const matches = s.match(regex);

  if (matches)
    return {
      type: 'qa',
      value: {
        q: {
          type: 'question',
          value: {
            type: 'string',
            value: matches[2],
          },
        },
        a: {
          type: 'answer',
          value: {
            type: 'string',
            value: matches[3],
          },
        },
      },
    };

  return { type: 'string', value: s };
};

export const compiler = { parse };
