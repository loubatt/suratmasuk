$( document ).ready(function() {
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
    		
    	}else{
    		alert("NOK")
    	}
    })
});