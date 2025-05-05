package com.freelanceproject.notification_service.service;
import com.freelanceproject.notification_service.model.Notification;
import com.freelanceproject.notification_service.repositories.NotificationRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendNotification(Long userId, String email, String subject, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .email(email)
                .subject(subject)
                .message(message)
                .isRead(false)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
        sendEmail(email, subject, message);
    }

    private void sendEmail(String email, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "utf-8");

            helper.setTo(email);
            helper.setFrom(fromEmail);
            helper.setSubject(subject);
            helper.setText(message, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        notification.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
