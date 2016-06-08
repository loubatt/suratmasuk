var Header = React.createClass({displayName: "Header",
	render: function(){
		return(
			React.createElement("div", {id: "header"}, 
				React.createElement("div", {className: "header-brand"}, 
					React.createElement("span", {className: "header-brand-name"}, this.props.nama), " ", React.createElement("span", {className: "header-brand-job"}, this.props.namaJabatan)
				), 
				React.createElement("div", {className: "header-menu"}, 
					React.createElement("div", {className: "header-menu-item"}, 
						React.createElement("a", {href: "/"}, "Home")
					), 
					React.createElement("div", {className: "header-menu-item"}, React.createElement("a", {href: "/suratmasuk"}, "Surat masuk")), 
					React.createElement("div", {className: "header-menu-item"}, "Surat keluar"), 
					React.createElement("div", {className: "header-menu-item"}, 
						React.createElement("a", {href: "/admin"}, "Admin")
					), 
					React.createElement("div", {className: "header-menu-item"}, 
						React.createElement("a", {href: "/logout"}, "Logout")
					)
				)
			)
		)
	}
})

var WindowFormSearch = React.createClass({displayName: "WindowFormSearch",

	getInitialState: function(){
		return {
			show_status 		: false,
			search_tujuan 		: "",
			search_jenissurat	: "",
			search_nomorsurat	: "",
			search_kodesurat	: "",
			search_tanggalsurat	: "",
			search_bulansurat 	: "",
			search_tahunsurat 	: "",
			search_halsurat 	: "",
			search_kodepenunjuk : "",
			list_tanggal  		: [],
			list_bulan  		: [],
			list_tahun  		: []
		}
	},

	clearSearch: function(){

		var _this = this

		React.findDOMNode(this.refs.tujuan_surat).value = ""
		React.findDOMNode(this.refs.jenis_surat).value = ""
		React.findDOMNode(this.refs.nomor_surat).value = ""
		React.findDOMNode(this.refs.kode_surat).value = ""
		React.findDOMNode(this.refs.tanggal_surat).value = ""
		React.findDOMNode(this.refs.bulan_surat).value = ""
		React.findDOMNode(this.refs.tahun_surat).value = ""
		React.findDOMNode(this.refs.hal_surat).value = ""
		React.findDOMNode(this.refs.kode_penunjuk).value = ""

		this.setState({search_tujuan		: ""})
		this.setState({search_jenissurat	: ""})
		this.setState({search_nomorsurat	: ""})
		this.setState({search_kodesurat 	: ""})
		this.setState({search_tanggalsurat	: ""})
		this.setState({search_bulansurat	: ""})
		this.setState({search_tahunsurat	: ""})
		this.setState({search_halsurat		: ""})
		this.setState({search_kodepenunjuk	: ""})

		var url = "/suratkeluar/search/clear"
		$.getJSON(url, function(res){
			if(res.result == "OK"){
				_this.props.setCurrentPageNumber(1)
				_this.props.getDataSearch(_this.props.currentPageNumber)
			}
		})
	},

	post: function(){

		var _this = this
		var data  = {}
		var url           = '/suratkeluar/search'

		var tujuan    	  = React.findDOMNode(this.refs.tujuan_surat)
		var jenis_surat   = React.findDOMNode(this.refs.jenis_surat)
		var nomor_surat   = React.findDOMNode(this.refs.nomor_surat)
		var kode_surat    = React.findDOMNode(this.refs.kode_surat)
		var tanggal_surat = React.findDOMNode(this.refs.tanggal_surat)
		var bulan_surat   = React.findDOMNode(this.refs.bulan_surat)
		var tahun_surat   = React.findDOMNode(this.refs.tahun_surat)
		var hal_surat     = React.findDOMNode(this.refs.hal_surat)
		var kode_penunjuk = React.findDOMNode(this.refs.kode_penunjuk)

		data.tujuan_surat  = tujuan.value
		data.jenis_surat   = jenis_surat.value
		data.nomor_surat   = nomor_surat.value
		data.kode_surat    = kode_surat.value
		data.tanggal_surat = tanggal_surat.value
		data.bulan_surat   = bulan_surat.value
		data.tahun_surat   = tahun_surat.value
		data.hal  		   = hal_surat.value
		data.kode_penunjuk = kode_penunjuk.value

		this.setState({search_tujuan: tujuan.value})
		this.setState({search_jenissurat: jenis_surat.value})
		this.setState({search_nomorsurat: nomor_surat.value})
		this.setState({search_kodesurat: kode_surat.value})
		this.setState({search_tanggalsurat: tanggal_surat.value})
		this.setState({search_bulansurat: bulan_surat.value})
		this.setState({search_tahunsurat: tahun_surat.value})
		this.setState({search_halsurat: hal_surat.value})
		this.setState({search_kodepenunjuk: kode_penunjuk.value})

		$.post(url, data, function(res){
			if(res.result == "OK"){
				_this.props.setCurrentPageNumber(1)
				_this.props.getDataSearch(_this.props.currentPageNumber)
			}
		})
	},

	componentWillMount: function(){
		var _this = this

		var url   = "/suratkeluar/search/getvalue"

		$.getJSON(url, function(res){

			_this.setState({search_tujuan: res['skl-search-tujuan']})
			_this.setState({search_jenissurat: res['skl-search-jenissurat']})
			_this.setState({search_nomorsurat: res['skl-search-nomorsurat']})
			_this.setState({search_kodesurat: res['skl-search-kodesurat']})

			_this.setState({search_tanggalsurat: res['skl-search-tanggalsurat']})
			_this.setState({search_bulansurat: res['skl-search-bulansurat']})
			_this.setState({search_tahunsurat: res['skl-search-tahunsurat']})

			_this.setState({search_halsurat: res['skl-search-halsurat']})
			_this.setState({search_kodepenunjuk: res['skl-search-kodepenunjuk']})

			React.findDOMNode(_this.refs.tujuan_surat).value = res['skl-search-tujuan']
			React.findDOMNode(_this.refs.jenis_surat).value = res['skl-search-jenissurat']
			React.findDOMNode(_this.refs.nomor_surat).value = res['skl-search-nomorsurat']
			React.findDOMNode(_this.refs.kode_surat).value = res['skl-search-kodesurat']

			React.findDOMNode(_this.refs.hal_surat).value = res['skl-search-halsurat']
			React.findDOMNode(_this.refs.kode_penunjuk).value = res['skl-search-kodepenunjuk']
		})

		var url2  = "/suratmasuk/search/form/getvars"
		$.getJSON(url2, function(res){
			_this.setState({list_tanggal : res.list_tanggal})
			_this.setState({list_bulan   : res.list_bulan})
			_this.setState({list_tahun   : res.list_tahun})
		})
	},

	componentDidMount: function(){
		$("#window_form_search").draggable({
			handle: $("div#window_form_search_handling"),
			cursor: "pointer",
			zIndex: 100
		})
	},

	toggleWindow: function(){
		if(this.state.show_status){
			this.setState({show_status: false})
		}else{
			this.setState({show_status: true})
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var class_name = ""
		}else{
			var class_name = "hide"
		}



		if (this.state.search_tujuan || this.state.search_jenissurat || this.state.search_nomorsurat || this.state.search_kodesurat || this.state.search_tanggalsurat || this.state.search_bulansurat || this.state.search_tahunsurat || this.state.search_halsurat || this.state.search_kodepenunjuk) {
			var search_is_on_style = "yellow"
		}else{
			var search_is_on_style = ""
		}

		return (
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_search", className: class_name}, 
					React.createElement("div", {id: "window_form_search_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-search-container"}, 
						React.createElement("span", {className: "form-field-label"}, "Tujuan Surat  "), 
						React.createElement("input", {className: "full-row form-control input-sm", type: "text", ref: "tujuan_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Jenis Surat  "), 
						React.createElement("input", {className: "full-row form-control input-sm", type: "text", ref: "jenis_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Nomor Surat  "), 
						React.createElement("input", {className: "full-row form-control input-sm", type: "text", ref: "nomor_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Kode Surat  "), 
						React.createElement("input", {className: "full-row form-control input-sm", type: "text", ref: "kode_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Tanggal Surat  "), 
						React.createElement("div", {className: "full-row", style: {marginBottom: "8px", display: "flex"}}, 
							React.createElement("select", {ref: "tanggal_surat", className: "form-control form-field-tanggal input-sm"}, 
								this.state.list_tanggal.map(function(res){
										if(res.Value == _this.state.search_tanggalsurat){
											var selected = true
										}else{
											var selected = false
										}

										return(
												React.createElement("option", {value: res.Value, selected: selected}, res.Label)
											)
									})
								
							), 
							React.createElement("select", {ref: "bulan_surat", className: "form-control form-field-bulan input-sm"}, 
								this.state.list_bulan.map(function(res){
										if(res.Value == _this.state.search_bulansurat){
											var selected = true
										}else{
											var selected = false
										}

										return(
												React.createElement("option", {value: res.Value, selected: selected}, res.Label)
											)
									})
								
							), 
							React.createElement("select", {ref: "tahun_surat", className: "form-control form-field-tahun input-sm"}, 
								this.state.list_tahun.map(function(res){
										if(res.Value == _this.state.search_tahunsurat){
											var selected = true
										}else{
											var selected = false
										}

										return(
												React.createElement("option", {value: res.Value, selected: selected}, res.Label)
											)
									})
								
							)
						), 

						React.createElement("span", {className: "form-field-label"}, "Hal Surat  "), 
						React.createElement("textarea", {className: "full-row form-control input-sm", style: {height:"50px"}, type: "text", ref: "hal_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Kode Penunjuk  "), 
						React.createElement("input", {className: "full-row form-control input-sm", type: "text", ref: "kode_penunjuk"}), 

						React.createElement("div", {className: "full-row"}, 
							React.createElement("button", {	className: "btn btn-success btn-sm", style: {width:"75%",marginRight:"2px"}, onClick: this.post}, "Cari"), 
							React.createElement("button", {	className: "btn btn-warning btn-sm", onClick: this.clearSearch}, "Clear")
						)
					)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: "btn btn-success btn-sm", style: {color:search_is_on_style}}, 
						React.createElement("span", {className: "glyphicon glyphicon-search"}), " Cari"
					)
				)
			)
		)
	}
})

var MenuPrint = React.createClass({displayName: "MenuPrint",

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	createPDF: function(){
		var data = {}
		data.UniqCHar = "XxxxX"
		data.Data     = this.props.selectedRows

		var url = "/suratmasuk/pdf/" + JSON.stringify(data)
		window.open(url,'sms','width=500px, height=500px')
	},

	render: function(){

		if(this.countSelectedRows() >= 1){
			var showBtnPrint = "btn btn-primary btn-sm"
		}else{
			var showBtnPrint = "hide"
		}

		return (
			React.createElement("div", {className: "menu-button"}, 
				React.createElement("button", {className: showBtnPrint, onClick: this.createPDF}, 
					React.createElement("span", {className: "glyphicon glyphicon-print"}), " Print"
				)
			)
		)
	}
})

var Last_nomorskl = React.createClass({displayName: "Last_nomorskl",

	getInitialState: function(){
		return{
			nomor_skl   : "",
			tanggal_skl : "",
			createdby_nama : "",
		}
	},

	componentDidMount: function(){
		$('#show_last_nomorskl_status').css("position","fixed")
		$("#show_last_nomorskl_status").draggable({
			// handle: $("div#window_form_search_handling"),
			cursor: "pointer",
			zIndex: 100
		})
	},

	componentWillReceiveProps: function(nextProps){
		var _this = this
		if(nextProps.show_last_nomorskl_status){
			var url = "/suratkeluar/check_last"

			var data = {}
			data.tahun_surat = nextProps.tahun_skl_selected
			data.jenis_surat = nextProps.jenis_skl_selected
			data.kode_surat  = nextProps.kode_skl_selected

			$.post(url, data, function(r){
				if(r.result){
					_this.setState({nomor_skl: r.result.nomor_skl})
					_this.setState({tanggal_skl: r.result.tanggal_skl})
					_this.setState({createdby_nama: r.result.createdby_nama})
				}else{
					_this.props.set_show_last_nomorskl_status(false)
				}
			})
		}
	},

	hide: function(){
		this.props.set_show_last_nomorskl_status(false)
	},

	render: function() {

		var _class = ""
		if (this.props.show_last_nomorskl_status){
			_class = "floating"
		}else{
			_class = "hide"
		}
		return(
			React.createElement("div", {id: "show_last_nomorskl_status", className: _class, onDoubleClick: this.hide}, 
				React.createElement("span", {style: {fontSize: "35px"}}, this.state.nomor_skl), React.createElement("br", null), 
				React.createElement("span", null, this.state.tanggal_skl), React.createElement("br", null), 
				React.createElement("span", null, this.state.createdby_nama)
			)
		)
	}
})

var WindowFormInput = React.createClass({displayName: "WindowFormInput",

	getInitialState: function(){
		return {
			show_status  : false,
			list_tanggal : [],
			list_bulan   : [],
			list_tahun   : [],
			jenis_skl    : [],
			kode_skl     : [],
			show_last_nomorskl_status : false,
			tahun_skl_selected : "",
			jenis_skl_selected : "",
			kode_skl_selected  : "",
		}
	},

	set_show_last_nomorskl_status: function(val){
		this.setState({show_last_nomorskl_status: val})
	},

	post: function(){

		var _this = this

		var url            = '/suratkeluar/input'
		var tahun_surat    = React.findDOMNode(this.refs.tahun_surat)
		var jenis_surat    = React.findDOMNode(this.refs.jenis_surat)
		var kode_surat     = React.findDOMNode(this.refs.kode_surat)
		var tanggal_surat  = React.findDOMNode(this.refs.tanggal_surat)
		var tujuan_surat   = React.findDOMNode(this.refs.tujuan_surat)
		var perihal_surat  = React.findDOMNode(this.refs.perihal_surat)
		var tembusan_surat = React.findDOMNode(this.refs.tembusan_surat)
		var kode_penunjuk  = React.findDOMNode(this.refs.kode_penunjuk)

		var data  = {}
		data.tahun_surat    = tahun_surat.value
		data.jenis_surat    = jenis_surat.value
		data.kode_surat     = kode_surat.value
		data.tanggal_surat  = tanggal_surat.value
		data.tujuan_surat   = tujuan_surat.value
		data.perihal_surat  = perihal_surat.value
		data.tembusan_surat = tembusan_surat.value
		data.kode_penunjuk  = kode_penunjuk.value

		this.props.setNotification(true)
		this.props.setNotificationMsg("Proses Input")

		$.post(url, data, function(result){
			_this.props.getData(_this.props.currentPageNumber)
			// _this.props.setNotification(false)
			_this.props.setNotificationMsg("Done")
			// tahun_surat.value    = ""
			// jenis_surat.value    = ""
			// kode_surat.value     = ""
			// tanggal_surat.value  = ""
			// tujuan_surat.value   = ""
			// perihal_surat.value  = ""
			// tembusan_surat.value = ""
			// kode_penunjuk.value  = ""
		})
	},

	componentWillMount: function(){
		var _this = this
		var url2  = "/suratmasuk/search/form/getvars"
		$.getJSON(url2, function(res){
			_this.setState({list_tanggal : res.list_tanggal})
			_this.setState({list_bulan   : res.list_bulan})
			_this.setState({list_tahun   : res.list_tahun})
			if(res.jenis_skl.list){
				_this.setState({jenis_skl: res.jenis_skl.list})
			}
			if(res.kode_skl.list){
				_this.setState({kode_skl : res.kode_skl.list})
			}
		})
	},

	componentDidMount: function(){
		$("#window_form_input").draggable({
			handle: $("div#window_form_input_handling"),
			cursor: "pointer",
			zIndex: 100
		})
		$('.datepicker').datepicker({
		    format: 'dd/mm/yyyy',
		    autoclose: true,
		    todayHighlight: true
		})
	},

	toggleWindow: function(){
		if(this.state.show_status){
			this.setState({show_status: false})
		}else{
			this.setState({show_status: true})
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
	},

	show_last_nomorskl: function() {

		var check     = ""
		var tahun_skl = React.findDOMNode(this.refs.tahun_surat).value
		var jenis_skl = React.findDOMNode(this.refs.jenis_surat).value
		var kode_skl  = React.findDOMNode(this.refs.kode_surat).value

		if(tahun_skl && jenis_skl && kode_skl){
			this.setState({show_last_nomorskl_status: true})
			this.setState({tahun_skl_selected : tahun_skl})
			this.setState({jenis_skl_selected : jenis_skl})
			this.setState({kode_skl_selected  : kode_skl})
		}else{
			this.setState({show_last_nomorskl_status: false})
		}
	},

	render: function(){
		if(this.state.show_status){
			var class_name = ""
		}else{
			var class_name = "hide"
		}
		return (
			React.createElement("div", null, 
				React.createElement(Last_nomorskl, {
					show_last_nomorskl_status: this.state.show_last_nomorskl_status, 
					tahun_skl_selected: this.state.tahun_skl_selected, 
					jenis_skl_selected: this.state.jenis_skl_selected, 
					kode_skl_selected: this.state.kode_skl_selected, 
					set_show_last_nomorskl_status: this.set_show_last_nomorskl_status}), 

				React.createElement("div", {id: "window_form_input", className: class_name}, 
					React.createElement("div", {id: "window_form_input_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-input-container"}, 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Tahun  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("select", {ref: "tahun_surat", className: "form-control form-field-tahun", onChange: this.show_last_nomorskl}, 
									this.state.list_tahun.map(function(res){
										return(
											React.createElement("option", {value: res.Value}, res.Label)
										)
									})
								)
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Jenis Surat  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("select", {ref: "jenis_surat", className: "form-control", onChange: this.show_last_nomorskl}, 
									React.createElement("option", {value: "", selected: true}), 
									this.state.jenis_skl.map(function(res){
										return(
											React.createElement("option", {value: res}, res)
										)
									})
								)
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Kode Surat  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("select", {ref: "kode_surat", className: "form-control", onChange: this.show_last_nomorskl}, 
									React.createElement("option", {value: "", selected: true}), 
									this.state.kode_skl.map(function(res){
										return(
											React.createElement("option", {value: res}, res)
										)
									})
								)
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Tanggal Surat  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("input", {className: "datepicker form-control", type: "text", ref: "tanggal_surat"})
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Tujuan  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("textarea", {ref: "tujuan_surat", className: "form-control form-small"})
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Perihal  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("textarea", {ref: "perihal_surat", className: "form-control form-middle"})
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Tembusan  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("textarea", {ref: "tembusan_surat", className: "form-control form-small"})
							)
						), 
						React.createElement("div", {className: "grid-row"}, 
							React.createElement("div", {className: "grid-row-column3"}, 
								React.createElement("span", {className: "form-field-label"}, "Kode penunjuk  ")
							), 
							React.createElement("div", {className: "grid-row-column7"}, 
								React.createElement("input", {className: "form-control", type: "text", ref: "kode_penunjuk"})
							)
						), 
						React.createElement("button", {	className: "full-row btn btn-success btn-sm", onClick: this.post}, "Simpan")
					)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: "btn btn-success btn-sm"}, 
						React.createElement("span", {className: "glyphicon glyphicon-plus"}), " Input"
					)
				)
			)
		)
	}
})

