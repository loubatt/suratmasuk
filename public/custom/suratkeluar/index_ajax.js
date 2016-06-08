function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function tableObject(){

    // gray area
    var objTbody            = $("tbody")
    var menuArea            = $(".menuArea")
    var disposisiModal      = $("#disposisiModal")
    var modalBodyDisposisi  = $(".modalbodydisposisi")
    var availableTag        = $("#availabletag")
    var surat               = $("#surat")
    var filesList           = $("#files-list")
    var itemDisposisi       = [
                                'Setuju','Tolak','Teliti dan pendapat','Untuk diketahui', 'Untuk perhatian', 'Edarkan', 'Jawab', 'Selesaikan', 'Perbaiki',
                                'Bicarakan dengan saya', 'Ingatkan', 'Simpan', 'Sesuai catatan', 'Perbanyak ... kali, asli kepada ...', '...'
                              ]
    var uploadPath          = "/files/"                              
    var uploadActionPath    = "/suratmasuk/files/"
    var pdfPath             = "/suratmasuk/pdf/"                              
    // end of gray area

    var dataProvider = {
        "smsList" : function(){
            return $.ajax({
                async: false,
                type: "GET",
                url : "/suratmasuk/all/1",
            }).responseText
        },
        "smsDetail" : function(){
            return $.ajax({
                async: false,
                type : "GET",
                url  : "/suratmasuk/detail/" + docseriesHandler.Gather()
            }).responseText
        },
        "jabatan" : function(){
            return $.ajax({
                async: false,
                type : "GET",
                url  : "/suratmasuk/tag/addto/" + docseriesHandler.Gather()
            }).responseText
        },
        "tagaddto" : function(data){
            return $.ajax({
                async : false,
                type : "POST",
                data: data,
                url : "/suratmasuk/tag/addto/" + docseriesHandler.Gather()
            }).responseText
        },
        "settanggalterima" : function(data){
            return $.ajax({
                async : false,
                type : "POST",
                data : data,
                url : "/suratmasuk/settanggalterima",
            }).responseText
        },
        "removetagfrom" : function(data){
            return $.ajax({
                async : false,
                type : "POST",
                data : data,
                url : "/suratmasuk/removetagfrom",
            }).responseText
        },
        "editsurat" : function(data){
            return $.ajax({
                async : false,
                type : "POST",
                data : data,
                url : "/suratmasuk/edit/" + docseriesHandler.Gather(),
            }).responseText
        },
        "badgeList" : function(){
            return $.ajax({
                async: false,
                type: "GET",
                url : "/suratmasuk/badge",
            }).responseText
        },        
    }

    var RowRenderer = function(obj, data, iam){
        if (data !== null){
            obj.html("")
            $.each(data, function(i){
                var datarow     = data[i]
                var tag         = tagHandler.Agenda(datarow["Tag"], iam)
                var doc_series  = datarow["Doc_series"]
                var dataforPDF  = {}
                dataforPDF.docseries       = doc_series
                dataforPDF.nomoragenda     = tag["nomor_agenda"]
                dataforPDF.tanggalterima   = tag["tanggal_terima"]
                dataforPDF                 = JSON.stringify(dataforPDF)
                var htmlRow     = ""
                htmlRow  = "<tr class='" + doc_series + "' data-docseries='" + doc_series + "' data-dataforpdf='" + dataforPDF + "'>"
                htmlRow += "<td class='text-nowrap smstable-checkbox'>" + "<input type='checkbox' class='isChecked' />" + "</td>"
                htmlRow += "<td class='text-nowrap smstable-nomor'>" + tag["nomor_agenda"] + "</td>"
                htmlRow += "<td class='text-nowrap smstable-tanggal'>" + tag["tanggal_terima"].split(" ")[0] + "</td>"
                htmlRow += "<td class='text-nowrap smstable-tanggal'>" + tag["tanggal_disposisi"].split(" ")[0] + "</td>"
                htmlRow += "<td class='smstable-normal'>" + datarow["Asal"] + "</td>"
                htmlRow += "<td class='smstable-normal'>" + datarow["Nomor"] + "</td>"
                htmlRow += "<td class='text-nowrap smstable-tanggal'>" + datarow["Tanggal"] + "</td>"
                htmlRow += "<td class=''>" + datarow["Hal"] + "</td>"
                htmlRow += "<td class='smstable-pictd'>" + tagHandler.People(datarow["Tag"]) + "</td>"
                htmlRow += "</tr>"
                var row = obj.append(htmlRow)
            })
            // badge renderer
            var badge  = JSON.parse(dataProvider.badgeList())["listBadge"]
            console.log(badge)
            var _badge = {}
            $.each(badge, function(key){
                var kodejabatan = badge[key]["kode_jabatan"]
                var thebadge = badge[key]["badge"]
                _badge[kodejabatan] = thebadge
            })
            $.each($("label.badge"), function(){
                var kodejabatan = $(this).attr("data-kodejabatan")
                var thebadge = _badge[kodejabatan]
                $(this).html(thebadge)
            })
        }
    }  

    var tagHandler = {
        "Agenda" : function(data, iam){
            var bundle       = {}
            var nomor_agenda = ""
            var kode_jabatan = ""
            $.each(data, function(k){
                if(data[k]){
                    kode_jabatan = data[k].kode_jabatan
                    if (iam === kode_jabatan){
                        nomor_agenda      = data[k].nomor_agenda || ""
                        tanggal_disposisi = data[k].tanggal_disposisi || ""
                        tanggal_terima    = data[k].tanggal_terima || ""
                    }
                }else{

                }
            })
            bundle.nomor_agenda       = nomor_agenda
            bundle.tanggal_disposisi  = tanggal_disposisi
            bundle.tanggal_terima     = tanggal_terima
            return bundle
        },
        "People" : function(data){
            var p = ""
            $.each(data, function(k){
                if(data[k]){
                    var kodejabatan = data[k].kode_jabatan
                    var nama   = data[k].nama
                    p += "<label class='label label-info badge' data-kodejabatan='" + kodejabatan + "' title='" + nama + "'>" + kodejabatan + "</label> "
                }
            })
            return p
        }
    }

    var disposisiModalHandler = {
        "Template"      : {
            "AvailableTag" : function(){
                return "<table class='table table-nowrap table-striped table-hover' >\
                    <thead>\
                        <tr>\
                            <th>Nomor agenda</th>\
                            <th>Tanggal agenda</th>\
                            <th>Tanggal terima</th>\
                            <th>Nama</th>\
                            <th>Jabatan</th>\
                            <th>Disposisi atasan</th>\
                            <th>Catatan atasan</th>\
                            <th>Mode</th>\
                        </tr>\
                    </thead>\
                    <tbody class='tbody-available-tag'></tbody>\
                </table>"
            },
            "Files" : function(){
                return "<table class='table table-nowrap table-striped table-hover' >\
                    <thead>\
                        <tr>\
                            <th>Nama File</th>\
                            <th>Author</th>\
                            <th>Mode</th>\
                        </tr>\
                    </thead>\
                    <tbody class='tbody-filesList'></tbody>\
                </table>"
            },            
            "FormAddTag" : function(){
                return "<div class='row'>\
                            <div class='col-lg-8' style='margin-top:5px;margin-bottom:5px'>\
                                <div class='row'>\
                                    <div class='col-lg-12'>\
                                        <div id='listbawahan'></div>\
                                    </div>\
                                </div>\
                                <div class='row' style='margin-top:5px;margin-bottom:5px'>\
                                    <div class='col-lg-12 divTextAreaDisposisi'>\
                                    </div>\
                                </div>\
                                <div class='row'>\
                                    <div class='col-lg-12 divBtnSetDisposisi'>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class='col-lg-4'>\
                                <div class='col-lg-12'>\
                                    <div id='listitemdisposisi'></div>\
                                </div>\
                            </div>\
                        </div>\
                        "
            },
            "Surat" : function(){
                return '<div class="row"> \
                            <div class="col-lg-7"> \
                                <form id="surat-form"> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Asal Surat :</div> \
                                    <div class="col-lg-8"> \
                                        <input type="text" class="form-control surat-asal" name="asal" placeholder="Asal Surat" /> \
                                    </div> \
                                </div> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Nomor Surat :</div> \
                                    <div class="col-lg-8"> \
                                        <input type="text" class="form-control surat-nomor" name="nomor" placeholder="No. Surat" /> \
                                    </div> \
                                </div> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Tanggal Surat :</div> \
                                    <div class="col-lg-8"> \
                                        <input type="text" class="form-control surat-tanggal datepicker" name="tanggal" placeholder="Tgl Surat" readonly/> \
                                    </div> \
                                </div> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Hal Surat :</div> \
                                    <div class="col-lg-8"> \
                                        <textarea class="form-control surat-hal" name="hal" placeholder="Perihal" style="height:175px"></textarea> \
                                    </div> \
                                </div> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Sifat :</div> \
                                    <div class="col-lg-8"> \
                                        <select class="form-control surat-sifat" name="sifat"> \
                                            <option value="Biasa">Biasa</option> \
                                            <option value="Segera">Segera</option> \
                                            <option value="Sangat Segera">Sangat Segera</option> \
                                        </select> \
                                    </div> \
                                </div> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-4">Lampiran :</div> \
                                    <div class="col-lg-8"> \
                                        <input type="text" class="form-control surat-lampiran" name="lampiran" placeholder="Lampiran" /> \
                                    </div> \
                                </div> \
                                </form> \
                                <div class="row" style="margin-bottom:5px"> \
                                    <div class="col-lg-8"></div> \
                                    <div class="col-lg-4"> \
                                        <button class="btn btn-danger btn-suratDelete">Delete</button> \
                                        <button class="btn btn-warning btn-suratEdit">Edit</button> \
                                    </div> \
                                </div> \
                            </div> \
                            <div class="col-lg-5 surat-history"></div> \
                        </div> \
                        '
            }
        },
        "Show"          : function(){
            var datasurat = {}
            datasurat     = JSON.parse(dataProvider.smsDetail())["datasurat"]
            bawahan       = JSON.parse(dataProvider.jabatan())["listbawahan"]
            
            this.Render.Surat(datasurat)
            this.Render.FormAddTag(this.PeopleInTag(datasurat.tag), bawahan )
            this.Render.AvailableTag(datasurat.tag)
            this.Render.Files(datasurat.files)

            disposisiModal.modal("show")
        },
        "PeopleInTag"   : function(data){
            var listPIT = {}
            $.each(data, function(k){
                if(data[k]){
                    var kode_jabatan = data[k].kode_jabatan
                    listPIT[kode_jabatan] = "OK"
                }
            })
            return listPIT
        },
        "Render"        : {
            "Surat" : function(datasurat){
                surat.html("")
                surat.append(disposisiModalHandler.Template.Surat())
                $(".surat-asal").val(datasurat.asal)
                $(".surat-nomor").val(datasurat.nomor)
                $(".surat-tanggal").val(datasurat.tanggal)
                $(".surat-hal").val(datasurat.hal)
                $(".surat-sifat").val(datasurat.sifat)
                $(".surat-lampiran").val(datasurat.lampiran)
                $(".btn-suratEdit").click(function(){
                    var data = $("#surat-form").serialize()
                    if(JSON.parse(dataProvider.editsurat(data))["result"] == "OK"){
                        $("#disposisiModal").modal('hide')
                        tableHandler.FirstLoad()
                    }
                })
                $('.datepicker').datepicker({
                    autoclose: true,
                    format: "yyyy-mm-dd",
                    todayHighlight: true
                })
            },
            "AvailableTag" : function(datasurat){
                availableTag.html("")
                availableTag.append(disposisiModalHandler.Template.AvailableTag())
                $.each(datasurat, function(k){
                    
                    if(datasurat[k]){

                        var doc_series     = docseriesHandler.Gather()

                        var nomor_agenda   = datasurat[k].nomor_agenda      || ""
                        var tanggal_agenda = datasurat[k].tanggal_disposisi || ""
                        var tanggal_terima = datasurat[k].tanggal_terima    || ""
                        var nama           = datasurat[k].nama              || ""
                        var nama_jabatan   = datasurat[k].nama_jabatan      || ""
                        var disposisi      = datasurat[k].disposisi         || ""
                        var catatan        = datasurat[k].catatan           || ""

                        var html = "<tr>"
                        html    += "<td class='text-nowrap'>" + nomor_agenda + "</td>"
                        html    += "<td class='text-nowrap'>" + tanggal_agenda.split(" ")[0] + "</td>"
                        html    += "<td class='text-nowrap'>" + tanggal_terima.split(" ")[0] + "</td>"
                        html    += "<td class=''>" + nama + "</td>"
                        html    += "<td class=''>" + nama_jabatan + "</td>"
                        html    += "<td class=''>" + disposisi + "</td>"
                        html    += "<td class=''>" + catatan + "</td>"
                        html    += "<td class=''>" 
                        html    += "<button class='btn btn-xs btn-danger btn-deleteTag' data-docseries='" + doc_series + "' data-kodejabatan='" + datasurat[k].kode_jabatan + "'>" 
                        html    += "<span class='glyphicon glyphicon-remove'></span></button>" 
                        html    += "</td>"
                        html    += "</tr>"
                    }
                    $(".tbody-available-tag").append(html)
                })
                $(".btn-deleteTag").click(function(){
                    var doc_series   = $(this).attr("data-docseries")
                    var kode_jabatan = $(this).attr("data-kodejabatan")
                    var data = "doc_series=" + doc_series + "&kode_jabatan=" + kode_jabatan
                    if(JSON.parse(dataProvider.removetagfrom(data))["result"] === "OK"){
                        disposisiModalHandler.Show()
                    }else{
                        alert("NOK")
                    }
                })
            },
            "FormAddTag" : function(peopleintag, bawahan){
                modalBodyDisposisi.html("")
                modalBodyDisposisi.append(disposisiModalHandler.Template.FormAddTag())
                if(bawahan){
                    $.each(bawahan, function(k){
                        var nama_jabatan = bawahan[k].Nama_jabatan
                        var kode_jabatan = bawahan[k].Kode_jabatan
                        var bawahanCheckbox = "<label><input type='checkbox' class='bawahan-checkbox' data-jabatan='" + kode_jabatan + "' /> " + nama_jabatan + "</label><br/>"
                        if(peopleintag[kode_jabatan] === undefined){
                            $("#listbawahan").append(bawahanCheckbox)
                        }
                    })
                }
                $.each(itemDisposisi, function(k){
                    var nama_disposisi = itemDisposisi[k]
                    var itemdisposisiCheckbox = "<label><input type='checkbox' class='itemdisposisi-checkbox' value='" + nama_disposisi + "' /> " + nama_disposisi + "</label><br/>"
                    $("#listitemdisposisi").append(itemdisposisiCheckbox)  
                })
                $(".divTextAreaDisposisi").html("<textarea class='textareaDisposisi form-control' style='height:200px'></textarea>")
                $(".divBtnSetDisposisi").html("<button class='btn btn-success btnSetDisposisi'>Disposisi</button>")
                $(".btnSetDisposisi").click(function(){
                    
                    // collect disposisi
                    var disposisi = ""
                    $.each($(".itemdisposisi-checkbox"), function(){
                        var isChecked = $(this).prop("checked")
                        var nama = $(this).val()
                        if(isChecked === true){
                            disposisi += nama + ","
                        }
                    })
                    var catatan     = encodeURIComponent($(".textareaDisposisi").val())
                    
                    $.each($(".bawahan-checkbox"), function(){
                        if ($(this).prop("checked") === true){
                            
                            var kodejabatan = encodeURIComponent($(this).attr("data-jabatan"))

                            var data = "kode_jabatan=" + kodejabatan
                            data += "&disposisi=" + disposisi
                            data += "&catatan=" + catatan

                            if(JSON.parse(dataProvider.tagaddto(data))["result"] === "OK"){
                                disposisiModalHandler.Show()
                            }
                        }
                    })
                })
            },
            "Files" : function(datafiles){
                filesList.html("")
                filesList.append(disposisiModalHandler.Template.Files())
                $.each(datafiles, function(k){
                    
                    if(datafiles[k]){

                        var doc_series     = docseriesHandler.Gather()

                        var nama_file   = datafiles[k].nama_file      || ""
                        var author      = datafiles[k].by_name      || ""

                        var html = "<tr>"
                        html    += "<td class='text-nowrap'><a href='" + uploadPath + nama_file + "'>" + nama_file + "</a></td>"
                        html    += "<td class='text-nowrap'>" + author + "</td>"
                        html    += "</tr>"
                    }
                    $(".tbody-filesList").append(html)
                })
            }
        }
    }

    var menuHandler = {
        "Update"        : function(){
            if(this.CountChecked() === 1){
                // this.MenuEdit.Create()
                // this.MenuDetail.Create()

                // Disposisi or Terima Surat dulu
                var className     = docseriesHandler.Gather()
                var tanggalTerima = $("tr." + className).children(":nth-child(3)").html()
                if (tanggalTerima === ""){
                    this.MenuSetTanggalTerima.Create()
                }else{
                    this.MenuDisposisi.Create()
                }

                // tambahkan doc_series ke upload-form action
                var new_action = uploadActionPath + docseriesHandler.Gather()
                $("#upload-form").attr("action", new_action)
            }else{
                // this.MenuEdit.Remove()
                // this.MenuDetail.Remove()
                this.MenuDisposisi.Remove()
                this.MenuSetTanggalTerima.Remove()
            }

            if(this.CountChecked() > 0){
                this.MenuPrint.Create()
            }else{
                this.MenuPrint.Remove()
            }
        },
        "CountChecked"     : function(){
            var numCheckBoxChecked = 0
            $.each($(".isChecked"), function(){
                var isChecked = $(this).prop("checked")
                if (isChecked === true) {
                    numCheckBoxChecked ++
                }
            })
            return numCheckBoxChecked
        },
        "MenuEdit"         : {
            "Template" : function(){
                return "<button class='btn btn-primary btn-sm btn-MenuEdit'>Edit</button> "
            },
            "Create" : function(){
                this.Remove()
                menuArea.append(this.Template)
            },
            "Remove" : function(){
                $(".btn-MenuEdit").remove()
            }
        },
        /*
        "MenuDetail"       : {
            "Template" : function(){
                return "<button class='btn btn-primary btn-sm btn-MenuDetail'>Detail</button> "
            },
            "Create" : function(){
                this.Remove()
                var btnMenuDetail = menuArea.append(this.Template)
                $(".btn-MenuDetail").click(function(){
                    var docseries = docseriesHandler.Gather()[0]
                    window.location.replace("/suratmasuk/detail/" + docseries)
                })
            },
            "Remove" : function(){
                $(".btn-MenuDetail").remove()
            }
        },
        */
        "MenuDisposisi"    : {
            "Template" : function(){
                return "<button class='btn btn-primary btn-md btn-MenuDisposisi'><span class='glyphicon glyphicon-folder-open'></span></button> "
            },
            "Create" : function(){
                this.Remove()
                var btnMenuDisposisi = menuArea.append(this.Template)
                $(".btn-MenuDisposisi").click(function(){
                    disposisiModalHandler.Show()
                })
            },
            "Remove" : function(){
                $(".btn-MenuDisposisi").remove()
            }
        },
        "MenuSetTanggalTerima" : {
            "Template" : function(){
                return "<button class='btn btn-primary btn-sm btn-MenuSetTanggalTerima'>Set Tgl. Terima</button> "
            },
            "Create" : function(){
                this.Remove()
                var btnMenuSetTanggalTerima = menuArea.append(this.Template)
                $(".btn-MenuSetTanggalTerima").click(function(){
                    var data = "doc_series=" + docseriesHandler.Gather()
                    var setter = JSON.parse(dataProvider.settanggalterima(data))["result"]
                    if (setter === "OK"){
                        tableHandler.FirstLoad()
                    }else{
                        alert(setter)
                    }
                })
            },
            "Remove" : function(){
                $(".btn-MenuSetTanggalTerima").remove()
            }
        },
        "MenuPrint"     : {
            "Template" : function(){
                return "<button class='btn btn-primary btn-md btn-MenuPrint'><span class='glyphicon glyphicon-print'></span></button> "
            },
            "Create" : function(){
                this.Remove()
                var btnMenuPrint = menuArea.append(this.Template)
                $(".btn-MenuPrint").click(function(){
                    var dataPDF = {}
                    dataPDF.UniqCHar      = makeid()
                    dataPDF.Data = docseriesHandler.GatherForPDF()
                    // var docserieses = JSON.stringify(docseriesHandler.Gather()).replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "")
                    // console.log(docserieses)
                    window.open(pdfPath + JSON.stringify(dataPDF), "width=800, height=600")
                })
            },
            "Remove" : function(){
                $(".btn-MenuPrint").remove()
            }
        }                
    }

    var docseriesHandler = {
        "Gather" : function(){
            var docseriesBundle = []
            $.each($(".isChecked"), function(){
                var isChecked = $(this).prop("checked")
                if (isChecked === true) {
                    var docseries = $(this).parent().parent().attr("data-docseries")
                    docseriesBundle.push(docseries)
                }
            })
            return docseriesBundle
        },
        "GatherForPDF" : function(){
            var docseriesBundle = []
            $.each($(".isChecked"), function(){
                var isChecked = $(this).prop("checked")
                if (isChecked === true) {
                    var obj = $(this).parent().parent().attr("data-dataforpdf")
                    docseriesBundle.push(JSON.parse(obj))
                }
            })
            return docseriesBundle
        }        
    }

    var tableHandler = {
        "FirstLoad"         : function(){
            var data = JSON.parse(dataProvider.smsList())
            RowRenderer(objTbody, data["listsurat"], data["my_kodejabatan"])
            this.AddEventCheckAll()
            this.AddEventRowClick()
            this.AddEventCheckOne()
            menuHandler.Update()
        },
        "CheckAll"          : function(){
            var root = this
            if ($(".checkAll").prop("checked") === true){
                $.each($(".isChecked"), function(){
                    root.CheckRow(this)
                })
            }else{
                $.each($(".isChecked"), function(){
                    root.UncheckRow(this)
                })
            }
        },
        "CheckOne"          : function(obj){
            // console.log(obj)
            var root = this
            if ($(obj).prop("checked") === false){
                root.CheckRow(obj)
            }else{
                root.UncheckRow(obj)
            }  
        },
        "CheckRow"          : function(obj){
            $(obj).prop("checked", true)
            $(obj).parent().parent().addClass("warning")
        },
        "UncheckRow"        : function(obj){
            $(obj).prop("checked", false)
            $(obj).parent().parent().removeClass("warning")
        },
        "AddEventCheckAll"  : function(){
            var root = this
            $(".checkAll").click(function(){
                root.CheckAll()
                menuHandler.Update()
            })
        },
        "AddEventCheckOne"  : function(){
            var root = this
            $(".isChecked").click(function(){
                root.CheckOne(this)
                menuHandler.Update()
            })
        },
        "AddEventRowClick"  : function(){
            var root = this
            $("tbody > tr").click(function(){
                var obj = $(this).children(":nth-child(1)").children(":nth-child(1)")

                if($(obj).prop("checked") === false){
                    root.CheckRow(obj)
                }else{
                    root.UncheckRow(obj)
                }
                menuHandler.Update()
            })
        }
    }

    var buildType = {
        "default" : function(){
            tableHandler.FirstLoad()
        },
        "refreshmodal" : function(){
            disposisiModalHandler.Show()
        }
    }

    var build = function(mode){
        buildType[mode]()
    }

    this.init = function(mode){
        build(mode)
    }
}

