import User from '../db/models/user.js';

class employeerController {
    async showRegisterEmpl(req,res) {
        const { name } = req.params;
        res.render('pages/auth/registerEmployeer.ejs', {
        })
    }
    async registerEmpl(req,res){
    let prefix=0;
    const {name} = req.params
    const toWhichCompanyID = name
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
    // console.log(users)
    // console.log(toWhichCompanyID)
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            userRank: req.body.userRank,
            userId: name+'-'+prefix,
            userImie:req.body.userImie,
            userNazwisko:req.body.userNazwisko,
            userMembership:name,
        });
      
        try {
            await user.save();
            res.redirect("/admin/firma/"+name);
          } catch (e) {
            res.render("pages/auth/registerEmployeer.ejs", {
                form:req.body,
                errors: e.errors,
            });
            console.log(e.message);
          }
    }
    async deleteEmpl(req, res){
        const {name, userId} = req.params
        try {
            await User.deleteOne({userId:userId})
            res.redirect("/admin/firma/"+name);
        } catch (e) {
            res.render("pages/auth/registerEmployeer.ejs", {
                form:req.body,
                errors: e.errors,
            });
            console.log(e.message);
        }
    }
}
export default new employeerController
