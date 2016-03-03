package de.tshw.java.compress;

import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;

import java.io.File;
import java.io.IOException;

public class RecursiveDirectoryCompressorTest {

    public static void main(String[] args) throws IOException {

        RecursiveDirectoryCompressor compressor = new RecursiveDirectoryCompressor();

        File outputFolder = new File("target/");
        if (!outputFolder.exists()) {
            outputFolder.mkdir();
        }
        File targetDirectory = new File("src/test/resources/test");

        File archiveFile = new File("target/test.zip");
        ZipArchiveOutputStream zipArchive = RecursiveDirectoryCompressor.createZipArchive(archiveFile);
        compressor.archiveDirectory(zipArchive, targetDirectory);
        System.out.println("Compressed folder into file: " + archiveFile.getAbsolutePath());

        archiveFile = new File("target/test.tar.gz");
        TarArchiveOutputStream tarGzArchive = RecursiveDirectoryCompressor.createTarGzArchive(archiveFile);
        compressor.archiveDirectory(tarGzArchive, targetDirectory);
        System.out.println("Compressed folder into file: " + archiveFile.getAbsolutePath());
    }

}
