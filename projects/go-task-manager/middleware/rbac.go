package middleware

import (
	"net/http"
	"task-management/logger"

	"github.com/gin-gonic/gin"
)

func RequirePermission(requiredPermission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			logger.Log.Error("Role not found in context")
			c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
			c.Abort()
			return
		}

		// Admin role has all permissions
		if role == "admin" {
			c.Next()
			return
		}

		// Check if the user's role has the required permission
		// This should be implemented based on your role-permission mapping
		hasPermission := checkPermission(role.(string), requiredPermission)
		if !hasPermission {
			logger.Log.Warn("Permission denied for role: " + role.(string))
			c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func checkPermission(role string, permission string) bool {
	// This is a simplified permission check
	// In a real application, you would check against the database
	permissions := map[string][]string{
		"user": {
			"task:read",
			"task:create",
			"task:update_own",
			"task:delete_own",
			"task:update_status",
			"user:read",
		},
		"manager": {
			"task:read",
			"task:create",
			"task:update",
			"task:delete",
			"task:assign",
			"task:update_status",
			"user:read",
			"user:update",
			"user:delete",
		},
	}

	rolePerms, exists := permissions[role]
	if !exists {
		return false
	}

	for _, p := range rolePerms {
		if p == permission {
			return true
		}
	}

	return false
}
