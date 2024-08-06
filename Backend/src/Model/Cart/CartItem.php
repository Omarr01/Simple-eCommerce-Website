<?php

namespace App\Model\Cart;

use JsonSerializable;
use App\Model\Product;

class CartItem
{
    protected $id;
    protected Product $product;
    protected $selectedAttributes;
    protected $quantity;

    public function __construct($data)
    {
        if (is_array($data)) {
            $this->setId($data['id']);
            $this->setProduct($data['product']);
            $this->setSelectedAttributes($data['selectedAttributes']);
            $this->setQuantity($data['quantity']);
        }
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getProduct()
    {
        return $this->product;
    }

    public function setProduct($product)
    {
        $this->product = $product;
    }

    public function getSelectedAttributes()
    {
        return $this->selectedAttributes;
    }

    public function setSelectedAttributes($selectedAttributes)
    {
        $this->selectedAttributes = array_map(function ($selectedAttribute) {
            return new SelectedAttribute($selectedAttribute['attributeName'], $selectedAttribute['attributeId']);
        }, $selectedAttributes);
    }

    public function getQuantity()
    {
        return $this->quantity;
    }

    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }
}
