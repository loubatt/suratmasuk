package suratmasuk_model

import(
	"fmt"
	"time"
	"strconv"
	"strings"
    "net/http"
    "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"

	"../../session"
	"../../function"
	"../../models"
	"../../models/nomor_agenda"
	"../../models/wordrank"
	"../../models/jabatan"
	"../../models/user"
)

var(
	rowsNum           = 10
	limit             = 10
)

type Suratmasuk struct {
	Tanggal string
	Asal string
	Hal string
	Nomor string
	Tag interface{}
	Files interface{}
	Doc_series string
}

type RuleSKL struct{
	Rule_name string
	List interface{}
}

type ListTanggal struct {
	Label string
	Value string
}

type ListBulan struct {
	Label string
	Value string
}

type ListTahun struct {
	Label string
	Value string
}

type ErrorStruct struct{
	Jenis string
}

type ListSurat struct {

}

// DATA FACTORY
func AllFormatter(data interface{}, kode_jabatan string, libjabatan interface{}) interface{}{

	var ListSurat []interface{}
	LibJabatan := libjabatan.(map[string]interface{})
	for _,v := range data.([]bson.M) {
		var Surat map[string]interface{}
		Surat = make(map[string]interface{})
		for k1, v1 := range v{
			if k1 == "tag" {
				var Tags []interface{}
				for k2, v2 := range v1.(bson.M) {
					var Tag map[string]interface{}
					Tag = make(map[string]interface{})
					v2bson := v2.(bson.M)
					for k3, v3 := range v2bson {
						tgt  := LibJabatan[k2]
						tgt2 := tgt.(bson.M)
						Tag["badge_color"]    = tgt2["badge_color"]
						Tag["to_nama"]        = v2bson["to_nama"]
						Tag["to_namajabatan"] = v2bson["to_namajabatan"]
						Tag["to_kodejabatan"] = v2bson["to_kodejabatan"]
						if k2 == kode_jabatan{
							if k3 == "to_tanggalditerima" {
								Surat["to_tanggalditerima"] = funcs.TimeIndonesianFormatter( v3.(string) )
							}else if k3 == "to_nomoragenda" {
								Surat["to_nomoragenda"] = v3
							}else if k3 == "createdby_time" {
								Surat["createdby_time"] = funcs.TimeIndonesianFormatter( v3.(string) )
							}
						}
					}
					Tags = append(Tags, Tag)
					// fmt.Println(Tag)
				}
				Surat[k1] = Tags
			}else if k1 == "tanggal" {
				Surat[k1] = funcs.TimeIndonesianFormatter2( v1.(string) )
			}else{
				Surat[k1] = v1
			}
		}
		ListSurat = append(ListSurat, Surat)
	}
	return ListSurat
}

func OneFormatter(data interface{}, kode_jabatan string) interface{}{

	var Surat map[string]interface{}
	Surat = make(map[string]interface{})
	for k1, v1 := range data.(bson.M){
		if k1 == "tag" {
			var Tags []interface{}
			for k2, v2 := range v1.(bson.M) {

				// register ke tag bentuk list
				Tags = append(Tags, v2)

				if k2 == kode_jabatan{
					Surat["to_tanggalditerima"] = v2.(bson.M)["to_tanggalditerima"]
				}

			}

			// Tag bentuk list
			Surat[k1] = Tags

			// Tag bentuk object
			Surat["tag_object"] = v1

		}else{
			Surat[k1] = v1
		}
	}
	return Surat
}

