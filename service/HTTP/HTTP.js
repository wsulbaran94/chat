const axios = require('axios');


const baseURL = `${process.env.URL}:${process.env.API_PORT}/`;

axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json'}
})

function post (data) {
    return axios({
        method:'post',
        url:data.subUrl,
        data: data.body,
        headers: (data.headers) ? data.headers : ''
    })
    .then((response) => {
        return  response.data
    })
    .catch(error => {
        throw handleError(error.response.status, error.response.data)
    })
}

function get (data) {
    return axios({
        method:'get',
        url:data.subUrl,
        headers: (data.headers) ? data.headers : ''
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
    get
}