package nomorskl_model

import(
	"net/http"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"../../session"
	"../../function"
	"../../models"
)

func Set(r *http.Request) (map[string]interface{}, interface{}) {

	var doc map[string]interface{}
	change 	  := mgo.Change{ 
			Update: bson.M{
				"$inc": bson.M{"nomor_skl": 1},
				"$set": bson.M{
					"tanggal_skl"			: funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal_surat")),
					"createdby_kodejabatan" : session.Get(r, "kode_jabatan"),
					"createdby_namajabatan" : session.Get(r, "nama_jabatan"),
					"createdby_nama" 		: session.Get(r, "nama"),
					"createdby_iduser" 		: session.Get(r, "id_user"),
				},
			},
			ReturnNew : true, 
			Upsert    : true,
		}

	query     := bson.M{
		"tahun_skl" : r.FormValue("tahun_surat"), 
		"jenis_skl" : r.FormValue("jenis_surat"), 
		"kode_skl"  : r.FormValue("kode_surat"),
	}
	_, err    := models.MongoDB.C("nomor_skl").Find(query).Apply(change, &doc)
	return doc, err
}

func CekTanggalTerakhir(tahun_skl string, jenis_skl string, kode_skl string) (map[string]interface{}, interface{}) {

	var doc map[string]interface{}
	query := bson.M{
		"tahun_skl": tahun_skl,
		"jenis_skl": jenis_skl,
		"kode_skl" : kode_skl,
	}
	err   := models.MongoDB.C("nomor_skl").Find(query).One(&doc)
	return doc, err
}