func QueryBuilder(my_kodejabatan string, params_search map[string]interface{}, mode string) bson.M {

	tagName := "tag." + my_kodejabatan

	if mode == "search" {
		query := bson.M{}
		query["$and"] = []bson.M{}

		query["$and"] = append(query["$and"].([]bson.M), bson.M{tagName: bson.M{"$exists" : true}})
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"status": "active"})

		if params_search["nomor_agenda"] != "" {
			_nomor_agenda := tagName + ".to_nomoragenda"
			noa, _ := strconv.Atoi(params_search["nomor_agenda"].(string))
			query["$and"] = append(query["$and"].([]bson.M), bson.M{_nomor_agenda: noa})
		}

		if params_search["waktuterima_surat"] != "" {
			tanggal_diterima := tagName + ".to_tanggalditerima"
			query["$and"] = append(query["$and"].([]bson.M), bson.M{tanggal_diterima: bson.RegEx{params_search["waktuterima_surat"].(string), "ig"}})
		}

		_asal := strings.Split(params_search["asal"].(string), " ")
		for _, v := range _asal {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"asal": bson.RegEx{v, "ig"}})
	    }

		_nomorsurat := strings.Split(params_search["nomor_surat"].(string), " ")
		for _, v := range _nomorsurat {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"nomor": bson.RegEx{v, "ig"}})
	    }

		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal": bson.RegEx{params_search["tanggal_surat"].(string), "ig"}})

		_hal := strings.Split(params_search["hal"].(string), " ")
		for _, v := range _hal {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"hal": bson.RegEx{v, "ig"}})
	    }	

		if params_search["kodejabatan"] != "" {
			tagDisposisi := "tag." + params_search["kodejabatan"].(string)
			query["$and"] = append(query["$and"].([]bson.M), bson.M{tagDisposisi : bson.M{"$exists" : true}})
	    }

		return query
	}else{
		query := bson.M{tagName : bson.M{"$exists" : true}, "status": "active"}
		return query
	}
}

func LibJabatanBuilder(listjabatan interface{}) interface{} {
	var LibJabatan map[string]interface{}
	LibJabatan = make(map[string]interface{})
	for _, v := range listjabatan.([]bson.M){
		kode_jabatan := v["kode_jabatan"].(string)
		LibJabatan[kode_jabatan] = v
	}
	// fmt.Println(LibJabatan)
	return LibJabatan
}

// GET DATA
func GetAll(r *http.Request, all bool) (interface{}, interface{}, int) {

	var result []bson.M
	var colQuerier bson.M
	var err interface{}

	kode_jabatan  := session.Get(r, "kode_jabatan")

	params_search := map[string]interface{}{
		"nomor_agenda" 		: session.Get(r, "search-nomoragenda"),
		"waktuterima_surat"	: session.Get(r, "search-waktuterimasurat"),
		"asal" 	 	 		: session.Get(r, "search-asal"),
		"nomor_surat"	 	: session.Get(r, "search-nomorsurat"),
		"tanggal_surat"		: session.Get(r, "search-tanggalsurat"),
		"hal"  	     		: session.Get(r, "search-hal"),
		"kodejabatan"  		: session.Get(r, "search-kodejabatan"),
	}
	
    page      := mux.Vars(r)["page"]
    pageInt,_ := strconv.Atoi(page)
    skip      := (pageInt - 1) * rowsNum

    if len(params_search) == 0 {
		colQuerier = QueryBuilder(kode_jabatan, map[string]interface{}{}, "all")
	}else{
		colQuerier = QueryBuilder(kode_jabatan, params_search, "search")
	}

	if all {
		err = models.MongoDB.C("sms").Find(colQuerier).Sort("-time_stamp").All(&result)
	}else{
		err = models.MongoDB.C("sms").Find(colQuerier).Sort("-time_stamp").Skip(skip).Limit(limit).All(&result)
	}

	// Hitung Total
	count,_ := models.MongoDB.C("sms").Find(colQuerier).Count()

    // Lib Semua Jabatan, untuk pewarnaan
    jabatanbson := jabatan_model.AllBson()
    libjabatan  := LibJabatanBuilder(jabatanbson)

	return err, AllFormatter(result, kode_jabatan, libjabatan), count		
}

func SetWordRank(asal_surat string, kode_jabatan string) interface{}{
	var res interface{}
	for _, asal := range strings.Split(asal_surat, " "){
		res,_ = wordrank_model.Set(asal, kode_jabatan)
	}
	return res
}

