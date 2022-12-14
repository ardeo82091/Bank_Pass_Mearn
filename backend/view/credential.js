const bcrypt = require('bcrypt');
const { DatabaseMongoose } = require('../repository/database');
class Credential
{
    constructor(userName, password)
    {
        this.userName = userName;
        this.password = password;
    }

    async getHashPassword(){
        return bcrypt.hash(this.password,10);
    }

    static async findCustomerName(userName)
    {
        const db = new DatabaseMongoose();
        let credExist = await db.findOneCred({"userName":userName})
        if(credExist)
        {
            return [true,credExist];
        }
        return [false,-1];
    }

    static async findCredId(credId)
    {
        const db = new DatabaseMongoose();
        let credExist = await db.findOneCred({"_id":credId});
        if(credExist)
        {
            return [true,credExist];
        }
        return [false,-1];
    }

    static async createCredential(userName, password)
    {
        const db = new DatabaseMongoose();
        let [isuserNameExist,credExist] = await  Credential.findCustomerName(userName);
        if(isuserNameExist)
        {
            return [false,"userName Already Exist",null]
        }
        let newCredential = new Credential(userName,password);
        newCredential.password = await newCredential.getHashPassword();
        let dCredential = await db.insertOneCred(newCredential);
        return [true,"Credential Created",dCredential];
    }
}
module.exports = Credential;