var WindowFormEdit = React.createClass({displayName: "WindowFormEdit",

	getInitialState: function(){
		return {
			show_status  : false,
			doc_detail   : {}
		}
	},

	post: function(){

		var _this       = this
		var Doc_series  = this.props.selectedRows[0]

		var Tujuan 		  = React.findDOMNode(this.refs.tujuan_surat).value
		var Hal  		  = React.findDOMNode(this.refs.hal_surat).value
		var Tembusan	  = React.findDOMNode(this.refs.tembusan_surat).value
		var Kode_penunjuk = React.findDOMNode(this.refs.kode_penunjuk).value

		var url  		= "/suratkeluar/edit/" + Doc_series
		var data 		= {}

		data.tujuan        = Tujuan
		data.hal    	   = Hal
		data.tembusan      = Tembusan
		data.kode_penunjuk = Kode_penunjuk

		$.post(url, data, function(res){
			if(res.result == 'OK'){
				_this.setState({show_status: false})
				_this.props.setLockRows(false)
				_this.props.getData(_this.props.currentPageNumber)
			}
		})
	},

	componentDidMount: function(){
		$("#window_form_edit").draggable({
			handle: $("div#window_form_edit_handling"),
			cursor: "pointer",
			zIndex: 100
		})
	},

	tanggalFormatterToIndonesian: function(tgl){
		// 2015-11-12 -> 12/11/2015
		if(tgl != undefined && tgl != ""){
			var tgl_split = tgl.split("-")
			return tgl_split[2] + "/" + tgl_split[1] + "/" + tgl_split[0]
		}else{
			return "-"
		}
	},

	getData: function(){
		var _this = this
		var url = "/suratkeluar/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){
			React.findDOMNode(_this.refs.tujuan_surat).value = res.datasurat.tujuan_skl
			React.findDOMNode(_this.refs.hal_surat).value = res.datasurat.perihal_skl
			React.findDOMNode(_this.refs.tembusan_surat).value = res.datasurat.tembusan_skl
			React.findDOMNode(_this.refs.kode_penunjuk).value = res.datasurat.kode_penunjuk
		})
	},

	toggleWindow: function(){

		if(this.state.show_status){
			this.setState({show_status: false})
			this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				this.props.setLockRows(true)
			}
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
		this.props.setLockRows(false)
	},

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	needShowBtnEdit: function(){
		var countSelectedRows = this.countSelectedRows()
		var isInAllRows = $.inArray(this.props.selectedRows[0], this.props.allRows)
		if (countSelectedRows == 1){
			if(isInAllRows != -1){
				return true
			}
		}
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var toggleWindow = ""
		}else{
			var toggleWindow = "hide"
		}

		if(this.needShowBtnEdit()){
			var showBtnEdit  = "btn btn-success btn-sm"
		}else{
			var showBtnEdit  = "hide"
			var toggleWindow = "hide"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_edit", className: toggleWindow}, 
					React.createElement("div", {id: "window_form_edit_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-edit-container"}, 

						React.createElement("input", {type: "hidden", ref: "Doc_series"}), React.createElement("br", null), 

						React.createElement("span", {className: "form-field-label"}, "Tujuan Surat  "), 
						React.createElement("input", {className: "full-row form-control", type: "text", ref: "tujuan_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Hal Surat  "), 
						React.createElement("textarea", {className: "full-row form-control", type: "text", ref: "hal_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Tembusan Surat  "), 
						React.createElement("input", {className: "full-row form-control", type: "text", ref: "tembusan_surat"}), 

						React.createElement("span", {className: "form-field-label"}, "Kode Penunjuk  "), 
						React.createElement("input", {className: "full-row form-control", type: "text", ref: "kode_penunjuk"}), 

						React.createElement("button", {	className: "full-row btn btn-success btn-sm", onClick: this.post}, "Edit")
					)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: showBtnEdit}, 
						React.createElement("span", {className: "glyphicon glyphicon-pencil"}), " Edit"
					)
				)
			)
		)
	}
})

