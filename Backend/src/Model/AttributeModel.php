<?php

namespace App\Model;

use Config\Database;

class AttributeModel
{
    protected $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    public function getProductAttributes($productId)
    {
        $sql = "SELECT 
                    a.name as attribute_name, 
                    a.type as attribute_type, 
                    pa.attribute_display_value, 
                    pa.attribute_value
                FROM 
                    product_attributes pa
                LEFT JOIN 
                    attributes a ON pa.attribute_id = a.id
                WHERE 
                    pa.product_id = ?";

        $connect = $this->database->connectToDatabase();
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("s", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        $attributes = [];

        while ($row = $result->fetch_assoc()) {
            $attributeName = $row['attribute_name'];
            if (!isset($attributes[$attributeName])) {
                $attributes[$attributeName] = [
                    'id' => $attributeName,
                    'name' => $attributeName,
                    'type' => $row['attribute_type'],
                    'items' => []
                ];
            }
            $attributes[$attributeName]['items'][] = [
                'displayValue' => $row['attribute_display_value'],
                'value' => $row['attribute_value'],
                'id' => $row['attribute_display_value'],
            ];
        }

        return $attributes;
    }
}