func SetSentenceRank(asal_surat string, kode_jabatan string) interface{} {
	var res interface{}
	res,_ = wordrank_model.SetSentence(asal_surat, kode_jabatan)
	return res
}

func Input(r *http.Request) (map[string]interface{}, interface{}) {

	nama         := session.Get(r, "nama")
	id_user      := session.Get(r, "id_user")
	nama_jabatan := session.Get(r, "nama_jabatan")
	kode_jabatan := session.Get(r, "kode_jabatan")
	waktu		 := fmt.Sprintf("%s", time.Now())
	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))
	
	doc, _ 	 := nomoragenda_model.Set(kode_jabatan)
	
	data := bson.M{ 
			"time_stamp"		: waktu,
	        "asal"				: r.FormValue("asal"),
	        "nomor"				: r.FormValue("nomor"),
	        "tanggal"			: funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal")),
	        "hal" 				: r.FormValue("hal"),
	        "lampiran"			: r.FormValue("lampiran"),
	        "sifat" 			: r.FormValue("sifat"),
	        "doc_series"		: funcs.RandomString(9, "alphanum"),
			"tag"				: bson.M{
									kode_jabatan :
	        							bson.M{
	        							"to_nama" 		        : nama,
	        							"to_iduser" 		    : id_user,
	        							"to_kodejabatan" 		: kode_jabatan,
	        							"to_namajabatan" 		: nama_jabatan,
	        							"to_nomoragenda" 		: doc["nomor_agenda"],
	        							"to_tanggalditerima" 	: funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal_diterima")),
	        							"createdby_time"   		: waktu,
			    						"createdby_ip"     		: ip,
			    						"createdby_kodejabatan" : session.Get(r, "kode_jabatan"),
			    						"createdby_namajabatan" : session.Get(r, "nama_jabatan"),
			    						"createdby_nama" 		: session.Get(r, "nama"),
			    						"createdby_iduser" 		: session.Get(r, "id_user"),
	        					  	},
	        					},	        					
	        "history" 			: []bson.M{
	        							bson.M{
										"history_action"  		 : "input",
										"createdby_kodejabatan"  : session.Get(r, "kode_jabatan"),
										"createdby_name"	     : session.Get(r, "nama"),
										"createdby_time"		 : waktu,
										"createdby_ip"   		 : ip,
										"data" : bson.M{
											"asal" 	  : r.FormValue("asal"),
											"nomor"   : r.FormValue("nomor"),
											"tanggal" : r.FormValue("tanggal"),
											"hal"	  : r.FormValue("hal"),
										},
									},
								},
			"files"				: []bson.M{
								},
			"status"			: "active",
	    }

	// Rank of Asal
	go SetWordRank(r.FormValue("asal"), kode_jabatan)
	go SetSentenceRank(r.FormValue("asal"), kode_jabatan)

	err := models.MongoDB.C("sms").Insert(data)
	return data, err
}

