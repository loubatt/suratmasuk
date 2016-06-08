package suratkeluar_model

import(
	"fmt"
	"time"
	"strconv"
	"strings"
    "net/http"
    "github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
	"github.com/manucorporat/try"

	"../../session"
	"../../function"
	"../../models"
	"../../models/nomor_skl"
	"../../models/jabatan"
	"../../models/user"
)

var(
	rowsNum           = 10
	limit             = 10
)

type Suratkeluar struct {
	Doc_series string
	Jenis_skl string
	Nomor_skl int
	Kode_skl string
	Tahun_skl string
	Tujuan_skl string
	Tanggal_skl string
	Perihal_skl string
	Tag interface{}
	Files interface{}
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

// DATA FACTORY
func AllFormatter(data interface{}, kode_jabatan string) interface{}{

	var ListSurat []interface{}
	for _,v := range data.([]bson.M) {
		var Surat map[string]interface{}
		Surat = make(map[string]interface{})
		for k1, v1 := range v{
			if k1 == "tag" {
				var Tags []interface{}
				for k2, v2 := range v1.(bson.M) {
					Tags = append(Tags, v2)
					for k3, v3 := range v2.(bson.M) {
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
				}
				Surat[k1] = Tags
			}else if k1 == "tanggal_skl" {
				Surat[k1] = funcs.TimeIndonesianFormatter2( v1.(string) )
			}else{
				Surat[k1] = v1
			}
		}
		ListSurat = append(ListSurat, Surat)
	}
	return ListSurat
}

// GET DATA
func All(r *http.Request) interface{} {

	var result []bson.M
	
	kode_jabatan  := session.Get(r, "kode_jabatan")
	tagName 	  := "tag." + kode_jabatan

	tujuan_surat  := session.Get(r, "skl-search-tujuan")
	jenis_surat   := session.Get(r, "skl-search-jenissurat")
	nomor_surat	  := session.Get(r, "skl-search-nomorsurat")
	kode_surat	  := session.Get(r, "skl-search-kodesurat")
	tanggal_surat := session.Get(r, "skl-search-tanggalsurat")
	bulan_surat	  := session.Get(r, "skl-search-bulansurat")
	tahun_surat	  := session.Get(r, "skl-search-tahunsurat")
	hal  	      := session.Get(r, "skl-search-halsurat")
	kode_penunjuk := session.Get(r, "skl-search-kodepenunjuk")

	string_query := tujuan_surat + jenis_surat + nomor_surat + kode_surat + tanggal_surat + bulan_surat + tahun_surat + hal + kode_penunjuk

    page      	 := mux.Vars(r)["page"]
    pageInt,_ 	 := strconv.Atoi(page)
    skip      	 := (pageInt - 1) * rowsNum

    if string_query == "" {
		colQuerier := bson.M{
					tagName : bson.M{
						"$exists" : true,
						},
					"status": "active",
				  }
		err := models.MongoDB.C("skl").Find(colQuerier).Sort("-waktu").Skip(skip).Limit(limit).All(&result)
		if err != nil {
			return err
		}else{
			return AllFormatter(result, kode_jabatan)
		}
	}else{

		query := bson.M{}
		query[tagName] = bson.M{"$exists" : true}
		query["$and"] = []bson.M{}

		_tujuan := strings.Split(tujuan_surat, " ")
		for _, v := range _tujuan {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"tujuan_skl": bson.RegEx{v, "ig"}})
	    }

	    if jenis_surat != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"jenis_skl": strings.ToUpper(jenis_surat)})
	    }

		if nomor_surat != "" {
			nomor, _ := strconv.Atoi(nomor_surat)
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"nomor_skl": nomor})
	    }

	    if kode_surat != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"kode_skl": strings.ToUpper(kode_surat)})
	    }

		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{tanggal_surat, "ig"}})
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{bulan_surat, "ig"}})
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{tahun_surat, "ig"}})
		
		_hal := strings.Split(hal, " ")
		for _, v := range _hal {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"perihal_skl": bson.RegEx{v, "ig"}})
	    }	

	    if kode_penunjuk != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"kode_penunjuk": bson.RegEx{kode_penunjuk, "ig"}})
	    }

		colQuerier := query
		// fmt.Println(colQuerier)
		err := models.MongoDB.C("skl").Find(colQuerier).Sort("-waktu").Skip(skip).Limit(limit).All(&result)
		if err != nil {
			return err
		}else{
			return AllFormatter(result, kode_jabatan)
		}		
	}
}