$( document ).ready(function() {

    // INIT TABLE
    var _t = new tableObject()
    _t.init('default')

    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
       
    $('#upload-form').ajaxForm({
        beforeSend: function() {
            console.log($("#upload-form").attr("action"))
            $(".progress-bar").removeClass("progress-bar-success")
        },
        uploadProgress: function(event, position, total, percentComplete) {
            // var percentVal = percentComplete + '%';
            // bar.width(percentVal)
            // percent.html(percentVal);
            var persen = percentComplete + "%"
            $(".progress-bar").attr("aria-valuenow", percentComplete)
            $(".progress-bar").css("width", persen)
            $(".progress-bar").html("Progress " + persen + " ...")
            // console.log(percentComplete)
        },
        success: function() {
            // var percentVal = '100%';
            // bar.width(percentVal)
            // percent.html(percentVal);
            // $(".progress-bar").addClass("progress-bar-success")
        },
        complete: function(xhr) {
            $(".progress-bar").html(xhr.responseText);
            $(".progress-bar").addClass("progress-bar-success")
            if(JSON.parse(xhr.responseText)["result"] == "OK"){
                _t.init("refreshmodal")
            }
        }
    }); 
    
    // MODAL - Input Surat SAVE
    $(".btn-save").click(function(){
    	var dataForm = $("#myForm").serialize()
    	var jqXHR = $.ajax({
        	type: "POST",
        	url: "/suratmasuk/input",
        	data: dataForm,
        	async: false
    	});
    	var r = JSON.parse(jqXHR.responseText)
    	if(r.result === "OK"){
    		$("#myModal").modal('hide')
            _t.init('default')
    	}else{
    		alert("NOK")
    	}
    })

    // datepicker firstload
    $('.datepicker').datepicker({
        autoclose: true,
        format: "yyyy-mm-dd",
        todayHighlight: true
    })

});