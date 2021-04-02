const reset = require("../sequelize/reset_db_test")

before(async () => {  
    await reset()
  })