func Total(r *http.Request) interface{} {

	kode_jabatan  := session.Get(r, "kode_jabatan")
	tagName 	  := "tag." + kode_jabatan

	tujuan_surat  := session.Get(r, "skl-search-tujuan")
	jenis_surat   := session.Get(r, "skl-search-jenissurat")
	nomor_surat	  := session.Get(r, "skl-search-nomorsurat")
	kode_surat	  := session.Get(r, "skl-search-kodesurat")
	tanggal_surat := session.Get(r, "skl-search-tanggalsurat")
	bulan_surat	  := session.Get(r, "skl-search-bulansurat")
	tahun_surat	  := session.Get(r, "skl-search-tahunsurat")
	hal  	      := session.Get(r, "skl-search-halsurat")
	kode_penunjuk := session.Get(r, "skl-search-kodepenunjuk")

	string_query := tujuan_surat + jenis_surat + nomor_surat + kode_surat + tanggal_surat + bulan_surat + tahun_surat + hal + kode_penunjuk

	if string_query == "" {
		colQuerier := bson.M{
						tagName : bson.M{
							"$exists" : true,
							},
						"status": "active",
					  }
		count, err := models.MongoDB.C("skl").Find(colQuerier).Count()

		if err != nil {
			return err
		}else{
			return count
		}
	}else{

		query := bson.M{}
		query[tagName] = bson.M{"$exists" : true}
		query["$and"] = []bson.M{}

		_tujuan := strings.Split(tujuan_surat, " ")
		for _, v := range _tujuan {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"tujuan_skl": bson.RegEx{v, "ig"}})
	    }

	    if jenis_surat != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"jenis_skl": strings.ToUpper(jenis_surat)})
	    }

		if nomor_surat != "" {
			nomor, _ := strconv.Atoi(nomor_surat)
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"nomor_skl": nomor})
	    }

	    if kode_surat != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"kode_skl": strings.ToUpper(kode_surat)})
	    }

		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{tanggal_surat, "ig"}})
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{bulan_surat, "ig"}})
		query["$and"] = append(query["$and"].([]bson.M), bson.M{"tanggal_skl": bson.RegEx{tahun_surat, "ig"}})
		
		_hal := strings.Split(hal, " ")
		for _, v := range _hal {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"perihal_skl": bson.RegEx{v, "ig"}})
	    }	

		if kode_penunjuk != "" {
			query["$and"] = append(query["$and"].([]bson.M), bson.M{"kode_penunjuk": bson.RegEx{kode_penunjuk, "ig"}})
	    }

		colQuerier := query
		count, err := models.MongoDB.C("skl").Find(colQuerier).Count()
		if err != nil {
			return err
		}else{
			return count
		}		
	}
}

