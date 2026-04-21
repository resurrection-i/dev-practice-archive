package models

import (
	"time"

	"gorm.io/gorm"
)

type Priority int

const (
	Low Priority = iota + 1
	Medium
	High
)

type Status int

const (
	Created Status = iota + 1
	InProgress
	Completed
	Deleted
)

func (s Status) String() string {
	switch s {
	case Created:
		return "Created"
	case InProgress:
		return "InProgress"
	case Completed:
		return "Completed"
	case Deleted:
		return "Deleted"
	default:
		return "Unknown"
	}
}

type Task struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Title       string         `gorm:"size:100;not null" json:"title" validate:"required,min=1,max=100"`
	Description string         `gorm:"size:1000" json:"description"`
	Priority    Priority       `gorm:"not null" json:"priority" validate:"required,min=1,max=3"`
	Status      Status         `gorm:"not null" json:"status" validate:"required,min=1,max=4"`
	CreatorID   uint           `gorm:"not null" json:"creator_id"`
	Creator     User           `gorm:"foreignKey:CreatorID" json:"creator"`
	AssigneeID  uint           `gorm:"not null" json:"assignee_id"`
	Assignee    User           `gorm:"foreignKey:AssigneeID" json:"assignee"`
	DueDate     time.Time      `json:"due_date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type TaskHistory struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	TaskID    uint      `gorm:"not null" json:"task_id"`
	Task      Task      `gorm:"foreignKey:TaskID" json:"task"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Action    string    `gorm:"size:50;not null" json:"action"`
	Details   string    `gorm:"size:500" json:"details"`
	CreatedAt time.Time `json:"created_at"`
}
