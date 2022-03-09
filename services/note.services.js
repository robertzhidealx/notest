import { fetchWrapper, openai } from '../lib';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/notes`;

const getAll = async () => {
  return fetchWrapper.get(baseUrl, false);
};

const getId = async (id) => {
  return fetchWrapper.getSpecificId(baseUrl + '/' + id);
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

const generateQuestions = async (prompt, context, temperature) => {
  const response = await openai.createCompletion('text-davinci-001', {
    prompt: `${prompt}${context}`,
    temperature, // randomness of the response -- level of unpredicability
    max_tokens: 100, // number of words returned
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = response.data.choices[0].text;
  const strs = text.split('\n').filter((s) => s.length);
  return strs;
};

export const noteService = {
  getAll,
  create,
  update,
  getId,
  generateQuestions,
};
