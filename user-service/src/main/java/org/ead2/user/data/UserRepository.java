package org.ead2.user.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * UserRepository provides all database access methods for the User entity.
 * It extends JpaRepository, which automatically provides standard CRUD operations (save, findById, findAll, deleteById, etc.).
 */
public interface UserRepository extends JpaRepository<User,Long> {

    /**
     * Custom JPQL query to find a user by their NIC.
     * @param nic The National Identity Card number.
     * @return The User object if found.
     */
    @Query("select u from User u where u.nic=?1")
    User existsByNIC(String nic);

    /**
     * Custom JPQL query to find a user by their email.
     * @param email The email address.
     * @return The User object if found.
     */
    @Query("select u from User u where u.email=?1")
    User existsByEmail(String email);

    /**
     * Custom JPQL query to find a user by their full name.
     * @param fullName The full name of the user.
     * @return The User object if found.
     */
    @Query("select u from User u where u.fullName=?1")
    User existsByFullName(String fullName);

    /**
     * Custom JPQL UPDATE query to change a user's status efficiently without loading the entire entity.
     * The @Modifying annotation tells Spring Data JPA that this query modifies data.
     * @param id The user ID.
     * @param status The new status.
     * @return The number of rows updated (usually 1 if successful, 0 if user not found).
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateUserStatus(@Param("id") Long id, @Param("status") User.Status status);


    /**
     * Custom JPQL query to find a user by either their email OR their NIC.
     * Used primarily during the login process.
     * @param identifier The string containing either the email or NIC.
     * @return The User object if a match is found.
     */
    @Query("SELECT u FROM User u WHERE u.email = :identifier OR u.nic = :identifier")
    User findByEmailOrNic(@Param("identifier") String identifier);
}
