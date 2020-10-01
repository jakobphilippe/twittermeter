<?php
//setting header to json
header('Content-Type: application/json');

//database
define('DB_HOST', 'HOST');
define('DB_USERNAME', 'USER');
define('DB_PASSWORD', 'PASS');
define('DB_NAME', 'DB_NAME');

//get connection
$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

if(!$mysqli){
  die("Connection failed: " . $mysqli->error);
}

//query to get data from the table
$query = sprintf("SELECT timestamp, polarity FROM twittermeter ORDER BY timestamp DESC LIMIT 1");

//execute query
$result = $mysqli->query($query);

//loop through the returned data
$data = array();
foreach ($result as $row) {
  $data[] = $row;
}

$data = array_reverse($data);

//free memory associated with result
$result->close();

//close connection
$mysqli->close();

//now print the data
print json_encode($data);