func Edit(r *http.Request) (map[string]interface{}, interface{}){

	doc_series   := mux.Vars(r)["doc_series"]
	asal   		 := r.FormValue("asal")
	nomor  		 := r.FormValue("nomor")
	tanggal		 := funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal"))
	hal 		 := r.FormValue("hal")
	sifat 		 := r.FormValue("sifat")
	lampiran	 := r.FormValue("lampiran")
	
	colQuerier := bson.M{"doc_series": doc_series}
	change	   := bson.M{"$set" : bson.M{
					"asal"    : asal,
					"nomor"   : nomor,
					"tanggal" : tanggal,
					"hal"	  : hal,
					"sifat"	  : sifat,
					"lampiran": lampiran,
					},
				  }

	err 	   := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func InsertHistory(r *http.Request, action string) (map[string]interface{}, interface{}){

	doc_series   := mux.Vars(r)["doc_series"]
	asal   		 := r.FormValue("asal")
	nomor  		 := r.FormValue("nomor")
	tanggal		 := r.FormValue("tanggal")
	hal 		 := r.FormValue("hal")

	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))
	waktu		 := fmt.Sprintf("%s", time.Now())
	
	colQuerier := bson.M{"doc_series": doc_series}
	change	   := bson.M{"$push" : bson.M{
						"history" : bson.M{
							"action"  		 : action,
							"by_kodejabatan" : session.Get(r, "kode_jabatan"),
							"by_name"	     : session.Get(r, "nama"),
							"waktu"			 : waktu,
							"created_from"   : ip,
							"data"	  : bson.M{
								"asal" 	  : asal,
								"nomor"   : nomor,
								"tanggal" : tanggal,
								"hal"	  : hal,
							},
						},
					},
				  }

	err 	   := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func InsertFile(r *http.Request, nama_file string) (map[string]interface{}, interface{}){

	doc_series   := mux.Vars(r)["doc_series"]

	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))
	waktu		 := fmt.Sprintf("%s", time.Now())
	
	colQuerier := bson.M{"doc_series": doc_series}
	change	   := bson.M{"$push" : bson.M{
						"files" : bson.M{
							"action"  		 : "insert",
							"by_kodejabatan" : session.Get(r, "kode_jabatan"),
							"by_name"	     : session.Get(r, "nama"),
							"waktu"			 : waktu,
							"created_from"   : ip,
							"nama_file"   	 : nama_file,
						},
					},
				  }

	err 	   := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func One(r *http.Request) interface{} {
	
	doc_series := mux.Vars(r)["doc_series"]
	kode_jabatan := session.Get(r, "kode_jabatan")

	var result bson.M
	err := models.MongoDB.C("sms").Find(bson.M{"doc_series": doc_series}).One(&result)
	if err != nil {
		return err
	}else{
		return OneFormatter(result, kode_jabatan)
	}
}

func OneForPDF(doc_series string) (map[string]interface{}, interface{}) {
	var result map[string]interface{}
	err := models.MongoDB.C("sms").Find(bson.M{"doc_series": doc_series}).One(&result)
	return result, err
}

func IsTanggalTerimaSetted(doc_series string, kode_jabatan string) (map[string]interface{}, interface{}){
	
	var result map[string]interface{}

    tagName 	 := "tag." + kode_jabatan
    tagTglTerima := tagName + ".to_tanggalditerima"
	colQuerier   := bson.M{
					"$and" : []bson.M{
					{"doc_series": doc_series},
			        {	
			        	tagTglTerima : bson.M{
			            	"$exists" : true,
			        	},
			        },
    			},
    		}

	err := models.MongoDB.C("sms").Find(colQuerier).One(&result)
	return result, err
}

func IsTagExistFor(doc_series string, kode_jabatan string) (map[string]interface{}, interface{}){

	var result map[string]interface{}
	colQuerier := bson.M{"doc_series": doc_series, "tag.kode_jabatan": kode_jabatan}
	err := models.MongoDB.C("sms").Find(colQuerier).One(&result)
	return result, err
}

