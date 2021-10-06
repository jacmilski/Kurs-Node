const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { emailValidator } = require('../validators');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');


const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        lowercase: true,
        trim: true,
        unique: true,
        validate: [emailValidator, 'Email nieprawidłowy'],
    },
    password: {
        type: String,
        required: [true, 'Hasło jest wymagane'],
        minLength: [4, 'Hasło powinno posiadać min. 4 znaki']
    },
    firstName: String,
    lastName: String,
    apiToken: String, // token jest stały, nie zmienia się
    // można zastosować paczkę jsonwebtoken opartą też na bearer token rozszerzającą bezpieczeństwo
    // żeby sprawić żeby aplikacja była mniej podatna na ataki można zastosować paczkę Helmet -
    // - to middleware, który zawiera w sobie 15 innych middleware
});
//poniższe haszowanie jako synchroniczne wykona się zanim dokona się validacja (asynchroniczna),
// więc nie ma to sensu 
//userSchema.path('password').set( (val) => {
//    const salt = bcrypt.genSaltSync(10);
//    const hash = bcrypt.hashSync(val, salt);
//    return hash;
//});

userSchema.pre('save', function(next) {
    const user = this;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});

userSchema.pre('save', function(next) {
    const user = this;
    if (user.isNew) { //isNew to specjalne pole dodawane przez mongoose
        user.apiToken = randomstring.generate(20); 
        // token będzie tworzony tylko raz przy rejestracji profilu
    }
    next()
})

userSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        error.errors = { email: { message: 'Email jest już zajęty'}}
    }
    next(error);
});

userSchema.methods =  {
    comparePassword(password) {
        //console.log(this) // this wskazuje obiekt user
        return bcrypt.compareSync(password, this.password)
    }
}

// wirtualna nazwa użytkownika
userSchema.virtual('fullName').get(function() {
    //return `${this.firstName || 'Imię/'} ${this.lastName ? this.lastName[0] : 'N'}.`
    return `${this.firstName || ''} ${this.lastName[0] || ''}.`
}); // tworzy wirtualną nazwę pola w modelu o nazwie fullName

const User = mongoose.model('User', userSchema);

module.exports = User;