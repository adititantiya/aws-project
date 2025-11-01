package com.aws_project.task_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.aws_project.task_manager.model.Category;
import com.aws_project.task_manager.repo.CategoryRepo;

@SpringBootApplication
public class TaskManagerApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(TaskManagerApplication.class, args);

		// Seed categories if they don't exist
		CategoryRepo categoryRepo = context.getBean(CategoryRepo.class);

		if (categoryRepo.findByName("Work").isEmpty()) {
			Category work = new Category();
			work.setName("Work");
			categoryRepo.save(work);
		}

		if (categoryRepo.findByName("Personal").isEmpty()) {
			Category personal = new Category();
			personal.setName("Personal");
			categoryRepo.save(personal);
		}
		
	}
}
