<?php

namespace App\Controller\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType
{
    public static $galleryItemType;
    public static $attributeItemType;
    public static $attributeType;
    public static $currencyType;
    public static $priceType;
    public static $productType;

    public static function initialize()
    {
        self::$galleryItemType = new ObjectType([
            'name' => 'GalleryItem',
            'fields' => [
                'imageUrl' => ['type' => Type::string()]
            ],
            'resolveField' => function ($galleryItemType, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($galleryItemType, $getter)) {
                    return $galleryItemType->$getter();
                } else {
                    return $galleryItemType->$fieldName ?? null;
                }
            }
        ]);

        self::$attributeItemType = new ObjectType([
            'name' => 'AttributeItem',
            'fields' => [
                'id' => ['type' => Type::string()],
                'displayValue' => ['type' => Type::string()],
                'value' => ['type' => Type::string()],
                'type' => ['type' => Type::string()]
            ],
            'resolveField' => function ($attributeItem, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($attributeItem, $getter)) {
                    return $attributeItem->$getter();
                } else {
                    return $attributeItem->$fieldName ?? null;
                }
            }
        ]);

        self::$attributeType = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'key' => ['type' => Type::string()],
                'values' => ['type' => Type::listOf(self::$attributeItemType)]
            ]
        ]);

        self::$currencyType = new ObjectType([
            'name' => 'Currency',
            'fields' => [
                'label' => ['type' => Type::string()],
                'symbol' => ['type' => Type::string()]
            ],
            'resolveField' => function ($price, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($price, $getter)) {
                    return $price->$getter();
                } else {
                    return $price->$fieldName ?? null;
                }
            }
        ]);

        self::$priceType = new ObjectType([
            'name' => 'Price',
            'fields' => [
                'amount' => ['type' => Type::float()],
                'currency' => ['type' => self::$currencyType]
            ],
            'resolveField' => function ($price, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($price, $getter)) {
                    return $price->$getter();
                } else {
                    return $price->$fieldName ?? null;
                }
            }
        ]);

        self::$productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'pid' => ['type' => Type::string()],
                'name' => ['type' => Type::string()],
                'inStock' => ['type' => Type::boolean()],
                'description' => ['type' => Type::string()],
                'category' => ['type' => Type::string()],
                'brand' => ['type' => Type::string()],
                'gallery' => ['type' => Type::listOf(self::$galleryItemType)],
                'attributes' => [
                    'type' => Type::listOf(self::$attributeType),
                    'resolve' => function ($product) {
                        $specificAttributes = $product->getSpecificAttributes();
                        $attributes = [];
                        foreach ($specificAttributes as $key => $values) {
                            $attributes[] = [
                                'key' => $key,
                                'values' => $values
                            ];
                        }
                        return $attributes;
                    }
                ],
                'prices' => ['type' => Type::listOf(self::$priceType)]
            ],
            'resolveField' => function ($product, $args, $context, $info) {
                $fieldName = $info->fieldName;
                $getter = 'get' . ucfirst($fieldName);
                if (method_exists($product, $getter)) {
                    return $product->$getter();
                } else {
                    return $product->$fieldName ?? null;
                }
            }
        ]);
    }
}

ProductType::initialize();
