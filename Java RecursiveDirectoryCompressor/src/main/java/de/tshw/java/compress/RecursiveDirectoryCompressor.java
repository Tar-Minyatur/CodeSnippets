package de.tshw.java.compress;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.ArchiveOutputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.compress.utils.IOUtils;

import java.io.*;
import java.util.zip.GZIPOutputStream;

public class RecursiveDirectoryCompressor {

    public static TarArchiveOutputStream createTarGzArchive(File archiveFile) throws IOException {
        return new TarArchiveOutputStream(
                new GZIPOutputStream(
                        new BufferedOutputStream(
                                new FileOutputStream(archiveFile)
                        )
                )
        );
    }

    public static ZipArchiveOutputStream createZipArchive(File archiveFile) throws IOException {
        return new ZipArchiveOutputStream(
                new BufferedOutputStream(
                        new FileOutputStream(archiveFile)
                )
        );
    }

    public void archiveDirectory(ArchiveOutputStream archive, File targetDirectory) throws IOException {
        addEntriesToArchive(archive, targetDirectory, "");

        archive.flush();
        archive.close();
    }

    private void addEntriesToArchive(ArchiveOutputStream archive, File root, String currentFile) throws IOException {
        String currentFilePath = currentFile + ((currentFile.length() > 0) ? '/' : "") + root.getName();
        ArchiveEntry archiveEntry = archive.createArchiveEntry(root, currentFilePath);
        archive.putArchiveEntry(archiveEntry);

        File[] files = root.listFiles();
        if (root.isDirectory() && (files != null)) {
            archive.closeArchiveEntry();
            for (File file: files) {
                addEntriesToArchive(archive, file, currentFilePath);
            }
        }
        else {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(root));
            IOUtils.copy(in, archive);
            archive.closeArchiveEntry();
            in.close();
        }
    }

}
