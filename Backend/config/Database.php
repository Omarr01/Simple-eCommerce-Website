<?php

namespace Config;

class Database
{
    protected $host = 'localhost';
    protected $user = 'root';
    protected $pass = '';
    protected $dbName = 'scandiweb';

    public function connectToDatabase()
    {
        $connect = mysqli_connect($this->host, $this->user, $this->pass, $this->dbName);
        if (!$connect) {
            die('Connection Failed');
        }
        return $connect;
    }
}
