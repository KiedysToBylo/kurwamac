import express from 'express';
import companyController from '../controllers/company-controller.js';
import PageController from '../controllers/page-controller.js';
import userController from '../controllers/user-controller.js';
import upload from '../services/uploader.js'
import CarController from '../controllers/car-controller.js'
import employeerController from '../controllers/employeer-controller.js'
import clientsController from '../controllers/clients-controller.js';
import ordersController from '../controllers/orders-controller.js'
const router = new express.Router();
// support parsing of application/json type post data
//router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
//router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', PageController.showHome)

// <------------------ all ------------------>
router.get('/zaloguj', userController.showLogin);
router.post('/zaloguj', userController.login);
router.get('/wyloguj', userController.logout);
// <------------------ admin ------------------> 
router.get('/admin/firmy', companyController.showCompanies);
router.get('/admin/firma/:name', companyController.showCompany);
// dodaj/usuń auto
router.get('/admin/firma/:name/dodaj-auto', CarController.showAddCar);
router.post('/admin/firma/:name/dodaj-auto', CarController.addCar);
router.get('/admin/firma/:name/usun-auto/:carPlats', CarController.deleteCar);
// dodaj/usuń/edytuj fracht
router.get('/admin/firma/:name/dodaj-fracht/', ordersController.showAddOrder);
router.post('/admin/firma/:name/dodaj-fracht/', ordersController.addOrder);
router.get('/admin/firma/:frachtId/edytuj-fracht/', ordersController.showEditOrder);
router.post('/admin/firma/:frachtId/edytuj-fracht/', ordersController.editOrder); 
//lista frachtów firmy
router.get('/admin/firma/:name/lista-frachtow/', ordersController.showCompanyOrders);
router.post('/admin/firma/:name/lista-frachtow/', ordersController.showCompanyOrdersForCar);
//szczegoly frachtu
router.get('/admin/firma/:name/szczegoly', ordersController.showOrdersDetails);
//lista frachtów wszystkich/trwających 
router.get('/admin/zlecenia/', ordersController.showAllOrders);
router.post('/admin/zlecenia/', ordersController.showAllOrders);
router.get('/admin/zlecenia/trwajace', ordersController.showOrdersInProgress);
router.post('/admin/zlecenia/trwajace', ordersController.setOrderStatus);
// profil
router.get('/admin/profil', userController.showProfile);
router.post('/admin/profil', userController.update);
// dodaj/usuń pracowanika
router.get('/admin/zarejestruj/:name/dodaj-pracownika', employeerController.showRegisterEmpl);
router.post('/admin/zarejestruj/:name/dodaj-pracownika', employeerController.registerEmpl);
router.get('/admin/firma/:name/usun-pracownika/:userId', employeerController.deleteEmpl);
// zarejestruj 
router.get('/admin/zarejestruj', userController.showRegister);
router.post('/admin/zarejestruj', userController.register);
// edytuj/dodaj/usuń firmę
router.post('/admin/firmy/:name/edytuj', upload.single('image'), companyController.editCompany);
router.get('/admin/firmy/:name/edytuj', companyController.showEditCompany);
router.get('/admin/firmy/dodaj', companyController.showCreateCompany);
router.post('/admin/firmy/dodaj', companyController.createCompany);
router.get('/admin/firmy/:name/usun', companyController.deleteCompany);
router.get('/admin/firmy/:name/usun-zdjecie', companyController.deleteImage);
// listy klientów
router.get('/admin/klienci', clientsController.showClients);
router.get('/admin/klienci/dodaj-klienta', clientsController.showAddClient);
router.post('/admin/klienci/dodaj-klienta', clientsController.addClient);
// strona domowa
router.get('/admin/home', PageController.showHome);

// <------------------ company ------------------> 
router.get('/company/home', PageController.showHome);

// <------------------ driver ------------------> 
router.get('/driver/home', PageController.showHome);

router.get('/csv', companyController.getCSV);

router.get('*', PageController.showNotFound);

export default router