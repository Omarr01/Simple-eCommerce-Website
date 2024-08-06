<?php

namespace App\Controller\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CartType
{
    public static $selectedAttributeType;
    public static $cartItemType;

    public static function initialize()
    {
        self::$selectedAttributeType = new ObjectType([
            'name' => 'SelectedAttribute',
            'fields' => [
                'attributeName' => ['type' => Type::string()],
                'attributeId' => ['type' => Type::string()]
            ],
            'resolveField' => function ($cartItem, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($cartItem, $getter)) {
                    return $cartItem->$getter();
                } else {
                    return $cartItem->$fieldName ?? null;
                }
            }
        ]);

        self::$cartItemType = new ObjectType([
            'name' => 'CartItem',
            'fields' => [
                'id' => ['type' => Type::int()],
                'product' => ['type' => ProductType::$productType],
                'selectedAttributes' => ['type' => Type::listOf(self::$selectedAttributeType)],
                'quantity' => ['type' => Type::int()]
            ],
            'resolveField' => function ($cartItem, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($cartItem, $getter)) {
                    return $cartItem->$getter();
                } else {
                    return $cartItem->$fieldName ?? null;
                }
            }
        ]);
    }
}

CartType::initialize();
