package suratkeluar

import(
    "os"
    "io"
	"fmt"
    "net/http"
    "html/template"
    "encoding/json"
    // "github.com/gorilla/mux"
    "../../config"
	"../../auth"
    "../../session"
	"../../function"
    "../../models/suratkeluar"
    "../../models/nomor_skl"
    // "../../models/suratmasuk"
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

        templates := template.Must(template.New("").ParseFiles(config.GetConfig("TemplatePath") + "base-suratkeluar.html", config.GetConfig("TemplatePath") + "home.html"))
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
        
        listsurat     := suratkeluar_model.All(r)
        totalsurat    := suratkeluar_model.Total(r)

        finalResult := Response{
            "my_kodejabatan": session.Get(r, "kode_jabatan"), 
            "my_nama": session.Get(r, "nama"), 
            "my_namajabatan": session.Get(r, "nama_jabatan"), 
            "listsurat": listsurat, 
            "count": totalsurat,
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
        
        datasurat   := suratkeluar_model.One(r)

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

        data, errInput := suratkeluar_model.Input(r)
        _, errLogInput := suratkeluar_model.InsertInputHistory(data)

        if errInput != nil || errLogInput != nil {
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

        _, errEdit   := suratkeluar_model.Edit(r)
        _, errInsert := suratkeluar_model.InsertEditHistory(r, "edit")

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
        out, err  := os.Create(config.GetConfig("UploadSKLPath") + nama_file)
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
        _, errDB := suratkeluar_model.InsertFile(r, nama_file)

        if errDB != nil {
            finalResult := Response{"result" : errDB}
            fmt.Fprint(w, finalResult)
        }else{
            finalResult := Response{"result" : "OK"}
            fmt.Fprint(w, finalResult)
        }
    }
}

/*
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
*/

func Search(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        tujuan        := r.FormValue("tujuan_surat")
        jenis_surat   := r.FormValue("jenis_surat")
        nomor_surat   := r.FormValue("nomor_surat")
        kode_surat    := r.FormValue("kode_surat")
        tanggal_surat := r.FormValue("tanggal_surat")
        bulan_surat   := r.FormValue("bulan_surat")
        tahun_surat   := r.FormValue("tahun_surat")
        hal           := r.FormValue("hal")
        kode_penunjuk := r.FormValue("kode_penunjuk")

        session.Save(w, r, "skl-search-tujuan", tujuan)
        session.Save(w, r, "skl-search-jenissurat", jenis_surat)
        session.Save(w, r, "skl-search-nomorsurat", nomor_surat)
        session.Save(w, r, "skl-search-kodesurat", kode_surat)
        session.Save(w, r, "skl-search-tanggalsurat", tanggal_surat)
        session.Save(w, r, "skl-search-bulansurat", bulan_surat)
        session.Save(w, r, "skl-search-tahunsurat", tahun_surat)
        session.Save(w, r, "skl-search-halsurat", hal)
        session.Save(w, r, "skl-search-kodepenunjuk", kode_penunjuk)

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

        session.Save(w, r, "skl-search-tujuan"       , "")
        session.Save(w, r, "skl-search-jenissurat"   , "")
        session.Save(w, r, "skl-search-nomorsurat"   , "")
        session.Save(w, r, "skl-search-kodesurat"    , "")
        session.Save(w, r, "skl-search-tanggalsurat" , "")
        session.Save(w, r, "skl-search-bulansurat"   , "")
        session.Save(w, r, "skl-search-tahunsurat"   , "")
        session.Save(w, r, "skl-search-halsurat"     , "")
        session.Save(w, r, "skl-search-kodepenunjuk" , "")

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

        finalResult := Response{
            "skl-search-tujuan"       : session.Get(r, "skl-search-tujuan"),
            "skl-search-jenissurat"   : session.Get(r, "skl-search-jenissurat"),
            "skl-search-nomorsurat"   : session.Get(r, "skl-search-nomorsurat"),
            "skl-search-kodesurat"    : session.Get(r, "skl-search-kodesurat"),
            "skl-search-tanggalsurat" : session.Get(r, "skl-search-tanggalsurat"),
            "skl-search-bulansurat"   : session.Get(r, "skl-search-bulansurat"),
            "skl-search-tahunsurat"   : session.Get(r, "skl-search-tahunsurat"),
            "skl-search-halsurat"     : session.Get(r, "skl-search-halsurat"),
            "skl-search-kodepenunjuk" : session.Get(r, "skl-search-kodepenunjuk"),
        }
        fmt.Fprint(w, finalResult)
        return         
    }
}

/*
func FormGetVars(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        list_tanggal := suratmasuk_model.SearchFormTanggal()
        list_bulan   := suratmasuk_model.SearchFormBulan()
        list_tahun   := suratmasuk_model.SearchFormTahun()

        f    := Response{
            "list_tanggal" : list_tanggal, 
            "list_bulan"   : list_bulan, 
            "list_tahun"   : list_tahun, 
        }
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, f)
        return
        
    }
}
*/

func CheckLast(w http.ResponseWriter, r *http.Request) {

    if auth.IsUser(r) == "" {
        finalResult := Response{"result"   : "No Auth",}
        fmt.Fprint(w, finalResult)
        return
    }else{
        
        w.Header().Set("Content-Type", "application/json")

        tahun_surat   := r.FormValue("tahun_surat")
        jenis_surat   := r.FormValue("jenis_surat")
        kode_surat    := r.FormValue("kode_surat")

        data, _ := nomorskl_model.CekTanggalTerakhir(tahun_surat, jenis_surat, kode_surat)

        finalResult := Response{"result"   : data,}
        fmt.Fprint(w, finalResult)
        return         
    }
}