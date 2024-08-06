<?php

namespace App\Model\Attributes;

class SwatchAttribute extends ProductAttribute
{
    protected $type;

    public function __construct($id, $displayValue, $value)
    {
        parent::__construct($id, $displayValue, $value);
        $this->setType('swatch');
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }
}
