package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"task-management/logger"
	"task-management/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type TaskHandler struct {
	db       *gorm.DB
	validate *validator.Validate
}

func NewTaskHandler(db *gorm.DB) *TaskHandler {
	return &TaskHandler{
		db:       db,
		validate: validator.New(),
	}
}

type CreateTaskRequest struct {
	Title       string    `json:"title" validate:"required,min=1,max=100"`
	Description string    `json:"description"`
	Priority    int       `json:"priority" validate:"required,min=1,max=3"`
	AssigneeID  uint      `json:"assignee_id" validate:"required"`
	DueDate     time.Time `json:"due_date" validate:"required"`
}

type UpdateTaskRequest struct {
	Title       string    `json:"title" validate:"required,min=1,max=100"`
	Description string    `json:"description"`
	Priority    int       `json:"priority" validate:"required,min=1,max=3"`
	AssigneeID  uint      `json:"assignee_id" validate:"required"`
	DueDate     time.Time `json:"due_date" validate:"required"`
}

type UpdateTaskStatusRequest struct {
	Status int `json:"status" validate:"required,min=1,max=4"`
}

func (h *TaskHandler) Create(c *gin.Context) {
	// 打印请求体
	var bodyBytes []byte
	if c.Request.Body != nil {
		bodyBytes, _ = io.ReadAll(c.Request.Body)
		c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // 恢复请求体以便后续使用
		logger.Log.Info("Task create request body: " + string(bodyBytes))
	}

	var req CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Log.Error("Invalid request format: " + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求格式无效: " + err.Error()})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		errorMessages := make([]string, 0, len(validationErrors))
		for _, e := range validationErrors {
			errorMessages = append(errorMessages, fmt.Sprintf("字段 %s 验证失败: %s", e.Field(), e.Tag()))
		}
		logger.Log.Error("Validation errors: " + fmt.Sprintf("%v", errorMessages))
		c.JSON(http.StatusBadRequest, gin.H{"error": "数据验证失败", "details": errorMessages})
		return
	}

	// 输出请求数据到日志
	requestDetails, _ := json.Marshal(req)
	logger.Log.Info("Task creation request: " + string(requestDetails))

	userID, exists := c.Get("userID")
	if !exists {
		logger.Log.Error("User ID not found in context")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "无法获取用户ID"})
		return
	}

	task := models.Task{
		Title:       req.Title,
		Description: req.Description,
		Priority:    models.Priority(req.Priority),
		Status:      models.Created,
		CreatorID:   userID.(uint),
		AssigneeID:  req.AssigneeID,
		DueDate:     req.DueDate,
	}

	if err := h.db.Create(&task).Error; err != nil {
		logger.Log.Error("Failed to create task: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建任务失败: " + err.Error()})
		return
	}

	// Create task history
	history := models.TaskHistory{
		TaskID:  task.ID,
		UserID:  userID.(uint),
		Action:  "created",
		Details: "Task created",
	}

	if err := h.db.Create(&history).Error; err != nil {
		logger.Log.Error("Failed to create task history: " + err.Error())
	}

	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) List(c *gin.Context) {
	var tasks []models.Task
	if err := h.db.Preload("Creator").Preload("Assignee").Find(&tasks).Error; err != nil {
		logger.Log.Error("Failed to list tasks: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := h.db.Preload("Creator").Preload("Assignee").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := h.db.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var req UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("userID")
	role := c.GetString("role")

	// Check if user has permission to update this task
	if role != "admin" && role != "manager" && task.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		return
	}

	task.Title = req.Title
	task.Description = req.Description
	task.Priority = models.Priority(req.Priority)
	task.AssigneeID = req.AssigneeID
	task.DueDate = req.DueDate

	if err := h.db.Save(&task).Error; err != nil {
		logger.Log.Error("Failed to update task: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	// Create task history
	history := models.TaskHistory{
		TaskID:  task.ID,
		UserID:  userID,
		Action:  "updated",
		Details: "Task updated",
	}

	if err := h.db.Create(&history).Error; err != nil {
		logger.Log.Error("Failed to create task history: " + err.Error())
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := h.db.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var req UpdateTaskStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("userID")
	role := c.GetString("role")

	// Check if user has permission to update this task status
	// Allow task assignee to update status
	if role != "admin" && role != "manager" && task.AssigneeID != userID && task.CreatorID != userID {
		logger.Log.Warn("Permission denied for updating task status. UserID: " + fmt.Sprint(userID) +
			", Role: " + role + ", Task AssigneeID: " + fmt.Sprint(task.AssigneeID) +
			", Task CreatorID: " + fmt.Sprint(task.CreatorID))
		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		return
	}

	oldStatus := task.Status
	task.Status = models.Status(req.Status)

	if err := h.db.Save(&task).Error; err != nil {
		logger.Log.Error("Failed to update task status: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task status"})
		return
	}

	// Create task history
	history := models.TaskHistory{
		TaskID:  task.ID,
		UserID:  userID,
		Action:  "status_updated",
		Details: "Status changed from " + oldStatus.String() + " to " + task.Status.String(),
	}

	if err := h.db.Create(&history).Error; err != nil {
		logger.Log.Error("Failed to create task history: " + err.Error())
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := h.db.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	userID := c.GetUint("userID")
	role := c.GetString("role")

	// Check if user has permission to delete this task
	if role != "admin" && role != "manager" && task.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		return
	}

	if err := h.db.Delete(&task).Error; err != nil {
		logger.Log.Error("Failed to delete task: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	// Create task history
	history := models.TaskHistory{
		TaskID:  task.ID,
		UserID:  userID,
		Action:  "deleted",
		Details: "Task deleted",
	}

	if err := h.db.Create(&history).Error; err != nil {
		logger.Log.Error("Failed to create task history: " + err.Error())
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func (h *TaskHandler) Assign(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := h.db.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var req struct {
		AssigneeID uint `json:"assignee_id" validate:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	oldAssigneeID := task.AssigneeID
	task.AssigneeID = req.AssigneeID

	if err := h.db.Save(&task).Error; err != nil {
		logger.Log.Error("Failed to assign task: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign task"})
		return
	}

	// Create task history
	history := models.TaskHistory{
		TaskID:  task.ID,
		UserID:  c.GetUint("userID"),
		Action:  "assigned",
		Details: "Task reassigned from user " + string(oldAssigneeID) + " to user " + string(req.AssigneeID),
	}

	if err := h.db.Create(&history).Error; err != nil {
		logger.Log.Error("Failed to create task history: " + err.Error())
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) GetHistory(c *gin.Context) {
	id := c.Param("id")
	var history []models.TaskHistory
	if err := h.db.Where("task_id = ?", id).Preload("User").Order("created_at desc").Find(&history).Error; err != nil {
		logger.Log.Error("Failed to get task history: " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get task history"})
		return
	}

	c.JSON(http.StatusOK, history)
}
