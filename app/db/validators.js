const validator = require("email-validator");

module.exports = {
    checkForbiddenString: (value, forbiddenString) => {
        if (value === forbiddenString)  {
            throw new Error('Nazwa "slug" jest zakazana')
        }
    },

    emailValidator: (email) => {
        return validator.validate(email)
    }
}