var DetailItem = React.createClass({displayName: "DetailItem",

	getInitialState: function(){
		return {
			open_list: []
		}
	},

	toggleSubItem: function(kode_jabatan){
		this.props.toggleSubItem(kode_jabatan)
		console.log(this.props.getOpenList())
	},

	render: function(){

		if($.inArray( this.props.data.to_kodejabatan, this.props.getOpenList()) == -1){
			var show = "none"
			var icon = "glyphicon glyphicon-triangle-right"
		}else{
			var show = "block"
			var icon = "glyphicon glyphicon-triangle-bottom"
		}

		return(
			React.createElement("div", {className: "form-detail-disposisi-item"}, 
				React.createElement("div", {onClick: this.toggleSubItem.bind(this, this.props.data.to_kodejabatan), className: "form-detail-disposisi-item-head"}, 
					React.createElement("span", {className: icon}), " ", React.createElement("span", {style: {fontWeight:"bold"}}, this.props.data.to_nama), " ", React.createElement("span", null, this.props.data.to_namajabatan)
				), 
				React.createElement("div", {style: {display: show}, className: "form-detail-disposisi-item-content"}, 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.createdby_nama, " (", this.props.data.createdby_namajabatan, ")"), React.createElement("br", null), 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Tgl. Disposisi Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.createdby_time), React.createElement("br", null), 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Nomor Agenda"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_nomoragenda), React.createElement("br", null), 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Tgl. Diterima"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_tanggalditerima), React.createElement("br", null), 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Isi Disposisi Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_disposisi), React.createElement("br", null), 
					React.createElement("span", {className: "form-detail-disposisi-item-content-label"}, "Catatan Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_catatan), React.createElement("br", null)
				)
			)

		)
	}
})

