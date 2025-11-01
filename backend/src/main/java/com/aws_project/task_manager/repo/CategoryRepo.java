package com.aws_project.task_manager.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aws_project.task_manager.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
