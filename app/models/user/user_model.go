package user_model

import(
	// "fmt"
    "net/http"
    "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"../../models"
	"../../function"
)

type User struct {
    Nama string
    Kode_jabatan string
    Id_user string
    Jenis_skl string
}

func Check(username string, password string) (map[string]interface{}, interface{}){
	var results map[string]interface{}
    err := models.MongoDB.C("user").Find(bson.M{"username": username, "password" : password}).One(&results)
    return results, err
}

func All() interface{} {
	var result []User
	err := models.MongoDB.C("user").Find(bson.M{}).Sort("kode_jabatan").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func One(r *http.Request) interface{} {
	id_user := mux.Vars(r)["id_user"]
	var result map[string]interface{}
	err := models.MongoDB.C("user").Find(bson.M{"id_user": id_user}).One(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func OneByKode(kode_jabatan string) (map[string]interface{}, interface{}) {

	var result map[string]interface{}
	err := models.MongoDB.C("user").Find(bson.M{"kode_jabatan": kode_jabatan}).One(&result)
	return result, err
}

func Add(r *http.Request) string {
	data := bson.M{ 
	        "username"		: r.FormValue("username"),
	        "password" 		: r.FormValue("password"),
	        "nama" 			: r.FormValue("nama"),
	        "kode_jabatan" 	: r.FormValue("kode_jabatan"),
	        "id_user" 		: funcs.RandomString(9, "alphanum"),
	    }
	err := models.MongoDB.C("user").Insert(data)
	if err != nil {
	    return "error"
	}else{
	    return "ok"
	}
}

func Update(r *http.Request) string {
    id_user    := mux.Vars(r)["id_user"]
    colQuerier := bson.M{"id_user": id_user}
    change     := bson.M{"$set" : bson.M{ "username": r.FormValue("username"), 
                    "password" : r.FormValue("password"),
                    "nama" : r.FormValue("nama"), 
                    "kode_jabatan" : r.FormValue("kode_jabatan"),
                    "jenis_skl" : r.FormValue("jenis_skl")}}
    err := models.MongoDB.C("user").Update(colQuerier, change)
    if err != nil {
    	return "error"
    }else{
    	return "ok"
    }
}

func Remove(r *http.Request) string {
    id_user    := mux.Vars(r)["id_user"]
    colQuerier := bson.M{"id_user": id_user}
    err := models.MongoDB.C("user").Remove(colQuerier)
    if err != nil {
    	return "error"
    }else{
    	return "ok"
    }
}