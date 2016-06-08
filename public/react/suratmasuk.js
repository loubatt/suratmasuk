var Header = React.createClass({displayName: "Header",
	render: function(){
		return(
			React.createElement("nav", {className: "white black-text"}, 
							React.createElement("div", {className: "nav-wrapper"}, 
									React.createElement("span", {className: "login-info"}, 
										React.createElement("b", null, React.createElement("font", {className: "black-text darken-3"}, this.props.nama)), 
										React.createElement("font", {className: "black-text darken-3"}, " ", this.props.namaJabatan)
									), 
									React.createElement("ul", {id: "nav-mobile", className: "right hide-on-med-and-down"}, 
										React.createElement("li", null, React.createElement("a", {href: "/suratkeluar", className: "blue-text"}, "Surat keluar")), 
										React.createElement("li", null, React.createElement("a", {href: "/logout", className: "blue-text"}, "Logout"))
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
			search_nomoragenda  : "",
			search_waktuterimasurat 		: "",
			search_waktuterimasurat	: "",
			search_asal 		: "",
			search_nomorsurat	: "",
			search_tanggalsurat	: "",
			search_hal  		: "",
			search_kodejabatan 	: "",
			list_tanggal  		: [],
			list_bulan  		: [],
			list_tahun  		: []
		}
	},

	clearSearch: function(){

		var _this = this

		React.findDOMNode(this.refs.nomor_agenda).value      = ""
		React.findDOMNode(this.refs.waktuterima_surat).value = ""
		React.findDOMNode(this.refs.asal_surat).value        = ""
		React.findDOMNode(this.refs.nomor_surat).value 		 = ""
		React.findDOMNode(this.refs.tanggal_surat).value 	 = ""
		React.findDOMNode(this.refs.hal_surat).value  		 = ""
		React.findDOMNode(this.refs.kode_jabatan).value  	 = ""

		this.setState({search_nomoragenda		: ""})
		this.setState({search_waktuterimasurat	: ""})
		this.setState({search_asal				: ""})
		this.setState({search_nomorsurat		: ""})
		this.setState({search_tanggalsurat		: ""})
		this.setState({search_hal 				: ""})
		this.setState({search_kodejabatan 		: ""})

		var url = "/suratmasuk/search/clear"
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
		var url           = '/suratmasuk/search'

		var nomor_agenda 	  = React.findDOMNode(this.refs.nomor_agenda)
		var waktuterima_surat = React.findDOMNode(this.refs.waktuterima_surat)
		var asal_surat    = React.findDOMNode(this.refs.asal_surat)
		var nomor_surat   = React.findDOMNode(this.refs.nomor_surat)
		var tanggal_surat = React.findDOMNode(this.refs.tanggal_surat)
		var hal_surat     = React.findDOMNode(this.refs.hal_surat)
		var kode_jabatan  = React.findDOMNode(this.refs.kode_jabatan)

		data.nomor_agenda  = nomor_agenda.value
		data.waktuterima_surat = waktuterima_surat.value
		data.asal 		   = asal_surat.value
		data.nomor_surat   = nomor_surat.value
		data.tanggal_surat = tanggal_surat.value
		data.hal  		   = hal_surat.value
		data.kode_jabatan  = kode_jabatan.value

		this.setState({search_nomoragenda: nomor_agenda.value})
		this.setState({search_waktuterimasurat: waktuterima_surat.value})
		this.setState({search_asal: asal_surat.value})
		this.setState({search_nomorsurat: nomor_surat.value})
		this.setState({search_tanggalsurat: tanggal_surat.value})
		this.setState({search_hal: hal_surat.value})
		this.setState({search_kodejabatan: kode_jabatan.value})

		$.post(url, data, function(res){
			if(res.result == "OK"){
				_this.props.setCurrentPageNumber(1)
				_this.props.getDataSearch(_this.props.currentPageNumber)
			}
		})
	},

	componentWillMount: function(){
		var _this = this

		var url   = "/suratmasuk/search/getvalue"

		$.getJSON(url, function(res){

			_this.setState({search_nomoragenda: res['search-nomoragenda']})
			_this.setState({search_waktuterimasurat: res['search-waktuterimasurat']})
			_this.setState({search_asal: res['search-asal']})
			_this.setState({search_nomorsurat: res['search-nomorsurat']})
			_this.setState({search_tanggalsurat: res['search-tanggalsurat']})
			_this.setState({search_hal: res['search-hal']})
			_this.setState({search_kodejabatan: res['search-kodejabatan']})

			React.findDOMNode(_this.refs.nomor_agenda).value = res['search-nomoragenda']
			React.findDOMNode(_this.refs.waktuterima_surat).value = res['search-waktuterimasurat']
			React.findDOMNode(_this.refs.asal_surat).value = res['search-asal']
			React.findDOMNode(_this.refs.nomor_surat).value = res['search-nomorsurat']
			React.findDOMNode(_this.refs.tanggal_surat).value = res['search-tanggalsurat']
			React.findDOMNode(_this.refs.hal_surat).value = res['search-hal']
			React.findDOMNode(_this.refs.kode_jabatan).value = res['search-kodejabatan']
		})

		var url2  = "/suratmasuk/search/form/getvars"
		$.getJSON(url2, function(res){
			_this.setState({list_tanggal : res.list_tanggal})
			_this.setState({list_bulan   : res.list_bulan})
			_this.setState({list_tahun   : res.list_tahun})
		})
	},

	componentDidMount: function(){
		$('.modal-trigger2').leanModal({
			ready: function(){
				// pass
			}
		});
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
			var class_name = "modal modal-fixed-footer"
		}else{
			var class_name = "modal modal-fixed-footer"
		}

		if(this.state.search_nomoragenda || this.state.search_waktuterimasurat || this.state.search_asal || this.state.search_nomorsurat || this.state.search_hal || this.state.search_tanggalsurat || this.state.search_kodejabatan){
			var search_is_on_style = "btn-floating waves-effect waves-light red modal-trigger2 tooltipped"
		}else{
			var search_is_on_style = "btn-floating waves-effect waves-light blue darken-2 modal-trigger2 tooltipped"
		}

		return (
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_search", className: class_name}, 
					React.createElement("div", {className: "modal-content"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "nomor_agenda", ref: "nomor_agenda"}), 
									React.createElement("label", {for: "nomor_agenda"}, "Nomor Agenda")
								)
							), 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", className: "tooltipped", "data-position": "bottom", "data-tooltip": "Format: YYYY-MM-DD", type: "text", id: "waktuterima_surat", ref: "waktuterima_surat"}), 
									React.createElement("label", {for: "waktuterima_surat"}, "Tgl. Terima")
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s12"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "asal_surat", ref: "asal_surat"}), 
									React.createElement("label", {for: "asal_surat"}, "Asal")
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s8"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "nomor_surat", ref: "nomor_surat"}), 
									React.createElement("label", {for: "asal_surat"}, "Nomor Surat")
								)
							), 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", className: "tooltipped", "data-position": "bottom", "data-tooltip": "Format: YYYY-MM-DD", type: "text", id: "tanggal_surat", ref: "tanggal_surat"}), 
									React.createElement("label", {for: "tanggal_surat"}, "Tgl. Surat")
								)
							)

						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s8"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("textarea", {placeholder: "", id: "hal_surat", className: "materialize-textarea", ref: "hal_surat"}), 
									React.createElement("label", {for: "hal_surat"}, "Hal Surat")
								)
							), 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", className: "tooltipped", "data-position": "bottom", "data-tooltip": "Masukkan kode jabatan", id: "kode_jabatan", ref: "kode_jabatan"}), 
									React.createElement("label", {for: "kode_jabatan"}, "Disposisi Ke")
								)
							)
						)
					), 
					React.createElement("div", {className: "modal-footer"}, 
					React.createElement("button", {	className: "btn yellow darken-4", onClick: this.clearSearch}, "Clear"), 
						React.createElement("a", {className: "btn light-green accent-4", style: {marginRight:"2px"}, onClick: this.post}, "Cari")
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: search_is_on_style, "data-position": "top", "data-tooltip": "Cari Surat", "data-delay": "5", onClick: this.toggleWindow, "data-target": "window_form_search"}, React.createElement("i", {className: "material-icons"}, "search"))
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
			var showBtnPrint = "btn-floating waves-effect waves-light blue darken-2 tooltipped"
		}else{
			var showBtnPrint = "hide tooltipped"
		}

		return (
			React.createElement("div", {className: "menu-button"}, 
				React.createElement("a", {className: showBtnPrint, "data-position": "top", "data-delay": "10", "data-tooltip": "Cetak Disposisi", onClick: this.createPDF}, React.createElement("i", {className: "material-icons"}, "print"))
			)
		)
	}
})

