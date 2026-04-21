package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Username  string         `gorm:"size:50;not null;unique" json:"username" validate:"required,min=3,max=50"`
	Password  string         `gorm:"size:100;not null" json:"password" validate:"required,min=6,containsany=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"`
	Email     string         `gorm:"size:100;unique" json:"email" validate:"required,email"`
	RoleID    uint           `gorm:"not null" json:"role_id"`
	Role      Role           `gorm:"foreignKey:RoleID" json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Role struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Name        string         `gorm:"size:50;not null;unique" json:"name"`
	Permissions []Permission   `gorm:"many2many:role_permissions;" json:"permissions"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Permission struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Name        string         `gorm:"size:50;not null;unique" json:"name"`
	Description string         `gorm:"size:200" json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
