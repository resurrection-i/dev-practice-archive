package handlers

import (
	"net/http"
	"task-management/logger"
	"task-management/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	db       *gorm.DB
	validate *validator.Validate
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{
		db:       db,
		validate: validator.New(),
	}
}

type UpdateUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"omitempty,min=6,containsany=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"`
	RoleID   uint   `json:"role_id" validate:"required"`
}

func (h *UserHandler) List(c *gin.Context) {
	var users []models.User
	if err := h.db.Preload("Role").Find(&users).Error; err != nil {
		logger.Log.Error("Failed to list users: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list users"})
		return
	}

	// Remove password from response
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := h.db.Preload("Role").First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := h.db.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username is taken by another user
	var existingUser models.User
	if err := h.db.Where("username = ? AND id != ?", req.Username, id).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	user.Username = req.Username
	user.Email = req.Email
	user.RoleID = req.RoleID

	// Update password if provided
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			logger.Log.Error("Failed to hash password: " + err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
			return
		}
		user.Password = string(hashedPassword)
	}

	if err := h.db.Save(&user).Error; err != nil {
		logger.Log.Error("Failed to update user: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := h.db.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check if user has any tasks
	var count int64
	if err := h.db.Model(&models.Task{}).Where("creator_id = ? OR assignee_id = ?", id, id).Count(&count).Error; err != nil {
		logger.Log.Error("Failed to check user tasks: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete user with associated tasks"})
		return
	}

	if err := h.db.Delete(&user).Error; err != nil {
		logger.Log.Error("Failed to delete user: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