var WindowFormInput = React.createClass({displayName: "WindowFormInput",

	getInitialState: function(){
		return {
			show_status: false,
			suggest_data: [],
			suggest_data_length: 0,
			item_index_selected: 0
		}
	},

	post: function(){
		var _this = this
		var url              = '/suratmasuk/input'
		var tanggal_diterima = React.findDOMNode(this.refs.tanggal_diterima)
		var asal_surat    = React.findDOMNode(this.refs.asal_surat)
		var nomor_surat   = React.findDOMNode(this.refs.nomor_surat)
		var tanggal_surat = React.findDOMNode(this.refs.tanggal_surat)
		var hal_surat     = React.findDOMNode(this.refs.hal_surat)
		var data  = {}

		data.tanggal_diterima = tanggal_diterima.value
		data.asal 		      = asal_surat.value
		data.nomor            = nomor_surat.value
		data.hal  		      = hal_surat.value
		data.tanggal          = tanggal_surat.value

		$.post(url, data, function(result){
			_this.props.getData(_this.props.currentPageNumber)
			Materialize.toast(data.nomor + ' dari ' + data.asal, 3000, 'rounded')
			// tanggal_diterima.value    = ""
			// asal_surat.value    = ""
			// nomor_surat.value   = ""
			// tanggal_surat.value = ""
			// hal_surat.value     = ""
		})
	},

	apply_result: function(){
		var item_index_selected = this.state.item_index_selected - 1
		var suggest             = this.state.suggest_data
		var data 				= suggest[item_index_selected]
		React.findDOMNode(this.refs.asal_surat).value       = data.word
		this.setState({suggest_data: []})
		this.setState({item_index_selected: 0})
	},

	autoCompleteNavigate: function(e){

		var result_length = this.state.suggest_data.length
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
			this.setState({suggest_data_length: result_length})
		}else{
			// console.log("No Result")
			this.setState({suggest_data_length: 0})
		}
		// console.log(this.state.item_index_selected)
	},

	suggest: function(){
		var _this = this
		var asal_surat = React.findDOMNode(this.refs.asal_surat).value
		if(asal_surat){
			$.getJSON("/suratmasuk/suggest/" + asal_surat, function(result){
				var res = []
				var i   = 1
				for(var a in result.result){
					result.result[a].nomor = i
					i ++
				}
				if(result.result){
					if(result.result.length > 0){
						_this.setState({suggest_data: result.result})
					}else{
						_this.setState({suggest_data: []})
					}
				}else{
					_this.setState({suggest_data: []})
				}
			})
		}else{
			this.setState({suggest_data: []})
		}
	},

	componentDidMount: function(){
		// $("#window_form_input").draggable({
		// 	handle: $("div#window_form_input_handling"),
		// 	cursor: "pointer",
		// 	zIndex: 100
		// })
		$('.datepicker').pickadate({
		  labelMonthNext: 'Next month',
		  labelMonthPrev: 'Previous month',
		  labelMonthSelect: 'Select a month',
		  labelYearSelect: 'Select a year',
		  monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
		  monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		  weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
		  weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		  weekdaysLetter: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
		  today: '',
		  clear: 'Clear',
		  close: '',
		  format: 'dd/mm/yyyy'
		  // closeOnSelect: true
		});
		$('.datepicker2').datepicker({
		    format: 'dd/mm/yyyy',
		    autoclose: true,
		    todayHighlight: true
		})

		var _this = this
		$('.asal_surat').on('keydown', function (e) {
			_this.autoCompleteNavigate(e)
		});

		$('.modal-trigger').leanModal({
			ready: function(){
				$("#tanggal_diterima").focus()
			}
		});

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

	blurSuggest: function(){
		this.setState({suggest_data: []})
		this.setState({item_index_selected: 0})
	},

	render: function(){

		var _this = this

		if(this.state.show_status){
			var class_name = "modal modal-fixed-footer"
		}else{
			var class_name = "modal modal-fixed-footer"
		}

		// Show or Hide suggest
		if(this.state.suggest_data.length > 0){
			var suggest_class = "suggest z-depth-1"
		}else{
			var suggest_class = "hide"
		}

		return (
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_input", className: class_name}, 
					React.createElement("div", {className: "modal-content"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", id: "tanggal_diterima", type: "date", className: "datepicker", ref: "tanggal_diterima"}), 
		          		React.createElement("label", {for: "tanggal_diterima"}, "Tanggal Diterima")
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s12"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", id: "asal_surat", type: "text", className: "asal_surat", ref: "asal_surat", onChange: this.suggest, onBlur: this.blurSuggest}), 
		          		React.createElement("label", {for: "asal_surat"}, "Asal Surat"), 
					        React.createElement("div", {className: suggest_class, id: "arsip-result-search"}, 
										this.state.suggest_data.map(function(r){
											if(r.nomor == _this.state.item_index_selected){
												var _class = "arsip-result-search-item item_arsip_selected"
											}else{
												var _class = "arsip-result-search-item"
											}
											return(
												React.createElement("div", {className: _class}, 
													React.createElement("div", null, r.word)
												)
											)
										})
									)
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s8"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", id: "nomor_surat", type: "text", ref: "nomor_surat"}), 
		          		React.createElement("label", {for: "nomor_surat"}, "Nomor Surat")
								)
							), 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", id: "tanggal_surat", type: "date", className: "datepicker", ref: "tanggal_surat"}), 
		          		React.createElement("label", {for: "tanggal_surat"}, "Tanggal Surat")
								)
							)
						), 
						React.createElement("div", {className: "input-field"}, 
							React.createElement("textarea", {placeholder: "", id: "hal_surat", className: "materialize-textarea", ref: "hal_surat"}), 
    					React.createElement("label", {for: "hal_surat"}, "Hal Surat")
						)
					), 
					React.createElement("div", {className: "modal-footer"}, 
						React.createElement("button", {	className: "btn light-green accent-4", onClick: this.post}, "Simpan")
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {"data-target": "window_form_input", className: "btn-floating waves-effect waves-light blue darken-2 modal-trigger tooltipped", "data-position": "top", "data-delay": "10", "data-tooltip": "Input"}, 
						React.createElement("i", {className: "material-icons"}, "add")
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
		var Asal 		= React.findDOMNode(this.refs.asal_surat).value
		var Tanggal     = React.findDOMNode(this.refs.tanggal_surat).value
		var Nomor       = React.findDOMNode(this.refs.nomor_surat).value
		var Hal  		= React.findDOMNode(this.refs.hal_surat).value
		var url  		= "/suratmasuk/edit/" + Doc_series
		var data 		= {}

		data.asal  		= Asal
		data.tanggal    = Tanggal
		data.nomor      = Nomor
		data.hal    	= Hal

		$.post(url, data, function(res){
			if(res.result == 'OK'){
				_this.setState({show_status: false})
				_this.props.setLockRows(false)
				_this.props.getData(_this.props.currentPageNumber)
			}
		})
	},

	componentDidMount: function(){
		var _this = this
		$('.modal-trigger3').leanModal({
			ready: function(){
				_this.getData()
			}
		});
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
		var url = "/suratmasuk/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){
			React.findDOMNode(_this.refs.asal_surat).value = res.datasurat.asal
			React.findDOMNode(_this.refs.nomor_surat).value = res.datasurat.nomor
			React.findDOMNode(_this.refs.tanggal_surat).value = _this.tanggalFormatterToIndonesian( res.datasurat.tanggal )
			React.findDOMNode(_this.refs.hal_surat).value = res.datasurat.hal
			$("#asal_surat").trigger("click")
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
			var toggleWindow = "modal modal-fixed-footer"
		}else{
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.needShowBtnEdit()){
			var showBtnEdit  = "btn-floating waves-effect waves-light blue darken-2 modal-trigger3 tooltipped"
		}else{
			var showBtnEdit  = "hide modal-trigger3 tooltipped"
			var toggleWindow = "modal modal-fixed-footer"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_edit", className: toggleWindow}, 
					React.createElement("div", {className: "modal-content"}, 
						React.createElement("input", {type: "hidden", ref: "Doc_series"}), React.createElement("br", null), 

						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s12"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "asal_surat", ref: "asal_surat"}), 
									React.createElement("label", {for: "asal_surat"}, "Asal Surat")
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s8"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "nomor_surat", ref: "nomor_surat"}), 
									React.createElement("label", {for: "nomor_surat"}, "Nomor Surat")
								)
							), 
							React.createElement("div", {className: "col s4"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("input", {placeholder: "", type: "text", id: "tanggal_surat", ref: "tanggal_surat"}), 
									React.createElement("label", {for: "tanggal_surat"}, "Tanggal Surat")
								)
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col s12"}, 
								React.createElement("div", {className: "input-field"}, 
									React.createElement("textarea", {placeholder: "", id: "hal_surat", className: "materialize-textarea", ref: "hal_surat"}), 
									React.createElement("label", {for: "hal_surat"}, "Hal Surat")
								)
							)
						)
					), 
					React.createElement("div", {className: "modal-footer"}, 
						React.createElement("button", {	className: "btn light-green accent-4", onClick: this.post}, "Edit")
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: showBtnEdit, "data-position": "top", "data-delay": "10", "data-tooltip": "Edit", "data-target": "window_form_edit"}, React.createElement("i", {className: "material-icons"}, "mode_edit"))
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
		// console.log(this.props.getOpenList())
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
					React.createElement("span", {className: icon}), 
					React.createElement("span", {style: {fontWeight:"bold"}}, " ", this.props.data.to_nama), " ", 
					React.createElement("span", null, this.props.data.to_namajabatan)
				), 
				React.createElement("div", {style: {display: show}}, 
					React.createElement("span", null, "Atasan"), React.createElement("span", null, ":"), React.createElement("span", null, this.props.data.createdby_nama, " (", this.props.data.createdby_namajabatan, ")"), React.createElement("br", null), 
					React.createElement("span", null, "Tgl. Disposisi Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.createdby_time), React.createElement("br", null), 
					React.createElement("span", null, "Nomor Agenda"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_nomoragenda), React.createElement("br", null), 
					React.createElement("span", null, "Tgl. Diterima"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_tanggalditerima), React.createElement("br", null), 
					React.createElement("span", null, "Isi Disposisi Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_disposisi), React.createElement("br", null), 
					React.createElement("span", null, "Catatan Atasan"), " ", React.createElement("span", null, ":"), " ", React.createElement("span", null, this.props.data.to_catatan), React.createElement("br", null)
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
		var _this = this
		$('.modal-trigger7').leanModal({
			ready: function(){
				_this.getData()
			}
		});
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
			list.push(tags[a])
		}

		list.sort(function(a, b){
			var nameA=a.to_kodejabatan.toLowerCase(), nameB=b.to_kodejabatan.toLowerCase()
		  if (nameA < nameB) //sort string ascending
		   return -1
		  if (nameA > nameB)
		   return 1
		  return 0 //default return value (no sorting)
		})

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
			// this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				// this.props.setLockRows(true)
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
			var toggleWindow = "modal modal-fixed-footer"
		}else{
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.needShowBtnEdit()){
			var showBtnEdit  = "btn-floating waves-effect waves-light blue darken-2 modal-trigger7 tooltipped"
		}else{
			var showBtnEdit  = "hide modal-trigger7 tooltipped"
			var toggleWindow = "modal modal-fixed-footer"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_detail", className: toggleWindow}, 
					React.createElement("div", {className: "modal-content"}, 
						React.createElement("div", {className: "row"}, 
					    React.createElement("div", {className: "col s12"}, 
					      React.createElement("ul", {className: "tabs"}, 
					        React.createElement("li", {className: "tab col s3"}, React.createElement("a", {href: "#detail_surat"}, "Surat")), 
					        React.createElement("li", {className: "tab col s3"}, React.createElement("a", {className: "active", href: "#detail_pic"}, "Disposisi"))
					      )
					    ), 
					    React.createElement("div", {id: "detail_surat", className: "col s12"}, 
								React.createElement("div", {className: "form-detail-surat"}, 
									React.createElement("span", {className: "form-field-label"}, "Asal Surat  "), 
									React.createElement("input", {className: "full-row form-control", type: "text", ref: "asal_surat"}), 
									React.createElement("span", {className: "form-field-label"}, "Nomor Surat  "), 
									React.createElement("input", {className: "full-row form-control", type: "text", ref: "nomor_surat"}), 
									React.createElement("span", {className: "form-field-label"}, "Tanggal Surat  "), 
									React.createElement("input", {className: "full-row datepicker form-control", type: "text", ref: "tanggal_surat"}), 
									React.createElement("span", {className: "form-field-label"}, "Hal Surat  "), 
									React.createElement("textarea", {className: "full-row form-control", type: "text", ref: "hal_surat"})
								)
							), 
					    React.createElement("div", {id: "detail_pic", className: "col s12"}, 
								React.createElement("ul", {className: "collection"}, 
									this.state.tags.map(function(data){
										return(
											React.createElement("li", {className: "collection-item"}, React.createElement(DetailItem, {
												data: data, 
												getOpenList: _this.getOpenList, 
												toggleSubItem: _this.toggleSubItem}))
										)
									})
								)
							)
				  	)
					), 
					React.createElement("div", {className: "modal-footer"}
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: showBtnEdit, "data-position": "top", "data-tooltip": "Lihat detail", "data-delay": "10", onClick: this.toggleWindow, "data-target": "window_form_detail"}, React.createElement("i", {className: "material-icons"}, "description"))
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

		$('#upload-form').ajaxForm({
	        beforeSend: function() {
	            $("#upload-button").val("Upload")
	        },
	        uploadProgress: function(event, position, total, percentComplete) {
	            var persen = percentComplete + "%"
	            $("#upload-button").val(persen)
							$("#upload-loading-progress").css("width",persen)
	        },
	        success: function() {
	        	$("#upload-button").val("Success")
	        },
	        complete: function(xhr) {
	        	$("#upload-button").val("Completed")
						$("#upload-loading-progress").css("width","0%")
						Materialize.toast("Upload berhasil !", 3000, 'rounded')
	        	_this.props.getData(_this.props.currentPageNumber)
	        }
    	});

			$('.modal-trigger6').leanModal({
				ready: function(){
					// _this.getData()
				}
			});

	},

	toggleWindow: function(){

		if(this.state.show_status){
			this.setState({show_status: false})
			// this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.setState({show_status: true})
				// this.props.setLockRows(true)
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
			var toggleWindow = "modal modal-fixed-footer"
		}else{
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn-floating waves-effect waves-light blue darken-2 modal-trigger6 tooltipped"
			var url          = "/suratmasuk/upload/" + this.props.selectedRows[0]
			// var toggleWindow = ""
		}else{
			var showBtnFiles = "hide modal-trigger6 tooltipped"
			var toggleWindow = "modal modal-fixed-footer"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_files", className: toggleWindow}, 
					React.createElement("div", {className: "modal-content valign-wrapper"}, 
						React.createElement("div", {className: "row valign", style: {margin: "0px auto"}}, 
							React.createElement("div", {className: "col s12"}, 
								React.createElement("form", {action: url, encType: "multipart/form-data", method: "post", id: "upload-form"}, 
									React.createElement("input", {type: "file", name: "file", id: "file"}), React.createElement("br", null), React.createElement("br", null), 
									React.createElement("input", {className: "btn btn-primary btn-xs", type: "submit", name: "submit", value: "Upload", id: "upload-button"})
								)
							)
						)
					), 
					React.createElement("div", {className: "modal-footer valign-wrapper"}, 
						React.createElement("div", {className: "progress valign"}, 
							React.createElement("div", {className: "determinate", id: "upload-loading-progress"})
						)
					)
				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: showBtnFiles, "data-position": "top", "data-tooltip": "File", "data-delay": "10", onClick: this.toggleWindow, "data-target": "window_form_files"}, React.createElement("i", {className: "material-icons"}, "attachment"))
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
				{name: 'dis_setuju',label: 'Setuju'},
				{name: 'dis_tolak',label: 'Tolak'},
				{name: 'dis_teliti',label: 'Teliti & Pendapat'},
				{name: 'dis_untukdiketahui',label: 'Untuk Diketahui'},
				{name: 'dis_untukperhatian',label: 'Untuk Perhatian'},
				{name: 'dis_edarkan',label: 'Edarkan'},
				{name: 'dis_jawab',label: 'Jawab'},
				{name: 'dis_selesai',label: 'Selesaikan'},
				{name: 'dis_perbaiki',label: 'Perbaiki'},
				{name: 'dis_bicarakan',label: 'Bicarakan dengan saya'},
				{name: 'dis_ingatkan',label: 'Ingatkan'},
				{name: 'dis_simpan',label: 'Simpan'},
				{name: 'dis_sesuaicatatan',label: 'Sesuai Catatan'},
				{name: 'dis_perbanyak',label: 'Perbanyak ... kali,asli ke ...'},
				{name: 'blank',label: '...'}
			]
		}
	},

	componentDidMount: function(){
		// $("#window_form_pic").draggable({
		// 	handle: $("div#window_form_pic_handling"),
		// 	cursor: "pointer",
		// 	zIndex: 100
		// })
		var _this = this
		$('.modal-trigger4').leanModal({
			ready: function(){
				_this.getData()
			}
		});
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
				// _this.setState({show_status: false})
				$('.modal').closeModal();
				// _this.props.setLockRows(false)
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

				if(res.datasurat.tag_object[kode_bawahan] == undefined){
					_bawahan.push(_obj)
				}else{
					_pic.push(_obj)
				}
			}

			if(res.datasurat.to_tanggalditerima == undefined || res.datasurat.to_tanggalditerima == ""){
				_this.setState({is_tgl_terima_setted: false})
			}else{
				_this.setState({is_tgl_terima_setted: true})
			}

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
			// this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				// this.props.setLockRows(true)
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
			var toggleWindow = "modal modal-fixed-footer"
		}else{
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn-floating waves-effect waves-light blue darken-2 modal-trigger4 tooltipped"
			var url          = "/suratmasuk/upload/" + this.props.selectedRows[0]
		}else{
			var showBtnFiles = "hide modal-trigger4 tooltipped"
			var toggleWindow = "modal modal-fixed-footer"
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
					React.createElement("div", {className: disposisiMode}, 
						React.createElement("div", {className: "modal-content"}, 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s12"}, 
										this.state.net_pic_list.map(function(bawahan){
												var idname  = bawahan.Kode_jabatan
												if($.inArray(bawahan.Kode_jabatan, _this.state.bulk_kodejabatan) == -1){
													var checked = false
												}else{
													var checked = true
												}
												return (
														React.createElement("div", {className: "chip custom-chip light-blue lighten-5"}, 
														React.createElement("input", {id: idname, type: "checkbox", onClick: _this.addToKodeJabatanBulk.bind(this, bawahan.Kode_jabatan), checked: checked}), 
														React.createElement("label", {htmlFor: idname}, 
															bawahan.Nama_jabatan_pendek
														)
														)
												)
											})
										
									)
								), 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s12"}, 
										this.state.disposisi.map(function(disposisi){
												return (
													React.createElement("div", {className: "chip custom-chip light-green accent-1"}, 
														React.createElement("input", {id: disposisi.name, type: "checkbox", onClick: _this.addToDisposisiBulk.bind(this, disposisi)}), 
														React.createElement("label", {htmlFor: disposisi.name}, 
															disposisi.label
														)
													)
												)
											})
										
									)
								), 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s12"}, 
										this.state.pic_list.map(function(bawahan){
												return (
													React.createElement("div", {className: "chip custom-chip light-blue lighten-5"}, 
														React.createElement("label", null, 
															bawahan.Nama_jabatan_pendek, " ", React.createElement("span", {onClick: _this.removeTag.bind(this, bawahan)}, "X")
														)
													)
												)
											})
										
									)
								), 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s12"}, 
											React.createElement("label", {for: "catatan_disposisi"}, "Catatan"), 
											React.createElement("textarea", {placeholder: "", id: "catatan_disposisi", className: "materialize-textarea", ref: "catatan_disposisi"})
									)
								)
							), 
							React.createElement("div", {className: "modal-footer"}, 
								React.createElement("button", {	className: "btn light-green accent-4", onClick: this.post}, "Disposisi")
							)
						), 

						React.createElement("div", {className: setTglTerimaMode}, 
							React.createElement("div", {className: "modal-content valign-wrapper"}, 
									React.createElement("div", {className: "valign", style: {margin: "0 auto"}}, 
										React.createElement("button", {className: "btn light-green accent-4", onClick: this.setTglTerima}, "Set Tanggal Terima")
									)
							), 
							React.createElement("div", {className: "modal-footer"}
							)
						)
					), 

				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: showBtnFiles, "data-position": "top", "data-tooltip": "Disposisi", "data-delay": "10", onClick: this.toggleWindow, "data-target": "window_form_pic"}, React.createElement("i", {className: "material-icons"}, "supervisor_account"))
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

		$('#kode_arsip').on('keydown', function (e) {
			_this.autoCompleteNavigate(e)
		});

		$('#keterangan_arsip').on('keydown', function (e) {
			_this.autoCompleteNavigate(e)
		});

		$('.modal-trigger5').leanModal({
			ready: function(){
				_this.getData()
			}
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
		var url  = "/arsip/remove/sms/" + this.props.selectedRows[0]
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
		var url         = "/arsip/sms/" + this.props.selectedRows[0]
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
		var url = "/suratmasuk/detail/" + this.props.selectedRows[0]
		$.getJSON(url, function(res){

			if(res.datasurat.to_tanggalditerima == undefined || res.datasurat.to_tanggalditerima == ""){
				_this.setState({is_tgl_terima_setted: false})
			}else{
				_this.setState({is_tgl_terima_setted: true})
				if(res.datasurat.arsip){
					_this.setState({list_arsip: _this.listArsipMapper(res.datasurat.arsip)})
				}else{
					_this.setState({list_arsip: []})
				}
			}

		})
	},

	toggleWindow: function(){
		if(this.state.show_status){
			this.setState({show_status: false})
			// this.props.setLockRows(false)
		}else{
			if(this.props.lockRows == false){
				this.getData()
				this.setState({show_status: true})
				// this.props.setLockRows(true)
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
			var toggleWindow = "modal modal-fixed-footer"
		}else{
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.needShowBtnFiles()){
			var showBtnFiles = "btn-floating waves-effect waves-light blue darken-2 modal-trigger5 tooltipped"
			var url          = "/suratmasuk/upload/" + this.props.selectedRows[0]
		}else{
			var showBtnFiles = "hide modal-trigger5 tooltipped"
			var toggleWindow = "modal modal-fixed-footer"
		}

		if(this.state.is_tgl_terima_setted){
			var arsipMode = "arsip-mode"
			var setTglTerimaMode = "hide"
		}else{
			var arsipMode = "hide"
			var setTglTerimaMode = ""
		}

		// Show or Hide suggest
		if(this.state.arsip_result.length > 0){
			var suggest_class = "suggest z-depth-1"
		}else{
			var suggest_class = "hide"
		}

		return(
			React.createElement("div", null, 
				React.createElement("div", {id: "window_form_arsip", className: toggleWindow}, 

						React.createElement("div", {className: arsipMode}, 
							React.createElement("div", {className: "modal-content"}, 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s6"}, 
										React.createElement("input", {className: "form-control input-sm", placeholder: "kode arsip", type: "text", ref: "kode_arsip", id: "kode_arsip", onChange: this.arsipKodeSearch, onFocus: this.arsipKodeSearch, onBlur: this.blurSearch})
									), 
									React.createElement("div", {className: "col s6"}, 
										React.createElement("input", {className: "form-control input-sm", placeholder: "keterangan", type: "text", ref: "keterangan_arsip", id: "keterangan_arsip", onChange: this.arsipKetSearch, onFocus: this.arsipKetSearch, onBlur: this.blurSearch})
									)
								), 
								React.createElement("div", {className: suggest_class, id: "arsip-result-search"}, 
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
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col s12"}, 
										this.state.list_arsip.map(function(r){
											var split   = r.waktu.split(" ")
											var _tgl    = split[0].split("-")
											var tanggal = _tgl[2] + "/" + _tgl[1] + "/" + _tgl[0]
											var jam     = split[1].split(".")[0].split(":")[0] + ":" + split[1].split(".")[0].split(":")[1]
											return(
												React.createElement("div", {className: "card-panel"}, 
													React.createElement("b", null, r.data.kode_arsip), React.createElement("br", null), 
													r.data.keterangan, React.createElement("br", null), 
													React.createElement("span", {className: "glyphicon glyphicon-user"}), " ", React.createElement("span", {className: "small-font"}, r.by_name), React.createElement("br", null), 
													React.createElement("span", {className: "glyphicon glyphicon-time"}), " ", React.createElement("span", {className: "small-font"}, tanggal, " ", jam), React.createElement("br", null), 
													React.createElement("button", {className: "btn btn-xs btn-warning", onClick: _this.removeArsip.bind(this, r)}, "Remove")
												)
											)
										})
									)
								)
							), 
							React.createElement("div", {className: "modal-footer"}
							)
						), 

						React.createElement("div", {className: setTglTerimaMode}, 
							React.createElement("div", {className: "modal-content valign-wrapper"}, 
									React.createElement("div", {className: "valign", style: {margin: "0 auto"}}, 
										React.createElement("button", {className: "btn light-green accent-4", onClick: this.setTglTerima}, "Set Tanggal Terima")
									)
							), 
							React.createElement("div", {className: "modal-footer"}
							)
						)

				), 
				React.createElement("div", {className: "menu-button"}, 
					React.createElement("a", {className: showBtnFiles, "data-position": "top", "data-tooltip": "Arsip", "data-delay": "10", onClick: this.toggleWindow, "data-target": "window_form_arsip"}, React.createElement("i", {className: "material-icons"}, "folder"))
				)
			)
		)
	}
})

