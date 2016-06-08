package wordrank_model

import(
	// "fmt"
	// "time"
    "net/http"
    // "github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"../../models"
	// "../../config"
	// "../../models/jabatan_model"
	// "../../models/user_model"
	"../../session"
	// "../../funcs"
)

func Get(r *http.Request, word string) ([]bson.M, interface{}){
	var result []bson.M
	colQuerier := bson.M{
		"$and": []bson.M{
			bson.M{"kode_jabatan" : session.Get(r, "kode_jabatan")},
			bson.M{"word" : bson.RegEx{word,"ig"}},
		},
	}
	err := models.MongoDB.C("sentencerank").Find(colQuerier).Sort("-rank").Limit(5).All(&result)

	return result, err
}

func Set(word_asal string, kode_jabatan string) (map[string]interface{}, interface{}) {

	var doc map[string]interface{}

	change 	  := mgo.Change{ 
		Update: bson.M{
			"$inc": bson.M{"rank": 1},
			"$set": bson.M{"word": word_asal},
			}, 
			ReturnNew: true, 
			Upsert: true,
	}
	query     := bson.M{"kode_jabatan": kode_jabatan, "word" : bson.RegEx{word_asal, "ig"}}
	_, err    := models.MongoDB.C("wordrank").Find(query).Apply(change, &doc)

	return doc, err

}

func SetSentence(word_asal string, kode_jabatan string) (map[string]interface{}, interface{}) {

	var doc map[string]interface{}

	change 	  := mgo.Change{ 
		Update: bson.M{
			"$inc": bson.M{"rank": 1},
			"$set": bson.M{"word": word_asal},
			}, 
			ReturnNew: true, 
			Upsert: true,
	}
	query     := bson.M{"kode_jabatan": kode_jabatan, "word" : bson.RegEx{word_asal, "ig"}}
	_, err    := models.MongoDB.C("sentencerank").Find(query).Apply(change, &doc)

	return doc, err

}