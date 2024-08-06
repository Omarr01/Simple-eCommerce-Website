<?php

namespace App\Model\Prices;

class Currency
{
    protected $label;
    protected $symbol;

    public function __construct($label, $symbol)
    {
        $this->setLabel($label);
        $this->setSymbol($symbol);
    }

    public function getLabel()
    {
        return $this->label;
    }

    public function setLabel($label)
    {
        $this->label = $label;
    }

    public function getSymbol()
    {
        return $this->symbol;
    }    

    public function setSymbol($symbol)
    {
        $this->symbol = $symbol;
    }
}
