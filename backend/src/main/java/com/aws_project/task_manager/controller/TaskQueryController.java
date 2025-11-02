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
    public List<Task> searchTasks(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Task.Priority priority,
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false, defaultValue = "dueDate,asc") String sort) {

        LocalDate fromDate = (from == null || from.isEmpty()) ? null : LocalDate.parse(from);
        LocalDate toDate = (to == null || to.isEmpty()) ? null : LocalDate.parse(to);

        Specification<Task> spec = Specification.where(TaskSpecifications.hasCategoryId(categoryId))
                .and(TaskSpecifications.hasPriority(priority))
                .and(TaskSpecifications.hasStatus(status))
                .and(TaskSpecifications.dueDateBetween(fromDate, toDate))
                .and(TaskSpecifications.titleOrDescriptionContains(q));

        String[] sortParts = sort.split(",");
        Sort s;
        if (sortParts.length == 2) {
            s = Sort.by(Sort.Direction.fromString(sortParts[1].trim()), sortParts[0].trim());
        } else {
            s = Sort.by(sort);
        }

        return taskRepo.findAll(spec, s);
    }

}
