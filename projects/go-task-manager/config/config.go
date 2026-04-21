package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Log      LogConfig
}

type ServerConfig struct {
	Port int
	Mode string
}

type DatabaseConfig struct {
	Driver       string
	Host         string
	Port         int
	Username     string
	Password     string
	DBName       string
	Charset      string
	ParseTime    bool
	Loc          string
	MaxIdleConns int
	MaxOpenConns int
}

type JWTConfig struct {
	Secret string
	Expire int
}

type LogConfig struct {
	Level      string
	Filename   string
	MaxSize    int
	MaxBackups int
	MaxAge     int
	Compress   bool
}

var AppConfig Config

func LoadConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}

	if err := viper.Unmarshal(&AppConfig); err != nil {
		return fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return nil
}

func GetDSN() string {
	db := AppConfig.Database
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=%v&loc=%s",
		db.Username,
		db.Password,
		db.Host,
		db.Port,
		db.DBName,
		db.Charset,
		db.ParseTime,
		db.Loc,
	)
}
