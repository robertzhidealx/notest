import { fetchWrapper } from '../lib';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/notes`;

const getAll = async () => {
  return fetchWrapper.get(baseUrl, false);
};

const create = async (title, author, content, time, questions) => {
  return fetchWrapper
    .post(`${baseUrl}/create`, {
      title,
      author,
      content,
      time,
      questions,
    })
    .then((note) => note);
};

const update = async (id, title, author, content, questions) => {
  return fetchWrapper
    .put(`${baseUrl}/create`, {
      id,
      title,
      author,
      content,
      questions,
    })
    .then((note) => note);
};

export const noteService = {
  getAll,
  create,
  update,
};