var WindowDetail = React.createClass({displayName: "WindowDetail",

	getInitialState: function(){
		return {
			show_status : false,
			tags   		: [],
			open_list 	: []
		}
	},

	componentDidMount: function(){
		$("#window_form_detail").draggable({
			handle: $("div#window_form_detail_handling"),
			cursor: "pointer",
			zIndex: 100
		})
	},

	getOpenList: function(){
		return this.state.open_list
	},

	toggleSubItem: function(kode_jabatan){

		var prevState = this.state.open_list

		if($.inArray(kode_jabatan, prevState) == -1){
			prevState.push(kode_jabatan)
		}else{
			var kode_jabatan_index = prevState.indexOf(kode_jabatan)
			prevState.splice(kode_jabatan_index, 1)
		}

		this.setState({open_list: prevState})
	},

	tagMapper: function(tags){
		var list = []
		for(var a in Object.keys(tags)){
			var kode_jabatan = Object.keys(tags)[a]
			var to_nama = tags[kode_jabatan].to_nama
			list.push(tags[kode_jabatan])
		}
		return list
	},

	getData: function(){
		var _this = this
		var url = "/suratmasuk/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){
			_this.setState({tags: _this.tagMapper( res.datasurat.tag )})
			React.findDOMNode(_this.refs.asal_surat).value = res.datasurat.asal
			React.findDOMNode(_this.refs.nomor_surat).value = res.datasurat.nomor
			React.findDOMNode(_this.refs.tanggal_surat).value = res.datasurat.tanggal
			React.findDOMNode(_this.refs.hal_surat).value = res.datasurat.hal
		})
	},

	toggleWindow: function(){

		if(this.state.show_status){
			this.setState({show_status: false})
			this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				this.props.setLockRows(true)
			}
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
		this.props.setLockRows(false)
	},

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	needShowBtnEdit: function(){
		var countSelectedRows = this.countSelectedRows()
		var isInAllRows = $.inArray(this.props.selectedRows[0], this.props.allRows)
		if (countSelectedRows == 1){
			if(isInAllRows != -1){
				return true
			}
		}
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var toggleWindow = ""
		}else{
			var toggleWindow = "hide"
		}

		if(this.needShowBtnEdit()){
			var showBtnEdit  = "btn btn-primary btn-sm"
		}else{
			var showBtnEdit  = "hide"
			var toggleWindow = "hide"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_detail", className: toggleWindow}, 
					React.createElement("div", {id: "window_form_detail_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-detail-container"}, 
						React.createElement("div", {className: "form-detail-surat"}, 
							React.createElement("span", {className: "form-field-label"}, "Asal Surat  "), 
							React.createElement("input", {className: "full-row form-control", type: "text", ref: "asal_surat"}), 
							React.createElement("span", {className: "form-field-label"}, "Nomor Surat  "), 
							React.createElement("input", {className: "full-row form-control", type: "text", ref: "nomor_surat"}), 
							React.createElement("span", {className: "form-field-label"}, "Tanggal Surat  "), 
							React.createElement("input", {className: "full-row datepicker form-control", type: "text", ref: "tanggal_surat"}), 
							React.createElement("span", {className: "form-field-label"}, "Hal Surat  "), 
							React.createElement("textarea", {className: "full-row form-control", type: "text", ref: "hal_surat"})
						), 
						React.createElement("div", {className: "form-detail-disposisi"}, 
							this.state.tags.map(function(data){
								return(
									React.createElement(DetailItem, {
										data: data, 
										getOpenList: _this.getOpenList, 
										toggleSubItem: _this.toggleSubItem})
								)
							})
						)
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: showBtnEdit}, 
						React.createElement("span", {className: "glyphicon glyphicon-sunglasses"}), " Detail"
					)
				)
			)
		)
	}
})

var WindowFiles = React.createClass({displayName: "WindowFiles",

	getInitialState: function(){
		return {
			show_status  : false
		}
	},

	componentDidMount: function(){

		var _this = this

		$("#window_form_files").draggable({
			handle: $("div#window_form_files_handling"),
			cursor: "pointer",
			zIndex: 100
		})

		$('#upload-form').ajaxForm({
	        beforeSend: function() {
	            $("#upload-button").val("Upload")
	        },
	        uploadProgress: function(event, position, total, percentComplete) {
	            var persen = percentComplete + "%"
	            $("#upload-button").val(persen)
	        },
	        success: function() {
	        	$("#upload-button").val("Success")
	        },
	        complete: function(xhr) {
	        	$("#upload-button").val("Completed")
	        	_this.props.getData(_this.props.currentPageNumber)
	            // $(".progress-bar").html(xhr.responseText);
	            // $(".progress-bar").addClass("progress-bar-success")
	            // if(JSON.parse(xhr.responseText)["result"] == "OK"){
	                // _t.init("refreshmodal")
	            // }
	        }
    	});
	},

	toggleWindow: function(){

		if(this.state.show_status){
			this.setState({show_status: false})
			this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.setState({show_status: true})
				this.props.setLockRows(true)
			}
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
		this.props.setLockRows(false)
	},

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	needShowBtnFiles: function(){
		var countSelectedRows = this.countSelectedRows()
		var isInAllRows = $.inArray(this.props.selectedRows[0], this.props.allRows)
		if (countSelectedRows == 1){
			if(isInAllRows != -1){
				return true
			}
		}
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var toggleWindow = ""
		}else{
			var toggleWindow = "hide"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn btn-success btn-sm"
			var url          = "/suratkeluar/upload/" + this.props.selectedRows[0]
			// var toggleWindow = ""
		}else{
			var showBtnFiles = "hide"
			var toggleWindow = "hide"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_files", className: toggleWindow}, 
					React.createElement("div", {id: "window_form_files_handling"}, "::::::"), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("form", {action: url, encType: "multipart/form-data", method: "post", id: "upload-form"}, 
						React.createElement("input", {type: "file", name: "file", id: "file"}), 
						React.createElement("input", {className: "btn btn-primary btn-xs", type: "submit", name: "submit", value: "Upload", id: "upload-button"})
					)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: showBtnFiles}, 
						React.createElement("span", {className: "glyphicon glyphicon-paperclip"}), " Files"
					)
				)
			)
		)
	}
})

