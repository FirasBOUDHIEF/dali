package com.freelanceproject.task_service.controller;


import com.freelanceproject.task_service.model.Task;
import com.freelanceproject.task_service.model.TaskStatus;
import com.freelanceproject.task_service.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")

public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }



    @PostMapping
    public Task createTask(@RequestBody Task task) {
        task.setStatus(TaskStatus.OPEN);
        return taskService.createTask(task);
    }
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Task>> getTasksByClientId(@PathVariable Long clientId) {
        List<Task> tasks = taskService.getTasksByClientId(clientId);
        return tasks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tasks);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Task>> getTasksByFreelancerId(@PathVariable Long freelancerId) {
        List<Task> tasks = taskService.getTasksByFreelancerId(freelancerId);
        return tasks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tasks);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return ResponseEntity.ok(taskService.updateTask(id, updatedTask));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Task> markTheTaskAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}