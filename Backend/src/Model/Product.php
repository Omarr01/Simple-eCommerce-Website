<?php

namespace App\Model;

use App\Model\Prices\Price;
use App\Factory\ProductAttributeFactory;

abstract class Product
{
    protected $pid;
    protected $name;
    protected $inStock;
    protected $gallery;
    protected $description;
    protected $category;
    protected $prices;
    protected $brand;

    public function __construct($data)
    {
        if (is_array($data)) {
            $this->setPid($data['pid']);
            $this->setName($data['name']);
            $this->setInStock($data['inStock']);
            $this->setGallery($data['gallery']);
            $this->setDescription($data['description']);
            $this->setCategory($data['category']);
            $this->setPrices($data['prices']);
            $this->setBrand($data['brand']);
        }
    }

    abstract public function getSpecificAttributes();

    public function getPid()
    {
        return $this->pid;
    }

    public function setPid($pid)
    {
        $this->pid = $pid;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getInStock()
    {
        return $this->inStock;
    }

    public function setInStock($inStock)
    {
        $this->inStock = $inStock;
    }

    public function getGallery()
    {
        return $this->gallery;
    }

    public function setGallery($gallery)
    {
        $this->gallery = array_map(function ($imageUrl) {
            return new Image($imageUrl);
        }, $gallery);
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory($category)
    {
        $this->category = $category;
    }

    public function getPrices()
    {
        return $this->prices;
    }

    public function setPrices($prices)
    {
        $this->prices = array_map(function ($prices) {
            return new Price($prices['amount'], $prices['currency']);
        }, $prices);
    }

    public function getBrand()
    {
        return $this->brand;
    }

    public function setBrand($brand)
    {
        $this->brand = $brand;
    }

    public function getAttributeInstances($attributes, $attributeId)
    {
        $items = [];
        $type = '';

        foreach ($attributes as $attribute) {
            if ($attribute['id'] === $attributeId) {
                $items = $attribute['items'];
                $type = $attribute['type'];
                break;
            }
        }

        $attributeInstances = [];
        foreach ($items as $item) {
            $attributeInstance = ProductAttributeFactory::create($type, $item['id'], $item['displayValue'], $item['value']);
            $attributeInstances[] = $attributeInstance;
        }

        return $attributeInstances;
    }
}
