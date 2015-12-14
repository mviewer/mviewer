<?php
header('Content-type: application/json');
$reference = date("YmdHis");
$legend = $_POST['legend'];
$legend = str_replace('data:image/png;base64,', '', $legend);
$legend = str_replace(' ', '+', $legend);
$datalegend = base64_decode($legend);
$srclegend = '/var/www/htdocs/prints/legend-' . $reference .".png";
file_put_contents($srclegend, $datalegend);
$map = $_POST['map'];
$map = str_replace('data:image/png;base64,', '', $map);
$map = str_replace(' ', '+', $map);
$datamap = base64_decode($map);
$srcmap = '/var/www/htdocs/prints/map-' . $reference .".png";
if (file_put_contents($srcmap, $datamap)) {
    echo '{"success":true, "job":'.json_encode($reference).'}';
}
else //Sinon (la fonction renvoie FALSE).
{
   echo '{"success":false, "message": "erreur"}';
}
?>