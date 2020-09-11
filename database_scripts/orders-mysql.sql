-- orders database
-- My SQL 

START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `order_discount`;
DROP TABLE IF EXISTS `order_product`;
DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `price_paid` DECIMAL(13,2) NOT NULL,
  `payment_id` VARCHAR(255) NOT NULL,
  `tax_rate` DECIMAL(4,2) NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `customer_id` INT NOT NULL,
  `shipping_street_address` VARCHAR(255) NOT NULL,
  `shipping_state` VARCHAR(50) NOT NULL,
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_zip` VARCHAR(10) NOT NULL,
  `sales_representative_id` INT NULL,
  `status` ENUM('OPEN', 'PENDING', 'CLOSED') DEFAULT 'OPEN' NOT NULL,
  `deleted` BOOLEAN DEFAULT FALSE NOT NULL,
  PRIMARY KEY(`id`),
  INDEX(`shipping_street_address`),
  INDEX(`shipping_state`),
  INDEX(`shipping_city`),
  INDEX(`shipping_zip`)
);

CREATE TABLE `order_product` (
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  FOREIGN KEY(`order_id`) REFERENCES `order` (`id`),
  INDEX(`product_id`)
);

CREATE TABLE `order_discount` (
  `order_id` INT NOT NULL,
  `discount_id` INT NOT NULL,
  FOREIGN KEY(`order_id`) REFERENCES `order` (`id`),
  INDEX(`discount_id`)
);

COMMIT;