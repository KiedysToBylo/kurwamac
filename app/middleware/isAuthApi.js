import User from '../db/models/user.js'
   const isAuthApi = async function (req, res, next)
   {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenInBody = req.body.authorization
    const token2 = req.headers.authorization;

    if (!token && !tokenInBody && !token2){
      return res.sendStatus(403)
    }
    const user = await User.findOne({$or:[{apiToken: token},{apiToken: tokenInBody}, {apiToken: token2}]})
    
      if(!user) {
       return res.sendStatus(403)
      }
       req.user = user
       next();
   }

export { isAuthApi } 
