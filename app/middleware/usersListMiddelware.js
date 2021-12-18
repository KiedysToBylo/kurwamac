import User from '../db/models/user.js'
import Company from '../db/models/company.js'
const usersListMiddleware = async function (req, res, next) {
    let usersList = await User.find({});
    const companiesList = await Company.find({});

    res.locals.companiesList = companiesList
    res.locals.usersList = usersList
    next();
}
export { usersListMiddleware }

// const companiesList = await Company.find({}).sort({ [s[0]] : 'desc' });

    // for (let i = 0; i<usersList.length; i++){
    //     let userId = usersList[i]['userId'].split('-')
    //     userId[0] //<--przynależność do firmy
    //     userId[1] //<--L.P
    // }