<?php

namespace App\Model;

use Config\Database;

class PriceModel
{
    protected $database;

    public function __construct()
    {
        $this->database = new Database();
    }

    public function getProductPrices($productId)
    {
        $sql = "SELECT 
                    pp.amount,
                    cu.currency,
                    cu.symbol
                FROM 
                    product_prices pp
                LEFT JOIN 
                    currencies cu ON pp.currency_id = cu.id
                WHERE 
                    pp.product_id = ?";

        $connect = $this->database->connectToDatabase();
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("s", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        $prices = [];

        while ($row = $result->fetch_assoc()) {
            $prices[] = [
                'amount' => (float) $row['amount'],
                'currency' => [
                    'label' => $row['currency'],
                    'symbol' => $row['symbol'],
                ],
            ];
        }

        return $prices;
    }
}