var WindowPIC = React.createClass({displayName: "WindowPIC",

	getInitialState: function(){
		return {
			show_status               : false,
			bulk_kodejabatan 		  : [],
			bulk_disposisi 		  	  : [],
			doc_detail                : {},
			bawahan_list              : [],
			net_pic_list              : [],
			pic_list 				  : [],
			is_tgl_terima_setted	  : false,
			disposisi                 : [
				'Setuju',
				'Tolak',
				'Teliti & Pendapat',
				'Untuk Diketahui',
				'Untuk Perhatian',
				'Edarkan',
				'Jawab',
				'Selesaikan',
				'Perbaiki',
				'Bicarakan dengan saya',
				'Ingatkan',
				'Simpan',
				'Sesuai Catatan',
				'Perbanyak ... kali,asli ke ...',
				'...'
			]
		}
	},

	componentDidMount: function(){
		$("#window_form_pic").draggable({
			handle: $("div#window_form_pic_handling"),
			cursor: "pointer",
			zIndex: 100
		})
		this.getListBawahan()
	},

	post: function(){
		var _this = this
		var list_kodejabatan = this.state.bulk_kodejabatan
		for(var a in list_kodejabatan){
			var data = {}
			data.kode_jabatan = list_kodejabatan[a]
			data.disposisi    = JSON.stringify(this.state.bulk_disposisi)
			data.catatan	  = React.findDOMNode(this.refs.catatan_disposisi).value
			var url           = "/suratmasuk/pic/add/" + this.props.selectedRows[0]
			$.post(url, data, function(result){
				if(result.result == "OK"){
					_this.props.getData(_this.props.currentPageNumber)
					// _this.hideWindow()
					_this.getData()
					_this.state.bulk_kodejabatan = []
				}
			})
		}
	},

	removeTag: function(obj){
		// console.log(obj)
		var _this = this
		var url  = "/suratmasuk/pic/remove/" + this.props.selectedRows[0]
		var data = {}
		data.kode_jabatan = obj.Kode_jabatan
		$.post(url, data, function(result){
			if(result.result == "OK"){
				_this.getData()
				_this.props.getData(_this.props.currentPageNumber)
			}
		})
	},

	setTglTerima: function(){
		var _this = this
		var url   = "/suratmasuk/settanggalterima"
		var data  = "doc_series=" + this.props.selectedRows[0]
		$.post(url, data, function(res){
			if(res.result == "OK"){
				_this.setState({show_status: false})
				_this.props.setLockRows(false)
				_this.props.getData(_this.props.currentPageNumber)
			}
		})
	},

	getData: function(){
		var _this = this
		var url = "/suratmasuk/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){
			var bawahan  = _this.state.bawahan_list
			var _bawahan = []
			var _pic     = []
			for(var a in bawahan){
				var _obj = {}
				var kode_bawahan         = bawahan[a].Kode_jabatan
				var nama_jabatan_bawahan = bawahan[a].Nama_jabatan
				var nama_jabatan_pendek_bawahan = bawahan[a].Nama_jabatan_pendek

				_obj.Kode_jabatan = kode_bawahan
				_obj.Nama_jabatan = nama_jabatan_bawahan
				_obj.Nama_jabatan_pendek = nama_jabatan_pendek_bawahan

				if(res.datasurat.tag[kode_bawahan] == undefined){
					_bawahan.push(_obj)
				}else{
					_pic.push(_obj)
				}
			}
			console.log(res.datasurat.tag[_this.props.myKodeJabatan].tanggal_terima)

			if(res.datasurat.tag[_this.props.myKodeJabatan].to_tanggalditerima == undefined || res.datasurat.tag[_this.props.myKodeJabatan].to_tanggalditerima == ""){
				_this.setState({is_tgl_terima_setted: false})
			}else{
				_this.setState({is_tgl_terima_setted: true})
			}

			console.log(_this.state.is_tgl_terima_setted)

			_this.setState({net_pic_list: _bawahan})
			_this.setState({pic_list: _pic})


		})
	},

	getListBawahan: function(){
		var _this = this
		var url   = "/jabatan/bawahan"
		$.getJSON(url, function(result){
			_this.setState({bawahan_list: result.listbawahan})
		})
	},

	toggleWindow: function(){
		if(this.state.show_status){
			this.setState({show_status: false})
			this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				this.props.setLockRows(true)
			}
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
		this.props.setLockRows(false)
	},

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	needShowBtnFiles: function(){
		var countSelectedRows = this.countSelectedRows()
		var isInAllRows = $.inArray(this.props.selectedRows[0], this.props.allRows)
		if (countSelectedRows == 1){
			if(isInAllRows != -1){
				return true
			}
		}
	},

	addToKodeJabatanBulk: function(kode_jabatan){
		var prevState = this.state.bulk_kodejabatan
		var inArray = $.inArray(kode_jabatan, prevState)
		if(inArray == -1){
			prevState.push(kode_jabatan)
		}else{
			var index = prevState.indexOf(kode_jabatan)
			prevState.splice(index, 1)
		}
		this.setState({bulk_kodejabatan: prevState})
		// console.log(this.state.bulk_kodejabatan)
	},

	addToDisposisiBulk: function(disposisi){
		var inArray = $.inArray(disposisi, this.state.bulk_disposisi)
		if(inArray == -1){
			this.state.bulk_disposisi.push(disposisi)
		}else{
			var index = this.state.bulk_disposisi.indexOf(disposisi)
			this.state.bulk_disposisi.splice(index, 1)
		}
		console.log(this.state.bulk_disposisi)
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var toggleWindow = ""
		}else{
			var toggleWindow = "hide"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn btn-primary btn-sm"
			var url          = "/suratmasuk/upload/" + this.props.selectedRows[0]
		}else{
			var showBtnFiles = "hide"
			var toggleWindow = "hide"
		}

		if(this.state.is_tgl_terima_setted){
			var disposisiMode = "disposisi-mode"
			var setTglTerimaMode = "hide"
		}else{
			var disposisiMode = "hide"
			var setTglTerimaMode = ""
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_pic", className: toggleWindow}, 
					React.createElement("div", {id: "window_form_pic_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-pic-container"}, 
						React.createElement("div", {className: disposisiMode}, 
							React.createElement("div", {className: "net-pic-list"}, 
							this.state.net_pic_list.map(function(bawahan){

									if($.inArray(bawahan.Kode_jabatan, _this.state.bulk_kodejabatan) == -1){
										var checked = false
									}else{
										var checked = true
									}

									return (
										React.createElement("div", {className: "net-pic-list-item"}, 
											React.createElement("label", null, 
												React.createElement("input", {type: "checkbox", onClick: _this.addToKodeJabatanBulk.bind(this, bawahan.Kode_jabatan), checked: checked}), 
												bawahan.Nama_jabatan_pendek
											)
										)
									)
								})
							
							), 

							React.createElement("div", {className: "pic-disposisi"}, 
							this.state.disposisi.map(function(disposisi){
									return (
										React.createElement("div", {className: "disposisi-item"}, 
											React.createElement("label", null, 
												React.createElement("input", {type: "checkbox", onClick: _this.addToDisposisiBulk.bind(this, disposisi)}), 
												disposisi
											)
										)
									)
								})
							
							), 

							React.createElement("div", {className: "pic-list"}, 
							this.state.pic_list.map(function(bawahan){
									return (
										React.createElement("div", {className: "pic-list-item"}, 
											React.createElement("label", null, 
												bawahan.Nama_jabatan_pendek, " ", React.createElement("span", {onClick: _this.removeTag.bind(this, bawahan)}, "X")
											)
										)
									)
								})
							
							), 



							React.createElement("div", {className: "pic-notes"}, 
								React.createElement("textarea", {ref: "catatan_disposisi", className: "pic-notes"})
							), 

							React.createElement("div", {style: {width:'500px'}}, 
								React.createElement("button", {onClick: this.post}, "DISPOSISI")
							)
						), 

						React.createElement("div", {className: setTglTerimaMode}, 
							React.createElement("button", {onClick: this.setTglTerima}, "SET")
						)
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: showBtnFiles}, 
						React.createElement("span", {className: "glyphicon glyphicon-user"}), " Disposisi"
					)
				)
			)
		)
	}
})

