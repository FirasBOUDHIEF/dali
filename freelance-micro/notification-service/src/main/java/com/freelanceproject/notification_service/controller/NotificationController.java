package com.freelanceproject.notification_service.controller;

import com.freelanceproject.notification_service.model.Notification;
import com.freelanceproject.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")

public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public void sendNotification(@RequestParam Long userId,
                                 @RequestParam String email,
                                 @RequestParam String subject,
                                 @RequestParam String message) {
        notificationService.sendNotification(userId, email, subject, message);
    }

    @GetMapping("/{userId}")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PostMapping("/mark-read/{notificationId}")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }
}

