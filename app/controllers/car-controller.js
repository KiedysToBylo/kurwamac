import Car from '../db/models/car.js'
import Company from '../db/models/company.js'

class CarController {
async addCar(req, res){
    const {name}=req.params;
    const car = new Car({
        carPlats:req.body.car,
        carID:name,
    })
    try {
      await car.save()
      res.redirect('/admin/firma/'+name)
    } catch (error) {
      console.log(error.message)
    }
  }
  async showAddCar(req, res){
      const { name } = req.params;
      const company = await Company.findOne({ companyId: name });
      res.render("pages/companies/addCar.ejs", {
        title: "Dodaj Auto",
        carsList:true,
      });
  }
  async deleteCar(req, res){
       const { name, carPlats } = req.params;
       const car = await Car.deleteOne({carPlats: carPlats});
       res.redirect('/admin/firma/'+name)
  }
}
  
export default new CarController