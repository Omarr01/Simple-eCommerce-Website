<?php

namespace App\Model\Attributes;

class TextAttribute extends ProductAttribute
{
    protected $type;

    public function __construct($id, $displayValue, $value)
    {
        parent::__construct($id, $displayValue, $value);
        $this->setType('text');
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
