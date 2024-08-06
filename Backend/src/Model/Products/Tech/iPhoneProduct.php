<?php

namespace App\Model\Products\Tech;

class iPhoneProduct extends TechProduct
{
    protected $colors = [];

    public function __construct($data)
    {
        parent::__construct($data);

        $this->setColors($data['attributes']);
    }

    public function getColors()
    {
        return $this->colors;
    }

    public function setColors($attributes)
    {
        $colors = $this->getAttributeInstances($attributes, 'Color');

        $this->colors = $colors;
    }

    public function getSpecificAttributes()
    {
        return array_merge(parent::getSpecificAttributes(), [
            'Color' => $this->getColors()
        ]);
    }
}
