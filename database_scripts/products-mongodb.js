conn = new Mongo();
db = conn.getDB("fashion_store_products");

db.createCollection("product", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "category", "product_description", "base_price", "final_price", "deleted" ],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        category: {
         enum: [ "APPAREL", "FOOTWEAR", "SPORTSWEAR", "FORMALWEAR", "ACCESSORIES", "JEWLRY", "COSMETICS" ],
          description: "can only be one of the enum values and is required"
        },
        product_description: {
            bsonType: "string",
          description: "can only be a string and is required"
        },
        gender: {
          enum: [ "MALE", "FEMALE", "UNISEX", null ],
          description: "can only be one of the enum values and is required"
        },
        size: {
          bsonType: [ "string", null ],
          description: "must be a string or null"
        },
        product_image: {
            bsonType: [ "string", null ],
            description: "must be string or null"
        },
        base_price: {
            bsonType: "decimal",
            description: "must be a decimal and is required"
        },
        final_price: {
            bsonType: "decimal",
            description: "must be a decimal and is required"
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
