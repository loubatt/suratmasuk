package auth

import(
	"fmt"
	"net/http"
	"../session"
)

func IsAdmin(r *http.Request) string {
	sess,_ 	:= session.Store.Get(r, "session-name")
	admin 	:= fmt.Sprintf("%s", sess.Values["admin"])

	if admin =="%!s(<nil>)" {
        return ""
    }else{
        return admin
    }
}

func IsUser(r *http.Request) string {
	sess,_ 	:= session.Store.Get(r, "session-name")
	user 	:= fmt.Sprintf("%s", sess.Values["kode_jabatan"])

	if user =="%!s(<nil>)" {
        return ""
    }else{
        return user
    }
}