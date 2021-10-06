class PageController {

    showHome(req, res) {
        res.render('pages/home', {
            title: 'Strona główna',
            user: req.session.user, //--> poszło? do middleware view-variables
            // req.session.user zawiera dane aktualnie zalogowanego użytkownika
            // _id i email
        });
    }

    showNotFound(req, res) {
        res.render('errors/404', {
            title: 'Nie znaleziono',
            layout: 'layouts/minimalistic',
        });
    }
}

module.exports = new PageController();
