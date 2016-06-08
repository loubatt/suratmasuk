package nomoragenda_model

import(
	// "fmt"
	// "time"
    // "net/http"
    // "github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"../../models"
	"../../config"
	// "../../models/jabatan_model"
	// "../../models/user_model"
	// "../../session"
	// "../../funcs"
)

func Set(kode_jabatan string) (map[string]interface{}, interface{}) {

	var doc map[string]interface{}

	change 	  := mgo.Change{ Update: bson.M{"$inc": bson.M{"nomor_agenda": 1}}, ReturnNew: true, Upsert: true}
	query     := bson.M{"kode_jabatan": kode_jabatan, "tahun": config.GetConfig("TahunAgendaSMS")}
	_, err    := models.MongoDB.C("nomor_agenda").Find(query).Apply(change, &doc)

	return doc, err

}
