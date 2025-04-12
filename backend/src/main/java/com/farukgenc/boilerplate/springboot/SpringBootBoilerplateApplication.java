package com.farukgenc.boilerplate.springboot;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import java.util.TimeZone;

@SpringBootApplication
@EnableJpaRepositories
@EnableAspectJAutoProxy
public class SpringBootBoilerplateApplication {

	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
		System.out.println("Zona horaria establecida en: " + TimeZone.getDefault().getID());
	}

	public static void main(String[] args) {
		SpringApplication.run(SpringBootBoilerplateApplication.class, args);
	}
}

