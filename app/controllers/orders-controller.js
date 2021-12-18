import Orders from '../db/models/orders.js'
import User from '../db/models/user.js'
import Car from '../db/models/car.js'
import Client from '../db/models/clients.js'
import Company from '../db/models/company.js'
class ordersController{
  //pokaż zlecenia
    async showCompanyOrders(req, res){
      const {name} = req.params;
      const d = new Date();
      let day = d.getDate()
      let month= d.getMonth()+1
      let year= d.getFullYear()
      if(day < 10) day = "0"+day
      let date = year+"-"+month+"-01"
      let dateNow = year+"-"+month+"-"+day
      const company = await Company.findOne({companyId:name})
      const companyOrders = await Orders.find({$and:[{orderMembership:name}, {orderTakeDate: {$gte:date}}, {orderTakeDate: {$lte:dateNow}}]})
      const cars = await Car.find({carID:name})
    // <-- sumowanie cen -->
      const [priceSumEuro] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$price" } } }
      ]);
      const [priceSumPln] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$price" } } }
      ]);
    // <-- sumowanie kilometrów EUR -->
      const [emptySumKmEur] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'EUR'},  {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      const [fullSumKmEur] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$fullKM" } } }
      ]);
      let ekeur = emptySumKmEur?.total
      ekeur = parseFloat(ekeur)
      let fkeur = fullSumKmEur?.total
      fkeur = parseFloat(fkeur)

      let allKmEur =ekeur+fkeur
    // <-- sumowanie kilometrów PLN -->
      const [emptySumKmPln] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      const [fullSumKmPln] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'PLN'},  {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      let ekpln = emptySumKmPln?.total
      ekpln = parseFloat(ekpln)
      let fkpln = fullSumKmPln?.total
      fkpln = parseFloat(fkpln)

      let allKmPln =ekpln+fkpln
    // <-- średnie stawki EUR-->
      let srFullEur = priceSumEuro?.total / fkeur
      srFullEur = Math.round(srFullEur * 1000) / 1000
      let srAllEur = priceSumEuro?.total / allKmEur
      srAllEur = Math.round(srAllEur * 1000) / 1000
    // <-- średnie stawki PLN-->
      let srFullPln = priceSumPln?.total / fkpln
      srFullPln = Math.round(srFullPln * 1000) / 1000
      let srAllPln = priceSumPln?.total / allKmPln
      srAllPln = Math.round(srAllPln * 1000) / 1000
    // <-- sumowanie prowizji EUR/PLN -->
      const [sumCommisionEur] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$commision" } } }
      ]);
      const [sumCommisionPln] = await Orders.aggregate([
        {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$commision" } } }
      ]);

      res.render('pages/orders/showCompanyOrders.ejs', {
        companyOrders,
        company,
        priceSumEuro,
        priceSumPln,
        emptySumKmEur,
        emptySumKmPln,
        fullSumKmEur,
        fullSumKmPln,
        allKmEur,
        allKmPln,
        srFullEur,
        srAllEur,
        srFullPln,
        srAllPln,
        sumCommisionEur,
        sumCommisionPln,
        cars,
        carForOrder:false,
        date,
        dateNow,
        sorting:false,
     });
    }
  //pokaż zlecenie dla samochodu
  async showCompanyOrdersForCar(req, res){
    
    const {name} = req.params;
    let car = req.body.car;
    let date= req.body.fromDate
    let dateNow= req.body.toDate
    const company = await Company.findOne({companyId:name })
    const companyOrders = await Orders.find({$and:[ {orderMembership:name}, {carForOrder:car}, {orderTakeDate:{$gte:date}}, {orderTakeDate: {$lte:dateNow}}]})
    const cars = await Car.find({carID:name})
  // <-- sumowanie cen -->
    const [priceSumEuro] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$price" } } }
    ]);
    const [priceSumPln] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$price" } } }
    ]);
  // <-- sumowanie kilometrów EUR -->
    const [emptySumKmEur] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$emptyKM" } } }
    ]);
    const [fullSumKmEur] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$fullKM" } } }
    ]);
    let ekeur = emptySumKmEur?.total
    ekeur = parseFloat(ekeur)
    let fkeur = fullSumKmEur?.total
    fkeur = parseFloat(fkeur)

    let allKmEur =ekeur+fkeur
  // <-- sumowanie kilometrów PLN -->
    const [emptySumKmPln] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$emptyKM" } } }
    ]);
    const [fullSumKmPln] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$emptyKM" } } }
    ]);
    let ekpln = emptySumKmPln?.total
    ekpln = parseFloat(ekpln)
    let fkpln = fullSumKmPln?.total
    fkpln = parseFloat(fkpln)

    let allKmPln =ekpln+fkpln
  // <-- średnie stawki EUR-->
    let srFullEur = priceSumEuro?.total / fkeur
    srFullEur = Math.round(srFullEur * 1000) / 1000
    let srAllEur = priceSumEuro?.total / allKmEur
    srAllEur = Math.round(srAllEur * 1000) / 1000
  // <-- średnie stawki PLN-->
    let srFullPln = priceSumPln?.total / fkpln
    srFullPln = Math.round(srFullPln * 1000) / 1000
    let srAllPln = priceSumPln?.total / allKmPln
    srAllPln = Math.round(srAllPln * 1000) / 1000
  // <-- sumowanie prowizji EUR/PLN -->
    const [sumCommisionEur] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'EUR'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$commision" } } }
    ]);
    const [sumCommisionPln] = await Orders.aggregate([
      {$match : {$and:[  {orderMembership:name}, {currency:'PLN'}, {carForOrder:car}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
      {$group : { _id : null, total : { $sum : "$commision" } } }
    ]);

    res.render('pages/orders/showCompanyOrders.ejs', {
      companyOrders,
      company,
      priceSumEuro,
      priceSumPln,
      emptySumKmEur,
      emptySumKmPln,
      fullSumKmEur,
      fullSumKmPln,
      allKmEur,
      allKmPln,
      srFullEur,
      srAllEur,
      srFullPln,
      srAllPln,
      sumCommisionEur,
      sumCommisionPln,
      cars,
      carForOrder:req.body.car,
      date:req.body.fromDate,
      dateNow:req.body.toDate,
      sorting:true,
   });
  }
  //pokaż dodaj zlecenie
    async showAddOrder(req,res){
        const {name} = req.params;
        const clients = await Client.find({});
        const users = await User.find({userMembership:name});
        const cars = await Car.find({carID:name});
        const carrier = await Company.findOne({companyId:name});
        res.render('pages/orders/addOrder.ejs', {
            clients,
            users,
            cars,
            carrier,
         });
    }
  //pokaż edytuj zlecenie
    async showEditOrder(req,res){
      const {frachtId} = req.params;
      const clients = await Client.find({});
      const order = await Orders.findOne({_id:frachtId})
      const membership = order.orderMembership
      const users = await User.find({userMembership:membership});
      const cars = await Car.find({carID:membership});
      const carrier = await Company.findOne({companyId:membership});
      res.render('pages/orders/editorder.ejs', {
        order,
        clients,
        users,
        carrier,
        cars,
     });
    }
  //edytuj zlecenie
  async editOrder(req,res){
    const {frachtId}=req.params;
    const clients = await Client.find({});
    const order = await Orders.findOne({_id:frachtId})
    const membership = order.orderMembership
    const users = await User.find({userMembership:membership});
    const cars = await Car.find({carID:membership});
    const carrier = await Company.findOne({companyId:membership});
        // obliczenia
        let emptykilometers = req.body.emptyKM
        emptykilometers = parseFloat(emptykilometers)

        let fullkilometers = req.body.fullKM
        fullkilometers = parseFloat(fullkilometers)

        let averageForFullKm = req.body.price / req.body.fullKM
        averageForFullKm = Math.round(averageForFullKm * 1000) / 1000

        const allkm = emptykilometers + fullkilometers;
        let averageForAllKm = req.body.price / allkm;
        averageForAllKm = Math.round(averageForAllKm * 1000) / 1000

        let commision = req.body.price * req.body.interest;
        commision = Math.round(commision * 1000) / 1000

          order.orderClient= req.body.orderClient
          order.currency= req.body.currency
          order.carForOrder= req.body.carForOrder
          order.interest= req.body.interest
          order.driver= req.body.driver
          order.orderNumber= req.body.orderNumber
          order.contaktPersonEmail= req.body.contaktPersonEmail
          order.emptyKM= req.body.emptyKM
          order.fullKM= req.body.fullKM
          order.loadingDate= req.body.loadingDate
          order.unloadingDate= req.body.unloadingDate
          order.price= req.body.price
          order.cargo= req.body.cargo
          order.allKM=allkm
          order.commision=commision
          order.loadingAdress={
              lAdress:req.body.lAdress,
              lPostCode:req.body.lPostCode,
          }
          order.unloadingAdress={
              uAdress:req.body.uAdress,
              uPostCode:req.body.uPostCode,
          }
          order.averageForFullKm=averageForFullKm
          order.averageForAllKm=averageForAllKm
          try {
            await order.save();
            res.redirect("/admin/firma/"+membership+"/lista-frachtow");
          } catch (e) {
            console.log('jakiś błąd')
            res.render("pages/orders/editorder.ejs", {
              errors: e.errors,
              order:order,
              carrier:carrier,
              clients:clients,
              cars:cars,
              users:users,
            });
            console.log(e.errors)
          }
        }
  //dodaj zlecenie
    async addOrder(req,res){
            //wyjęcie z bazy
            const clients = await Client.find({})
            const cars = await Car.find({carID:req.body.companyId})
            const users = await User.find({userMembership:req.body.companyId})
            const company = await Company.findOne({companyId: req.body.companyId})
            // obliczenia
            let emptykilometers = req.body.emptyKM
            emptykilometers = parseFloat(emptykilometers)

            let fullkilometers = req.body.fullKM
            fullkilometers = parseFloat(fullkilometers)

            let averageForFullKm = req.body.price / req.body.fullKM
            averageForFullKm = Math.round(averageForFullKm * 1000) / 1000

            const allkm = emptykilometers + fullkilometers;
            let averageForAllKm = req.body.price / allkm;
            averageForAllKm = Math.round(averageForAllKm * 1000) / 1000

            let commision = req.body.price * req.body.interest;
            commision = Math.round(commision * 1000) / 1000
            //pobieranie daty
            const d = new Date();
            let day = d.getUTCDate()
            let month = d.getMonth()+1
            let year = d.getUTCFullYear();
            const date = year+"-"+month+"-"+day
            //kreowanie obiektu
            const order = new Orders({
                orderClient: req.body.orderClient,
                currency: req.body.currency,
                carForOrder: req.body.carForOrder,
                interest: req.body.interest,
                driver: req.body.driver,
                orderNumber: req.body.orderNumber,
                contaktPersonEmail: req.body.contaktPersonEmail,
                emptyKM: req.body.emptyKM,
                fullKM: req.body.fullKM,
                loadingDate: req.body.loadingDate,
                unloadingDate: req.body.unloadingDate,
                price: req.body.price,
                cargo: req.body.cargo,
                allKM:allkm,
                commision:commision,
                orderMembership:company.companyId,
                orderTakeDate:date,
                loadingAdress:{
                    lAdress:req.body.lAdress,
                    lPostCode:req.body.lPostCode,
                },
                unloadingAdress:{
                    uAdress:req.body.uAdress,
                    uPostCode:req.body.uPostCode,
                },
                averageForFullKm:averageForFullKm,
                averageForAllKm:averageForAllKm,
              });
              try {
                await order.save();
                res.redirect("/admin/firma/"+req.body.companyId+"/lista-frachtow");
              } catch (e) {
                console.log(e),
                console.log("jakiś błąd")
                res.render("pages/orders/addOrder.ejs", {
                  errors: e.errors,
                  form: req.body,
                  carrier:company,
                  clients:clients,
                  cars:cars,
                  users:users,
                });
              }
    }
    async showAllOrders(req, res){
     
      const d = new Date();
      let day = d.getDate()
      let month= d.getMonth()+1
      let year= d.getFullYear()
      if(day < 10) day = "0"+day
      let date = year+"-"+month+"-01"
      let dateNow = year+"-"+month+"-"+day
      if(req.body.fromDate && req.body.toDate){
        date = req.body.fromDate;
        dateNow = req.body.toDate;
      }
      const company = await Company.findOne({})
      const companyOrders = await Orders.find({$and:[{orderTakeDate: {$gte:date}}, {orderTakeDate: {$lte:dateNow}}]})
      const cars = await Car.find({})
    // <-- sumowanie cen -->
      const [priceSumEuro] = await Orders.aggregate([
        {$match : {$and:[   {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$price" } } }
      ]);
      const [priceSumPln] = await Orders.aggregate([
        {$match : {$and:[  {currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$price" } } }
      ]);
    // <-- sumowanie kilometrów EUR -->
      const [emptySumKmEur] = await Orders.aggregate([
        {$match : {$and:[  {currency:'EUR'},  {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      const [fullSumKmEur] = await Orders.aggregate([
        {$match : {$and:[  {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$fullKM" } } }
      ]);
      let ekeur = emptySumKmEur?.total
      ekeur = parseFloat(ekeur)
      let fkeur = fullSumKmEur?.total
      fkeur = parseFloat(fkeur)

      let allKmEur =ekeur+fkeur
    // <-- sumowanie kilometrów PLN -->
      const [emptySumKmPln] = await Orders.aggregate([
        {$match : {$and:[{currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      const [fullSumKmPln] = await Orders.aggregate([
        {$match : {$and:[ {currency:'PLN'},  {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$emptyKM" } } }
      ]);
      let ekpln = emptySumKmPln?.total
      ekpln = parseFloat(ekpln)
      let fkpln = fullSumKmPln?.total
      fkpln = parseFloat(fkpln)

      let allKmPln =ekpln+fkpln
    // <-- średnie stawki EUR-->
      let srFullEur = priceSumEuro?.total / fkeur
      srFullEur = Math.round(srFullEur * 1000) / 1000
      let srAllEur = priceSumEuro?.total / allKmEur
      srAllEur = Math.round(srAllEur * 1000) / 1000
    // <-- średnie stawki PLN-->
      let srFullPln = priceSumPln?.total / fkpln
      srFullPln = Math.round(srFullPln * 1000) / 1000
      let srAllPln = priceSumPln?.total / allKmPln
      srAllPln = Math.round(srAllPln * 1000) / 1000
    // <-- sumowanie prowizji EUR/PLN -->
      const [sumCommisionEur] = await Orders.aggregate([
        {$match : {$and:[ {currency:'EUR'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$commision" } } }
      ]);
      const [sumCommisionPln] = await Orders.aggregate([
        {$match : {$and:[{currency:'PLN'}, {orderTakeDate:{$gte: date}}, {orderTakeDate:{$lte:dateNow}}]}},
        {$group : { _id : null, total : { $sum : "$commision" } } }
      ]);
      res.render('pages/orders/allorders.ejs', {
        companyOrders,
        company,
        priceSumEuro,
        priceSumPln,
        emptySumKmEur,
        emptySumKmPln,
        fullSumKmEur,
        fullSumKmPln,
        allKmEur,
        allKmPln,
        srFullEur,
        srAllEur,
        srFullPln,
        srAllPln,
        sumCommisionEur,
        sumCommisionPln,
        cars,
        carForOrder:false,
        date,
        dateNow,
        sorting:false,
     });
    }
    async showOrdersInProgress(req, res){
      const orders = await Orders.find({statusOrder:{$ne:6}}).sort({statusOrder:"desc"});
      res.render('pages/orders/ordersinprogress.ejs', {
        orders,
      })
    }
    async setOrderStatus(req, res){
      const orderId = req.body.orderId
      console.log("dsds")
      const order = await Orders.findOne({_id:orderId})
      order.statusOrder = order.statusOrder + 1
      try {
        await order.save()
        res.redirect("/admin/zlecenia/trwajace");
      } catch (error) {
        res.redirect("/admin/zlecenia/trwajace");
        console.log(e)
      }
    }
    async showOrdersDetails(req, res){
      const orderId=req.params.name
      const order = await Orders.findOne({_id:orderId})
      res.render('pages/orders/orderdetails.ejs', {
        order,
      })
    }
}
export default new ordersController