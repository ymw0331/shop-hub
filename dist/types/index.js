// src/types/index.ts
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["NOT_PROCESSED"] = "Not processed";
    OrderStatus["PROCESSING"] = "Processing";
    OrderStatus["SHIPPED"] = "Shipped";
    OrderStatus["DELIVERED"] = "Delivered";
    OrderStatus["CANCELLED"] = "Cancelled";
})(OrderStatus || (OrderStatus = {}));
