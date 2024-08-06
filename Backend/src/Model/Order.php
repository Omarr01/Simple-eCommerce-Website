<?php

namespace App\Model;

use App\Enum\OrderStatus;

class Order
{
    protected $id;
    protected $orderedItems;
    protected $totalPrice;
    protected OrderStatus $status;

    public function __construct($id, $orderedItems, $totalPrice, OrderStatus $status)
    {
        $this->setId($id);
        $this->setOrderedItems($orderedItems);
        $this->setTotalPrice($totalPrice);
        $this->setStatus($status);
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getOrderedItems()
    {
        return $this->orderedItems;
    }

    public function setOrderedItems($orderedItems)
    {
        $this->orderedItems = $orderedItems;
    }

    public function getTotalPrice()
    {
        return $this->totalPrice;
    }

    public function setTotalPrice($totalPrice)
    {
        $this->totalPrice = $totalPrice;
    }

    public function getStatus(): OrderStatus
    {
        return $this->status;
    }

    public function setStatus(OrderStatus $status)
    {
        $this->status = $status;
    }
}
