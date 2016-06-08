package login_model

import(
	// "fmt"
    // "net/http"
    // "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"../../models"
	// "../../funcs"
)

func UserAccount(username string, password string) (map[string]interface{}, interface{}){
	var results map[string]interface{}
    err := models.MongoDB.C("user").Find(bson.M{"username": username, "password" : password}).One(&results)
    return results, err
}

func GetNamaJabatan(kode_jabatan string) (map[string]interface{}, interface{}){
	var results map[string]interface{}
    err := models.MongoDB.C("jabatan").Find(bson.M{"kode_jabatan": kode_jabatan}).One(&results)
    return results, err
}