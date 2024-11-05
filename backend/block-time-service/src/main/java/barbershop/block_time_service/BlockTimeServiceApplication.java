package barbershop.block_time_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class BlockTimeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlockTimeServiceApplication.class, args);
	}
}
