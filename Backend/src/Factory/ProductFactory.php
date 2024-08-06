<?php

namespace App\Factory;

class ProductFactory
{
    private static $productMap = [
        'huarache-x-stussy-le' => 'App\\Model\\Products\\Clothing\\ShoeProduct',
        'jacket-canada-goosee' => 'App\\Model\\Products\\Clothing\\JacketProduct',
        'ps-5' => 'App\\Model\\Products\\Tech\\GamingConsoleProduct',
        'xbox-series-s' => 'App\\Model\\Products\\Tech\\GamingConsoleProduct',
        'apple-imac-2021' => 'App\\Model\\Products\\Tech\\iMacProduct',
        'apple-iphone-12-pro' => 'App\\Model\\Products\\Tech\\iPhoneProduct',
        'apple-airpods-pro' => 'App\\Model\\Products\\Tech\\AppleAccessoryProduct',
        'apple-airtag' => 'App\\Model\\Products\\Tech\\AppleAccessoryProduct'
    ];

    public static function create($productId)
    {
        if (array_key_exists($productId, self::$productMap)) {
            $className = self::$productMap[$productId];
            if (class_exists($className)) {
                return $className;
            } else {
                throw new \Exception("Class $className does not exist.");
            }
        } else {
            throw new \Exception("Unknown product: $productId");
        }
    }

    public static function addProductMapping($productId, $className)
    {
        if (class_exists($className)) {
            self::$productMap[$productId] = $className;
        } else {
            throw new \Exception("Class $className does not exist.");
        }
    }
}
