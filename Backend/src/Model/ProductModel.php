<?php

namespace App\Model;

use Config\Database;
use App\Model\AttributeModel;
use App\Model\PriceModel;
use App\Factory\ProductFactory;

class ProductModel
{
    protected $database;
    protected $attributeModel;
    protected $priceModel;

    public function __construct()
    {
        $this->database = new Database();
        $this->attributeModel = new AttributeModel();
        $this->priceModel = new PriceModel();
    }

    public function getAllProducts()
    {
        $sql = "SELECT 
                    p.id as pid, 
                    p.name, 
                    p.inStock, 
                    p.description, 
                    c.name as category, 
                    p.brand
                FROM 
                    products p
                LEFT JOIN 
                    categories c ON p.category_id = c.id";

        $connect = $this->database->connectToDatabase();
        $result = mysqli_query($connect, $sql);

        $products = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $productId = $row['pid'];

            if (!isset($products[$productId])) {
                $products[$productId] = [
                    'pid' => $row['pid'],
                    'name' => $row['name'],
                    'inStock' => (bool) $row['inStock'],
                    'description' => $row['description'],
                    'category' => $row['category'],
                    'brand' => $row['brand'],
                    'gallery' => [],
                    'attributes' => [],
                    'prices' => []
                ];
            }
        }

        $sql = "SELECT 
                    product_id, 
                    image_url as imageUrl
                FROM 
                    product_gallery";

        $result = mysqli_query($connect, $sql);

        while ($row = mysqli_fetch_assoc($result)) {
            $productId = $row['product_id'];

            if (isset($products[$productId])) {
                $products[$productId]['gallery'][] = ['imageUrl' => $row['imageUrl']];
            }
        }

        foreach ($products as $productId => $product) {
            $products[$productId]['attributes'] = $this->attributeModel->getProductAttributes($productId);
            $products[$productId]['prices'] = $this->priceModel->getProductPrices($productId);
        }

        $productObjects = array();
        foreach ($products as $product) {
            $type = ProductFactory::create($product['pid']);
            $productObjects[] = new $type($product);
        }

        return $productObjects;
    }

    public function getProductById($pid)
    {
        $connect = $this->database->connectToDatabase();

        $sql = "SELECT 
                    p.id as pid,
                    p.name, 
                    p.inStock, 
                    p.description, 
                    c.name as category, 
                    p.brand
                FROM 
                    products p
                LEFT JOIN 
                    categories c ON p.category_id = c.id
                WHERE 
                    p.id = ?";

        $stmt = $connect->prepare($sql);
        $stmt->bind_param("s", $pid);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $product = [
                'pid' => $row['pid'],
                'name' => $row['name'],
                'inStock' => (bool) $row['inStock'],
                'description' => $row['description'],
                'category' => $row['category'],
                'brand' => $row['brand'],
                'gallery' => [],
                'attributes' => [],
                'prices' => []
            ];
        } else {
            return null;
        }

        $sql = "SELECT 
                    image_url as imageUrl
                FROM 
                    product_gallery
                WHERE 
                    product_id = ?";

        $stmt = $connect->prepare($sql);
        $stmt->bind_param("s", $pid);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $product['gallery'][] = ['imageUrl' => $row['imageUrl']];
        }

        $product['attributes'] = $this->attributeModel->getProductAttributes($pid);
        $product['prices'] = $this->priceModel->getProductPrices($pid);

        $type = ProductFactory::create($product['pid']);

        return new $type($product);
    }
}
