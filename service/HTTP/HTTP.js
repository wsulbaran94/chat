const axios = require('axios');


const baseURL = process.env.BASE_URL;


function post (data) {
    return axios.post(`${baseURL}${data.subUrl}`, data.body, { 
        headers:  {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        return  response.data
    })
    .catch(error => {
        throw handleError(error.response.status, error.response.data)
    })
}

function get (data) {
    return axios.get(`${baseURL}${data.subUrl}`, { 
        headers:  {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        return  response.data
    })
    .catch(error => {
        throw handleError(error.response.status, error.response.data)
    })
}


function handleError (status, data) {
    if(status == 400) {
        return data
    }

    if(status == 401 || status == 403) {
        return data
    }
}

module.exports = {
    post, 
    get,
}