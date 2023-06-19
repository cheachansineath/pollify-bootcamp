package com.polify.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "community")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "community_name", nullable = false)
    private String communityName;

    @Column(name = "community_description")
    private String communityDescription;

    @Column(name = "date_created", nullable = false)
    private LocalDate dateCreated;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User users;

    @PrePersist
    public void onCreate(){
        dateCreated = LocalDate.now();
    }
    public Community(String communityName, String communityDescription) {
        this.communityName = communityName;
        this.communityDescription = communityDescription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommunityName() {
        return communityName;
    }

    public void setCommunityName(String communityName) {
        this.communityName = communityName;
    }

    public String getCommunityDescription() {
        return communityDescription;
    }

    public void setCommunityDescription(String communityDescription) {
        this.communityDescription = communityDescription;
    }

    public LocalDate getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDate dateCreated) {
        this.dateCreated = dateCreated;
    }

    public User getUsers() {
        return users;
    }

    public void setUsers(User users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Community{" +
                "id=" + id +
                ", communityName='" + communityName + '\'' +
                ", communityDescription='" + communityDescription + '\'' +
                ", dateCreated=" + dateCreated +
                ", users=" + users +
                '}';
    }
}