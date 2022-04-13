

const dev = process.env.NODE_ENV !== 'production';
module.exports = {
    env: {
        BASE_URL: dev ? 'http://localhost:5000/' : 'https://test-tecnical-red-valley.herokuapp.com/',
        API_KEY_GIPHY: "21W55uc1dqNobqkOtluZMLGnvA2hXAyN"
    },
    webpack: config => {
        config.optimization.minimize = false;        
        return config;
    }

}