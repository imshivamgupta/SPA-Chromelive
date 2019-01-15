<?php
$dbhost = 'localhost';
$dbuser = '';
$dbpass = '';
$dbname = 'test';
date_default_timezone_set('Asia/Kolkata');
$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

mysqli_set_charset($con, 'utf8');