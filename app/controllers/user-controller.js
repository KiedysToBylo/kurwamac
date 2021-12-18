import User from '../db/models/user.js'
import Company from "../db/models/company.js";
import { exec } from 'child_process';
class userController {
    //pokaż rejestracje
  async  showRegister(req, res)
    {   
        const companies = await Company.find({})
        res.render('pages/auth/register.ejs', {
           companies
        })
    }
    //rejestuj
    async register(req, res){
    let prefix=0;
    const toWhichCompany = await Company.findOne({'companyId': req.body.userId})
    const toWhichCompanyID = toWhichCompany.companyId 
    const users = await User.findOne({'userId': { $regex: '.*' + toWhichCompanyID + '.*'}}).sort({'userId': 'desc'})
    if (users === null)
    {
         prefix = 1;
    }else{
         const userExistingId = users.userId;
         const s = userExistingId.split('-');
         let prefixa =s[1];
         prefixa = parseFloat(prefixa);
         prefix = prefixa+1
    }
    console.log(users)
    console.log(toWhichCompanyID)
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            userRank: req.body.userRank,
            userId: req.body.userId+'-'+prefix,
            userImie:req.body.userImie,
            userNazwisko:req.body.userNazwisko,
            userMembership:req.body.userId,
        });
        const companies = await Company.find({})
        try {
            await user.save();
            res.redirect("/zaloguj");
          } catch (e) {
            res.render("pages/auth/register.ejs", {
                form:req.body,
                errors: e.errors,
                companies
            });
            console.log(e.message);
          }
    }
    //pokaż logowanie
    showLogin(req, res)
    {
        res.render('pages/auth/login.ejs')
    }
    //zaloguj
    async login(req, res){
        try{
            const user = await User.findOne({userId: req.body.userId});
            if(!user){
            throw new Error('Invalid user')
            }
            const isValidPassword = user.comparePassword(req.body.password);
            if(!isValidPassword){
            throw new Error('Password not valid')
            }
            //login
            req.session.user = {
                userId: user.userId,
                email: user.email,
                userRank: user.userRank,
                userPhone: user.userPhone,
                userImie:user.userImie,
            }
            if (user.userRank === "ADMIN")
            {
                res.redirect('/admin/home');
            }else if (user.userRank === "COMPANY")
            {
                res.redirect('/company/home');
            }else if (user.userRank === "DRIVER")
            {
                res.redirect('/driver/home');
            }
           
        } catch {
            res.render('pages/auth/login', {
                form:req.body,
                errors:true,
            });
        }
    }
    //wyloguj
    logout(req, res){
        req.session.destroy();
        res.redirect('/');
    }
    //pokaż mój profil
    showProfile(req, res)
    {
        res.render('pages/auth/profil.ejs', {
            form: req.session.user,
        })
    }
   async update(req, res) {
       const user = await User.findById(req.session.user._id);
       user.email = req.body.email;
       if(req.body.password){
           user.password = req.body.password;
       }
       try {
        await user.save();
        req.session.user.email = user.email;
        res.redirect('/admin/profil')
       } catch (e) {
        res.render('pages/auth/profil.ejs', {
            errors: e.errors,
            form: req.body,
        })
       }
   }
}
export default new userController