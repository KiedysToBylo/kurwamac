import Client from '../db/models/clients.js'
class clientsController {
    async showClients(req,res){
        const {q} = req.query;
       let where = {};
        if (q) where = {'clientName': { $regex: '.*' + q + '.*', $options:'i'}}
        const clients = await Client.find(where)

        res.render('pages/clients/clients.ejs', {
            clients:clients
        })
    }
    async showAddClient(req,res){
        const clients = await Client.find({})
        res.render('pages/clients/addclient.ejs', {
            clients
        })
    }
    async addClient(req,res){
        const client = new Client({
            clientName: req.body.name,
            clientAdress:{
              adress:req.body.clientAdress,
              clientNip:req.body.clientNip,
            },
          });
          try {
              await client.save();
              res.redirect("/admin/klienci");
          } catch (e) {
              res.render("pages/clients/addclient.ejs", {
              errors: e.errors,
              form: req.body
            });
        }
    }
}
export default new clientsController;