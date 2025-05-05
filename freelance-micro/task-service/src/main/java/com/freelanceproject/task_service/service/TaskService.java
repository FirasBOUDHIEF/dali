package com.freelanceproject.task_service.service;

import com.freelanceproject.task_service.model.Task;
import com.freelanceproject.task_service.model.TaskCompetance;
import com.freelanceproject.task_service.model.TaskStatus;
import com.freelanceproject.task_service.repositories.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByClientId(Long clientId) {
        return taskRepository.findByClientId(clientId);
    }

    public List<Task> getTasksByFreelancerId(Long freelancerId) {
        return taskRepository.findByFreelancerId(freelancerId);
    }

    public Task createTask(Task task) {
        if (task.getCompetences() != null) {
            for (TaskCompetance competence : task.getCompetences()) {
                competence.setTask(task);  // Assign the task reference
            }
        }
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setStatus(updatedTask.getStatus());
                    return taskRepository.save(task);
                }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task updateTaskStatus(Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setStatus(TaskStatus.COMPLETED);
                    return taskRepository.save(task);
                }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}