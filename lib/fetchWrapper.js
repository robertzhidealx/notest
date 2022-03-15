const get = async (url) => {
  const options = {
    method: 'GET',
  };
  return fetch(url, options).then(handleResponse);
};


const post = async (url, body) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  return fetch(url, options).then(handleResponse);
};

const put = async (url, body) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  return fetch(url, options).then(handleResponse);
};

const handleResponse = (res) => {
  return res.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!res.ok) {
      const error = (data && data.message) || res.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};

export const fetchWrapper = {
  get,
  post,
  put,
};
