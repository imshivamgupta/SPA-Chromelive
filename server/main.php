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
} elseif ($req == 'update') {
    extract($_POST);
    switch ($type) {
        case 'frequency_trend_data':
            $sql = "UPDATE $type SET TYPE='" .
            mysqli_real_escape_string($con, $TYPE) . "', MARKET='" .
            mysqli_real_escape_string($con, $MARKET) . "', CITY='" . mysqli_real_escape_string($con, $CITY) . "', HEADEND='" . mysqli_real_escape_string($con, $HEADEND) . "', CRN_NO='" . mysqli_real_escape_string($con, $CRN_NO) . "', MSOs='" . mysqli_real_escape_string($con, $MSOs) . "', CHANNEL='" .
            mysqli_real_escape_string($con, $CHANNEL) . "' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
            break;
        case 'carriage_impact_data':
            $sql = "UPDATE $type SET TYPE='" .
            mysqli_real_escape_string($con, $TYPE) . "', MARKET='" .
            mysqli_real_escape_string($con, $MARKET) . "', CITY='" . mysqli_real_escape_string($con, $CITY) . "', HEADEND='" . mysqli_real_escape_string($con, $HEADEND) . "', CRN_NO='" . mysqli_real_escape_string($con, $CRN_NO) . "', MSOs='" . mysqli_real_escape_string($con, $MSOs) . "', CHANNEL='" .
            mysqli_real_escape_string($con, $CHANNEL) . "', IMPACT='".
            mysqli_real_escape_string($con, $IMPACT)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'carriage_impact_graph':
            $sql = "UPDATE $type SET Week='" .
            mysqli_real_escape_string($con, $Week) . "', Actioned='" .
            mysqli_real_escape_string($con, $Actioned) . "', Reported='" . mysqli_real_escape_string($con, $Reported) . "' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'weekly_carriage_data':
            $sql = "UPDATE $type SET TYPE='" .
            mysqli_real_escape_string($con, $TYPE) . "', MARKET='" .
            mysqli_real_escape_string($con, $MARKET) . "', CITY='" . mysqli_real_escape_string($con, $CITY) . "', HEADEND='" . mysqli_real_escape_string($con, $HEADEND) . "', CRN_NO='" . mysqli_real_escape_string($con, $CRN_NO) . "', MSOs='" . mysqli_real_escape_string($con, $MSOs) . "', CHANNEL='" .
            mysqli_real_escape_string($con, $CHANNEL) . "', PARAMETER='".
            mysqli_real_escape_string($con, $PARAMETER)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'weekly_carriage_graph':
            $sql = "UPDATE $type SET Week='" .
            mysqli_real_escape_string($con, $Week) . "', Carriage_Value='" .
            mysqli_real_escape_string($con, $Carriage_Value) . "', Carriage_Loss='" . mysqli_real_escape_string($con, $Carriage_Loss) . "', Subscribers_Loss='".
            mysqli_real_escape_string($con, $Subscribers_Loss)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'active_subs_data':
            $sql = "UPDATE $type SET TYPE='" .
            mysqli_real_escape_string($con, $TYPE) . "', MARKET='" .
            mysqli_real_escape_string($con, $MARKET) . "', CITY='" . mysqli_real_escape_string($con, $CITY) . "', HEADEND='" . mysqli_real_escape_string($con, $HEADEND) . "', CRN_NO='" . mysqli_real_escape_string($con, $CRN_NO) . "', MSOs='" . mysqli_real_escape_string($con, $MSOs) . "', CHANNEL='" .
            mysqli_real_escape_string($con, $CHANNEL) . "', SUBS='".
            mysqli_real_escape_string($con, $SUBS)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'total_subs_data':
            $sql = "UPDATE $type SET TYPE='" .
            mysqli_real_escape_string($con, $TYPE) . "', MARKET='" .
            mysqli_real_escape_string($con, $MARKET) . "', CITY='" . mysqli_real_escape_string($con, $CITY) . "', HEADEND='" . mysqli_real_escape_string($con, $HEADEND) . "', CRN_NO='" . mysqli_real_escape_string($con, $CRN_NO) . "', MSOs='" . mysqli_real_escape_string($con, $MSOs) . "', CHANNEL='" .
            mysqli_real_escape_string($con, $CHANNEL) . "', IMPACT='".
            mysqli_real_escape_string($con, $IMPACT)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        case 'total_subs_graph':
            $sql = "UPDATE $type SET Week='" .
            mysqli_real_escape_string($con, $Week) . "', Switched_On='" .
            mysqli_real_escape_string($con, $Switched_On) . "', Switched_Off='" . mysqli_real_escape_string($con, $Switched_Off) . "', Channel_Reach='".
            mysqli_real_escape_string($con, $Channel_Reach)."' WHERE ID='" . mysqli_real_escape_string($con, $ID) . "'";
        break;
        default:
            break;
    }
    if (mysqli_query($con, $sql)) {
        $res['status'] = '200';
        $res['message'] = 'Updated Successfully';
    } else {
        $res['status'] = '201';
        $res['message'] = mysqli_error($con);
    }
    echo json_encode($res);
} elseif ($req == 'only_week') {
    extract($_POST);
    $sql = "UPDATE $type SET $week_name='".
    mysqli_real_escape_string($con, $week_value)."' WHERE ID='$id'";
    if (mysqli_query($con, $sql)) {
        $res['status'] = '200';
        $res['message'] = 'Updated Successfully';
    } else {
        $res['status'] = '201';
        $res['message'] = mysqli_error($con);
    }
    echo json_encode($res);
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
