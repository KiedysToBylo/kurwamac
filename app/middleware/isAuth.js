
   const isAuth = function (req, res, next)
   {
      if(!res.locals.user) 
      {
         return res.redirect('/zaloguj');
      }
       next();
   }
export 
{ isAuth } 