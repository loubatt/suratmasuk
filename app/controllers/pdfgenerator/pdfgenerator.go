package pdfgenerator

import(
    "io"
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/jung-kurt/gofpdf"    
    "path/filepath"
    "fmt"
    "strings"
    "../../config"
    "../../function"
    "../../models/suratmasuk"
    "../../models/jabatan"
    "../../models/user"
    "../../session"
    // "reflect"
)

type DataPDF struct {
    UniqCHar string 
    // Data []map[string]interface{}
    Data []string
}

func splitHal(hal string) []string {
    list   := []string{}
    chrlen := 60
    hallen := len(hal) / chrlen
    h      := ""
    for a := 0; a < 4; a++ {
        s := (a) * chrlen
        e := (a + 1) * chrlen

        if a < hallen {
            h = hal[s:e]
        }else if a == hallen {
            h = hal[s:len(hal)]
        }else{
            h = ""
        }

        list = append(list, h)
    }
    fmt.Println(list)
    return list
}

type Tag1 struct {
    Nomoragenda string
}

func PDFcreate(w http.ResponseWriter, r *http.Request) {
    
    var flagAddPage, countAddPage int = 0, 0
    var xLogo, xCell float64 = 0, 0


    // JSON ; mengubah string json ajax ke DataPDF struct
    jsonString := mux.Vars(r)["doc_serieses"]
    var jsondata DataPDF
    errJson := json.Unmarshal([]byte(jsonString), &jsondata)
    if errJson != nil {
        fmt.Println(errJson)
    }    

    nama_file    := funcs.RandomString(9, "alphanum") + ".pdf"

    // Daftar bawahan
    bawahan, errBawahan := jabatan_model.ListBawahanForPDF(r)
    if errBawahan != nil{
        fmt.Println(errBawahan)
    }


    // PDF
    pdf := gofpdf.New("L", "mm", "A4", "")

    for _, v := range jsondata.Data{

        docseries := fmt.Sprintf("%v", v)
        
        // MODEL
        data, errData := suratmasuk_model.OneForPDF(docseries)

        _kodejabatan  := fmt.Sprintf("%v", session.Get(r, "kode_jabatan"))

        _t,_    := data["tag"]
        _tag,_  := _t.(map[string]interface{})
        
        _t1,_   := _tag[_kodejabatan]
        _tag1,_ := _t1.(map[string]interface{})

        fmt.Println(_tag1)

        if errData != nil {
            fmt.Println(errData)
        }
        // end of MODEL

        asal                := strings.ToUpper(fmt.Sprintf("%v", data["asal"]))
        hal                 := splitHal(strings.ToUpper(fmt.Sprintf("%v", data["hal"])))
        // tanggalterima       := funcs.TimeIndonesianFormatter(fmt.Sprintf("%v", v["tanggalterima"]))
        tanggalterima       := funcs.TimeIndonesianFormatter( fmt.Sprintf("%v", _tag1["to_tanggalditerima"]) )
        lampiran            := strings.ToUpper(fmt.Sprintf("%v", data["lampiran"]))
        nomoragenda         := strings.ToUpper(fmt.Sprintf("%v", _tag1["to_nomoragenda"]))
        nomorsurat          := strings.ToUpper(fmt.Sprintf("%v", data["nomor"]))
        // tanggalsurat        := funcs.TimeIndonesianFormatter2(fmt.Sprintf("%v", data["tanggal"]))
        tanggalsurat        := funcs.TimeIndonesianFormatter( fmt.Sprintf("%v", data["tanggal"]) )
        nama_jabatan_pendek := strings.ToUpper(session.Get(r, "nama_jabatan_pendek"))

        // AddPage Manajer
        if countAddPage == 0 {
            flagAddPage = 1
            countAddPage += 1
        }else if countAddPage == 1 {
            flagAddPage = 0
            countAddPage = 0
        }
        
        if flagAddPage == 1 {
            pdf.AddPage()
            pdf.SetLeftMargin(5)
            xLogo = 13
            xCell = 1
        }else{
            xLogo = 160
            xCell = 148
        }

        // KOP Chapter
        pdf.Image(config.GetConfig("ImagesLogoPath"), xLogo, 6, 20, 0, false, "", 0, "")
        
        pdf.SetY(5)
        pdf.SetFont("Arial", "", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "LT", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 4, "KEMENTERIAN KEUANGAN REPUBLIK INDONESIA", "TR", 0, "C", false, 0, "")                        
        pdf.Ln(4)

        pdf.SetFont("Arial", "", 9)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 4, "DIREKTORAT JENDERAL PAJAK", "R", 0, "C", false, 0, "")                        
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 4, "KANTOR WILAYAH DJP KALIMANTAN SELATAN DAN TENGAH", "R", 0, "C", false, 0, "")                        
        pdf.Ln(4)

        pdf.SetFont("Arial", "", 6)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 3, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 3, "JALAN LAMBUNG MANGKURAT N0. 21 BANJARMASIN 7000 KALIMANTAN SELATAN", "R", 0, "C", false, 0, "")                        
        pdf.Ln(3)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 3, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 3, "TELEPON (0511) 3351072, 3351073; FAKSIMILE (0511) 3351077; SITUS kanwilkalselteng.pajak.go.id", "R", 0, "C", false, 0, "")                        
        pdf.Ln(3)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 3, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 3, "LAYANAN INFORMASI DAN KELUHAN KRING PAJAK (021) 500200", "R", 0, "C", false, 0, "")                        
        pdf.Ln(3)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 3, "", "BL", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 3, "EMAIL pengaduan@pajak.go.id", "BR", 0, "C", false, 0, "")                        
        pdf.Ln(3)

        // pdf.Cell(xCell, 0, "")
        // pdf.CellFormat(25, 2, "", "LB", 0, "C", false, 0, "") 
        // pdf.CellFormat(112, 2, "", "RB", 0, "C", false, 0, "")                        
        // pdf.Ln(2)

        pdf.SetFont("Arial", "B", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(137, 4, "LEMBAR DISPOSISI", "LRB", 0, "C", false, 0, "") 
        pdf.Ln(4)

        pdf.SetFont("Arial", "", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(137, 4, "PERHATIAN : Dilarang memisahkan sehelai surat pun yang tergabung dalam berkas ini", "LRB", 0, "C", false, 0, "") 
        pdf.Ln(4)
        // end KOP
        
        // SURAT Chapter
        pdf.SetFont("Arial", "", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 5, "Tgl terima surat ", "LB", 0, "L", false, 0, "") 
        pdf.CellFormat(4, 5, " : ", "B", 0, "C", false, 0, "") 
        pdf.CellFormat(50, 5, tanggalterima, "B", 0, "L", false, 0, "")                      
        pdf.CellFormat(17, 5, "No. Agenda : ", "B", 0, "L", false, 0, "")                      
        pdf.CellFormat(20, 5, " " +nomoragenda, "B", 0, "L", false, 0, "")                      
        pdf.CellFormat(21, 5, "A / T / S / P", "LBR", 0, "C", false, 0, "")                      
        pdf.Ln(5)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "No./Tgl. Surat : ", "L", 0, "L", false, 0, "") 
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, nomorsurat + " tanggal : " +tanggalsurat, "R", 0, "L", false, 0, "")                        
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "Dari : ", "L", 0, "L", false, 0, "") 
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, asal, "R", 0, "L", false, 0, "")                        
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "Hal : ", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, hal[0], "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, hal[1], "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, hal[2], "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, hal[3], "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "Lampiran", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(108, 4, lampiran, "R", 0, "L", false, 0, "") 
        pdf.Ln(4)       

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 2, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 2, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(2)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "Sifat", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Sangat rahasia", "", 0, "L", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Rahasia", "", 0, "L", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Biasa", "", 0, "L", false, 0, "")         
        pdf.CellFormat(24, 4, "" , "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 4, "Klasifikasi", "L", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, " : ", "", 0, "C", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Sangat segera", "", 0, "L", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Segera", "", 0, "L", false, 0, "") 
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Biasa", "", 0, "L", false, 0, "")         
        pdf.CellFormat(24, 4, "" , "R", 0, "L", false, 0, "") 
        pdf.Ln(4)        

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)
        // end of SURAT chapter

        // DISPOSISI chapter
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "LT", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "RT", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.SetFont("Arial", "U", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(137, 4, "DISPOSISI " + nama_jabatan_pendek + " KEPADA : ", "LR", 0, "L", false, 0, "")
        pdf.Ln(4) 

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        // loop bawahan
        pdf.SetFont("Arial", "", 8)
        flagLn := 1
        var _flagLn string = ""
        var bawahanLen int = len(bawahan) - 1
        for key, val2 := range bawahan{
            
            kode_jabatan        := fmt.Sprintf("%v", val2["kode_jabatan"])
            nama_jabatan_pendek := strings.ToUpper(fmt.Sprintf("%v", val2["nama_jabatan_pendek"]))

            // Ambil Nama Pegawai
            var u map[string]interface{}
            u,_     = user_model.OneByKode(kode_jabatan)
            nama   := strings.ToLower(fmt.Sprintf("%v", u["nama"]))

            tujuan_disposisi    := nama_jabatan_pendek + " (" + nama + ")"
            // _flagLn = fmt.Sprintf("%v", flagLn)
            // _xCell := fmt.Sprintf("%v", xCell)

            var leftBorder, rightBorder string = "", ""

            if flagLn == 1 {
                pdf.Cell(xCell, 0, "")
                leftBorder = "L"
                rightBorder = ""
            }else{
                leftBorder = ""
                rightBorder = "R"
            }

            pdf.CellFormat(2, 4, "", leftBorder, 0, "C", false, 0, "")
            pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
            pdf.CellFormat(61.5, 4, tujuan_disposisi, rightBorder, 0, "L", false, 0, "") 

            if flagLn == 1 {
                flagLn += 1         
            }else if flagLn == 2 && key != bawahanLen {
                flagLn = 1
            
                pdf.Ln(4)
                pdf.Cell(xCell, 0, "")
                pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
                pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
                pdf.Ln(1)
            
            }
        }
        
        if bawahanLen % 2 == 0 {
            pdf.CellFormat(2, 4, "", "", 0, "C", false, 0, "")
            pdf.CellFormat(5, 4, "", "", 0, "C", false, 0, "") 
            pdf.CellFormat(61.5, 4, "", "R", 0, "L", false, 0, "")
        }

        pdf.Ln(4)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        // PETUNJUK chapter
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "LT", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "RT", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.SetFont("Arial", "U", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(137, 4, "PETUNJUK : " + _flagLn, "LR", 0, "L", false, 0, "")
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.SetFont("Arial", "", 8)        
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(2, 4, "", "L", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(20, 4, "Setuju", "", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Untuk perhatian", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(28, 4, "Perbaiki", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(32, 4, "Sesuai catatan", "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(2, 4, "", "L", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(20, 4, "Tolak", "", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Edarkan", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(28, 4, "Bicarakan dengan saya", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(32, 4, "Perbanyak ............. kali", "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(2, 4, "", "L", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(20, 4, "Teliti & pendapat", "", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Jawab", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(28, 4, "Ingatkan", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "", 0, "C", false, 0, "") 
        pdf.CellFormat(32, 4, "asli kepada .........", "R", 0, "L", false, 0, "") 
        pdf.Ln(4)        

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(2, 4, "", "L", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(20, 4, "Untuk diketahui", "", 0, "L", false, 0, "")
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(23, 4, "Selesaikan", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(28, 4, "Simpan", "", 0, "L", false, 0, "")        
        pdf.CellFormat(4, 4, "", "", 0, "C", false, 0, "")
        pdf.CellFormat(5, 4, "", "1", 0, "C", false, 0, "") 
        pdf.CellFormat(32, 4, ".........................", "R", 0, "L", false, 0, "") 
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 1, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)

        pdf.SetFont("Arial", "U", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(137, 4, "CATATAN : ", "LR", 0, "L", false, 0, "")
        pdf.Ln(4)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(25, 7, "", "L", 0, "C", false, 0, "") 
        pdf.CellFormat(112, 7, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(7)        

        // pdf.SetFont("Arial", "", 8)
        // pdf.Cell(xCell, 0, "")
        // pdf.CellFormat(68.5, 5, "Tgl. penyelesaian : ", "LTRB", 0, "L", false, 0, "") 
        // pdf.CellFormat(68.5, 5, "Diajukan kembali tgl. : ", "LTRB", 0, "L", false, 0, "") 
        // pdf.Ln(5)

        // pdf.Cell(xCell, 0, "")
        // pdf.CellFormat(68.5, 5, "Penerima : ", "LRB", 0, "L", false, 0, "") 
        // pdf.CellFormat(68.5, 5, "Penerima : ", "LRB", 0, "L", false, 0, "") 
        // pdf.Ln(5)

        // pdf.SetFont("Arial", "", 8)
        // pdf.Cell(xCell, 0, "")
        // pdf.CellFormat(68.5, 5, "", "L", 0, "L", false, 0, "") 
        // pdf.CellFormat(68.5, 5, "", "R", 0, "L", false, 0, "") 
        // pdf.Ln(5)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "", "L", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "", "R", 0, "L", false, 0, "") 
        pdf.Ln(5)
        
       // pdf.Cell(xCell, 0, "")
       // pdf.CellFormat(68.5, 5, "", "L", 0, "L", false, 0, "") 
       // pdf.CellFormat(68.5, 5, "", "R", 0, "L", false, 0, "") 
       // pdf.Ln(5)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "", "LB", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "", "RB", 0, "L", false, 0, "") 
        pdf.Ln(5)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 1, "", "LR", 0, "C", false, 0, "") 
        pdf.CellFormat(68.5, 1, "", "R", 0, "C", false, 0, "")                        
        pdf.Ln(1)        

        pdf.SetFont("Arial", "U", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "DISPOSISI KBU/KABID : ", "LR", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "DISPOSISI Kasubbag/Kasi : ", "LR", 0, "L", false, 0, "") 
        pdf.Ln(5)

        // pdf.Cell(xCell, 0, "")
        // pdf.CellFormat(68.5, 2, "", "LR", 0, "C", false, 0, "") 
        // pdf.CellFormat(68.5, 2, "", "R", 0, "C", false, 0, "")                        
        // pdf.Ln(2)         

        pdf.SetFont("Arial", "", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "Kepada : ", "LR", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "Kepada : ", "LR", 0, "L", false, 0, "") 
        pdf.Ln(5)

        pdf.SetFont("Arial", "", 8)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 8, "Petunjuk : ", "LR", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 8, "Petunjuk : ", "LR", 0, "L", false, 0, "") 
        pdf.Ln(8)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "Tgl. penyelesaian : ", "LTRB", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "Diajukan kembali tgl. : ", "LTRB", 0, "L", false, 0, "") 
        pdf.Ln(5)

        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 5, "Penerima : ", "LR", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 5, "Penerima : ", "LR", 0, "L", false, 0, "") 
        pdf.Ln(5)

        pdf.SetFont("Arial", "", 5)
        pdf.Cell(xCell, 0, "")
        pdf.CellFormat(68.5, 2, "", "LRB", 0, "L", false, 0, "") 
        pdf.CellFormat(68.5, 2, docseries, "LRB", 0, "R", false, 0, "") 
        pdf.Ln(2)        

    }

    // OUTPUT
    fmt.Println( config.GetConfig("PDFPath") )
    fileStr := filepath.Join(config.GetConfig("PDFPath"), nama_file)
    err := pdf.OutputFileAndClose(fileStr)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println("Successfully generated " + nama_file)
        // http.Redirect(w, r, "/pdf/" + nama_file, 301)
        io.WriteString(w, "<a href='/pdf/" + nama_file + "'>" + nama_file + "</a>")
    }
}
