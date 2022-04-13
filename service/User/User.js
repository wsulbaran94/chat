const { post } = require('../HTTP/HTTP')
import { useRouter } from 'next/router';

import { alertService } from '../Alert/Alert';

function register (form) {
    const data = {
        body: form,
        subUrl: 'auth/register'
    };

    return post(data)
    .then(response => {
        if (response.data[0]) {
            return response.data;
        }
    })
    .catch(error => {
        alertService.error(error.data[1], { id: 'right-alert' });
    })
}

function login (form) {
    const data = {
        body: form,
        subUrl: 'auth/login'
    };

    return post(data)
    .then(response => {
        if (response.data[0]) {
            localStorage.setItem('user', JSON.stringify(response));
            return response;     
        }
    })
    .catch(error => {
        console.log(error);
        alertService.error(error.data[1]);
    })
}

function logout() {
    const router = useRouter();

    localStorage.removeItem('user');
    router.push('login');
}

module.exports = {
    login,
    logout,
    register
}