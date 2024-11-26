package barbershop.user_service.repositories;

import barbershop.user_service.entities.User;

import java.util.List;

public interface UserRepositoryCustom {
    void updateUserProfile(User user);
    int statisticQuantity(int month, int year);
    List<User> getListUserByIdsAndKeyword(List<Integer> ids, String keyword);
}
