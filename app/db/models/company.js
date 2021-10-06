const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { checkForbiddenString } = require('../validators')


// model
const companySchema =  new Schema({
    slug: {
        type: String,
        required: [true, 'pole slug jest wymagane'],
        minLength: [3, 'Slug powinien zawierać min. 3 znaki'],
        validate: value => checkForbiddenString(value, 'slug'),
        trim: true,
        //lowercase: true, - zamiast tego ustawiony setter
    },
    name: {
        type: String,
        required: [true, 'pole slug jest wymagane'],
        minLength: [3, 'Nazwa powinna zawierać min. 3 znaki'] 
    },
    employeesCount: {
        type: Number,
        min: 1,
        default: 1
    },
    user: { // będzie przechowywać id użytkownika i email
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User' // to powoduje, że pole user staje się referencją do obiektu User
        // można też zaimportować User z pliku user.js i wstawić do pola ref jako zmienną
        // następnie dodajemy pole user przy tworzeniu kolejnego rekordu firmy w createCompany
        // i przypisujemy mu wartość _id aktualnego użytkownika
    },
    image: String,
});

// setter
companySchema.path('slug').set(value => value.toLowerCase())

const Company = mongoose.model('Company', companySchema);

module.exports = Company;