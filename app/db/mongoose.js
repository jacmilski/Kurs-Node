const mongoose = require('mongoose');
const { database } = require('../config.js')

mongoose.connect(database, {})

// do przeniesienia
const Company = require('./models/company')

/* async function main() {

    //const companies = await Company.find({});
    //console.log(companies)
    const company = new Company({
        name: "OktaBest",
        slug: '   OktaBest  ',
        //employeesCount: 0
    });
    //console.log(company)
    //Company.insertMany(company) lub...
    try {
        //await company.save();
        const res = await Company.find({});
        console.log(res)
    } catch (e) {
        console.log('coś poszło nie tak');
        for (let key in e.errors) {
            console.log(e.errors[key].message);
        }
    }
}
main() */



    
