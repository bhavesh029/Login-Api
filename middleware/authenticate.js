const jwt = require('jsonwebtoken');
const User = require('../model/signup');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('authorization');
        console.log(token);
        const userid = Number(jwt.verify(token, '2e67c65743d09e2b193cfbe1c3f2e2d34ffa2df6a7385af4a8d33ff991b4d70d661d5f0578315212a1c261cd7d6707427a167172512bdaffb71252ae4c8b28cc'
        ));
        User.findByPk(userid).then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
      }

}

module.exports = {
    authenticate
}