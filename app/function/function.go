package funcs

import(
   "fmt"
   "net"
   "net/http"
   "crypto/rand"
   "strings"
   "gopkg.in/mgo.v2/bson"
   "encoding/gob"
   "bytes"
   "html/template"
   "github.com/manucorporat/try"
   // "github.com/gorilla/context"
   // "reflect"
)

var nomor int = 0

var Value struct{
   tanggal_disposisi string
   nomor_agenda int 
   created_by string 
   nama string
   kode_jabatan string
   nama_jabatan string
}

func RandomString(strSize int, randType string) string {
   var dictionary string
   if randType == "alphanum" {
      dictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
   }
   if randType == "alpha" {
      dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
   }
   if randType == "number" {
      dictionary = "0123456789"
   }
   var bytes = make([]byte, strSize)
   rand.Read(bytes)
   for k, v := range bytes {
      bytes[k] = dictionary[v%byte(len(dictionary))]
   }
   return string(bytes)
}

func TimeFormatter(s string) string {
  text := strings.Split(s, " ")
  return text[0]
}

func TimeIndonesianFormatter(s string) string {
  status := ""

  try.This(func(){
    if (s != "") && (s != "<nil>") {
      text := strings.Split(s, " ")
      tgl  := strings.Split(text[0], "-")
      status = tgl[2] + "/" + tgl[1] + "/" + tgl[0]
    }else{
      status = "(tanpa tanggal)"
    }    
  }).Catch(func(e try.E) {
    // ket := fmt.Sprintf("%s", e)
    // status = "Error " + ket
    status = s
  })

  return status
}

func TimeIndonesianFormatter2(s string) string {
  
  status := ""

  try.This(func(){  
    if s != "" {
      tgl  := strings.Split(s, "-")
      status = tgl[2] + "/" + tgl[1] + "/" + tgl[0]
    }else{
      status = "-"
    }
  }).Catch(func(e try.E) {
    // ket := fmt.Sprintf("%s", e)
    // status = "Error " + ket
    status = s
  })

  return status
}

func TimeIndonesianToYYYYMMHH(s string) string {
  // 11/12/2015 -> 2015-12-11
  if (s != "") && (s != "<nil>") {
    tgl := strings.Split(s, "/")
    return tgl[2] + "-" + tgl[1] + "-" + tgl[0]
  }else{
    return "-"
  }
}

func GetIP(r *http.Request) string {
   if ipProxy := r.Header.Get("X-FORWARDED-FOR"); len(ipProxy) > 0 {
       return ipProxy
   }
   ip, _, _ := net.SplitHostPort(r.RemoteAddr)
   return ip
}

func TagEvaluator(data bson.M) template.HTML{

   var kode_jabatan string = ""
   var nama_jabatan string = ""
   var eselon string = ""
   for k,v := range data{
      if k == "kode_jabatan"{
         kode_jabatan    = fmt.Sprintf("%v", v)
         kj_split       := strings.Split(kode_jabatan, ".")
         kj_len         := len(kj_split)
         eselon          = fmt.Sprintf("%v", kj_len + 1)
      }else if k == "nama_jabatan"{
         nama_jabatan    = fmt.Sprintf("%v", v)
      }
   }
   return  template.HTML("<span class='label label-default' title='" + nama_jabatan + "'>" + eselon + "</span>")
}

func Numbering(s string) int{
   nomor ++
   fmt.Println(s)
   // fmt.Println(nomor)
   return nomor
}

func ResetNumber(s string) string{
   nomor = 0
   return ""
}

func GetBytes(key interface{}) ([]byte, error) {
    var buf bytes.Buffer
    enc := gob.NewEncoder(&buf)
    err := enc.Encode(key)
    if err != nil {
        return nil, err
    }
    return buf.Bytes(), nil
}