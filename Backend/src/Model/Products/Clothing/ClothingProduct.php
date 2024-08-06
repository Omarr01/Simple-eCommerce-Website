<?php

namespace App\Model\Products\Clothing;

use App\Model\Product;

class ClothingProduct extends Product
{
    protected $sizes = [];

    public function __construct($data)
    {
        parent::__construct($data);

        $this->setSizes($data['attributes']);
    }

    public function getSizes()
    {
        return $this->sizes;
    }

    public function setSizes($attributes)
    {
        $sizes = $this->getAttributeInstances($attributes, 'Size');

        $this->sizes = $sizes;
    }

    public function getSpecificAttributes()
    {
        return [
            'Size' => $this->getSizes()
        ];
    }
}
