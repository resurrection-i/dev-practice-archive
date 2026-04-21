package main

import (
	"fmt"
	"task-management/config"
	"task-management/logger"
	"task-management/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {
	// Load configuration
	if err := config.LoadConfig(); err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	// Initialize logger
	if err := logger.InitLogger(); err != nil {
		panic(fmt.Sprintf("Failed to initialize logger: %v", err))
	}

	// Connect to database
	var err error
	DB, err = gorm.Open(mysql.Open(config.GetDSN()), &gorm.Config{})
	if err != nil {
		logger.Log.Fatal("Failed to connect to database: " + err.Error())
	}

	// Set Gin mode
	gin.SetMode(config.AppConfig.Server.Mode)

	// Create router
	router := gin.Default()

	// Setup routes
	routes.SetupRoutes(router, DB)

	// Start server
	addr := fmt.Sprintf(":%d", config.AppConfig.Server.Port)
	logger.Log.Info("Starting server on " + addr)
	if err := router.Run(addr); err != nil {
		logger.Log.Fatal("Failed to start server: " + err.Error())
	}
}
