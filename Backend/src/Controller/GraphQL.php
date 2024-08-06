<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;
use App\Controller\Type\ProductType;
use App\Controller\Type\CartType;
use App\Model\ProductModel;
use App\Model\CartModel;
use App\Model\Cart\CartItem;
use App\Model\Order;
use App\Enum\OrderStatus;

class GraphQL
{
    public static function handle()
    {
        try {
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf(ProductType::$productType),
                        'resolve' => function () {
                            $productModel = new ProductModel();
                            return $productModel->getAllProducts();
                        }
                    ],
                    'product' => [
                        'type' => ProductType::$productType,
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::id())]
                        ],
                        'resolve' => function ($root, $args) {
                            $productModel = new ProductModel();
                            return $productModel->getProductById($args['id']);
                        }
                    ],
                    'cart' => [
                        'type' => Type::listOf(CartType::$cartItemType),
                        'resolve' => function () {
                            $cartModel = new CartModel();
                            return $cartModel->getCartItems();
                        }
                    ]
                ]
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'addItemToCart' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'productId' => ['type' => Type::nonNull(Type::string())],
                            'selectedAttributes' => [
                                'type' => Type::listOf(new InputObjectType([
                                    'name' => 'SelectedAttributeInput',
                                    'fields' => [
                                        'attributeName' => ['type' => Type::nonNull(Type::string())],
                                        'attributeId' => ['type' => Type::nonNull(Type::string())],
                                    ]
                                ]))
                            ],
                        ],
                        'resolve' => function ($root, $args) {
                            $productModel = new ProductModel();
                            $product = $productModel->getProductById($args['productId']);

                            $data = [
                                'id' => 0,
                                'product' => $product,
                                'selectedAttributes' => $args['selectedAttributes'],
                                'quantity' => 1
                            ];

                            $cartItem = new CartItem($data);

                            $cartModel = new CartModel();
                            return $cartModel->addItemToCart($cartItem);
                        }
                    ],
                    'incrementCartItemQuantity' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::int())],
                        ],
                        'resolve' => function ($root, $args) {
                            $cartModel = new CartModel();
                            return $cartModel->incrementCartItemQuantity($args['id']);
                        }
                    ],
                    'decrementCartItemQuantity' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::int())],
                        ],
                        'resolve' => function ($root, $args) {
                            $cartModel = new CartModel();
                            return $cartModel->decrementCartItemQuantity($args['id']);
                        }
                    ],
                    'removeCartItem' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::int())],
                        ],
                        'resolve' => function ($root, $args) {
                            $cartModel = new CartModel();
                            return $cartModel->removeItem($args['id']);
                        }
                    ],
                    'removeAllCartItems' => [
                        'type' => Type::boolean(),
                        'resolve' => function () {
                            $cartModel = new CartModel();
                            return $cartModel->removeAllCartItems();
                        }
                    ],
                    'placeOrder' => [
                        'type' => Type::boolean(),
                        'resolve' => function () {
                            $cartModel = new CartModel();
                            $cartItems = $cartModel->getCartItems();

                            $totalPrice = 0;

                            foreach ($cartItems as $cartItem) {
                                $product = $cartItem->getProduct();
                                $productPrices = $product->getPrices();
                                $pricePerUnit = $productPrices[0]->getAmount();
                                $quantity = $cartItem->getQuantity();
                                $totalPrice += $pricePerUnit * $quantity;
                            }

                            $totalPrice = round($totalPrice, 2);

                            $order = new Order(0, $cartItems, $totalPrice, OrderStatus::PENDING);

                            $cartModel->placeOrder($order);

                            return $cartModel->removeAllCartItems();
                        }
                    ]
                ],
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                ->setQuery($queryType)
                ->setMutation($mutationType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}
