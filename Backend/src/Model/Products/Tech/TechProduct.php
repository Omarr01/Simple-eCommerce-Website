<?php

namespace App\Model\Products\Tech;

use App\Model\Product;

class TechProduct extends Product
{
    protected $capacities = [];

    public function __construct($data)
    {
        parent::__construct($data);

        $this->setCapacities($data['attributes']);
    }

    public function getCapacities()
    {
        return $this->capacities;
    }

    public function setCapacities($attributes)
    {
        $capacities = $this->getAttributeInstances($attributes, 'Capacity');

        $this->capacities = $capacities;
    }

    public function getSpecificAttributes()
    {
        return [
            'Capacity' => $this->getCapacities()
        ];
    }
}
