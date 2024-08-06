<?php

namespace App\Model;

use Config\Database;
use App\Model\ProductModel;
use App\Model\Cart\CartItem;

class CartModel
{
    protected $database;
    protected $productModel;

    public function __construct()
    {
        $this->database = new Database();
        $this->productModel = new ProductModel();
    }

    public function addItemToCart($cartItem)
    {
        $product = $cartItem->getProduct();
        $productId = $product->getPid();
        $quantity = intval($cartItem->getQuantity());
        $selectedAttributes = $cartItem->getSelectedAttributes();

        $connect = $this->database->connectToDatabase();

        mysqli_begin_transaction($connect);

        try {
            if (!empty($selectedAttributes)) {
                $attributesConditions = [];
                foreach ($selectedAttributes as $selectedAttribute) {
                    $attributeName = $selectedAttribute->getAttributeName();
                    $attributeId = $selectedAttribute->getAttributeId();
                    $attributesConditions[] = "(attribute_name = '$attributeName' AND attribute_id = '$attributeId')";
                }
                $attributesConditionStr = implode(' OR ', $attributesConditions);

                $sql = "SELECT 
                            ci.item_id
                        FROM 
                            cart_items ci
                        JOIN cart_items_attributes cia ON ci.item_id = cia.item_id
                        WHERE 
                            ci.product_id = '$productId'
                        AND 
                            ($attributesConditionStr)
                        GROUP BY ci.item_id
                        HAVING COUNT(DISTINCT cia.attribute_name) = " . count($selectedAttributes);

                $result = mysqli_query($connect, $sql);
            } else {
                $sql = "SELECT 
                            ci.item_id
                        FROM 
                            cart_items ci
                        WHERE 
                            ci.product_id = '$productId'";

                $result = mysqli_query($connect, $sql);
            }

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $itemId = $row['item_id'];

                $updateSql = "UPDATE cart_items SET quantity = quantity + $quantity WHERE item_id = $itemId";
                mysqli_query($connect, $updateSql);
            } else {
                $sql = "INSERT INTO cart_items (product_id, quantity) VALUES ('$productId', '$quantity')";
                mysqli_query($connect, $sql);
                $itemId = mysqli_insert_id($connect);

                if (!empty($selectedAttributes)) {
                    foreach ($selectedAttributes as $selectedAttribute) {
                        $attributeName = $selectedAttribute->getAttributeName();
                        $attributeId = $selectedAttribute->getAttributeId();

                        $sql = "INSERT INTO cart_items_attributes (item_id, attribute_name, attribute_id) VALUES ('$itemId', '$attributeName', '$attributeId')";
                        mysqli_query($connect, $sql);
                    }
                }
            }

            mysqli_commit($connect);
            return true;
        } catch (Exception $e) {
            mysqli_rollback($connect);
            return false;
        }
    }


    public function getCartItems()
    {
        $sql = "SELECT
                    item_id as id,
                    product_id,
                    quantity
                FROM
                    cart_items";

        $connect = $this->database->connectToDatabase();
        $result = mysqli_query($connect, $sql);

        $cartItems = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $itemId = $row['id'];
            $product = $this->productModel->getProductById($row['product_id']);

            if (!isset($cartItems[$itemId])) {
                $cartItems[$itemId] = [
                    'id' => $row['id'],
                    'product' => $product,
                    'quantity' => $row['quantity'],
                    'selectedAttributes' => []
                ];
            }
        }

        $sql = "SELECT
                    item_id,
                    attribute_name,
                    attribute_id
                FROM
                    cart_items_attributes";

        $result = mysqli_query($connect, $sql);

        while ($row = mysqli_fetch_assoc($result)) {
            $itemId = $row['item_id'];

            if (isset($cartItems[$itemId])) {
                $cartItems[$itemId]['selectedAttributes'][] = [
                    'attributeName' => $row['attribute_name'],
                    'attributeId' => $row['attribute_id']
                ];
            }
        }

        $cartItemsObjects = array();
        foreach ($cartItems as $cartItem) {
            $cartItemsObjects[] = new CartItem($cartItem);
        }

        return $cartItemsObjects;
    }

    public function incrementCartItemQuantity($itemId)
    {
        $sql = "UPDATE cart_items SET quantity = quantity + 1 WHERE item_id = $itemId";
        $connect = $this->database->connectToDatabase();
        mysqli_query($connect, $sql);
        return true;
    }

    public function decrementCartItemQuantity($itemId)
    {
        $sql = "UPDATE cart_items SET quantity = quantity - 1 WHERE item_id = $itemId AND quantity > 0";
        $connect = $this->database->connectToDatabase();
        mysqli_query($connect, $sql);
        return true;
    }

    public function removeItem($itemId)
    {
        $connect = $this->database->connectToDatabase();

        mysqli_begin_transaction($connect);

        try {
            $sqlAttributes = "DELETE FROM cart_items_attributes WHERE item_id = $itemId";
            mysqli_query($connect, $sqlAttributes);

            $sqlCart = "DELETE FROM cart_items WHERE item_id = $itemId";
            mysqli_query($connect, $sqlCart);

            mysqli_commit($connect);
            return true;
        } catch (Exception $e) {
            mysqli_rollback($connect);
            return false;
        }
    }

    public function removeAllCartItems()
    {
        $connect = $this->database->connectToDatabase();

        mysqli_begin_transaction($connect);

        try {
            $sqlAttributes = "DELETE FROM cart_items_attributes";
            mysqli_query($connect, $sqlAttributes);

            $sqlCart = "DELETE FROM cart_items";
            mysqli_query($connect, $sqlCart);

            mysqli_commit($connect);
            return true;
        } catch (Exception $e) {
            mysqli_rollback($connect);
            return false;
        }
    }

    public function placeOrder($order)
    {
        $orderedItems = $order->getOrderedItems();
        $totalPrice = $order->getTotalPrice();
        $status = $order->getStatus()->value;

        $connect = $this->database->connectToDatabase();

        mysqli_begin_transaction($connect);

        try {
            $sql = "INSERT INTO orders (total_price, order_status) VALUES ('$totalPrice', '$status')";
            mysqli_query($connect, $sql);

            $orderId = mysqli_insert_id($connect);

            foreach ($orderedItems as $orderedItem) {
                $product = $orderedItem->getProduct();
                $productId = $product->getPid();
                $quantity = intval($orderedItem->getQuantity());
                $selectedAttributes = $orderedItem->getSelectedAttributes();

                $sql = "INSERT INTO order_items (product_id, quantity, order_id) VALUES ('$productId', '$quantity', '$orderId')";
                mysqli_query($connect, $sql);
                $itemId = mysqli_insert_id($connect);

                if (!empty($selectedAttributes)) {
                    foreach ($selectedAttributes as $selectedAttribute) {
                        $attributeName = $selectedAttribute->getAttributeName();
                        $attributeId = $selectedAttribute->getAttributeId();

                        $sql = "INSERT INTO order_items_attributes (item_id, attribute_name, attribute_id) VALUES ('$itemId', '$attributeName', '$attributeId')";
                        mysqli_query($connect, $sql);
                    }
                }
            }

            mysqli_commit($connect);
            return true;
        } catch (Exception $e) {
            mysqli_rollback($connect);
            return false;
        }
    }
}
