

const dev = process.env.NODE_ENV !== 'production';
module.exports = {
    env: {
        BASE_URL: dev ? 'http://localhost:4000/' : 'https://tecnical-test-rv.herokuapp.com/',
        API_KEY_GIPHY: "21W55uc1dqNobqkOtluZMLGnvA2hXAyN"
    }
}