const Company = require('../../db/models/company');
const fs = require('fs');


class CompanyController  {

    async showCompanies(req, res) {
        const companies = await Company.find({});
        res.status(200).json(companies)
    }

    /* dla create, edit, delete ustawiam w Postman nagłówek:
        key: Authorization,
        value: Bearer 'i podaję token' wygenerowany przez middleware
        i zapisany w bazie MongoDB
        ... to tylko jeden z wielu rodzajów autoryzacji
    */

    async createCompany(req, res) {

        const company = new Company({
            name: req.body.name,
            slug: req.body.slug,
            employeesCount: req.body.employeesCount,
            user: req.body.user,
            user: req.user._id
            //user: req.session.user._id,
        });

        try {
            await company.save();
            res.status(201).json(company);
        } catch (e) {
            res.status(422).json({errors: e.errors})
        }
    }

    async editCompany(req, res) {

        const { slug } = req.params;
        const company = await Company.findOne({ slug });
        if (req.body.name) company.name = req.body.name;
        if (req.body.slug) company.slug = req.body.slug;
        if (req.body.employeesCount) company.employeesCount = req.body.employeesCount;

        if (req.file.filename && company.image) {
            fs.unlinkSync('public/uploads/' + company.image);
        }
        if (req.file.filename) {
            company.image = req.file.filename;
        }

        try {
            await company.save();
            res.status(201).json(company);
        } catch (e) {
            res.status(422).json({
                errors: e.errors
            })
        }
    }

    async deleteCompany(req, res) {
        const { slug } = req.params;
        const company = await Company.findOne({slug});
        try {

            if (company?.image) {
                fs.unlinkSync('public/uploads/' + company.image);
            }

            await Company.deleteOne({ slug });
            //res.status(204).send(); // send a nie json bo nic nie przekazuję
            //lub...
            res.sendStatus(204);
        } catch(e) {
            /* res.status(422).send({
                errors: 'Coś poszło nie tak'
            }) */
        }
    }
}

module.exports = new CompanyController();