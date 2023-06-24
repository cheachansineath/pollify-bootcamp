package com.polify.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.polify.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  /**
   * Find by username user.
   *
   * @param email the username
   * @return the user
   */
  User findByEmail(String email);

  Optional<User> findByUsername(String username);
}

