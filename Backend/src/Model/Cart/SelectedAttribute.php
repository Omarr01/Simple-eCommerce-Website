<?php

namespace App\Model\Cart;

class SelectedAttribute
{
    protected $attributeName;
    protected $attributeId;

    public function __construct($attributeName, $attributeId)
    {
        $this->setAttributeName($attributeName);
        $this->setAttributeId($attributeId);
    }

    public function getAttributeName()
    {
        return $this->attributeName;
    }

    public function setAttributeName($attributeName)
    {
        $this->attributeName = $attributeName;
    }

    public function getAttributeId()
    {
        return $this->attributeId;
    }

    public function setAttributeId($attributeId)
    {
        $this->attributeId = $attributeId;
    }
}