var WindowArsip = React.createClass({displayName: "WindowArsip",

	getInitialState: function(){
		return {
			show_status               : false,
			list_arsip                : [],
			is_tgl_terima_setted	  : false,
			arsip_result 		      : [],
			item_index_selected 	  : 0,
		}
	},

	componentDidMount: function(){

		var _this = this

		$("#window_form_arsip").draggable({
			handle: $("div#window_form_arsip_handling"),
			cursor: "pointer",
			zIndex: 100
		})

		$('#kode_arsip').on('keydown', function (e) {
			_this.autoCompleteNavigate(e)
		});

		$('#keterangan_arsip').on('keydown', function (e) {
			_this.autoCompleteNavigate(e)
		});

	},

	autoCompleteNavigate: function(e){

		// console.log(e.keyCode)

		var result_length = this.state.arsip_result.length
		var item_index    = this.state.item_index_selected
		if(result_length > 0){
			if(e.keyCode == 40){
				// Down
				var new_item_selected = item_index + 1
				if(new_item_selected <= result_length){
					this.setState({item_index_selected: new_item_selected})
				}else{
					new_item_selected = 1
					this.setState({item_index_selected: new_item_selected})
				}
			}else if(e.keyCode == 38){
				// Up
				var new_item_selected = item_index - 1
				if(new_item_selected > 0){
					this.setState({item_index_selected: new_item_selected})
				}else{
					new_item_selected = result_length
					this.setState({item_index_selected: new_item_selected})
				}
			}else if(e.keyCode == 13){
				this.apply_result()
			}
		}else{
			console.log("No Result")
		}
		console.log(this.state.item_index_selected)
	},

	apply_result: function(){
		var item_index_selected = this.state.item_index_selected - 1
		var arsip_result        = this.state.arsip_result
		var data 				= arsip_result[item_index_selected]
		React.findDOMNode(this.refs.kode_arsip).value       = ""
		React.findDOMNode(this.refs.keterangan_arsip).value = ""
		this.post(data.Kode_arsip, data.Keterangan)
		this.setState({arsip_result: []})
		this.getData()
	},

	removeArsip: function(obj){
		console.log(obj)
		var _this = this
		var url  = "/arsip/remove/skl/" + this.props.selectedRows[0]
		var data = {}
		data.id_arsip       = obj.id
		data.kode_arsip     = obj.data.kode_arsip.replace(".","")
		$.post(url, data, function(result){
			_this.getData()
		})
	},

	post: function(kode_arsip, keterangan_arsip){
		var _this = this
		var data = {}
		data.kode_arsip = kode_arsip
		data.keterangan = keterangan_arsip
		var url         = "/arsip/skl/" + this.props.selectedRows[0]
		$.post(url, data, function(result){
			if(result.result == "OK"){

			}
		})
	},

	setTglTerima: function(){
		var _this = this
		var url   = "/suratmasuk/settanggalterima"
		var data  = "doc_series=" + this.props.selectedRows[0]
		$.post(url, data, function(res){
			if(res.result == "OK"){
				_this.setState({show_status: false})
				_this.props.setLockRows(false)
				_this.props.getData(_this.props.currentPageNumber)
			}
		})
	},

	listArsipMapper: function(arsips){
		var list = []
		for(var a in Object.keys(arsips)){
			var sub_list   = []
			var kode_arsip = Object.keys(arsips)[a]

			var obj = arsips[kode_arsip]
			for(var b in Object.keys(arsips[kode_arsip])){
				var kode_jabatan = Object.keys(arsips[kode_arsip])[b]
				// sub_list.push(obj[kode_jabatan])
				list.push(obj[kode_jabatan])
			}
		}
		return list
	},

	getData: function(){
		var _this = this
		var url = "/suratkeluar/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){

			if(res.datasurat.arsip){
				_this.setState({list_arsip: _this.listArsipMapper(res.datasurat.arsip)})
			}else{
				_this.setState({list_arsip: []})
			}

		})
	},

	toggleWindow: function(){
		if(this.state.show_status){
			this.setState({show_status: false})
			this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				this.props.setLockRows(true)
			}
		}
	},

	hideWindow: function(){
		this.setState({show_status: false})
		this.props.setLockRows(false)
	},

	countSelectedRows: function(){
		return this.props.selectedRows.length
	},

	needShowBtnFiles: function(){
		var countSelectedRows = this.countSelectedRows()
		var isInAllRows = $.inArray(this.props.selectedRows[0], this.props.allRows)
		if (countSelectedRows == 1){
			if(isInAllRows != -1){
				return true
			}
		}
	},

	addToKodeJabatanBulk: function(kode_jabatan){
		var prevState = this.state.bulk_kodejabatan
		var inArray = $.inArray(kode_jabatan, prevState)
		if(inArray == -1){
			prevState.push(kode_jabatan)
		}else{
			var index = prevState.indexOf(kode_jabatan)
			prevState.splice(index, 1)
		}
		this.setState({bulk_kodejabatan: prevState})
		// console.log(this.state.bulk_kodejabatan)
	},

	addToDisposisiBulk: function(disposisi){
		var inArray = $.inArray(disposisi, this.state.bulk_disposisi)
		if(inArray == -1){
			this.state.bulk_disposisi.push(disposisi)
		}else{
			var index = this.state.bulk_disposisi.indexOf(disposisi)
			this.state.bulk_disposisi.splice(index, 1)
		}
		console.log(this.state.bulk_disposisi)
	},

	arsipKodeSearch: function(){
		var _this = this
		React.findDOMNode(this.refs.keterangan_arsip).value = ""
		var arsip_value = React.findDOMNode(this.refs.kode_arsip).value
		if(arsip_value){
			$.getJSON("/arsip/kode/" + arsip_value, function(result){
				var res = []
				var i   = 1
				for(var a in result.list){
					result.list[a].nomor = i
					i ++
				}
				if(result.list){
					if(result.list.length > 0){
						_this.setState({arsip_result: result.list})
					}else{
						_this.setState({arsip_result: []})
					}
				}else{
					_this.setState({arsip_result: []})
				}
			})
		}else{
			this.setState({arsip_result: []})
		}
	},

	arsipKetSearch: function(){
		var _this = this
		React.findDOMNode(this.refs.kode_arsip).value = ""
		var arsip_value = React.findDOMNode(this.refs.keterangan_arsip).value
		if(arsip_value){
			$.getJSON("/arsip/keterangan/" + arsip_value, function(result){
				var res = []
				var i   = 1
				for(var a in result.list){
					result.list[a].nomor = i
					i ++
				}
				if(result.list){
					if(result.list.length > 0){
						_this.setState({arsip_result: result.list})
					}else{
						_this.setState({arsip_result: []})
					}
				}else{
					_this.setState({arsip_result: []})
				}
			})
		}else{
			this.setState({arsip_result: []})
		}
	},

	blurSearch: function(){
		this.setState({arsip_result: []})
		this.setState({item_index_selected: 0})
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var toggleWindow = ""
		}else{
			var toggleWindow = "hide"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn btn-primary btn-sm"
			var url          = "/suratmasuk/upload/" + this.props.selectedRows[0]
		}else{
			var showBtnFiles = "hide"
			var toggleWindow = "hide"
		}

		var arsipMode = "arsip-mode"
		var setTglTerimaMode = "hide"


		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_arsip", className: toggleWindow}, 
					React.createElement("div", {id: "window_form_arsip_handling"}), 
					React.createElement("div", {onClick: this.hideWindow, className: "btn-close"}, React.createElement("span", {className: "glyphicon glyphicon-remove"})), 

					React.createElement("div", {className: "form-arsip-container"}, 

						React.createElement("div", {className: arsipMode}, 
							React.createElement("div", {className: "arsip-search-row"}, 
								React.createElement("div", {className: "arsip-search-row-column2"}, 
									React.createElement("input", {className: "form-control input-sm", placeholder: "kode arsip", type: "text", ref: "kode_arsip", id: "kode_arsip", onChange: this.arsipKodeSearch, onFocus: this.arsipKodeSearch, onBlur: this.blurSearch})
								), 
								React.createElement("div", {className: "arsip-search-row-column8"}, 
									React.createElement("input", {className: "form-control input-sm", placeholder: "keterangan", type: "text", ref: "keterangan_arsip", id: "keterangan_arsip", onChange: this.arsipKetSearch, onFocus: this.arsipKetSearch, onBlur: this.blurSearch})
								)
							), 
							React.createElement("div", {className: "arsip-result-search", id: "arsip-result-search"}, 
								this.state.arsip_result.map(function(r){
									if(r.nomor == _this.state.item_index_selected){
										var _class = "arsip-result-search-item item_arsip_selected"
									}else{
										var _class = "arsip-result-search-item"
									}
									return(
										React.createElement("div", {className: _class}, 
											React.createElement("div", null, r.Kode_arsip), 
											React.createElement("div", null, r.Keterangan)
										)
									)
								})

							), 
							React.createElement("div", {className: "arsip-list"}, 
								this.state.list_arsip.map(function(r){
									var split   = r.waktu.split(" ")
									var _tgl    = split[0].split("-")
									var tanggal = _tgl[2] + "/" + _tgl[1] + "/" + _tgl[0]
									var jam     = split[1].split(".")[0].split(":")[0] + ":" + split[1].split(".")[0].split(":")[1]
									return(
										React.createElement("div", {className: "arsip-item card"}, 
											React.createElement("b", null, r.data.kode_arsip), React.createElement("br", null), 
											r.data.keterangan, React.createElement("br", null), 
											React.createElement("span", {className: "glyphicon glyphicon-user"}), " ", React.createElement("span", {className: "small-font"}, r.by_name), React.createElement("br", null), 
											React.createElement("span", {className: "glyphicon glyphicon-time"}), " ", React.createElement("span", {className: "small-font"}, tanggal, " ", jam), React.createElement("br", null), 
											React.createElement("button", {className: "btn btn-xs btn-warning", onClick: _this.removeArsip.bind(this, r)}, "Remove")
										)
									)
									/*
									return(
										<div className="arsip-list-container">
										{r.map(function(res){
											var split   = res.waktu.split(" ")
											var _tgl    = split[0].split("-")
											var tanggal = _tgl[2] + "/" + _tgl[1] + "/" + _tgl[0]
											var jam     = split[1].split(".")[0].split(":")[0] + ":" + split[1].split(".")[0].split(":")[1]
											return(
												<div className="arsip-item card">
													{res.id}<br/>
													<b>{res.data.kode_arsip}</b><br/>
													{res.data.keterangan}<br/>
													<span className="glyphicon glyphicon-user"></span>&nbsp;<span className="small-font">{res.by_name}</span><br/>
													<span className="glyphicon glyphicon-time"></span>&nbsp;<span className="small-font">{tanggal} {jam}</span><br/>
													<button className="btn btn-xs btn-warning" onClick={_this.removeArsip.bind(this, res)}>Remove</button>
												</div>
											)
										})}
										</div>
									)
									*/
								})
							)
						), 

						React.createElement("div", {className: setTglTerimaMode}, 
							React.createElement("button", {onClick: this.setTglTerima}, "SET")
						)
					)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("button", {onClick: this.toggleWindow, className: showBtnFiles}, 
						React.createElement("span", {className: "glyphicon glyphicon-book"}), " Arsip"
					)
				)
			)
		)
	}
})

