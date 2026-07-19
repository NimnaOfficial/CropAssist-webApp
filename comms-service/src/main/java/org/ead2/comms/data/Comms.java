package org.ead2.comms.data;
import jakarta.persistence.*;

// LocalDateTime: A Java class that represents a date AND time (e.g., 2026-07-17T10:30:00).
// We use it for the "sentAt" field to record WHEN each message was sent.
// It does NOT include timezone information — it's a "local" date-time.
import java.time.LocalDateTime;
@Entity
@Table(name = "messages")
public class Comms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;
    @Column(name = "sender_role", nullable = false)
    private String senderRole;
    @Column(name = "content", nullable = false, length = 2000)
    private String content;
    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;
    public Comms() {
    }
    public Comms(Long farmerId, String senderRole, String content, LocalDateTime sentAt) {
        this.farmerId = farmerId;
        this.senderRole = senderRole;
        this.content = content;
        this.sentAt = sentAt;
    }
    @PrePersist
    public void setDefaultSentAt() {
        if (sentAt == null) {
            sentAt = LocalDateTime.now();
        }
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getFarmerId() {
        return farmerId;
    }
    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }
    public String getSenderRole() {
        return senderRole;
    }
    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
