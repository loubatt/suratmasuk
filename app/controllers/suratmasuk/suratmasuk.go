package suratmasuk

import(
    "os"
    "io"
	"fmt"
    "net/http"
    "html/template"
    "encoding/json"
    "github.com/gorilla/mux"
    "../../config"
	"../../auth"
    "../../session"
	"../../function"
    "../../models/suratmasuk"
    "../../models/wordrank"
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
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/login", 301)
    }else{
        finalResult := map[string]interface{}{
        	"say" : "Hai",
        }

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "base-suratmasuk.html", config.GetConfig("TemplatePath") + "home.html"))
        err := templates.ExecuteTemplate(w, "base", finalResult)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    }
}

func Page(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        _, listsurat, totalsurat := suratmasuk_model.GetAll(r, false) // false = tampilkan per page, true = tampilkan semua (untuk printpreview)

        finalResult := Response{
            "my_kodejabatan" : session.Get(r, "kode_jabatan"), 
            "my_nama"        : session.Get(r, "nama"), 
            "my_namajabatan" : session.Get(r, "nama_jabatan"), 
            "listsurat"      : listsurat, 
            "count"          : totalsurat,
        }
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return
        
    }
}

func Detail(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        datasurat   := suratmasuk_model.One(r)

        finalResult := Response{"datasurat": datasurat}
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}

func Input(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{

        _, errInput         := suratmasuk_model.Input(r)

        if errInput != nil {
            finalResult := Response{"result"   : "Error",}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result": "OK"}
            fmt.Fprint(w, finalResult)
        }
        return
    }
}

func Edit(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        _, errEdit   := suratmasuk_model.Edit(r)
        _, errInsert := suratmasuk_model.InsertHistory(r, "edit")

        if errEdit != nil || errInsert != nil {
            finalResult := Response{"result"   : "Error",}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result"   : "OK",}
            fmt.Fprint(w, finalResult)
        }
        return         
    }
}

func Upload(w http.ResponseWriter, r *http.Request){

    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{    
        // the FormFile function takes in the POST input id file
        file, header, err := r.FormFile("file")

        if err != nil {
             fmt.Fprintln(w, err)
             return
        }

        defer file.Close()

        nama_file := funcs.RandomString(5, "alphanum") + "_" + header.Filename
        out, err  := os.Create(config.GetConfig("UploadPath") + nama_file)
        if err != nil {
             fmt.Println(err)
             fmt.Fprintf(w, "Unable to create the file for writing. Check your write access privilege")
             return
        }

        defer out.Close()

        // write the content from POST to the file
        _, err = io.Copy(out, file)
        if err != nil {
             fmt.Fprintln(w, err)
        }

        // write to database
        _, errDB := suratmasuk_model.InsertFile(r, nama_file)

        if errDB != nil {
            finalResult := Response{"result" : errDB}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result" : "OK"}
            fmt.Fprint(w, finalResult)
        }
    }
}

func PicPost(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        doc_series      := mux.Vars(r)["doc_series"]
        kode_jabatan    := r.FormValue("kode_jabatan")

        // Cek Tanggal Terima
        _,error := suratmasuk_model.IsTanggalTerimaSetted(doc_series, session.Get(r, "kode_jabatan"))

        if error != nil{
            // Tanggal terima belum di set
            fmt.Println(doc_series)
            fmt.Println(kode_jabatan)
            finalResult := Response{"result"   : "Tgl Terima belum di set",}
            fmt.Fprint(w, finalResult)
        }else{

            // Cek Tag Untuk kode jabatan tertentu
            var tag map[string]interface{}
            tag,_ = suratmasuk_model.IsTagExistFor(doc_series, kode_jabatan)

            // Tag Sudah ada di dokumen
            if tag["doc_series"] != nil {
                finalResult := Response{"result"   : "Tag Exist",}
                fmt.Fprint(w, finalResult)

            // Tag available untuk diinput, Silakan input
            }else{
                _, err := suratmasuk_model.AddTagTo(r)
                if err != nil {
                    finalResult := Response{"result"   : "Gagal Add",}
                    fmt.Fprint(w, finalResult)
                }else{
                    finalResult := Response{"result"   : "OK",}
                    fmt.Fprint(w, finalResult)
                }
            }
        }

        return         
    }
}

func PicRemove(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        _, err := suratmasuk_model.RemoveTagFrom(r)

        if err != nil {
            finalResult := Response{"result"   : err,}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result"   : "OK",}
            fmt.Fprint(w, finalResult)
        }
        return          
    }
}

