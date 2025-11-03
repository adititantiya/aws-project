package com.aws_project.task_manager.controller;

import com.aws_project.task_manager.model.User;
import com.aws_project.task_manager.repo.UserRepo;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    // --- Signup ---
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return "{\"message\":\"User already exists\"}";
        }
        userRepository.save(user);
        return "{\"message\":\"User created successfully\"}";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> existingUserOpt = userRepository.findByUsername(user.getUsername());

        if (existingUserOpt.isEmpty()) {
            return "{\"message\":\"User not found\"}";
        }

        User existingUser = existingUserOpt.get();

        if (!existingUser.getPassword().equals(user.getPassword())) {
            return "{\"message\":\"Invalid password\"}";
        }

        return "{\"message\":\"Login successful\"}";
    }

}
