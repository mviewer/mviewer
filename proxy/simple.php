<?

$pos = strrpos($url, "http://DOMAINE/mviewer");
if ($pos === false) { // note : 3 signes "="
	$opts = array('http' => array('proxy' => 'tcp://XXX.XXX.XXX.XXX:YYYY', 'request_fulluri' => true));
	$context = stream_context_create($opts);
	$url = urldecode($_REQUEST['url']);
	$s = file_get_contents($url, false, $context);
} else {
	// Pas de proxy vers soi-même
	// On va chercher la ressource sur le disque
	// Juste un problème : pas valable s'il y a des paramètres ...
	$url = str_replace('http://DOMAINE/mviewer', '/opt/www/mviewer', $url);
	$s = file_get_contents($url);
}

echo $s;
?>
