import User from '../db/models/user.js'
   const isAuthGetApi = async function (req, res, next)
   {
    const token = req.url?.split('=')[1];
   
    if (!token){
      return res.sendStatus(403)
    }
    const user = await User.findOne({ apiToken: token })
      if(!user) {
       return res.sendStatus(403)
      }
       req.user = user
       next();
   }

export { isAuthGetApi } 
