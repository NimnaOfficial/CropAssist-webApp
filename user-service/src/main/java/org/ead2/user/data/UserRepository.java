package org.ead2.user.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User,String> {

    @Query("select u from User u where u.nic=?1")
    User existsByNIC(String nic);
}
