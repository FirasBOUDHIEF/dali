package com.freelanceproject.messaging_service.service;

import com.freelanceproject.messaging_service.model.Chat;
import com.freelanceproject.messaging_service.model.Message;
import com.freelanceproject.messaging_service.repositories.ChatRepository;
import com.freelanceproject.messaging_service.repositories.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessagingService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public MessagingService(ChatRepository chatRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    public Chat startChat(Long user1Id, Long user2Id, String canalName) {
        Optional<Chat> existingChat = chatRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        Chat chat = Chat.builder()
                .canalName(canalName)
                .user1Id(user1Id)
                .user2Id(user2Id)
                .build();

        return chatRepository.save(chat);
    }

    public Message sendMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = Message.builder()
                .chat(chat)
                .senderId(senderId)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getMessages(Long chatId) {
        return messageRepository.findByChatId(chatId);
    }

    public List<Chat> getUserChats(Long userId) {
        return chatRepository.findAll().stream()
                .filter(chat -> chat.getUser1Id().equals(userId) || chat.getUser2Id().equals(userId))
                .toList();
    }
}
