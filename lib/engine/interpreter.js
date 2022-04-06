const _eval = (exp) => {
  const { type, value } = exp;
  switch (type) {
    case 'string':
      return value;
    case 'question':
      return value;
    case 'answer':
      return value;
    case 'qa':
      return value;
  }
};

const print = (exp) => {
  const value = _eval(exp);
  switch (exp.type) {
    case 'string':
      return value;
    case 'question':
      return print(value);
    case 'answer':
      return print(value);
    case 'qa':
      return `
        <div style="display: flex; flex-direction: row; height: 22px; align-items: center; column-gap: 3px"><div style="font-size: 0.75rem; line-height: 1rem; font-weight: 500; color: rgb(234 88 12); border-color: rgb(234 88 12); border-width: 1.5px; padding: 1px; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem; height: 15px; width: 15px;">Q</div><p style="margin-bottom: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${print(
          value.q
        )}</p></div>
        <div style="display: flex; flex-direction: row; align-items: center; height: 22px; column-gap: 3px"><div style="font-size: 0.75rem; line-height: 1rem; font-weight: 500; color: rgb(2 132 199); border-color: rgb(2 132 199); border-width: 1.5px; padding: 1px; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem; height: 15px; width: 15px;">A</div><p style="margin-bottom: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${print(
          value.a
        )}</p></div>
      `;
  }
};

export const interpreter = { eval: _eval, print };
