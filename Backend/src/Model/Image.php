<?php

namespace App\Model;

class Image
{
    protected $imageUrl;

    public function __construct($imageUrl)
    {
        $this->setImageUrl($imageUrl);
    }

    public function getImageUrl()
    {
        return $this->imageUrl;
    }

    public function setImageUrl($imageUrl)
    {
        $this->imageUrl = $imageUrl['imageUrl'];
    }

    public function jsonSerialize()
    {
        return ['imageUrl' => $this->getImageUrl()];
    }
}
