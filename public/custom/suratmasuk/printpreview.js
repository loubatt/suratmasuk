function date_machine_to_indonesian(string){
	// 2016-01-07 => 07/01/2016
	if(string){
		var m = string.split(" ")
		var splitter = m[0].split("-")
		return splitter[2] + "/" + splitter[1] + "/" + splitter[0]
	}else{
		return "-"
	}
}

$(document).ready(function(){
	var url  = "/suratmasuk/printpreview/data"
	
	$("body").append("<div id='status'>Loading....</div>")
	$("body").append("<table></table>")
	$("table").append("<thead></thead>")
	$("thead").append("<tr>\
		<th>No.</th>\
		<th>No. Agenda</th>\
		<th>Tgl. Terima</th>\
		<th>Asal Surat</th>\
		<th>Nomor Surat</th>\
		<th>Tgl. Surat</th>\
		<th>Hal Surat</th>\
		<th>Disposisi</th>\
		<th>Tanda Terima</th>\
		</tr>")
	$("table").append("<tbody></tbody>")

	var nomor = 1
	$.getJSON(url, function(result){
		var my_kodejabatan = result.my_kodejabatan
		var data = result.listsurat
		for(var a in data){
			var tag = data[a].tag
			var tr  = "<tr>"
			tr += "<td>" + nomor + "</td>"

			tr += "<td>"
			tr += data[a].to_nomoragenda
			tr += "</td>"

			tr += "<td>"
			tr += data[a].to_tanggalditerima
			tr += "</td>"

			tr += "<td>" + data[a].asal + "</td>"
			tr += "<td>" + data[a].nomor + "</td>"
			tr += "<td>" + data[a].tanggal +"</td>"
			tr += "<td>" + data[a].hal +"</td>"

			tr += "<td>"
			for(var b in tag){
				var kode_jabatan = tag[b].to_kodejabatan
				if(my_kodejabatan != kode_jabatan){
					var nama_jabatan = tag[b].to_namajabatan
					tr += nama_jabatan + "; "
				}
			}
			tr += "</td>"

			tr += "<td></td>"

			tr += "</tr>"
			$("tbody").append(tr)
			nomor += 1
		}
		$("#status").html("Jumlah Data " + result.count)
	})
	
})