func TagAtasan(r *http.Request, doc_series string) string {

	var result bson.M

	status         := false
	my_kodejabatan := session.Get(r, "kode_jabatan")

	for status == false {

		err := models.MongoDB.C("jabatan").Find(bson.M{"kode_jabatan": my_kodejabatan}).One(&result)
		if err != nil {
			status = true
		}else{
			try.This(func(){
				
				my_kodejabatan = result["atasan"].(string)

				var j map[string]interface{}
			    j,_				 = jabatan_model.GetNamaJabatan(my_kodejabatan)
			    nama_jabatan 	:= fmt.Sprintf("%v", j["nama_jabatan"])

				var u map[string]interface{}
			    u,_				 = user_model.OneByKode(my_kodejabatan)
			    nama 			:= fmt.Sprintf("%v", u["nama"])
			    id_user 		:= fmt.Sprintf("%v", u["id_user"])

				ip	 	    := fmt.Sprintf("%s", funcs.GetIP(r))
    			waktu	 	:= fmt.Sprintf("%v", time.Now())
			    tagName     := "tag." + my_kodejabatan
			    colQuerier 	:= bson.M{"doc_series": doc_series}
				change     	:= bson.M{
							        "$set" : bson.M{
							                tagName : bson.M{
					    						"createdby_time"   : waktu,
					    						"createdby_ip"     : ip,
					    						"createdby_kodejabatan"  : session.Get(r, "kode_jabatan"),
					    						"createdby_namajabatan"  : session.Get(r, "nama_jabatan"),
					    						"createdby_nama" 	: session.Get(r, "nama"),
					    						"createdby_iduser"  : session.Get(r, "id_user"),
					    						"to_iduser"         : id_user, 
							                	"to_nama"           : nama,
					    						"to_kodejabatan"	: my_kodejabatan, 
					    						"to_namajabatan"	: nama_jabatan,
							                	"status"			: "active",
							                },
							            },
			    					}

			    err := models.MongoDB.C("skl").Update(colQuerier, change)
			    if err != nil {
			    	// fmt.Println("Error")
			    }

			}).Catch(func(e try.E) {
				status = true
			})
		}

	}

	return doc_series
}

func Input(r *http.Request) (map[string]interface{}, interface{}) {

	kode_jabatan := session.Get(r, "kode_jabatan")

	tanggal_skl  := funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal_surat"))
	waktu		 := fmt.Sprintf("%s", time.Now())
	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))

	// cek tanggal SKL yang diminta User
	_ctglskl          := ""
	current_tgl_skl,_ := nomorskl_model.CekTanggalTerakhir(r.FormValue("tahun_surat"), r.FormValue("jenis_surat"), r.FormValue("kode_surat"))

	fmt.Println(current_tgl_skl["tanggal_skl"])

	try.This(func(){
		_ctglskl      = current_tgl_skl["tanggal_skl"].(string)
	}).Catch(func(e try.E){
		_ctglskl      = "1000-00-00"
	})

	form_tgl_skl      := strings.Replace(tanggal_skl, "-", "", -1)
	data_tgl_skl      := strings.Replace(_ctglskl, "-", "", -1)

	fmt.Println(form_tgl_skl + " " + data_tgl_skl)

	if form_tgl_skl < data_tgl_skl {
		data := map[string]interface{}{
					"Error": "TGL < TGL TERAKHIR",
					"createdby_time"   		: waktu,
					"createdby_ip"     		: ip,
					"createdby_kodejabatan" : session.Get(r, "kode_jabatan"),
					"createdby_namajabatan" : session.Get(r, "nama_jabatan"),
					"createdby_nama" 		: session.Get(r, "nama"),
					"createdby_iduser" 		: session.Get(r, "id_user"),
					"to_iduser"         : session.Get(r, "id_user"),
                	"to_nama"           : session.Get(r, "nama"),
					"to_kodejabatan"	: session.Get(r, "kode_jabatan"),
					"to_namajabatan"	: session.Get(r, "nama_jabatan"),
				}
		err  := "Error"
		fmt.Println("<")
		return data, err
	}else{

		fmt.Println("!<")

		doc, _ 	 	 := nomorskl_model.Set(r)
		
		doc_series := "skl" + funcs.RandomString(6, "alphanum")
		data := bson.M{
				"doc_series"		: doc_series,
				"waktu"				: waktu,
				"tahun_skl"			: doc["tahun_skl"],
				"jenis_skl"			: doc["jenis_skl"],
				"kode_skl"			: doc["kode_skl"],
				"nomor_skl"			: doc["nomor_skl"],
				"tanggal_skl"		: tanggal_skl,
				"tujuan_skl"		: r.FormValue("tujuan_surat"),
				"perihal_skl"		: r.FormValue("perihal_surat"),
				"tembusan_skl"		: r.FormValue("tembusan_surat"),
				"kode_penunjuk"		: r.FormValue("kode_penunjuk"),
				"createdby_ip"		: ip,
				"tag"				: bson.M{
										kode_jabatan : bson.M{
											"active" : true,
											"createdby_time"   		: waktu,
				    						"createdby_ip"     		: ip,
				    						"createdby_kodejabatan" : session.Get(r, "kode_jabatan"),
				    						"createdby_namajabatan" : session.Get(r, "nama_jabatan"),
				    						"createdby_nama" 		: session.Get(r, "nama"),
				    						"createdby_iduser" 		: session.Get(r, "id_user"),
				    						"to_iduser"         : session.Get(r, "id_user"),
						                	"to_nama"           : session.Get(r, "nama"),
				    						"to_kodejabatan"	: session.Get(r, "kode_jabatan"),
				    						"to_namajabatan"	: session.Get(r, "nama_jabatan"),
										},

				},
				"files"  			: []bson.M{},
				"status"			: "active",
		}

		err := models.MongoDB.C("skl").Insert(data)
		TagAtasan(r, doc_series)
		return data, err
	}
}

