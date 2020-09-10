% Fashion Store design

# Fashion Store Design

note: deletes are soft deletes

## user types

- customer:  
add/remove items from a shopping cart  
post order
- sales_representative:  
add/remove item from cart  
post  order for customer  
cancel and refund order
- admin:  
everything

## microservice architecture

Secured using JWT authentication using AWS cognito

### order service

technology: spring boot using spring data JPA/hibernate

using strype for payments , the payment_id is related to strype
extract user_id on requests through JWT  
an order will not be written to the database until the payment is complete through strype  
a customer ID is the same as a user ID
a sailes rep ID is the same as a user ID

#### data

SQL database

##### Relational Model

order:

- id, int
- price_paid, decimal
- payment_id, int
- tax_rate, decimal
- order_date, date
- customer_id, int
- shipping_street_address, string
- shipping_city, string
- shipping_state, string
- shipping_zip, string
- sales_representative_id, int
- status, enum(OPEN, PENDING, CLOSED)
- deleted, boolean

order_product:

- order_id
- product_id

order_discount:

- order_id
- discount_id

####end points

- get: /orders | (ADMIN, SALES_REPRESENTATIVE)  
response body: [{id: 0, products: [product_ids], discounts: [discount_ids], price_paid, decimal: 0.0, tax_rate: 0.0, order_date: yyyy-mm-dd, customer: {user_id: 0.0, email: "", phone: "", first_name: "", last_name: ""}, shipping_address: "", shipping_city: "", shipping_state: "", shipping_zip: ""}]  
success status: 200  
Gets all orders
- get: /orders/{id} | (ADMIN, SALES_REPRESENTATIVE)  
response body: {id: 0, products: [product_ids], discounts: [discount_ids], price_paid, decimal: 0.0, tax_rate: 0.0, order_date: yyyy-mm-dd, customer: {user_id: 0.0, email: "", phone: "", first_name: "", last_name: ""}, shipping_address: "", shipping_city: "", shipping_state: "", shipping_zip: ""}  
success status: 200
not found status: 404
Gets a specific order by order ID
- get: /orders/users/{id} | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
response body: [{id: 0, products: [product_ids], discounts: [discount_ids], price_paid, decimal: 0.0, tax_rate: 0.0, order_date: yyyy-mm-dd, customer: {user_id: 0.0, email: "", phone: "", first_name: "", last_name: ""}, shipping_address: "", shipping_city: "", shipping_state: "", shipping_zip: ""}]  
success status: 200
not found status: 404
Gets orders orders by user ID for the customer
- get: /taxrate?zip="" | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
success status: 200
not found status: 404
response body: {tax_rate: 0.0}
Get the tax rate for a specific zip code
- post: /orders/{id}/cancellation | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
success status: 204
not found: 404
Cancels a specific order by changing the status field to CLOSED
- put: /orders/{id} | (ADMIN, SALES_REPRESENTATIVE)  
request body: {id: 0, products: [product_ids], discounts: [discount_ids], shipping_address: "", shipping_city: "", shipping_state: "", shipping_zip: ""}  
success status: 204  
not found status: 404
bad request status: 400  
Updates an order based on a provided order ID
- post: /orders | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
request body: {products: [product_ids], discounts: [discount_ids], shipping_address: "", shipping_city: "", shipping_state: "", shipping_zip: ""}  
response location header: http://url/orders/{id}  
success status: 201  
not found status: 404
bad request status: 400  
Creates a new order
- delete: /orders/:id | (ADMIN)  
success status: 204
not found status: 404
Soft deletes an order by flipping the deleted flag to True

### product service

technology: Node.js using express 

product_image is just a path to a location of an image  
Images are stored in Amazon Web Services S3 bucket

#### data

- id, int
- name, string
- category, string
- description, string
- gender, enum(MALE, FEMALE, OTHER), nullable
- size, int, nullable
- product_image, string, nullable
- base_price, decimal
- final_price, decimal
- deleted, boolean

#### end points

