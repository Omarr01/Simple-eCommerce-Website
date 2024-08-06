<?php

namespace App\Model\Products\Tech;

use App\Model\Products\Tech\TechProduct;

class iMacProduct extends TechProduct
{
    protected $withUSB3Ports = [];
    protected $touchIDInKeyboard = [];

    public function __construct($data)
    {
        parent::__construct($data);

        $attributes = $data['attributes'];

        $this->setWithUSB3Ports($attributes);

        $this->setTouchIDInKeyboard($attributes);
    }

    public function getWithUSB3Ports()
    {
        return $this->withUSB3Ports;
    }

    public function setWithUSB3Ports($attributes)
    {
        $withUSB3Ports = $this->getAttributeInstances($attributes, 'With USB 3 ports');

        $this->withUSB3Ports = $withUSB3Ports;
    }

    public function getTouchIDInKeyboard()
    {
        return $this->touchIDInKeyboard;
    }

    public function setTouchIDInKeyboard($attributes)
    {
        $touchIDInKeyboard = $this->getAttributeInstances($attributes, 'Touch ID in keyboard');

        $this->touchIDInKeyboard = $touchIDInKeyboard;
    }

    public function getSpecificAttributes()
    {
        return array_merge(parent::getSpecificAttributes(), [
            'With USB3 Ports' => $this->getWithUSB3Ports(),
            'Touch ID In Keyboard' => $this->getTouchIDInKeyboard()
        ]);
    }
}
