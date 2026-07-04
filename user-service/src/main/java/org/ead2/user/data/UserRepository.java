package org.ead2.user.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Long> {

    @Query("select u from User u where u.nic=?1")
    User existsByNIC(String nic);

    @Query("select u from User u where u.email=?1")
    User existsByEmail(String email);

    @Query("select u from User u where u.fullName=?1")
    User existsByFullName(String fullName);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateUserStatus(@Param("id") Long id, @Param("status") User.Status status);


    @Query("SELECT u FROM User u WHERE u.email = :identifier OR u.nic = :identifier")
    User findByEmailOrNic(@Param("identifier") String identifier);
}