func AddTagTo(r *http.Request) (map[string]interface{}, interface{}) {

    doc_series 		:= mux.Vars(r)["doc_series"]
    ip		 	    := fmt.Sprintf("%s", funcs.GetIP(r))
    waktu		 	:= fmt.Sprintf("%v", time.Now())
    kode_jabatan 	:= r.FormValue("kode_jabatan")
    catatan 		:= r.FormValue("catatan")
    disposisi 		:= r.FormValue("disposisi")

    var j map[string]interface{}
    j,_ 		     = jabatan_model.GetNamaJabatan(kode_jabatan)
    nama_jabatan	:= fmt.Sprintf("%v", j["nama_jabatan"])

    var u map[string]interface{}
    u,_				 = user_model.OneByKode(kode_jabatan)
    nama 			:= fmt.Sprintf("%v", u["nama"])
    id_user 		:= fmt.Sprintf("%v", u["id_user"])
    
    tagName := "tag." + kode_jabatan
    colQuerier 		:= bson.M{"doc_series": doc_series}
	change     		:= bson.M{
				        "$set" : bson.M{
				                tagName : bson.M{
		    						"createdby_time"   : waktu,
		    						"createdby_ip"     : ip,
		    						"createdby_kodejabatan"  : session.Get(r, "kode_jabatan"),
		    						"createdby_namajabatan"  : session.Get(r, "nama_jabatan"),
		    						"createdby_nama" 	: session.Get(r, "nama"),
		    						"createdby_iduser" : session.Get(r, "id_user"),
				                	"to_iduser"         : id_user, 
				                	"to_nama"           : nama, 
		    						"to_kodejabatan"	: kode_jabatan, 
		    						"to_namajabatan"	: nama_jabatan,
		    						"to_disposisi"		: disposisi,
		    						"to_catatan"		: catatan,
				                },
				            },
    					}

    err := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func SetTanggalTerima(r *http.Request) (map[string]interface{}, interface{}) {

    doc_series 		:= r.FormValue("doc_series")
    kode_jabatan 	:= session.Get(r, "kode_jabatan")
    waktu		 	:= fmt.Sprintf("%v", time.Now())
    doc, _ 	 		:= nomoragenda_model.Set(kode_jabatan)

    tagName := "tag." + kode_jabatan
    colQuerier 		:= bson.M{
					        "$and" : []bson.M{
					            {"doc_series": doc_series},
					            {
					                tagName + ".to_tanggalditerima" : bson.M{"$exists" : false},
					            },
					        },
					    }
    change     		:= bson.M{
					   		"$set" :  bson.M{ 
					   			tagName + ".to_nomoragenda"   : doc["nomor_agenda"],
					   			tagName + ".to_tanggalditerima" : waktu },
					   }
    err := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func SearchFormTanggal() interface{} {
	var result []ListTanggal
	err := models.MongoDB.C("form_search_tanggal").Find(bson.M{}).Sort("value").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func SearchFormBulan() interface{} {
	var result []ListBulan
	err := models.MongoDB.C("form_search_bulan").Find(bson.M{}).Sort("value").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func SearchFormTahun() interface{} {
	var result []ListTahun
	err := models.MongoDB.C("form_search_tahun").Find(bson.M{}).Sort("-value").All(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func Jenis_skl(r *http.Request) interface{} {
	var result map[string]interface{}
	user_rule_name := session.Get(r, "jenis_skl")
	err := models.MongoDB.C("jenis_skl").Find(bson.M{"rule_name": user_rule_name}).Select(bson.M{"list": 1, "_id": 0}).One(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func Kode_skl(r *http.Request) interface{} {
	var result map[string]interface{}
	user_rule_name := session.Get(r, "kode_skl")
	err := models.MongoDB.C("kode_skl").Find(bson.M{"rule_name": user_rule_name}).Select(bson.M{"list": 1, "_id": 0}).One(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

func RemoveTagFrom(r *http.Request) (map[string]interface{}, interface{}) {

    doc_series 		:= mux.Vars(r)["doc_series"]
    kode_jabatan 	:= r.FormValue("kode_jabatan")
    created_by		:= session.Get(r, "kode_jabatan")
    
    tagName 		:= "tag." + kode_jabatan
    colQuerier 		:= bson.M{
					        "$and" : []bson.M{
					            {"doc_series": doc_series},
					            {
					            	tagName + ".createdby_kodejabatan" : created_by,
					                tagName + ".to_kodejabatan" : kode_jabatan,
					                tagName + ".to_tanggalditerima" : bson.M{ "$exists" : false},
					            },
					        },
					    }
    change     		:= bson.M{
					   		"$unset" :  bson.M{ tagName : 1 },
					   }
    err := models.MongoDB.C("sms").Update(colQuerier, change)

	return change, err
}