var DocsTableNavigation = React.createClass({displayName: "DocsTableNavigation",

	prevPage: function(){
		var current_page_number = this.props.currentPageNumber
		var previous_page_number = current_page_number - 1
		if(previous_page_number > 0){
			this.props.getData(previous_page_number)
		}
	},

	nextPage: function(){
		var current_page_number = this.props.currentPageNumber
		var next_page_number = current_page_number + 1
		this.props.getData(next_page_number)
	},

	// selectChange: function(){
	// 	var current_page_number = React.findDOMNode(this.refs.page).value
	// 	this.props.getData(current_page_number)
	// },

	render: function(){

		var _this = this

		var start = ((this.props.currentPageNumber - 1) * 10) + 1
		var end   = this.props.currentPageNumber * 10
		if(end > this.props.docCount){
			end = this.props.docCount
		}

		var pageCount = Math.ceil(this.props.docCount / 10)
		var optionStart   = 1
		var bulk = []

		while(optionStart <= pageCount){
			bulk.push(optionStart)
			optionStart++
		}

		// <select onChange={this.selectChange} ref="page">
		// {bulk.map(function(d){
		// 	if(d == _this.props.currentPageNumber){
		// 		var selected = true
		// 	}else{
		// 		var selected = false
		// 	}
		// 	return(
		// 			<option selected={selected} value={d}>{d}</option>
		// 		)
		// 	})
		// }
		// </select>

		// <button type="button" className="btn btn-default btn-xs">{start} - {end} dari {this.props.docCount}</button>&nbsp;

		return(
			React.createElement("div", null, 
				React.createElement("font", null, start, " - ", end, " dari ", this.props.docCount), "  ", 
				React.createElement("button", {type: "button", className: "btn btn-default btn-xs", onClick: this.prevPage}, "Prev"), " ", 
				React.createElement("button", {type: "button", className: "btn btn-default btn-xs"}, this.props.currentPageNumber), " ", 
				React.createElement("button", {type: "button", className: "btn btn-default btn-xs", onClick: this.nextPage}, "Next")
			)
		)
	}
})

var DocsTable = React.createClass({displayName: "DocsTable",

	getInitialState: function(){
		return {
			x_coor : 0,
			y_coor : 0
		}
	},

	toggleSelectRow: function(doc_series){

		if(this.props.lockRows == false){
			var prevState = this.props.selectedRows

			if ($.inArray(doc_series, prevState) == -1){
				prevState.push(doc_series)
			}
			else{
				var doc_series_index = prevState.indexOf(doc_series)
				prevState.splice(doc_series_index, 1)
			}
			this.props.setSelectedRows(prevState)
		}
	},

	doSelectAllRow: function(doc_series){
		if(this.props.lockRows == false){
			var prevState = this.props.selectedRows
			if ($.inArray(doc_series, prevState) == -1){
				prevState.push(doc_series)
			}
			this.props.setSelectedRows(prevState)
		}
	},

	doUnSelectAllRow: function(doc_series){
		if(this.props.lockRows == false){
			var prevState = this.props.selectedRows
			if ($.inArray(doc_series, prevState) == -1){

			}else{
				var doc_series_index = prevState.indexOf(doc_series)
				prevState.splice(doc_series_index, 1)
			}
			this.props.setSelectedRows(prevState)
		}
	},

	toggleSelectAllRows: function(){
		var is_checked = React.findDOMNode(this.refs.select_all).checked
		var all_rows = this.props.allRows
		for(var a in all_rows){
			var doc_series = all_rows[a]
			if(is_checked){
				this.doSelectAllRow(doc_series)
			}else{
				this.doUnSelectAllRow(doc_series)
			}
		}
	},

	selectAllChecker: function(){
		var is_checked    = true
		var all_rows      = this.props.allRows
		var selected_rows = this.props.selectedRows
		for(var a in all_rows){
			if($.inArray(all_rows[a], selected_rows) == -1){
				is_checked = false
			}
		}
		return is_checked
	},

	render: function(){

		var _this 			= this
		var _is_select_all  = this.selectAllChecker()

		return(
			React.createElement("div", null, 
				React.createElement("table", {className: "table table-striped table-condensed", style: {fontSize:"12px",width:"100%"}}, 
					React.createElement("thead", null, 
						React.createElement("th", {className: "docs-table", style: {width: "20px"}}, React.createElement("input", {type: "checkbox", onClick: this.toggleSelectAllRows, ref: "select_all", checked: _is_select_all})), 
						React.createElement("th", {className: "docs-table", style: {width: "185px"}}, "Tujuan"), 
						React.createElement("th", {className: "docs-table text-nowrap", style: {width: "100px"}}, "Nomor"), 
						React.createElement("th", {className: "docs-table", style: {width: "75px"}}, "Tanggal"), 
						React.createElement("th", {className: "docs-table"}, "Perihal"), 
						React.createElement("th", {className: "docs-table", style: {width: "75px"}}, "Tembusan"), 
						React.createElement("th", {className: "docs-table", style: {width: "75px"}}, "Kode", React.createElement("br", null), "Penunjuk"), 
						React.createElement("th", {className: "docs-table", style: {width: "75px"}}, "Person", React.createElement("br", null), "In Charge"), 
						React.createElement("th", {className: "docs-table", style: {width: "50px"}}, "Files")
					), 
					React.createElement("tbody", null, 

						this.props.docList.map(function(res){

							if($.inArray(res.doc_series, _this.props.selectedRows) == -1){
								var class_name = ""
								var checked = false
							}else{
								var class_name = "selected"
								var checked = true
							}

							return(
								React.createElement("tr", {
								onClick: _this.toggleSelectRow.bind(this, res.doc_series), 
								className: class_name}, 
									React.createElement("td", null, React.createElement("input", {type: "checkbox", checked: checked})), 
									React.createElement("td", null, res.tujuan_skl), 
									React.createElement("td", null, res.jenis_skl, "-", res.nomor_skl, res.kode_skl, res.tahun_skl), 
									React.createElement("td", null, res.tanggal_skl), 
									React.createElement("td", null, res.perihal_skl), 
									React.createElement("td", null, res.tembusan_skl), 
									React.createElement("td", {style: {textAlign: "center"}}, res.kode_penunjuk), 
									React.createElement("td", null, res.tag.map(function(data){
										var title = data.to_namajabatan + "\n" + data.to_nama + ""
										var _color = data.badge_color
										var _class = "glyphicon glyphicon-user"
										return(
											React.createElement("div", {style: {float:"left",marginRight:"2px"}}, 
												React.createElement("span", {className: _class, title: title, style: {color: _color}})
											)
											)
										})
									), 
									React.createElement("td", null, res.files.map(function(file){
										var path = "/files/" + file.nama_file
										return(
											React.createElement("a", {href: path, target: "_new"}, 
												React.createElement("span", {className: "glyphicon glyphicon-pushpin"})
											)
											)
										})
									)
								)
							)
						})
					)
				)
			)
		)
	}
})

var NotificationBar = React.createClass({displayName: "NotificationBar",
	render: function(){
		if(this.props.notification_show){
			var _class = "notification-bar-show"
		}else{
			var _class = "hide"
		}
		return(
			React.createElement("div", {className: _class}, this.props.notification_msg)
		)
	}
})

