package admin

import(
	"net/http"
	"html/template"
	"fmt"
	"../../config"
	"../../auth"
	"../../session"
    // "../../models/admin"
    "../../models/user"
    "../../models/admin"
	"../../models/jabatan"
    // "reflect"
)

func Home(w http.ResponseWriter, r *http.Request) {
	if auth.IsAdmin(r) == "" {
		http.Redirect(w, r, "/admin/login", 301)
	}else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
        }

	    templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/home.html"))
	    err := templates.ExecuteTemplate(w, "base", finalResult)
	    if err != nil {
	        http.Error(w, err.Error(), http.StatusInternalServerError)
	    }
	}
}

// LOGIN
func Login(w http.ResponseWriter, r *http.Request) {
	if auth.IsAdmin(r) == "" {
	    templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base-noauth.html", config.GetConfig("TemplatePath") + "admin/login.html"))
	    err := templates.ExecuteTemplate(w, "base", user_model.All())
	    if err != nil {
	        http.Error(w, err.Error(), http.StatusInternalServerError)
	    }		
	}else{
		http.Redirect(w, r, "/admin", 301)
	}
}

func LoginPost(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        username          := r.FormValue("username")
        password          := r.FormValue("password")

        var adminAccount map[string]interface{}
        adminAccount, err := adminModel.Check(username, password)

        if err != nil {
            http.Redirect(w, r, "/admin/#login-failed", 301)
        }else{
            val := fmt.Sprintf("%s", adminAccount["username"])
            session.Save(w, r, "admin", val)
            http.Redirect(w, r, "/admin", 301)
        }
    }else{
        http.Redirect(w, r, "/admin", 301)
    }
}

func Logout(w http.ResponseWriter, r *http.Request) {

	if auth.IsAdmin(r) == "" {
		http.Redirect(w, r, "/admin/#no-need-logout", 301)
	}else{
        session.Delete(w, r, "admin")
        http.Redirect(w, r, "/admin", 301)
	}
}

// USER
func User(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
            "userlist"    : user_model.All(),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/user.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func UserAdd(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/useradd.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func UserAddPost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if user_model.Add(r) == "ok" {
            http.Redirect(w, r, "/admin/user", 301)
        }else{
            http.Redirect(w, r, "/admin/user/#gagal-edit", 301)
        }
    }
}

func UserEdit(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
            "datauser"    : user_model.One(r),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/useredit.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func UserEditPost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if user_model.Update(r) == "ok" {
            http.Redirect(w, r, "/admin/user", 301)
        }else{
            http.Redirect(w, r, "/admin/user/#gagal-edit", 301)
        }
    }
}

func UserRemove(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
            "datauser"    : user_model.One(r),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/userremove.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func UserRemovePost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if user_model.Remove(r) == "ok" {
            http.Redirect(w, r, "/admin/user", 301)
        }else{
            http.Redirect(w, r, "/admin/user/#gagal-remove", 301)
        }
    }
}

// JABATAN
func Jabatan(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
            "jabatanlist"    : jabatan_model.All(),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/jabatan.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func JabatanAdd(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/jabatanadd.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func JabatanAddPost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if jabatan_model.Add(r) == "ok" {
            http.Redirect(w, r, "/admin/jabatan", 301)
        }else{
            http.Redirect(w, r, "/admin/jabatan/#gagal-add", 301)
        }
    }
}

func JabatanEdit(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"     : session.Get(r, "admin"),
            "datajabatan"    : jabatan_model.One(r),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/jabatanedit.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func JabatanEditPost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if jabatan_model.Update(r) == "ok" {
            http.Redirect(w, r, "/admin/jabatan", 301)
        }else{
            http.Redirect(w, r, "/admin/jabatan/#gagal-edit", 301)
        }
    }
}

func JabatanRemove(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
            "datajabatan" : jabatan_model.One(r),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/jabatanremove.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func JabatanRemovePost(w http.ResponseWriter, r *http.Request) {

    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{
        if jabatan_model.Remove(r) == "ok" {
            http.Redirect(w, r, "/admin/jabatan", 301)
        }else{
            http.Redirect(w, r, "/admin/jabatan/#gagal-remove", 301)
        }
    }
}

// FORM SEARCH
func FormSearch(w http.ResponseWriter, r *http.Request) {
    
    if auth.IsAdmin(r) == "" {
        http.Redirect(w, r, "/admin/login", 301)
    }else{

        // model
        finalResult := map[string]interface{}{
            "admin_name"  : session.Get(r, "admin"),
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "admin/base.html", config.GetConfig("TemplatePath") + "admin/formsearch.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}