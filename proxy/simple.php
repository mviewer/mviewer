<?

$domaine='DOMAINE';
$ip='XXX.XXX.XXX.XXX';
$port='YYYY';
$chemin='LOCALPATH';

// ---
// --- Offrir un moyen de ne passer par un proxy
// ---
if (isset($_REQUEST['mviewernoproxy'])&&($_REQUEST['mviewernoproxy']==1))
	$s = file_get_contents($url);
else {
	$pos = strrpos($url, "http://$domaine/");
	if ($pos === false) { // note : 3 signes "="
		$opts = array('http' => array('proxy' => "tcp://$ip:$port", 'request_fulluri' => true));
		$context = stream_context_create($opts);
		$url = urldecode($_REQUEST['url']);
		$s = file_get_contents($url, false, $context);
	} else {
		// Pas de proxy vers soi-même
		// On va chercher la ressource sur le disque
		// Juste un problème : pas valable s'il y a des paramètres ...
		$url = str_replace("http://$domaine/mviewer", $chemin, $url);
		$s = file_get_contents($url);
	}
}

echo $s;
?>