var DocsTableNavigation = React.createClass({displayName: "DocsTableNavigation",

	getInitialState: function(){
		return {
			show_page_changer: false
		}
	},

	toggle_page_changer: function(){
		if(this.state.show_page_changer){
			this.setState({show_page_changer: false})
		}else{
			this.setState({show_page_changer: true})
			React.findDOMNode(this.refs.page_number).value = this.props.currentPageNumber
		}
	},

	prevPage: function(){
		var current_page_number = this.props.currentPageNumber
		var previous_page_number = current_page_number - 1
		if(previous_page_number > 0){
			this.props.getData(previous_page_number)
		}
	},

	go_to_printpreview: function(){
		window.open("/suratmasuk/printpreview")
	},

	nextPage: function(){
		var current_page_number = this.props.currentPageNumber
		var next_page_number    = current_page_number + 1
		var end                 = this.props.currentPageNumber * 10
		if(end <= this.props.docCount){
			this.props.getData(next_page_number)
		}
	},

	setCurrentPageNumber: function(e){
		var value = parseInt(e.target.value)
		if(value){
			var current = value * 10
			if(current <= this.props.docCount){
				this.props.getData(value)
			}
		}
	},

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

		if(this.state.show_page_changer){
			var _class_page_changer = "stealblue"
		}else{
			var _class_page_changer = "hide"
		}

		return(
			React.createElement("div", null, 
					start, " - ", end, " dari ", React.createElement("span", {className: "doc_count", onClick: this.go_to_printpreview}, this.props.docCount), "  ", 

					React.createElement("font", {className: "prev_button", onClick: this.prevPage}, "< "), 

					React.createElement("div", {className: _class_page_changer}, React.createElement("input", {type: "text", style: {width: "20px"}, className: "page_number", ref: "page_number", onChange: this.setCurrentPageNumber, onBlur: this.toggle_page_changer})), 
					React.createElement("font", {onClick: this.toggle_page_changer}, this.props.currentPageNumber), 

					React.createElement("font", {className: "next_button", onClick: this.nextPage}, " >")

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
			if(!is_checked){
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
		// console.log(this.props.docList)
		return(
			React.createElement("div", null, 
				React.createElement("table", {className: "bordered scroll striped", style: {fontSize:"12px",width:"100%"}}, 
					React.createElement("thead", {className: "blue white-text darken-1"}, 
						React.createElement("th", {style: {width:"50px"}}, React.createElement("p", {onClick: this.toggleSelectAllRows}, React.createElement("input", {type: "checkbox", onChange: this.toggleSelectAllRows, ref: "select_all", checked: _is_select_all, className: "custom-checkbox filled-in"}), React.createElement("label", null))), 
						React.createElement("th", {style: {width:"60px"}}, "Agenda"), 
						React.createElement("th", {style: {width:"80px"}}, "Atasan"), 
						React.createElement("th", {style: {width:"80px"}}, "Diterima"), 
						React.createElement("th", {style: {width:"190px"}}, "Asal"), 
						React.createElement("th", {style: {width:"150px"}}, "Nomor"), 
						React.createElement("th", {style: {width:"80px"}}, "Tanggal"), 
						React.createElement("th", {style: {width:"350px"}}, "Perihal"), 
						React.createElement("th", {style: {width:"90px"}}, "PIC"), 
						React.createElement("th", {style: {width:"70px"}}, "File")
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
									React.createElement("td", {style: {width:"50px"}}, React.createElement("p", null, React.createElement("input", {type: "checkbox", className: "custom-checkbox filled-in", checked: checked}), React.createElement("label", null))), 
									React.createElement("td", {style: {width:"60px"}}, res.to_nomoragenda), 
									React.createElement("td", {style: {width:"80px"}}, res.createdby_time), 
									React.createElement("td", {style: {width:"80px"}}, res.to_tanggalditerima), 
									React.createElement("td", {style: {width:"190px"}}, res.asal), 
									React.createElement("td", {style: {width:"150px"}}, res.nomor), 
									React.createElement("td", {style: {width:"80px"}}, res.tanggal), 
									React.createElement("td", {style: {width:"350px"}}, res.hal), 
									React.createElement("td", {style: {width:"90px"}}, 
										res.tag.map(function(data){
											var title = data.to_namajabatan + "\n" + data.to_nama + ""
											var _color = data.badge_color
											var _class = "glyphicon " + data.badge
											return(
												React.createElement("div", {style: {float:"left",marginRight:"2px"}}, 
													React.createElement("i", {className: "tiny material-icons", title: title, style: {color: _color, fontSize: 18}}, "person")
												)
												)
										})
									), 
									React.createElement("td", {className: "td-flexible-edge"}, res.files.map(function(file){
										var path = "/files/" + file.nama_file
										return(
											React.createElement("a", {href: path, target: "_new"}, 
												React.createElement("i", {className: "tiny material-icons"}, "attach_file")
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
			lock_rows           : false
		}
	},

	componentDidMount: function(){
		this.getData(this.state.current_page_number)

	},

	setLockRows: function(value){
		this.setState({lock_rows: value})
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
		var url = "/suratmasuk/page/" + page
		$.getJSON(url, function(result){
			if(result.listsurat){
				_this.setDocList(result.listsurat)
		    }else{
		    	var empty = []
		    	_this.setDocList(empty)
		    }
			_this.setMyKodeJabatan(result.my_kodejabatan)
			_this.setCurrentPageNumber(page)
			_this.create_all_rows(result.listsurat)
		    _this.setState({doc_count: result.count})
		})
	},

	getData: function(page){
		var _this = this
		var url = "/suratmasuk/page/" + page
		$.getJSON(url, function(result){
			if(result.listsurat){
				_this.setDocList(result.listsurat)
		    }
			_this.setMyKodeJabatan(result.my_kodejabatan)
			_this.setMyNamaJabatan(result.my_namajabatan)
			_this.setMyNama(result.my_nama)
			_this.setCurrentPageNumber(page)
			_this.setState({doc_count: result.count})
			_this.create_all_rows(result.listsurat)
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

	create_all_rows: function(listsurat){
		var _all_rows     = []
		for(var a in listsurat){
			var doc_series = listsurat[a].doc_series
			_all_rows.push(doc_series)
		}
		this.setAllRows(_all_rows)
	},

	render: function(){
		return(
			React.createElement("div", null, 

				React.createElement(Header, {
					nama: this.state.my_nama, 
					namaJabatan: this.state.my_namajabatan}), 

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
						setAllRows: this.setAllRows}), 

					React.createElement(MenuPrint, {
						selectedRows: this.state.selected_rows}), 

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

					React.createElement(WindowPIC, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						myKodeJabatan: this.state.my_kodejabatan, 
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

					React.createElement(WindowFiles, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
						lockRows: this.state.lock_rows, 
						selectedRows: this.state.selected_rows, 
						setLockRows: this.setLockRows}), 

					React.createElement(WindowDetail, {
						allRows: this.state.all_rows, 
						currentPageNumber: this.state.current_page_number, 
						getData: this.getData, 
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

React.render(React.createElement(App, null), document.getElementById('react'));