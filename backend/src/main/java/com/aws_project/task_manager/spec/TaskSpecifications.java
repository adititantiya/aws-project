package com.aws_project.task_manager.spec;

import com.aws_project.task_manager.model.Task;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class TaskSpecifications {

    private TaskSpecifications() {
    }

    public static Specification<Task> hasCategoryId(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Task> hasStatus(Task.Status status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Task> hasPriority(Task.Priority priority) {
        return (root, query, cb) -> priority == null ? null : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Task> dueDateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null)
                return null;
            Path<LocalDate> due = root.get("dueDate");
            if (from != null && to != null) {
                return cb.between(due, from, to);
            } else if (from != null) {
                return cb.greaterThanOrEqualTo(due, from);
            } else {
                return cb.lessThanOrEqualTo(due, to);
            }
        };
    }

    public static Specification<Task> titleOrDescriptionContains(String q) {
        return (root, query, cb) -> {
            if (q == null || q.trim().isEmpty())
                return null;
            String pattern = "%" + q.trim().toLowerCase() + "%";
            Expression<String> titleLower = cb.lower(root.get("title"));
            Expression<String> descLower = cb.lower(root.get("description"));
            return cb.or(cb.like(titleLower, pattern), cb.like(descLower, pattern));
        };
    }
}
