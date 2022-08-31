<?php

class ConfigDB
{

    public static function getConfig(){
        switch ($_SERVER['SERVER_NAME']){
            default:
                $configDB = array(
                    'hostname' => 'localhost',
                    'usuario' => 'root',
                    'password' => '',
                    'bd' => 'php_cap_ago22',
                    'puerto' => '3306'
                );
                break;
        }
        return $configDB;
    }

}