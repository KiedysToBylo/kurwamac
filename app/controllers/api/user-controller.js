import User from '../../db/models/user.js'

class userController {
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
            res.status(200).json({ 
                apiToken: user.apiToken,
                userImie: user.userImie,
                userId: user.userId,
             });
        } catch {
         res.status(401);
            };
    }
    logout(req, res){
        res.status(401).json({ apiToken: null });
    }
}
export default new userController;