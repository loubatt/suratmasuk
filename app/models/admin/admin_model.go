package adminModel

import(
	// "fmt"
    // "net/http"
    // "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"../../models"
	// "../../funcs"
)

func Check(username string, password string) (map[string]interface{}, interface{}){
	var results map[string]interface{}
    err := models.MongoDB.C("admin").Find(bson.M{"username": username, "password" : password}).One(&results)
    return results, err
}