- get: /products | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
response body: [{id: 0, name: "", category: "", description: "", gender: "", size: "", product_image: "", base_price: 0.0, final_price: 0.0}]  
success status: 200  
Gets all products
- get: /products/prices?id=""... | (internal to be used by the order API)  
response body: [{id: 0, final_price: 0.0}]  
success status: 200  
not found: 404  
Gets the final prices for each product ID provided to be used by the order API on checkout, if any one of the IDs provided are invalid, a 404 status code is returned
- get: /products/{id} | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
response body: {id: 0, final_price: 0.0}  
success status: 200  
not found: 404  
Gets a specific product by product ID
- get: /products/search?name=""&category=""&gender="" | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
response body: [{id: 0, name: "", category: "", description: "", gender: "", size: "", product_image: "", base_price: 0.0, final_price: 0.0}]  
success status: 200  
bad request: 400  
not found: 404  
Searchs Products based on the query parameters: name, category, and gender
- put: /products/{id} | (ADMIN)  
request body: {id: 0, name: "", category: "", description: "", gender: "", size: "", product_image: "", base_price: 0.0, final_price: 0.0}  
success status: 204  
bad request: 400  
not found: 404  
updates a product based on a given product ID
- post: /products | (ADMIN)  
request body: {name: "", category: "", description: "", gender: "", size: "", product_image: "", base_price: 0.0, final_price: 0.0}  
response location header: http://url/products/{id}  
success status: 201  
bad request: 400  
Creates a new product
- delete: /products/:{id} | (ADMIN)  
success status: 204  
not found: 404  
Soft deletes an product by flipping the deleted flag to True

### discount service

technology: python using flask

Discounts are seen in two ways, either general discounts to the entire order, or category discounts  
Only a percentage is used for discounts to simplify more complex discount models

#### data

- promo_code, string
- experation_date, date, nullable
- category, string, nullable
- percentage_off, decimal
- times_used, int, nullable
- max_usage, int, nullable
- deleted, boolean

#### end points

- get: /discounts | (ADMIN)  
response body: [{promo_code: "", experation_date: "", category: "", percentage_off: 0.0, times_used: 0, max_usage}]  
success status: 200  
Returns all discounts
- get: /discounts/{id} | (ADMIN, SALES_REPRESENTATIVE, CUSTOMER)  
response body: {promo_code: "", experation_date: "", category: "", percentage_off: 0.0, times_used: 0, max_usage}  
success status: 200  
not found: 404  
invalid promo code: 422  
Returns a specific discount by discount ID, validating that the code is not past its experation date if applicable or exceeding the number of usages if applicable
- get: /discounts/percentages?id=0&... | (internal to be used by the order API)  
response body: [{promo_code: "", category: "", percentage_off: 0.0}]  
success status: 200  
not found: 404  
invalid code: 422  
Returns discounts based on provided discount IDs, validating that each code is not past its experation date if applicable or exceeding the number of usages if applicable, if any discount IDs cannot be found a 404 error is thrown, and if any code is invalid a 422 error is thrown
- put: /discounts/{code} | (ADMIN)  
request body: {promo_code: "", experation_date: "", category: "", percentage_off: 0.0, times_used: 0, max_usage}  
success status: 204  
not found: 404  
bad request: 400  
Updates a discount by promo code
- post: /discounts | (ADMIN)  
request body: {experation_date: "", category: "", percentage_off: 0.0, times_used: 0, max_usage}  
response location header: http://url/discounts/{code}  
success status: 201  
not found: 404  
bad request: 400  
Creates a discount
- /delete: /delete | (ADMIN)  
success status: 204  
not found: 404  
Deletes a discount

### user service (AWS Cognito)

#### data

- user_id, int
- password, string
- role, enum(CUSTOMER, SALES_REPRESENTATIVE, ADMIN)
- email, string
- first_name, string
- last_name, string
- phone, string
- street_address, string
- city, string
- state, string
- zip, string

#### Endpoints

n/a
