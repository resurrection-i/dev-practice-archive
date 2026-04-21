package routes

import (
	"task-management/handlers"
	"task-management/middleware"

	"path/filepath"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	// 添加CORS中间件
	router.Use(middleware.CORS())

	// 设置静态文件服务
	router.Static("/static", "./frontend/static")
	router.StaticFile("/", "./frontend/index.html")

	// Favicon
	router.GET("/favicon.ico", func(c *gin.Context) {
		c.File(filepath.Join("frontend", "favicon.ico"))
	})

	// Create handlers
	authHandler := handlers.NewAuthHandler(db)
	taskHandler := handlers.NewTaskHandler(db)
	userHandler := handlers.NewUserHandler(db)

	// Public routes
	public := router.Group("/api")
	{
		public.POST("/login", authHandler.Login)
		public.POST("/register", authHandler.Register)
	}

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuth())
	{
		// User routes
		protected.GET("/users", middleware.RequirePermission("user:read"), userHandler.List)
		protected.GET("/users/:id", middleware.RequirePermission("user:read"), userHandler.Get)
		protected.PUT("/users/:id", middleware.RequirePermission("user:update"), userHandler.Update)
		protected.DELETE("/users/:id", middleware.RequirePermission("user:delete"), userHandler.Delete)

		// Task routes
		tasks := protected.Group("/tasks")
		{
			tasks.POST("", middleware.RequirePermission("task:create"), taskHandler.Create)
			tasks.GET("", middleware.RequirePermission("task:read"), taskHandler.List)
			tasks.GET("/:id", middleware.RequirePermission("task:read"), taskHandler.Get)
			tasks.PUT("/:id", middleware.RequirePermission("task:update"), taskHandler.Update)
			tasks.DELETE("/:id", middleware.RequirePermission("task:delete"), taskHandler.Delete)
			tasks.PUT("/:id/status", middleware.RequirePermission("task:update_status"), taskHandler.UpdateStatus)
			tasks.PUT("/:id/assign", middleware.RequirePermission("task:assign"), taskHandler.Assign)
			tasks.GET("/:id/history", middleware.RequirePermission("task:read"), taskHandler.GetHistory)
		}
	}
}
