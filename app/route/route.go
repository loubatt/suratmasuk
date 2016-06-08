package route

import(
    "os"
    "net/http"
    "github.com/gorilla/mux"

    "../config"
    "../controllers/admin"
    "../controllers/root"
    "../controllers/login"
    "../controllers/suratmasuk"
    "../controllers/suratkeluar"
    "../controllers/jabatan"
    "../controllers/arsip"
    "../controllers/pdfgenerator"

    // DEVELOPMENT PURPOSE ONLY, REMOVE WHEN PRODUCTION READY
    "../session"
)

type justFilesFilesystem struct {
    fs http.FileSystem
}

func (fs justFilesFilesystem) Open(name string) (http.File, error) {
    f, err := fs.fs.Open(name)
    if err != nil {
        return nil, err
    }
    return neuteredReaddirFile{f}, nil
}

type neuteredReaddirFile struct {
    http.File
}

func (f neuteredReaddirFile) Readdir(count int) ([]os.FileInfo, error) {
    return nil, nil
}

func Route() {
    
    mx := mux.NewRouter()

    mx.HandleFunc("/", root.Index).Methods("GET")
    
    // ### ADMIN ###
    mx.HandleFunc("/admin", admin.Home).Methods("GET")

    mx.HandleFunc("/admin/login", admin.Login).Methods("GET")
    mx.HandleFunc("/admin/login", admin.LoginPost).Methods("POST")
    mx.HandleFunc("/admin/logout", admin.Logout).Methods("GET")

    mx.HandleFunc("/admin/user", admin.User).Methods("GET")
    mx.HandleFunc("/admin/user/add", admin.UserAdd).Methods("GET")
    mx.HandleFunc("/admin/user/add", admin.UserAddPost).Methods("POST")
    mx.HandleFunc("/admin/user/edit/{id_user}", admin.UserEdit).Methods("GET")
    mx.HandleFunc("/admin/user/edit/{id_user}", admin.UserEditPost).Methods("POST")
    mx.HandleFunc("/admin/user/remove/{id_user}", admin.UserRemove).Methods("GET")
    mx.HandleFunc("/admin/user/remove/{id_user}", admin.UserRemovePost).Methods("POST")

    mx.HandleFunc("/admin/jabatan", admin.Jabatan).Methods("GET")
    mx.HandleFunc("/admin/jabatan/badge", admin.Jabatan).Methods("GET")
    mx.HandleFunc("/admin/jabatan/add", admin.JabatanAdd).Methods("GET")
    mx.HandleFunc("/admin/jabatan/add", admin.JabatanAddPost).Methods("POST")
    mx.HandleFunc("/admin/jabatan/edit/{id_jabatan}", admin.JabatanEdit).Methods("GET")
    mx.HandleFunc("/admin/jabatan/edit/{id_jabatan}", admin.JabatanEditPost).Methods("POST")
    mx.HandleFunc("/admin/jabatan/remove/{id_jabatan}", admin.JabatanRemove).Methods("GET")
    mx.HandleFunc("/admin/jabatan/remove/{id_jabatan}", admin.JabatanRemovePost).Methods("POST")

    mx.HandleFunc("/admin/form_search", admin.FormSearch).Methods("GET")

    // USER
    mx.HandleFunc("/login", login.Index).Methods("GET")
    mx.HandleFunc("/login", login.Post).Methods("POST")
    mx.HandleFunc("/logout", login.Logout).Methods("GET")

    // Surat Masuk
    mx.HandleFunc("/suratmasuk", suratmasuk.Index).Methods("GET")
    mx.HandleFunc("/suratmasuk/", suratmasuk.Index).Methods("GET")
    mx.HandleFunc("/suratmasuk/suggest/{word}", suratmasuk.Suggest).Methods("GET")
    mx.HandleFunc("/suratmasuk/page/{page}", suratmasuk.Page).Methods("GET")
    mx.HandleFunc("/suratmasuk/printpreview", suratmasuk.PrintPreview).Methods("GET")
    mx.HandleFunc("/suratmasuk/printpreview/data", suratmasuk.PrintPreviewData).Methods("GET")

    mx.HandleFunc("/suratmasuk/search", suratmasuk.Search).Methods("POST")
    mx.HandleFunc("/suratmasuk/search/getvalue", suratmasuk.SearchGetValue).Methods("GET")
    mx.HandleFunc("/suratmasuk/search/clear", suratmasuk.SearchClear).Methods("GET")
    mx.HandleFunc("/suratmasuk/search/form/getvars", suratmasuk.FormGetVars).Methods("GET")

    mx.HandleFunc("/suratmasuk/detail/{doc_series}", suratmasuk.Detail).Methods("GET")
    mx.HandleFunc("/suratmasuk/input", suratmasuk.Input).Methods("POST")
    mx.HandleFunc("/suratmasuk/edit/{doc_series}", suratmasuk.Edit).Methods("POST")
    mx.HandleFunc("/suratmasuk/upload/{doc_series}", suratmasuk.Upload).Methods("POST")
    mx.HandleFunc("/suratmasuk/pic/add/{doc_series}", suratmasuk.PicPost).Methods("POST")
    mx.HandleFunc("/suratmasuk/pic/remove/{doc_series}", suratmasuk.PicRemove).Methods("POST")
    mx.HandleFunc("/suratmasuk/settanggalterima", suratmasuk.SetTanggalTerima).Methods("POST")

    mx.HandleFunc("/jabatan/list", jabatan.List).Methods("GET")
    mx.HandleFunc("/jabatan/bawahan", jabatan.ListBawahan).Methods("GET")
    
    mx.HandleFunc("/arsip/{doc_series}", arsip.Get).Methods("GET")
    mx.HandleFunc("/arsip/{sms_or_skl}/{doc_series}", arsip.Post).Methods("POST")
    mx.HandleFunc("/arsip/remove/{sms_or_skl}/{doc_series}", arsip.Remove).Methods("POST")
    mx.HandleFunc("/arsip/kode/{kode_arsip}", arsip.ByKodeList).Methods("GET")
    mx.HandleFunc("/arsip/keterangan/{keterangan_arsip}", arsip.ByKetList).Methods("GET")

    // Surat Keluar
    mx.HandleFunc("/suratkeluar", suratkeluar.Index).Methods("GET")
    mx.HandleFunc("/suratkeluar/", suratkeluar.Index).Methods("GET")
    mx.HandleFunc("/suratkeluar/input", suratkeluar.Input).Methods("POST")
    mx.HandleFunc("/suratkeluar/page/{page}", suratkeluar.Page).Methods("GET")
    mx.HandleFunc("/suratkeluar/upload/{doc_series}", suratkeluar.Upload).Methods("POST")
    mx.HandleFunc("/suratkeluar/detail/{doc_series}", suratkeluar.Detail).Methods("GET")
    mx.HandleFunc("/suratkeluar/edit/{doc_series}", suratkeluar.Edit).Methods("POST")
    mx.HandleFunc("/suratkeluar/check_last", suratkeluar.CheckLast).Methods("POST")

    mx.HandleFunc("/suratkeluar/search", suratkeluar.Search).Methods("POST")
    mx.HandleFunc("/suratkeluar/search/getvalue", suratkeluar.SearchGetValue).Methods("GET")
    mx.HandleFunc("/suratkeluar/search/clear", suratkeluar.SearchClear).Methods("GET")
    // PDF
    mx.HandleFunc("/suratmasuk/pdf/{doc_serieses}", pdfgenerator.PDFcreate).Methods("GET") 

    // DEVELOPMENT PURPOSE ONLY, REMOVE WHEN PRODUSTION READY
    mx.HandleFunc("/session", session.Show).Methods("GET")

    // Public
    fs := justFilesFilesystem{http.Dir(config.GetConfig("PublicPath"))}
    mx.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(fs)))

    http.ListenAndServe(":" + config.GetConfig("Port"), mx)

}    