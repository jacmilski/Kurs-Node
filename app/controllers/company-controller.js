const Company = require('../db/models/company');
const fs = require('fs');
// z biblioteki json2csv pobieram tylko Parser
const { Parser } = require('json2csv');

class CompanyController  {

    // wyświetlanie listy firm
    async showCompanies(req, res) {
            const { q, sort, countmin, countmax } = req.query;
            //const companies = await Company.find({});
            //const filtered = await companies.filter(company => company.slug.includes(q.toLowerCase()))
            // lub...
            const page = req.query.page || 1;
            const perPage = 4;

            const where = {};

            // searching
            if (q) {
                where.name = { $regex: q, $options: 'i'};
            }
            // filtering
            if (countmin || countmax) {
                where.employeesCount = {};
                if (countmin) where.employeesCount.$gte = countmin;
                if (countmax) where.employeesCount.$lte = countmax;
            }

            let query = Company.find(where);

            // pagination
            query = query.skip((page - 1) * perPage)
            query = query.limit(perPage);

            // sorting
            if (sort) {
                let s = sort.split('|');
                query = query.sort({ [s[0]]: s[1] })
            }

            // exec
            const companies = await query.populate('user').exec();
            // populate('user') - przy pobieraniu firm wypełnij pole user w userSchema
            const resultsCount = await Company.find(where).count();
            const pagesCount = Math.ceil(resultsCount / perPage);

            res.render('pages/companies/companies', {
               //companies: filtered,
                companies,
                page,
                pagesCount,
                resultsCount,
            })
    }

    // wyświetlanie zapisanej firmy
    async showCompany(req, res) {
        const { name } = req.params;

        const company = await Company.findOne({slug: name});

        res.render(`pages/companies/company`, {
            name: company?.name,
            title: company?.name ?? 'Brak wyników',
        })
    }

    // wyświetlanie formularza do dodawania firmy
    showCreateCompanyForm(req, res) {
        res.render('pages/companies/create')
    }

    // tworzenie nowego rekordu firmy
    async createCompany(req, res) {

        const company = new Company({
            name: req.body.name,
            slug: req.body.slug,
            employeesCount: req.body.employeesCount,
            user: req.session.user._id,
        });

        try {
            await company.save();
            res.redirect('/firmy');
        } catch (e) {
            res.render('pages/companies/create', {
                errors: e.errors,
                form: req.body,
            })
        }
    }

    // wyświetlenie firmy do edycji
    async showEditCompanyForm(req, res) {
        const { name } = req.params;
        const company = await Company.findOne({ slug: name})
        res.render('pages/companies/edit', {
            form:  company,
        })
    }

    // edytowanie firmy
    async editCompany(req, res) {

        const { name } = req.params;
        const company = await Company.findOne({ slug: name });
        company.name = req.body.name;
        company.slug = req.body.slug;
        company.employeesCount = req.body.employeesCount;

        try {

        if (req.file.filename && company.image) {
            fs.unlinkSync('public/uploads/' + company.image);
        }
        if (req.file.filename) {
            company.image = req.file.filename;
        }


            await company.save();
            res.redirect('/firmy');
        } catch (e) {
            res.render('pages/companies/edit', {
                errors: e.errors,
                form: req.body,
            })
        }
    }

    // usuwanie firmy
    async deleteCompany(req, res) {
        const { name } = req.params;
        const company = await Company.findOne({slug: name})

        try {

        if (company.image) {
            fs.unlinkSync('public/uploads/' + company.image);
        }

            await Company.deleteOne({ slug: name });
            res.redirect('/firmy')
        } catch(e) {
            console.log(e.errors)
        }
    }

    // usuwanie zdjęcia
    async deleteImage(req, res) {
        const { name } = req.params;
        const company = await Company.findOne({slug: name});

        try {
            fs.unlinkSync('public/uploads/' + company.image) // usunięcie pliku z folderu
            // podaję tylko ścieżkę - złączenie folderów i nazwy pliku
            company.image = ''; // usunięcie pliku z bazy
            await company.save();

            res.redirect('/firmy');
        } catch(e) {
            console.log('Oj, chyba nie ma takiego pliku...')
        }
    }

    // generowanie pliku csv z wykorzystaniem biblioteki json2csv
    async getCSV(req, res) {
        // formatka pliku csv
        const fields = [
            {
                label: 'Nazwa',
                value: 'name', // wartości będą pobierane wg nazw pól w rekordach bazy
            },
            {
                label: 'URL',
                value: 'slug',
            },
            {
                label: 'L. pracowników',
                value: 'employeesCount',
            }
        ];

        const data = await Company.find({});
        const fileName = 'companies.csv'; // jak się będzie nazywał plik wyjściowy
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);

        //to co poniżej jest z express'a
        res.header('Content-Type', 'text/csv') // informuję przeglądarkę, że to co poniżej wysyłam jest
        //w odpowiednim formacie
        res.attachment(fileName);
        res.send(csv);
    }

}

module.exports = new CompanyController();