func SetTanggalTerima(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        _, err := suratmasuk_model.SetTanggalTerima(r)

        if err != nil {
            finalResult := Response{"result"   : err,}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result"   : "OK",}
            fmt.Fprint(w, finalResult)
        }
        return         
    }
}

func Search(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        nomor_agenda  := r.FormValue("nomor_agenda")
        waktuterima_surat := r.FormValue("waktuterima_surat")
        asal          := r.FormValue("asal")
        nomor_surat   := r.FormValue("nomor_surat")
        tanggal_surat := r.FormValue("tanggal_surat")
        hal           := r.FormValue("hal")
        kode_jabatan  := r.FormValue("kode_jabatan")

        session.Save(w, r, "search-nomoragenda", nomor_agenda)
        session.Save(w, r, "search-waktuterimasurat", waktuterima_surat)
        session.Save(w, r, "search-asal", asal)
        session.Save(w, r, "search-nomorsurat", nomor_surat)
        session.Save(w, r, "search-tanggalsurat", tanggal_surat)
        session.Save(w, r, "search-hal", hal)
        session.Save(w, r, "search-kodejabatan", kode_jabatan)

        finalResult := Response{"result"   : "OK",}
        fmt.Fprint(w, finalResult)
        return         
    }
}

func SearchClear(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        session.Save(w, r, "search-nomoragenda", "")
        session.Save(w, r, "search-waktuterimasurat", "")
        session.Save(w, r, "search-asal", "")
        session.Save(w, r, "search-nomorsurat", "")
        session.Save(w, r, "search-tanggalsurat", "")
        session.Save(w, r, "search-hal", "")
        session.Save(w, r, "search-kodejabatan", "")

        finalResult := Response{"result"   : "OK",}
        fmt.Fprint(w, finalResult)
        return         
    }
}

func SearchGetValue(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        search_nomoragenda  := session.Get(r, "search-nomoragenda")
        search_waktuterimasurat := session.Get(r, "search-waktuterimasurat")
        search_asal         := session.Get(r, "search-asal")
        search_nomorsurat   := session.Get(r, "search-nomorsurat")
        search_tanggalsurat := session.Get(r, "search-tanggalsurat")
        search_hal          := session.Get(r, "search-hal")
        search_kodejabatan := session.Get(r, "search-kodejabatan")

        finalResult := Response{
            "search-nomoragenda" : search_nomoragenda,
            "search-waktuterimasurat" : search_waktuterimasurat,
            "search-asal"         : search_asal,
            "search-nomorsurat"   : search_nomorsurat,
            "search-tanggalsurat" : search_tanggalsurat,
            "search-hal"          : search_hal,
            "search-kodejabatan"  : search_kodejabatan,
        }
        fmt.Fprint(w, finalResult)
        return         
    }
}

func FormGetVars(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        list_tanggal := suratmasuk_model.SearchFormTanggal()
        list_bulan   := suratmasuk_model.SearchFormBulan()
        list_tahun   := suratmasuk_model.SearchFormTahun()
        jenis_skl    := suratmasuk_model.Jenis_skl(r)
        kode_skl     := suratmasuk_model.Kode_skl(r)

        f    := Response{
            "list_tanggal" : list_tanggal, 
            "list_bulan"   : list_bulan, 
            "list_tahun"   : list_tahun, 
            "jenis_skl"    : jenis_skl, 
            "kode_skl"     : kode_skl, 
        }
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, f)
        return
        
    }
}

func PrintPreview(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        fmt.Println("No Auth")
        http.Redirect(w, r, "/suratmasuk", 301)
    }else{
        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "base-sms_printpreview.html", config.GetConfig("TemplatePath") + "sms_printpreview.html"))
        err := templates.ExecuteTemplate(w, "base", nil)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        } 
    }
}

func PrintPreviewData(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        _, listsurat, totalsurat := suratmasuk_model.GetAll(r, true) // true = tampilkan semua data, tanpa paging

        finalResult := Response{
            "listsurat"      : listsurat,
            "count"          : totalsurat,
            "my_kodejabatan" : session.Get(r, "kode_jabatan"),
        }
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return
        
    }
}

func Suggest(w http.ResponseWriter, r *http.Request) {
    word   := mux.Vars(r)["word"]

    res, _ := wordrank_model.Get(r, word)

    finalResult := Response{"result"   : res,}
    fmt.Fprint(w, finalResult)
    return
}