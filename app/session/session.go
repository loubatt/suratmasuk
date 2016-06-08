package session

import(
	"fmt"
	"net/http"
	"github.com/gorilla/sessions"
)

var(
	Store = sessions.NewCookieStore([]byte("something-very-secret"))
)

func Show(w http.ResponseWriter, r *http.Request) {
	sess,_  := Store.Get(r, "session-name")
	// sess	 = fmt.Sprintf("%v", sess)
	w.Header().Set("Content-Type", "application/json")
    fmt.Fprint(w, sess)
    return
}

func Get(r *http.Request, key string) string {

	// var value interface{}s
	sess,_ 	:= Store.Get(r, "session-name")
	value	:= fmt.Sprintf("%s", sess.Values[key])

	if value == "%!s(<nil>)" {
		return ""
	}else{
		return value
	}
}

func Save(w http.ResponseWriter, r *http.Request, key string, val string) string {
	sess,_ 	:= Store.Get(r, "session-name")
	sess.Values[key] = val
	sess.Save(r, w)

	return val
}

func Delete(w http.ResponseWriter, r *http.Request, key string) string {
	sess,_ 	:= Store.Get(r, "session-name")
    delete(sess.Values, key) 
    sess.Save(r, w)

    return key
}