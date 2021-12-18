
   const userMiddleware = function (req, res, next)
   {
       res.locals.user = req.session.user,
       next();
   }
export 
{ userMiddleware }