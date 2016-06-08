package jabatan

import(
	"net/http"
	// "html/template"
	"encoding/json"
	"fmt"
    // "../../config"
	"../../auth"
	// "../../session"
	"../../models/jabatan"
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

func List(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        listjabatan,_ := jabatan_model.Badge(r)

        finalResult := Response{
            "listjabatan": listjabatan,
        }
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return
    }
}

func ListBawahan(w http.ResponseWriter, r *http.Request) {
    if auth.IsUser(r) == "" {
        http.Redirect(w, r, "/", 301)
    }else{
        
        // model
        finalResult := Response{
            "listbawahan"   : jabatan_model.ListBawahan(r),
        }       
        
        w.Header().Set("Content-Type", "application/json")
        fmt.Fprint(w, finalResult)
        return      
    }
}