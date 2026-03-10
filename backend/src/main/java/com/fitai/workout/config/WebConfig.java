package com.fitai.workout.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * In production, images are stored on AWS S3 and served via their public URL.
     * The /uploads/** resource handler is only needed in development (aws.enabled=false).
     * Keeping it in prod is harmless but the local uploads/ folder won't be used.
     */
    @Value("${aws.enabled:false}")
    private boolean awsEnabled;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!awsEnabled) {
            Path uploadDir = Paths.get("uploads");
            String uploadPath = uploadDir.toFile().getAbsolutePath();
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:///" + uploadPath + "/");
        }
    }
}
