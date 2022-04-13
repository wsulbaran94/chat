const User = require("../../model/User");


function create (data) {
    return User.create(data)
        .then((user) => {
            return [true, 'Success Register!!!']
        })
        .catch((error) => {
            if (error.code == 11000) return [false, `User ${data.nickname} exists...!`]
            return [false, error]
        })
}

function find (filter) {
    return User.findOne(filter)
    .then((user) => {
        return user;
    })
    .catch((error) => {
        return [false, error]
    })
}


module.exports = {
    create,
    find
}