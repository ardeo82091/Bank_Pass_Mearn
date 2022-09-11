const jwt = require("jsonwebtoken")
class JWTPayload{
    static secratekey = "strongPassword";
    constructor(user){
        this.userName = user.credentials;
        this.fullName = user.fullName;
        this.customerID = user.customerID;
        this.role = user.role;
        this.isActive = user.isActive;
    }
    createToken()
    {
        return jwt.sign(JSON.stringify(this),JWTPayload.secratekey)
    }
    static verifyCookie(token)
    {
        return jwt.verify(token,JWTPayload.secratekey)
    }

    static isValidateToken(req,resp,mytoken)
    {
        if (!mytoken) {
            return false
        }
        return JWTPayload.verifyCookie(mytoken)
    }
}

module.exports = JWTPayload;