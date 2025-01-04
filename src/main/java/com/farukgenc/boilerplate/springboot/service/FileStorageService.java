package com.farukgenc.boilerplate.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads";

    public FileStorageService(){
        File file = new File(uploadDir);
        if(!file.exists()){
            file.mkdir();
        }
    }

    public String saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.write(filePath, file.getBytes());
        return fileName;
    }

    public File getFile(String fileName) {
        return new File(uploadDir + "/" + fileName);
    }
}
