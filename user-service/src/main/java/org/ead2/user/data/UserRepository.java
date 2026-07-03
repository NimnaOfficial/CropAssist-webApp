package org.ead2.user.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User,Long> {

    @Query("select u from User u where u.nic=?1")
    User existsByNIC(String nic);

    @Query("select u from User u where u.email=?1")
    User existsByEmail(String email);

    @Query("select u from User u where u.fullName=?1")
    User existsByFullName(String fullName);
}
