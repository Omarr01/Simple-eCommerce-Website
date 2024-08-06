<?php

namespace App\Model\Products\Tech;

use App\Model\Product;

class AppleAccessoryProduct extends Product
{
    public function __construct($data)
    {
        parent::__construct($data);
    }

    public function getSpecificAttributes()
    {
        return [];
    }
}
