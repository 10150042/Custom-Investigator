require([
    "jquery",
    "underscore",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc",
    "splunkjs/mvc/simplexml/ready!"
], function($,_,SearchManager,mvc) {

    $("#div_id").html("<p><b>&#128512;검색 시 IP 정보 출력</b></p>");
    //검색 시 동작
    $("#submit").on("click", function () {
        $("#div_id").html("<p><b>&#128517;출력 중...</b></p>");
        var token = mvc.Components.getInstance("default");
        var ip_token = token.get("ip_token");

        var SM = new SearchManager({
            earliest_time: "-5m@m",
            latest_time: "now",
            preview: true,
            cache: false,
            search: "| `reverse_asset_lookup(" + ip_token + ")`"
        });
        var result = SM.data("results");
        result.on("data", function(){
            var val_list = result.data().rows[0];
            console.log(val_list);
            $("#div_id").html("");
            $("#div_id").append("<table><tbody><tr>");
            var field_count = 0;
            for(i=0; i<val_list.length; i++){
                var key = result.data().fields[i];
                var value = result.data().rows[0][i];
                if(!value || key=="domain" || key=="rdn_domain" || key=="_mkv_child" || key=="ip"){
                    continue;
                }
                
                const multi_string= value.toString().split(',').join('<br />');
                console.log(multi_string);
                $("#div_id").append("<td style='width: 464.5px;' height='30'>" + "&lt;" + key + "&gt;" + "&nbsp;<br />" + "<h3>" + multi_string + "</h3>" + "</td>");
                field_count = field_count + 1;
                

                if(field_count % 4 == 0){
                    $("#div_id").append("</tr><tr>");
                }
                if(field_count % 4 != 0 && i+1 == val_list.lengh){
                    $("div_id").append("</tr></tbody></table>");
                }

            };
//테스트
        });
    });
});
