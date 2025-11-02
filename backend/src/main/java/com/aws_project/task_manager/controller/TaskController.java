package com.aws_project.task_manager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.aws_project.task_manager.model.Category;
import com.aws_project.task_manager.model.Task;
import com.aws_project.task_manager.repo.CategoryRepo;
import com.aws_project.task_manager.repo.TaskRepo;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Bean
    public CommandLineRunner setupDefaultCategory(CategoryRepo categoryRepo) {
        return args -> {
            Category uncategorized = categoryRepo.findByName("Uncategorized")
                    .orElseGet(() -> {
                        Category c = new Category();
                        c.setName("Uncategorized");
                        return categoryRepo.save(c);
                    });

            taskRepo.findAll().stream()
                    .filter(t -> t.getCategory() == null)
                    .forEach(t -> t.setCategory(uncategorized));

            taskRepo.saveAll(taskRepo.findAll().stream()
                    .filter(t -> t.getCategory() == null)
                    .toList());
        };
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Map<String, Object> payload) {
        try {
            Task task = new Task();
            task.setTitle((String) payload.get("title"));
            task.setDescription((String) payload.get("description"));
            task.setPriority(Task.Priority.valueOf(((String) payload.get("priority")).toUpperCase()));
            task.setCompleted(payload.get("completed") != null && (Boolean) payload.get("completed"));
            task.setStatus(Task.Status.valueOf(((String) payload.get("status")).toUpperCase()));

            if (payload.get("dueDate") != null) {
                String dueDateStr = (String) payload.get("dueDate");
                Instant instant = Instant.parse(dueDateStr);
                LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
                LocalTime localTime = instant.atZone(ZoneId.systemDefault()).toLocalTime();
                task.setDueDate(localDate);
                task.setDueTime(localTime);
            }

            if (payload.get("categoryId") != null) {
                Long categoryId = Long.parseLong(payload.get("categoryId").toString());
                Category category = categoryRepo.findById(categoryId).orElse(null);
                task.setCategory(category);
            }

            return taskRepo.save(task);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid task data: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask,
            @RequestParam(required = false) Long categoryId) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());
        task.setDueTime(updatedTask.getDueTime());
        task.setPriority(updatedTask.getPriority());
        task.setCompleted(updatedTask.isCompleted());
        task.setStatus(updatedTask.getStatus()); // update status

        Category category = categoryId != null
                ? categoryRepo.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"))
                : categoryRepo.findByName("Uncategorized")
                        .orElseThrow(() -> new RuntimeException("Default category missing"));

        task.setCategory(category);

        return taskRepo.save(task);
    }

    @PutMapping("/{id}/category")
    public Task updateTaskCategory(@PathVariable Long id, @RequestParam Long categoryId) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        task.setCategory(category);
        return taskRepo.save(task);
    }

    @PutMapping("/{id}/status")
    public Task updateTaskStatus(@PathVariable Long id, @RequestParam Task.Status status) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);

        if (status == Task.Status.COMPLETED) {
            task.setCompleted(true);
        } else {
            task.setCompleted(false);
        }

        return taskRepo.save(task);
    }

    @PutMapping("/{id}/toggle")
    public Task toggleCompleted(@PathVariable Long id) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(!task.isCompleted());

        if (task.isCompleted()) {
            task.setStatus(Task.Status.COMPLETED);
        } else if (task.getStatus() == Task.Status.COMPLETED) {
            task.setStatus(Task.Status.TODO);
        }

        return taskRepo.save(task);
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
    }
}
