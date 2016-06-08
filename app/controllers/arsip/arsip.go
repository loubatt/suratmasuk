package arsip

import(
	"net/http"
	"encoding/json"
	"fmt"
	"../../auth"
    "../../models/arsip"
	"../../models/suratmasuk"
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

func ByKodeList(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        // model
        finalResult := Response{
            "list"   : arsip_model.ByKodeList(r),
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}

func ByKetList(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        // model
        finalResult := Response{
            "list"   : arsip_model.ByKetList(r),
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}

func Get(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        // model
        finalResult := Response{
            "list"   : suratmasuk_model.One(r),
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}

func Post(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        result, _ := arsip_model.InsertArsip(r)

        // model
        finalResult := Response{
            "list"   : result,
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}

func Remove(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        result, _ := arsip_model.RemoveArsip(r)

        // model
        finalResult := Response{
            "list"   : result,
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}