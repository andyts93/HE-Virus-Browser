(function() {
    'use strict';

    $('.widget-title .nav.nav-tabs').append('<li class="link" id="call"><a href="#"><span class="he16-bug icon-tab"></span>Virus</a></li>');

    $('#call').on('click', function(e){
        $.each($('.widget-title .nav.nav-tabs li'), function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        // recupero numero pagine
        var pagine = $('.pagination ul li').length-2;

        var form = '<form class="form-horizontal"><div class="browser-input">Filter:<select id="virusType" style="margin-left:10px"><option value="">All</option><option value="vwarez">Warez</option><option value="vddos">DDOS</option><option value="vspam">Spam</option><option value="vminer">Miner</option></select></div></form>';
        $('.widget-content .span12').html(form+'<div id="results"></div><div id="virus-content"></div>');
        var ip_virus = get_ips(pagine);
        setTimeout(function(){
            if(ip_virus.length > 0){
                create_list(ip_virus);
            }
        }, (pagine * 0.08) * 1000);
        $('#virusType').on('change', function(){
            var filtered = $.grep(ip_virus, function(value, key){
                var ext = value.virus.substring(value.virus.indexOf('.')+1);
                if(ext == $('#virusType').val() || $('#virusType').val() === '')
                    return true;
            });
            create_list(filtered);
        });
    });

    function create_list(ip_virus){
        var list = '<ul class="list ip" id="list">';
        ip_virus.forEach(function(virus){
            list += '<li><span class="span4"><div class="list-ip"><a href="#"><span class="label pull-left '+(virus['tipo'] == 'VPC' ? 'label-success' : 'label-info')+'">'+virus['tipo']+'</span><span id="ip">'+virus['ip']+'</span></a></div></span><span class="span4"><div class="list-virus"><span class="he16-bug heicon icon-tab"></span><span id="vname">'+virus['virus']+'</span></div><div class="list-time"><span class="small">'+virus['tempo']+'</span></div></span><span class="span4">'+virus['internet']+'<br>'+virus['hd']+'</span><div style="clear:both"></div>'; 
        });
        list += '</ul>';
        $('#virus-content').html(list);
        $('#results').html('<h3 style="text-align:center">'+ip_virus.length+' virus found</h3>');
    }

    function get_ips(pagine){
        $('#virus-content').html('<h3 style="text-align:center">LOADING...</h3>');
        var ip_virus = [];
        for(var i = 1; i <= pagine; i++){
            $.ajax({
                url: '/list?page='+i,
                success: function(risp){
                    var el = $('<div></div>');
                    el.html(risp);
                    $.each($('#list li',el), function(key, value){
                        var el2 = $('<div></div>');
                        el2.html(value);
                        var virus = $('#vname', el2).html();
                        if(virus !== ''){
                            var ext = virus.substring(virus.indexOf('.')+1);
                            var arr = [];
                            arr['ip'] = $('#ip', el2).html();
                            arr['tempo'] = $('.list-time span', el2).html();
                            arr['virus'] = virus;
                            arr['tipo'] = $('.list-ip .label', el2).html();
                            $.each($('.span3 span.small', el2), function(key, value){
                                if(key == 0)
                                    arr['internet'] = $(this).html();
                                else if(key == 1)
                                    arr['hd'] = $(this).html();
                            });
                            ip_virus.push(arr);
                        }
                    });
                }
            });
        }
        return ip_virus;
    }
})();
