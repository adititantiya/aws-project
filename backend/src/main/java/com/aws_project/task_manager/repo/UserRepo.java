package com.aws_project.task_manager.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aws_project.task_manager.model.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
