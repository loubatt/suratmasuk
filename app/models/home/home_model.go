package homeModel

import(
	"fmt"
	"time"
	"strconv"
    "net/http"
    "github.com/gorilla/mux"
	// "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"../../models"
)

var(
	rowsNum           = 10
	limit             = 10
)

type ListData struct {
	Waktu string
	Name string
	Message string
}

func Api(r *http.Request) ([]ListData, interface{}) {
	var result []ListData

	// paging
    page      := mux.Vars(r)["page"]
    pageInt,_ := strconv.Atoi(page)

    skip      := (pageInt - 1) * rowsNum

	colQuerier := bson.M{}
	err := models.MongoDB.C("sms").Find(colQuerier).Sort("-waktu").Skip(skip).Limit(limit).All(&result)

	return result, err
}



func Post(r *http.Request) (map[string]interface{}, interface{}) {

	theMsg := r.FormValue("message")
	waktu  := fmt.Sprintf("%s", time.Now())

	data := bson.M{
		"waktu"   : waktu,
		"name"	  : "Mr.X",
		"message" : theMsg,
	}
	err := models.MongoDB.C("sms").Insert(data)
	return data, err
}