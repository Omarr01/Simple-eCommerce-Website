<?php

namespace App\Factory;

class ProductAttributeFactory
{
    private static $attributeMap = [
        'text' => 'App\\Model\\Attributes\\TextAttribute',
        'swatch' => 'App\\Model\\Attributes\\SwatchAttribute'
    ];

    public static function create($attributeType, $id, $displayValue, $value)
    {
        if (array_key_exists($attributeType, self::$attributeMap)) {
            $className = self::$attributeMap[$attributeType];
            if (class_exists($className)) {
                return new $className($id, $displayValue, $value);
            } else {
                throw new \Exception("Class $className does not exist.");
            }
        } else {
            throw new \Exception("Unknown product: $attributeType");
        }
    }

    public static function addAttributeMapping($attributeType, $className)
    {
        if (class_exists($className)) {
            self::$attributeMap[$attributeType] = $className;
        } else {
            throw new \Exception("Class $className does not exist.");
        }
    }
}
