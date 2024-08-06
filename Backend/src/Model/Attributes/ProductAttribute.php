<?php

namespace App\Model\Attributes;

abstract class ProductAttribute
{
    protected $id;
    protected $displayValue;
    protected $value;

    public function __construct($id, $displayValue, $value)
    {
        $this->setId($id);
        $this->setDisplayValue($displayValue);
        $this->setValue($value);
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getDisplayValue()
    {
        return $this->displayValue;
    }

    public function setDisplayValue($displayValue)
    {
        $this->displayValue = $displayValue;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }
}
