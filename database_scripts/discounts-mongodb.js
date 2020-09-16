/** 
 * discount database
 * Mongo DB
*/

conn = new Mongo();
db = conn.getDB("fashion_store_discounts");

db.createCollection("product", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "promo_code", "percentage_off", "deleted" ],
      properties: {
        promo_code: {
          bsonType: "string",
          minLength: 5,
          maxLength: 5,
          description: "must be a 5 character string and is required"
        },
        experation_date: {
         bsonType: [ "date", null ],
          description: "can only be only be a date or null"
        },
        category: {
            bsonType: [ "string", null ],
          description: "can only be a string or null"
        },
        percentage_off: {
          bsonType: "double",
          description: "can only be a double and is required"
        },
        times_used: {
          bsonType: [ "int", null ],
          minimum: 0,
          description: "must be a int that is at least 0 or null"
        },
        max_usage: {
          bsonType: [ "int", null ],
          minimum: 1,
          description: "must be a int that is at least 1 or null"
        },
        deleted: {
            bsonType: "bool",
            description: "must be a bool and is required"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
