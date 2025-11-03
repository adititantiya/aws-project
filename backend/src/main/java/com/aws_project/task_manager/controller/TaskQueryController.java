package com.aws_project.task_manager.controller;

import com.aws_project.task_manager.model.Task;
import com.aws_project.task_manager.repo.TaskRepo;
import com.aws_project.task_manager.spec.TaskSpecifications;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskQueryController {

    private final TaskRepo taskRepo;

    public TaskQueryController(TaskRepo taskRepo) {
        this.taskRepo = taskRepo;
    }

    @GetMapping("/search")
    public List<Task> searchTasks(@RequestParam(required = false) String q) {
        Specification<Task> spec = Specification.where(TaskSpecifications.titleContains(q));
        return taskRepo.findAll(spec);
    }

    @GetMapping("/filter")
    public List<Task> filterTasks(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Task.Priority priority,
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false, defaultValue = "dueDate,asc") String sort) {

        LocalDate fromDate = (from == null || from.isEmpty()) ? null : LocalDate.parse(from);
        LocalDate toDate = (to == null || to.isEmpty()) ? null : LocalDate.parse(to);

        Specification<Task> spec = Specification.where(TaskSpecifications.hasCategoryId(categoryId))
                .and(TaskSpecifications.hasPriority(priority))
                .and(TaskSpecifications.hasStatus(status))
                .and(TaskSpecifications.dueDateBetween(fromDate, toDate));

        String[] sortParts = sort.split(",");
        Sort s = (sortParts.length == 2)
                ? Sort.by(Sort.Direction.fromString(sortParts[1].trim()), sortParts[0].trim())
                : Sort.by(sort);

        return taskRepo.findAll(spec, s);
    }

}
