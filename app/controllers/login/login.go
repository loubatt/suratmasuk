package login

import(
	"net/http"
	"html/template"
	"fmt"
	"../../config"
	"../../auth"
	"../../session"
    "../../models/login"
    "../../models/user"
)

// LOGIN
func Index(w http.ResponseWriter, r *http.Request) {
	if auth.IsUser(r) == "" {

	    templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "base-loginuser.html", config.GetConfig("TemplatePath") + "loginuser.html"))
	    err := templates.ExecuteTemplate(w, "base", nil)
	    if err != nil {
	        http.Error(w, err.Error(), http.StatusInternalServerError)
	    }		
	}else{
		http.Redirect(w, r, "/suratmasuk", 301)
	}
}

func Post(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsUser(r) == "" {
        username          := r.FormValue("username")
        password          := r.FormValue("password")

        var userAccount map[string]interface{}
        userAccount, err := user_model.Check(username, password)

        if err != nil {
            http.Redirect(w, r, "/suratmasuk", 301)
        }else{
            
            // USER
            kode_jabatan    := fmt.Sprintf("%s", userAccount["kode_jabatan"])
            jenis_skl 	    := fmt.Sprintf("%s", userAccount["jenis_skl"])
            username	 	:= fmt.Sprintf("%s", userAccount["username"])
            nama		 	:= fmt.Sprintf("%s", userAccount["nama"])
            id_user		 	:= fmt.Sprintf("%s", userAccount["id_user"])
            
            // JABATAN
            var jabatan map[string]interface{}
            jabatan,_ 	          = login_model.GetNamaJabatan(kode_jabatan)
            nama_jabatan         := fmt.Sprintf("%s", jabatan["nama_jabatan"])
            nama_jabatan_pendek  := fmt.Sprintf("%s", jabatan["nama_jabatan_pendek"])
            atasan               := fmt.Sprintf("%s", jabatan["atasan"])
            kode_skl	         := fmt.Sprintf("%s", jabatan["kode_skl"])
            
            // Session Register
            session.Save(w, r, "kode_jabatan", kode_jabatan)
            session.Save(w, r, "jenis_skl", jenis_skl)
            session.Save(w, r, "kode_skl", kode_skl)
            session.Save(w, r, "username", username)
            session.Save(w, r, "nama", nama)
            session.Save(w, r, "id_user", id_user)
            session.Save(w, r, "nama_jabatan", nama_jabatan)
            session.Save(w, r, "nama_jabatan_pendek", nama_jabatan_pendek)
            session.Save(w, r, "atasan", atasan)

            http.Redirect(w, r, "/suratmasuk", 301)
        }
    }else{
        http.Redirect(w, r, "/", 301)
    }
}

func Logout(w http.ResponseWriter, r *http.Request) {

	if auth.IsUser(r) == "" {
		http.Redirect(w, r, "/#no-need-logout", 301)
	}else{
        session.Delete(w, r, "kode_jabatan")
        http.Redirect(w, r, "/suratmasuk", 301)
	}
}