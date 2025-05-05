package com.freelanceproject.messaging_service.repositories;


import com.freelanceproject.messaging_service.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatId(Long chatId);
}