func Edit(r *http.Request) (map[string]interface{}, interface{}){

	doc_series    := mux.Vars(r)["doc_series"]
	tujuan   	  := r.FormValue("tujuan")
	hal 		  := r.FormValue("hal")
	tembusan 	  := r.FormValue("tembusan")
	kode_penunjuk := r.FormValue("kode_penunjuk")
	
	colQuerier := bson.M{"doc_series" : doc_series}
	change	   := bson.M{"$set"       : bson.M{
					"tujuan_skl"      : tujuan,
					"perihal_skl"     : hal,
					"tembusan_skl"	  : tembusan,
					"kode_penunjuk"   : kode_penunjuk,
					},
				  }

	err 	   := models.MongoDB.C("skl").Update(colQuerier, change)
	return change, err
}

func InsertInputHistory(data bson.M) (map[string]interface{}, interface{}){

	err := models.MongoDB.C("log").Insert(data)
	return data, err
}

func InsertEditHistory(r *http.Request, action string) (map[string]interface{}, interface{}){

	doc_series    := mux.Vars(r)["doc_series"]
	tujuan   	  := r.FormValue("tujuan")
	tanggal		  := funcs.TimeIndonesianToYYYYMMHH(r.FormValue("tanggal_surat"))
	hal 		  := r.FormValue("hal")
	tembusan 	  := r.FormValue("tembusan")
	kode_penunjuk := r.FormValue("kode_penunjuk")

	ip		 	 := fmt.Sprintf("%s", funcs.GetIP(r))
	waktu		 := fmt.Sprintf("%s", time.Now())
	
	data	     := bson.M{
						"doc_series"	 : doc_series,
						"action"  		 : "EDIT",
						"createdby_kodejabatan" : session.Get(r, "kode_jabatan"),
						"createdby_namajabatan"	: session.Get(r, "nama_jabatan"),
						"waktu"			 : waktu,
						"created_from"   : ip,
					}

	data["data"] = bson.M{
					"tujuan_skl"      : tujuan,
					"tanggal_skl"     : tanggal,
					"perihal_skl"     : hal,
					"tembusan_skl"	  : tembusan,
					"kode_penunjuk"   : kode_penunjuk,
				}

	err 	   := models.MongoDB.C("log").Insert(data)
	return data, err
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

	err 	   := models.MongoDB.C("skl").Update(colQuerier, change)
	fmt.Println("insert file")
	return change, err
}

func One(r *http.Request) interface{} {
	doc_series := mux.Vars(r)["doc_series"]
	var result map[string]interface{}
	err := models.MongoDB.C("skl").Find(bson.M{"doc_series": doc_series}).One(&result)
	if err != nil {
		return err
	}else{
		return result
	}
}

/*
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
	err := models.MongoDB.C("form_search_tahun").Find(bson.M{}).Sort("value").All(&result)
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

func InsertArsip(r *http.Request) (map[string]interface{}, interface{}){

	kode_jabatan := session.Get(r, "kode_jabatan")
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

	err 	   := models.MongoDB.C("sms").Update(colQuerier, change)
	return change, err
}

func RemoveArsip(r *http.Request) (map[string]interface{}, interface{}){

    created_by		:= session.Get(r, "kode_jabatan")
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
    err := models.MongoDB.C("sms").Update(colQuerier, change)

	return change, err
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
*/