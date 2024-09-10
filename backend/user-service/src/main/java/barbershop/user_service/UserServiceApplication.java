package barbershop.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.apache.kafka.clients.admin.NewTopic;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	NewTopic sendEmailRegister() {
		// topic name, partition numbers, replication number = broker server number
		return new NewTopic("send-email-register", 2, (short) 1);
	}
}
