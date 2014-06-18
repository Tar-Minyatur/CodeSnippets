<?php
function concatSprites($fileMask, $cols, $outputFile) {
	$files = glob($fileMask);

	if (count($files) < 1) {
		return false;
	}

	$target = null;
	$y = 0;
	$x = 0;
	$width = 0;
	$height = 0;

	foreach ($files as $file) {

		if (is_null($target)) {
			$size = getimagesize($file);
			$width = $size[0];
			$height = $size[1];
			$targetWidth = $width * $cols;
			$targetHeight = $height * ceil(count($files) / $cols);
			$target = imagecreatetruecolor($targetWidth, $targetHeight);
			$transparent = imagecolorallocatealpha($target, 0, 0, 0, 127); 
			imagefill($target, 0, 0, $transparent); 
			imagealphablending($target, true);
		}

		$src = imagecreatefrompng($file);
		imagealphablending($src, true);

		imagecopy($target, $src, $x * $width, $y * $height, 0, 0, $width, $height);
		imagedestroy($src);

		$x++;
		if ($x >= $cols) {
			$y++;
			$x = 0;
		}
	}

	imagealphablending($target, false);
	imagesavealpha($target, true);
	imagepng($target, $outputFile);
	imagedestroy($target);

	return true;
}

if (!function_exists("imagecreatetruecolor")) {
	die("Error: This script requires that the GD library is installed!\n\n");
}

if (PHP_SAPI != 'cli') {
	die("Error: This script should only be run from the CLI. Don't try to execute it via webserver!\n\n");
}

if (count($argv) < 4) {
	die("At least one argument is missing!\nUsage: php " . $argv[0] . " <file mask> <# columns> <output file> [memory limit]\n\n");
}

$fileMask = $argv[1];
$columns = max(1, intval($argv[2]));
$outputFile = $argv[3];
$memoryLimit = "2048M";

if (count($argv) > 4) {
	$memoryLimit = $argv[4];
}

if (!ini_set('memory_limit', $memoryLimit)) {
	echo "Warning: Could not change the memory limit. Execution might fail!\n";
}

if (!is_writable($outputFile)) {
	die("Error: Output file is not writable!\n\n");
}

if (concatSprites($fileMask, $columns, $outputFile)) {
	echo "SUCCESS!\nAll images have been combined into one! :)\n\n";
} else {
	echo "FAILURE!\nSomething went wrong. :(\n\n";
}
