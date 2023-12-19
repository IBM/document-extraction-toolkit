// import jsonServerProvider from "ra-data-json-server";
// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');



import postgrestRestProvider from '@bobfang/ra-data-postgrest'
import { serialize } from 'object-to-formdata'
import {fetchUtils} from 'react-admin'

const httpClient = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }
  const { access_token } = JSON.parse(localStorage.getItem('token'));
  //console.log(`using token ${access_token}`)
  if (access_token) {
    options.headers.set('Authorization', `Bearer ${access_token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

// point to API server
const dataProvider = postgrestRestProvider('/api', httpClient)

const transformData = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const keys = Object.keys(data)

  if (keys.length === 0) {
    return data
  }

  if (keys.includes('rawFile') && data.rawFile instanceof File) {
    return data.rawFile
  } else {
    const output = Array.isArray(data) ? [] : {}
    keys.forEach((key) => {
      output[key] = transformData(data[key])
    })
    return output
  }
}

const transformDataFiles = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const keys = Object.keys(data)

  if (keys.length === 0) {
    return data
  }

  if (keys.includes('rawFile') && data.rawFile instanceof File) {
    const reader = new FileReader()
    return reader.readAsDataURL(data.rawFile)
  } else {
    const output = Array.isArray(data) ? [] : {}
    keys.forEach((key) => {
      output[key] = transformData(data[key])
    })
    return output
  }
}

const myDataProvider = {
  ...dataProvider,
  create: (resource, params) => {
    switch (resource) {
      case 'documents':
        console.log('converting params.data to FormData')
        return dataProvider.create(resource, { ...params, data: serialize(transformData(params.data)) })
      default:
        return dataProvider.create(resource, params)
    }
  },
}

export default myDataProvider


//export default dataProvider
