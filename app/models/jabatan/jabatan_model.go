package jabatan_model

import(
	// "fmt"
    "net/http"
    "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"../../session"
	"../../models"
	"../../function"
)

type Jabatan struct {
	Kode_jabatan string
	Nama_jabatan string
	Nama_jabatan_pendek string
	Badge string
	Badge_color string
	Atasan string
	Id_jabatan string
	Kode_skl string
}

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

func All() interface{} {
	var result []Jabatan
	err := models.MongoDB.C("jabatan").Find(bson.M{}).Sort("kode_jabatan").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func AllBson() interface{}{
	var result []bson.M
	err := models.MongoDB.C("jabatan").Find(bson.M{}).Sort("kode_jabatan").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}	
}

func One(r *http.Request) interface{} {
	id_jabatan := mux.Vars(r)["id_jabatan"]
	var result map[string]interface{}
	err := models.MongoDB.C("jabatan").Find(bson.M{"id_jabatan": id_jabatan}).One(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func Add(r *http.Request) string {
	data := bson.M{ 
	        "kode_jabatan" 			: r.FormValue("kode_jabatan"),
	        "nama_jabatan"			: r.FormValue("nama_jabatan"),
	        "nama_jabatan_pendek"	: r.FormValue("nama_jabatan_pendek"),
	        "badge"					: r.FormValue("badge"),
	        "badge_color"			: r.FormValue("badge_color"),
	        "atasan" 				: r.FormValue("atasan"),
	        "id_jabatan" 			: funcs.RandomString(9, "alphanum"),
	    }
	err := models.MongoDB.C("jabatan").Insert(data)
	if err != nil {
	    return "error"
	}else{
	    return "ok"
	}
} 

func Update(r *http.Request) string {
    id_jabatan := mux.Vars(r)["id_jabatan"]
    colQuerier := bson.M{"id_jabatan": id_jabatan}
    change     := bson.M{
    				"$set" : bson.M{ 
    					"kode_jabatan"		  : r.FormValue("kode_jabatan"), 
                    	"nama_jabatan" 		  : r.FormValue("nama_jabatan"),
                    	"nama_jabatan_pendek" : r.FormValue("nama_jabatan_pendek"),
                    	"badge" 			  : r.FormValue("badge"),
                    	"kode_skl" 		      : r.FormValue("kode_skl"),
                    	"badge_color"		  : r.FormValue("badge_color"),
                    	"atasan" 			  : r.FormValue("atasan"),
                    },
                }
    err := models.MongoDB.C("jabatan").Update(colQuerier, change)
    if err != nil {
    	return "error"
    }else{
    	return "ok"
    }
}

func Remove(r *http.Request) string {
    id_jabatan := mux.Vars(r)["id_jabatan"]
    colQuerier := bson.M{"id_jabatan": id_jabatan}
    err := models.MongoDB.C("jabatan").Remove(colQuerier)
    if err != nil {
    	return "error"
    }else{
    	return "ok"
    }
}

func ListBawahan(r *http.Request) interface{} {
	kode_jabatan := session.Get(r, "kode_jabatan")
	var result []Jabatan
	err := models.MongoDB.C("jabatan").Find(bson.M{"atasan": kode_jabatan}).Sort("kode_jabatan").All(&result)
	// fmt.Println(result)	
	if err != nil {
		return err
	}else{
		return result
	}
}

func ListBawahanForPDF(r *http.Request) ([]map[string]interface{}, interface{}) {
	kode_jabatan := session.Get(r, "kode_jabatan")
	var result []map[string]interface{}
	err := models.MongoDB.C("jabatan").Find(bson.M{"atasan": kode_jabatan}).All(&result)
	return result, err
}

func Badge(r *http.Request) ([]map[string]interface{}, interface{}) {
	colQuerier1 := bson.M{}
	colSelector := bson.M{"kode_jabatan" : true, "badge" : true, "badge_color" : true, "_id": false}

	var result []map[string]interface{}
	err := models.MongoDB.C("jabatan").Find(colQuerier1).Select(colSelector).All(&result)
	return result, err
}