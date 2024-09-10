package barbershop.user_service.securities;

import org.mindrot.jbcrypt.BCrypt;

public class Bcrypt {
    public static String hashpw(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(10));
    }

    public static boolean checkpw(String password, String hash) {
        return BCrypt.checkpw(password, hash);
    }
}
