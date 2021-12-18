import Company from "../db/models/company.js";
import fs from 'fs';
import Car from '../db/models/car.js'
import Users from '../db/models/user.js'
import {Parser} from 'json2csv'


class CompanyController {
  //pokaż firmy
  async showCompanies(req, res) {
    const {q, sort, countmin, countmax} = req.query;
    const page = req.query.page ?? 1;
    const perPage= 10;
    //search
    let where ={};
    if (q) where = {'name': { $regex: '.*' + q + '.*', $options:'i'}}
    //filters
    // if (countmin || countmax)
    // {
    //   where.employeesCount = {};
    //   if (countmin) where.employeesCount.$gte=countmin
    //   if (countmax) where.employeesCount.$lte=countmax
    // }
    let query = Company.find(where);
    //pagination
    query = query.skip((page - 1) * perPage);
    query = query.limit(perPage);

    //sorting
    if (sort)
    {
      const s = sort.split('|');
      query = query.sort({ [s[0]] : s[1] });
    }
    //exec
    const companies =await query.populate('companyId').exec()
    const resultsCount = await Company.find(where).count();
    const pagesCount = Math.ceil(resultsCount / perPage);
    
    res.render("pages/companies/firmy", {
      title: "Lista Firm",
      companies,
      page:page,
      pagesCount,
      resultsCount,
    });
  }
  //szczegóły firmy
  async showCompany(req, res) {
    const { name } = req.params;
    const company = await Company.findOne({ companyId: name });
    const companyCars = await Car.find({carID: name})
    const Employees = await Users.find({userMembership: name})
  //  console.log(Employees)
    res.render("pages/companies/firma", {
      title: "Szczegóły",
      name: company?.name,
      carsList:true,
      companyId:company.companyId,
      companyCars:companyCars,
      companyEmployees:Employees,
      image:company.image
    });
  }
//pokaż dodaj firmę
  async showCreateCompany(req, res) {
    res.render("./pages/companies/create.ejs");
  }
//dodaj firmę
  async createCompany(req, res) {
    const company = new Company({
      name: req.body.name,
      companyAdress:{
        adress:req.body.companyAdress,
        companyNip:req.body.companyNip,
      },
    });
    try {
      await company.save();
      res.redirect("/");
    } catch (e) {
      res.render("./pages/companies/create.ejs", {
        errors: e.errors,
        form: req.body
      });
    }
  }
  //pokaż edytuj firmę
  async showEditCompany(req, res) {
    const { name } = req.params;
    const company = await Company.findOne({ companyId: name });
    res.render("pages/companies/edit.ejs", {
      form: company
    });
  }
  //edytuj firmę
  async editCompany(req, res) {
    const { name } = req.params;
    const company = await Company.findOne({ companyId: name });
    company.name =req.body.name;
    company.companyAdress.adress =req.body.companyAdress;
    company.companyAdress.companyNip =req.body.companyNip;
   if(req.body.image || req.file) {
    if(req.file.filename && company.image)
    {
      fs.unlinkSync('public/upload/' + company.image)
    }
    if (req.file.filename)
    {
      company.image = req.file.filename;
    }
  }
    try {
      await company.save();
      res.redirect("/admin/firmy");
    } catch (e) {
      res.render("./pages/companies/edit.ejs", {
        errors: e.errors,
        form: req.body
      });
    }
  }
  //usuń firmę
  async deleteCompany(req, res) {
    const { name } = req.params;
    const company = await Company.findOne({ companyId: name });
    try {
      if(company.image)
      {
        fs.unlinkSync('public/upload/' + company.image)
      }
      await Company.deleteOne({ companyId: name });
      res.redirect("/admin/firmy");
    } catch (e) {
      console.log(e.message);
    }
  }

  //usuń zdjęcie
  async deleteImage(req, res)
  {
    const { name } = req.params;
    const company= await Company.findOne({ companyId: name });
    try {
      fs.unlinkSync('public/upload/' + company.image)
      company.image = '';
      await company.save()
      res.redirect("/admin/firmy");
    } catch (e) {
      console.log(e.message);
    }
  }

  //pobierz CSV
 async getCSV(req,res)
  {
    const fields = [
      {
        label: 'Nazwa',
        value: 'name',
      },
      {
        label: 'URL',
        value: 'slug',
      },
      {
        label: 'Liczba pracowników',
        value: 'employeesCount',
      },
    ];

    const data = await Company.find();
    const filename = 'companies.csv';

    const json2csv = new Parser({fields});
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  }
}
export default new CompanyController();
