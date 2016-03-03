# Java RecursiveDirectoryCompressor

I recently needed a way to compress an entire directory into an archive. After searching for quite a a while, I could
not find a library that wrapped this task into a single method call. Most recommended was Apache Commons Compress, but
there are a lot of steps involved to actually get the desired result.

After an unexpected amount of testing, I finally ended up with this class.

I did not bother putting it into a proper library, because you can basically just copy the single class into your
project and I have no real intention of updating it regularly.

## Dependencies

- Apache Commons Compress: `org.apache.commons:commons-compress`

## Usage

    /*
     * Create an ArchiveOutputStream using the helper functions.
     * Any other from org.apache.commons.compress.archivers should also work, but you have to set it up yourself.
     */
    ArchiveOutputStream archive = RecursiveDirectoryCompressor.createZipArchive(new File("output.zip"));
    ArchiveOutputStream archive = RecursiveDirectoryCompressor.createTarGzArchive(new File("output.tar.gz"));

    /*
     * Locate the directory you want to archive
     */
     File targetDirectory = File("path/to/the/folder");

     /*
      * Create the archive
      */
     RecursiveDirectoryCompressor compressor = new RecursiveDirectoryCompressor();
     compressor.archiveDirectory(zipArchive, targetDirectory);

If any problem occurs, the `archiveDirectory()` method will throw an unchanged `IOException` from the underlying
framework.

## Test

There is a test class, which does not really execute any tests, but actually just compresses an example directory tree
(`src/test/resources/test/`) into a `test.zip` and a `test.tar.gz`.

## License

Feel free to do what ever you want with this code. I do not offer support for this code. Also, you use this code at your
own risk. Don't copy it blindly and blame me if something breaks. ;)