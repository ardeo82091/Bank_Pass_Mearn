class Transaction {
    constructor(fullName, amount, type,totalAmount) {

      this.creditedTo= fullName;
      if(type == "credit")
      {
        this.amountp = amount;
      }
      else if(type == "debit" || type == "transfer")
      {
        this.amountn = amount;
      }
      
      this.type = type;
      this.totalAmount = totalAmount;
      if(type == "credit")
      {
        this.totalAmount += amount;
      }
      else if(type == "debit" || type == "transfer")
      {
        this.totalAmount -= amount;
      }
      else
      {
        this.totalAmount = totalAmount;
      }
      
    }

}
  
module.exports = Transaction;