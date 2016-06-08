package root

import(
	"net/http"
	"html/template"
	"encoding/json"
	"fmt"
	"../../config"
	// "../../models"
	"../../models/home"
)

type Response map[string]interface{}

func (r Response) String() (s string) {
    b, err := json.Marshal(r)
    if err != nil {
            s = ""
            return
    }
    s = string(b)
    return
}

func Index(w http.ResponseWriter, r *http.Request) {

    finalResult := map[string]interface{}{
    	"say" : "Hai",
        // "username"  			: session.Get(r, "username"),
        // "kode_jabatan"  		: session.Get(r, "kode_jabatan"),
        // "nama"  				: session.Get(r, "nama"),
        // "id_user"  				: session.Get(r, "id_user"),
        // "nama_jabatan"			: session.Get(r, "nama_jabatan"),
        // "nama_jabatan_pendek"	: session.Get(r, "nama_jabatan_pendek"),
        // "atasan"  				: session.Get(r, "atasan"),
        // "jsfile"	    		: "/custom/suratmasuk/index_ajax.js",
    }

    templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "base-home.html", config.GetConfig("TemplatePath") + "home.html"))
    err := templates.ExecuteTemplate(w, "base", finalResult)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

func Api(w http.ResponseWriter, r *http.Request) {
       
    list,_ 		:= homeModel.Api(r)
    finalResult := Response{"list": list}
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprint(w, finalResult)
    return
}

func Post(w http.ResponseWriter, r *http.Request) {
       
    send,_      := homeModel.Post(r)
    finalResult := Response{"list": send, "post": "OK"}
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprint(w, finalResult)
    return
}