<?php
require './config.php';
$req = $_POST['req'];
if ($req == 'fetch') {
    $page = $_POST['page'];
    $data_type = $_POST['data_type'];
    $sql = "SELECT * FROM " . $data_type;
    // Array with Sql and remaining pages
    $arr = fetch($con, $sql, $page);
    $new_sql = $arr[0];
    $remaining_pages = $arr[1];
    echo generate_response($con, $new_sql, $page, $remaining_pages);
} elseif ($req == 'filter') {
    $data_type = $_POST['data_type'];
    $channel = $_POST['channel'];
    $page = $_POST['page'];
    $sql = "SELECT * FROM " . $data_type . " WHERE CHANNEL='" . $channel . "'";
    $result = mysqli_query($con, $sql);
    $total_items = mysqli_num_rows($result);
    $item_per_page = $_POST['items_per_page'];
    $total_pages = ceil($total_items / $item_per_page);
    $remaining_pages = $total_pages - $page;
    $offset = ($page - 1) * $item_per_page;
    $sql = "SELECT * FROM $data_type WHERE CHANNEL='{$channel}' ORDER BY ID DESC LIMIT $item_per_page OFFSET $offset";
    echo generate_response($con, $sql, $page, $remaining_pages);
}

function fetch($con, $sql, $page)
{
    $result = mysqli_query($con, $sql);
    $total_items = mysqli_num_rows($result);
    $item_per_page = 10;
    return pagination($page, $total_items, $item_per_page);
}

function pagination($page, $total_items, $item_per_page)
{
    global $data_type;
    $total_pages = ceil($total_items / $item_per_page);
    $remaining_pages = $total_pages - $page;
    $offset = ($page - 1) * $item_per_page;
    $sql = "SELECT * FROM $data_type ORDER BY ID DESC LIMIT $item_per_page OFFSET $offset";
    return array($sql, $remaining_pages);
}

// For Generating Response
function generate_response($con, $sql, $page = 1, $remaining_pages)
{
    global $data_type;
    $data = $con->query($sql);
    if ($data->num_rows > 0) {
        $data_set = array();
        while ($row = $data->fetch_assoc()) {
            array_push($data_set, $row);
        }
        $res['status'] = '200';
        $res['data_type'] = $data_type;
        $res['page'] = $page;
        $res['remaining_pages'] = $remaining_pages;
        $res['data'] = $data_set;
    } else {
        $res['status'] = '402';
        $res['message'] = 'No Data';
    }
    return json_encode($res);
}