var App = React.createClass({displayName: "App",

	getInitialState: function(){
		return {
			current_page_number : 1,
			my_kodejabatan      : "",
			my_namajabatan      : "",
			my_nama      		: "",
			doc_list            : [],
			doc_count           : 0,
			jabatan_list        : [],
			selected_rows       : [],
			all_rows            : [],
			lock_rows           : false,
			notification_show   : false,
			notification_msg    : ""
		}
	},

	componentDidMount: function(){
		this.getListJabatan()
		this.getData(this.state.current_page_number)
	},

	setLockRows: function(value){
		this.setState({lock_rows: value})
	},

	setNotification: function(value){
		this.setState({notification_show: value})
	},

	setNotificationMsg: function(value){
		this.setState({notification_msg: value})
	},

	setCurrentPageNumber: function(value){
		this.setState({current_page_number: value})
	},

	setMyKodeJabatan: function(value){
		this.setState({my_kodejabatan: value})
	},

	setMyNamaJabatan: function(value){
		this.setState({my_namajabatan: value})
	},

	setMyNama: function(value){
		this.setState({my_nama: value})
	},

	setDocList: function(list){
		this.setState({doc_list: list})
	},

	setSelectedRows: function(list){
		this.setState({selected_rows: list})
	},

	setAllRows: function(list){
		this.setState({all_rows: list})
	},

	getListJabatan: function(){
		var _this = this
		var url   = "/jabatan/list"
		$.getJSON(url, function(result){
			_this.setState({jabatan_list: result.listjabatan})
		})
	},

	getDataSearch: function(page){
		var _this = this
		var url = "/suratkeluar/page/" + page
		$.getJSON(url, function(result){
			if(result.listsurat){
				_this.setDocList(result.listsurat)
				_this.setMyKodeJabatan(result.my_kodejabatan)
				_this.setCurrentPageNumber(page)
		    }else{
		    	var empty = []
		    	_this.setDocList(empty)
				_this.setCurrentPageNumber(page)
		    }
		    _this.setState({doc_count: result.count})
		})
	},

	getData: function(page){
		var _this = this
		var url = "/suratkeluar/page/" + page
		$.getJSON(url, function(result){
			if(result.listsurat){
				_this.setDocList(result.listsurat)
				_this.setMyKodeJabatan(result.my_kodejabatan)
				_this.setMyNamaJabatan(result.my_namajabatan)
				_this.setMyNama(result.my_nama)
				_this.setCurrentPageNumber(page)
				_this.setState({doc_count: result.count})
				_this.create_all_rows(result.listsurat)
		    }
		})
	},

	tanggalFactory: function(tanggal_panjang){

		var _tgl = ""
		if(tanggal_panjang || tanggal_panjang != undefined){
			_tgl = tanggal_panjang.split(" ")[0].split("-")
			if(_tgl.length == 3){
				_tgl = _tgl[2] + "/" + _tgl[1] + "/" + _tgl[0]
			}
		}else{
			_tgl = "-"
		}
		return _tgl
	},

	nomorAgendaFactory: function(nomor_agenda){

		var _nomor_agenda = ""
		if(nomor_agenda){
			_nomor_agenda = ("00000" + nomor_agenda).slice(-5)
		}else{
			_nomor_agenda = "-"
		}
		return _nomor_agenda
	},

	badgeFactory: function(tags, lib_badge, data_list){

		var _badge = {}
		var _badge_color = {}
		for(var a in lib_badge){
			var kode_jabatan     		= lib_badge[a].kode_jabatan
			var badge            		= lib_badge[a].badge
			var badge_color		 		= lib_badge[a].badge_color
			_badge[kode_jabatan] 		= badge
			_badge_color[kode_jabatan] 	= badge_color
		}

		var result = []
		for(var a in tags){
			var _obj 	        = {}
			var kode_jabatan    = tags[a]
			var the_badge       = _badge[kode_jabatan]
			var the_badge_color = _badge_color[kode_jabatan]
			_obj.badge          = the_badge
			_obj.badge_color    = the_badge_color
			_obj.nama 	        = data_list.Tag[kode_jabatan].to_nama
			_obj.nama_jabatan   = data_list.Tag[kode_jabatan].to_namajabatan
			result.push(_obj)
		}

		return result
	},

	create_all_rows: function(listsurat){
		var _all_rows     = []
		for(var a in listsurat){
			var doc_series = listsurat[a].doc_series
			_all_rows.push(doc_series)
		}
		this.setAllRows(_all_rows)
	},

	listFactory: function(data){

		var theList 	  = data.listsurat
		var _result       = []
		var kode_jabatan  = data.my_kodejabatan
		var badge_jabatan = this.state.jabatan_list
		var _all_rows     = []

		for(var a in theList){

			console.log(theList[a])

			var _obj          	   = {}
			var doc_series    	   = theList[a].Doc_series

			var tanggal_surat      = theList[a].Tanggal_skl
			var jenis_skl          = theList[a].Jenis_skl
			var nomor_skl          = theList[a].Nomor_skl
			var kode_skl           = theList[a].Kode_skl
			var tahun_skl          = theList[a].Tahun_skl
			var hal           	   = theList[a].Perihal_skl
			var files          	   = theList[a].Files
			var tujuan             = theList[a].Tujuan_skl

			/*
			var nomor          	   = theList[a].Nomor
			var tanggal_surat  	   = this.tanggalFactory( theList[a].Tanggal )
			var nomor_agenda  	   = this.nomorAgendaFactory( theList[a].Tag[kode_jabatan].to_nomoragenda )
			var tgl_disposisi 	   = this.tanggalFactory( theList[a].Tag[kode_jabatan].createdby_time )
			var tgl_terima    	   = this.tanggalFactory( theList[a].Tag[kode_jabatan].to_tanggalditerima )
			*/

			var badge              = this.badgeFactory(Object.keys(theList[a].Tag), badge_jabatan, theList[a])

			_obj['Kode_jabatan'] 		   = kode_jabatan
			_obj['Doc_series'] 		 	   = doc_series

			_obj['Jenis_skl'] 		 	   = jenis_skl
			_obj['Nomor_skl'] 		 	   = nomor_skl
			_obj['Kode_skl'] 		 	   = kode_skl
			_obj['Tahun_skl'] 		 	   = tahun_skl

			_obj['Tanggal']		 		   = tanggal_surat
			_obj['Files'] 		 		   = files
			_obj['Hal'] 		 		   = hal
			_obj['Tujuan'] 		 		   = tujuan


			/*
			_obj['Nomor'] 		 		   = nomor
			_obj['Nomor_agenda'] 		   = nomor_agenda
			_obj['Tanggal_disposisi']	   = tgl_disposisi
			_obj['Tanggal_terima']	       = tgl_terima
			*/

			_obj['Tags']		 		   = badge

			_all_rows.push(doc_series)
			_result.push(_obj)
		}

		this.setAllRows(_all_rows)
		return _result
	},

	render: function(){
		return(
			React.createElement("div", {className: "container"}, 

				React.createElement(NotificationBar, {
				 notification_show: this.state.notification_show, 
				 notification_msg: this.state.notification_msg, 
				 setNotification: this.setNotification, 
				 setNotificationMsg: this.setNotificationMsg}), 

				React.createElement("div", {className: "header"}, 
					React.createElement(Header, {
					nama: this.state.my_nama, 
					namaJabatan: this.state.my_namajabatan})
				), 

				React.createElement("div", {className: "docs-table"}, 

					React.createElement(DocsTable, {
						allRows: this.state.all_rows, 
						docList: this.state.doc_list, 
						lockRows: this.state.lock_rows, 
						selectedRows: this.state.selected_rows, 
						setSelectedRows: this.setSelectedRows})
				), 

				React.createElement("div", {className: "docs-table-navigation"}, 

					React.createElement(DocsTableNavigation, {
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						jabatanList: this.state.jabatan_list, 
						docCount: this.state.doc_count, 
						setCurrentPageNumber: this.setCurrentPageNumber, 
						setMyKodeJabatan: this.setMyKodeJabatan, 
						setDocList: this.setDocList, 
						setAllRows: this.setAllRows})
				), 

				React.createElement("div", {className: "menu"}, 

					React.createElement(WindowFormInput, {
						getData: this.getData, 
						currentPageNumber: this.state.current_page_number, 
						jabatanList: this.state.jabatan_list, 
						setCurrentPageNumber: this.setCurrentPageNumber, 
						setDocList: this.setDocList, 
						setAllRows: this.setAllRows, 
						setNotification: this.setNotification, 
						setNotificationMsg: this.setNotificationMsg}), 

					React.createElement(WindowFormEdit, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						jabatanList: this.state.jabatan_list, 
						lockRows: this.state.lock_rows, 
						selectedRows: this.state.selected_rows, 
						setAllRows: this.setAllRows, 
						setCurrentPageNumber: this.setCurrentPageNumber, 
						setDocList: this.setDocList, 
						setLockRows: this.setLockRows}), 

					React.createElement(WindowFiles, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						lockRows: this.state.lock_rows, 
						selectedRows: this.state.selected_rows, 
						setLockRows: this.setLockRows}), 

					React.createElement(WindowArsip, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						myKodeJabatan: this.state.my_kodejabatan, 
						lockRows: this.state.lock_rows, 
						selectedRows: this.state.selected_rows, 
						setLockRows: this.setLockRows}), 

					React.createElement(WindowFormSearch, {
						getDataSearch: this.getDataSearch, 
						currentPageNumber: this.state.current_page_number, 
						setCurrentPageNumber: this.setCurrentPageNumber})

				)
			)
		)
	}
})

React.render(React.createElement(App, null), document.body);