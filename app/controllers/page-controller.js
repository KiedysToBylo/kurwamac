class PageController {
    // strona główna
    showHome(req, res){
        res.render('pages/home', {
            title: 'Strona Główna',
        });
    }
    // 404
    showNotFound(req, res){
        res.render('errors/404',{
            title: "Nie znaleziono!",
            layout: '../views/layouts/minimalistics.ejs'
        })
    }
}
export default new PageController();