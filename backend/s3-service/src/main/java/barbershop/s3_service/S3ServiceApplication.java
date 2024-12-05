package barbershop.s3_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class S3ServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(S3ServiceApplication.class, args);
	}
}
