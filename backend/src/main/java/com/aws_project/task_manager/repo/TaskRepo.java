package com.aws_project.task_manager.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aws_project.task_manager.model.Task;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TaskRepo extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
}
