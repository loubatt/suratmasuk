package config

import(
	"encoding/json"
	"os"
	"fmt"
)

func GetConfig(s string) string {
	// configFile := "/go-app/development0.2/config.json"
	configFile := os.Args[1]
	var configuration map[string]interface{}
	file, _ := os.Open(configFile)
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&configuration)
	if err != nil {
	  fmt.Println("errors:", err)
	}
	value := fmt.Sprintf("%v", configuration[s])
	return value
}