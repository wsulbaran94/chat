const { get } = require("../HTTP/HTTP");


function verifyToken (token) {
    const data = {
        subUrl:`auth/verify-token/${token}`,
    }
    return get(data)
        .then(response => {
            return response;
        })
        .catch(error => {
            throw error
        })
}

module.exports = {
    verifyToken
}