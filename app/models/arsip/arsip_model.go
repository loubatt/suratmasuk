package arsip_model

import(
	"fmt"
	"time"
	"strings"
    "net/http"
    "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"../../session"
	"../../models"
	"../../function"
)

type Arsip struct {
	Kode_arsip string
	Keterangan string
}

func ByKodeList(r *http.Request) interface{} {
	
	var result []Arsip
	kode_arsip  := mux.Vars(r)["kode_arsip"]

	query 		:= bson.M{"kode_arsip": bson.RegEx{kode_arsip, "ig"}}
	colQuerier  := query
	err := models.MongoDB.C("arsip").Find(colQuerier).Sort("-sekunder").Limit(10).All(&result)
	if err != nil {
		return err
	}else{
		return result
	}	
}

func ByKetList(r *http.Request) interface{} {
	
	var result []Arsip
	kode_arsip  := mux.Vars(r)["keterangan_arsip"]

	query := bson.M{}
	query["$and"] = []bson.M{}

	ket := strings.Split(kode_arsip, " ")
	for _, v := range ket {
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"keterangan": bson.RegEx{v, "ig"}})
    }

	colQuerier  := query
	err := models.MongoDB.C("arsip").Find(colQuerier).Sort("-sekunder").Limit(10).All(&result)
	if err != nil {
		return err
	}else{
		return result
	}	
}

func InsertArsip(r *http.Request) (map[string]interface{}, interface{}){

	kode_jabatan := session.Get(r, "kode_jabatan")
	sms_or_skl   := mux.Vars(r)["sms_or_skl"]
	doc_series   := mux.Vars(r)["doc_series"]
	kode_arsip	 := r.FormValue("kode_arsip")
	_kode_arsip  := strings.Replace(kode_arsip, ".", "", -1)
	keterangan	 := r.FormValue("keterangan")
	tagName	     := "arsip." + _kode_arsip + "." + kode_jabatan

	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))
	waktu		 := fmt.Sprintf("%s", time.Now())
	
	colQuerier := bson.M{"doc_series": doc_series}
	change	   := bson.M{"$set" : bson.M{
						tagName : bson.M{
							"id"		     : funcs.RandomString(5, "alphanum"),
							"by_kodejabatan" : kode_jabatan,
							"by_name"	     : session.Get(r, "nama"),
							"by_iduser"	     : session.Get(r, "id_user"),
							"waktu"			 : waktu,
							"created_from"   : ip,
							"data"	  : bson.M{
								"kode_arsip" : kode_arsip,
								"keterangan" : keterangan,
							},
						},
					},
				  }

	err 	   := models.MongoDB.C(sms_or_skl).Update(colQuerier, change)
	return change, err
}

func RemoveArsip(r *http.Request) (map[string]interface{}, interface{}){

    created_by		:= session.Get(r, "kode_jabatan")
    sms_or_skl   	:= mux.Vars(r)["sms_or_skl"]
    doc_series 		:= mux.Vars(r)["doc_series"]
    id_arsip 		:= r.FormValue("id_arsip")
    kode_arsip 	    := r.FormValue("kode_arsip")
    
    tagName 		:= "arsip." + kode_arsip + "." + created_by
    colQuerier 		:= bson.M{
					        "$and" : []bson.M{
					            {"doc_series": doc_series},
					            {
					            	tagName + ".id" : id_arsip,
					                tagName + ".by_kodejabatan" : created_by,
					            },
					        },
					    }
    change     		:= bson.M{
					   		"$unset" :  bson.M{ tagName : 1 },
					   }
    err := models.MongoDB.C(sms_or_skl).Update(colQuerier, change)

	return change, err
}