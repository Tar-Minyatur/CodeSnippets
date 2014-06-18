PHP SpriteConcatenator
======================

Sometimes in frontend development animations (be it CSS or JS) have to be created. Best practices suggest
that in this case all sprites should be combined into one image. If you happen to have all frames/sprited
in single files, you might wonder how to combine them easily into one file. This script can help you with
this.

Features
--------

- Can combine any number of PNG files into a single PNG file
- The number of columns is customizeable
- Works also with transparency
      
Usage
-----

Simply call the script using the PHP CLI interface:

    $ php concatSprites.php <file mask> <# columns> <output file> [memory limit]

These are the command line parameters:

- `file mask` defines the set of input files
  Examples: `sprite*.png`, `*_image.png`
- `# columns` sets the number of columns in the result image
- `output file` defines the file name of the result image
- `memory limit` can be defined if you encounter out of memory errors (defaults to 2 GB)

Requirements
============

- Can only be executed from the PHP CLI
- Requires the GD extension to be installed for PHP
- Usually requires more RAM than usually available to PHP

Example
-------

1. Put X images into the current folder
2. Name the images `image1.png`, `image2.png`, ..., `imageX.png`
3. Call `php concatSprites.php image*.png 3 all-images.png`
4. Your combined image has been saved to `all-images.png`
