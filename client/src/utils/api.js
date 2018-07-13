// eslint-disable-next-line
import axios from "axios";

// config.api.url
const API_BASE_URL = 'https://api.github.com/'
// localStorage[token]
const API_TOKEN = '02642d76af1dfdb75385fccfefa9113c7ec0e107'
const SIZE_PER_PAGE = 100

export const fetch = (method, path, data, params) => {
  if (!method) throw new Error('Method is a required field.')
  if (!path) throw new Error('Path is a required field.')

  console.log('API fetch', method, path, data, params)

  const options = {
    baseURL: API_BASE_URL,
    method: method.toUpperCase(),
    url: path,
    data: data || {},
    params: params || {},
    headers: {
      Authorization: `token ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }

  return axios(options)
}

export const fetchCollection = async (method, path, data, params) => {
  let page = 1
  let nextPage = true
  const collection = []

  while (nextPage) {
    try {
      // eslint-disable-line no-await-in-loop
      const req = await fetch(method, path, data, { page, per_page: SIZE_PER_PAGE })

      if (!Array.isArray(req.data)) {
        throw new Error(`The result should return an array, but returned ${typeof req.data}`)
      }

      collection.push(...req.data)
      page += 1

      if (req.data.length < SIZE_PER_PAGE) {
        nextPage = false
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  return collection
}
