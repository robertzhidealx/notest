const _eval = (exp) => {
  const { type, value } = exp;
  switch (type) {
    case 'string':
      return value;
    case 'question':
      return _eval(value);
    case 'answer':
      return _eval(value);
    default:
  }
};

// console.log(
//   _eval({ type: 'question', value: { type: 'question', value: {type: 'string', value: 'hello world'} } })
// );

export const interpreter = { eval: _eval };
