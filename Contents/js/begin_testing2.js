var _json = {};
var _code = '';
var _style = '';
var hour = 0, minute = 0, second = 0, maxtime = 0;
var timer;
var _begin = false;
// layui.extend({
// 	cookie:'{/}'+'/Contents/js/cookie'
// }).use(['form', 'element', 'layer', 'cookie'], function () {
//layui.use(['form', 'element', 'layer', 'cookie'], function () { //原来的
layui.use(['form', 'element', 'layer'], function () {
    var $ = layui.jquery,
        form = layui.form,
        layer = layui.layer,
        element = layui.element;
    //var _storage = JSON.parse($.cookie("vipexam"));
    var _storage = { "msg": "登录成功", "code": "1", "zktoken": "63B1CsdfagFC30F95BC24BdfC68gdfgd6DCA2539Edfgds47Ffdg61", "user": { "managerid": 352864, "role": 4, "account": "PDFSGSF094729473", "password": null, "username": null, "lastlogintime": null, "credentialsSalt": "9d8hsdjfsogaskj2drd38jsirfi9e2fds", "locked": "1", "headimg": null, "collegename": "考斯系统", "email": null, "sex": null, "regdate": "2023-12-25 13: 29: 38.117", "phone": "ST1865264233", "token": null, "issuper": false }, "token": "sdfagfdsasgsgda4973jtueidsf0" };
    console.log("_storage：：", _storage);
    var _token = (typeof (_storage.token) == undefined || _storage.token == null) ? "" : _storage.token;
    var _account = _storage.user.account;
    // var _storage = {};
    // var _token = "";
    // var _account = "";
    var _exid = GetQueryString("id");
    var special = '';
    var visits = 4;

    $(".change_font i").click(function () {
        var fontSize = $(this).text();
        $('.question_content .question_title').attr("style", "font-size:" + fontSize + "px");
        $('.question_content .options_l').attr("style", "font-size:" + fontSize + "px");
        $('.question_title pre').attr("style", "font-size:" + fontSize + "px");
        $('.layui-form-item .layui-form-radio>div').attr("style", "font-size:" + fontSize + "px");
        $('.layui-form-checkbox[lay-skin=primary] span').attr("style", "font-size:" + fontSize + "px");
    });

    function RequestJson(url, params, callback) {
        var _idx = layer.load(1);
        // $.ajax({
        //     type: "post", data: params, url: url, dataType: "json", global: false, success: function (data) {
        //         callback && callback(data);
        //     }, complete: function () {
        //         layer.close(_idx);
        //     }, error: function (XMLHttpRequest, textStatus, errorThrown) {
        //         layer.close(_idx);
        //     }
        // });
        $.ajax({
            type: "get", data: params, url: url, dataType: "json", global: false, success: function (data) {
                callback && callback(data);
            }, complete: function () {
                layer.close(_idx);
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(_idx);
            }
        });
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    var examName = "";
    var loadQuestions = function (filename) {
        console.log("进来了", filename);
        $(".hand_paper .layui-btn").addClass("layui-disabled");
        // RequestJson("exam/getExamList.action", {examID: _exid, account: _account, token: _token}, function (data) {
        //原来的//RequestJson("/data/getExamList."+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {
        //下面测试
        //RequestJson("/" + filename + ".action", { examID: _exid, account: _account, token: _token }, function (data) {
        
        //RequestJson("/data/getExamList."+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {
        //RequestJson("https://raw.githubusercontent.com/ZCYUer/exam.github.io/master/data/getExamList."+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {
        //RequestJson("https://gitee.com/zcy123zcy/exam-zhaocy/raw/master/data/getExamList."+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {
        //RequestJson("https://zcyuer.github.io/exam.github.io/data/getExamList."+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {
        RequestJson("https://zcyuer.github.io/exam.github.io/"+ filename +".action", {examID: _exid, account: _account, token: _token}, function (data) {    
            if (data.code == "1") {
                var newspecial = data.examTypeCode;
                special = newspecial.substring(0, 4);
                // invisits(special,visits);
                var _select = "";
                var result = "";
                var _selauto = "";
                var _index = 0;
                var _total = 0;
                examName = data.examName;
                layui.each(data.muban, function (m, items) {
                    if (items.cunt > 0) {
                        var _curr = (_index == 0) ? "col_qing" : "";
                        _select += "<a class='" + _curr + "' href='#" + items.ename + "'>" + items.cname + "</a>";
                        _selauto += "<div class=\"single_item\"><h2>【" + items.cname + "】</h2><ul class='single_list'>";
                        _total += parseFloat(items.cunt * items.grade);
                        result += "<div class=\"question_all\"><div class=\"topic_type\" id='" + items.ename + "'><h2><em></em>" + items.cname + " <span>(本题共<i>" + items.cunt + "</i>题，每题 <i>" + items.grade + "</i>分，共<i>" + items.cunt * items.grade + "</i>分。)</span></h2></div>";
                        layui.each(items.shiti, function (s, item) {
                            if (item.children.length > 0) {
                                result += "<div class=\"question_stem\"><div class='question_title'><pre>" + setImages(item.groupCodePrimQuestion, item.primPic) + "</pre>"
                                    + setAudio(item.audioFiles) + "</div></div><div class='question_all_list'>";
                                if (setImages(item.refAnswer, item.answerPic) != "") {
                                    _index++;
                                    result += "<div class='question_all_same' id='paper_" + _index + "'><div class='layui-form question_content'><div class='question_title'><pre><span class='num'>" + _index + "</span>";
                                    if (setImages(item.secondQuestion, item.subPrimPic) != "") {
                                        result += setImages(item.secondQuestion, item.subPrimPic) + "</pre>" + setAudio(item.audioFiles) + "</div>" + setContent(item, items, _index) + "</div></div>";
                                    } else {
                                        result += setImages(item.primQuestion, item.primPic) + "</pre>" + setAudio(item.audioFiles) + "</div>" + setContent(item, items, _index) + "</div></div>";
                                    }
                                    _selauto += "<li><a href=\"#paper_" + _index + "\">" + _index + "</a></li>";
                                }
                                layui.each(item.children, function (c, child) {
                                    _index++;
                                    result += "<div class='question_all_same' id='paper_" + _index + "'><div class='layui-form question_content'><div class='question_title'><pre><span class='num'>" + _index + "</span>";
                                    if (setImages(child.secondQuestion, child.subPrimPic) != "") {
                                        result += setImages(child.secondQuestion, child.subPrimPic) + "</pre>" + setAudio(child.audioFiles) + "</div>" + setContent(child, items, _index) + "</div></div>";
                                    } else {
                                        result += setImages(child.primQuestion, child.primPic) + "</pre>" + setAudio(child.audioFiles) + "</div>" + setContent(child, items, _index) + "</div></div>";
                                    }
                                    _selauto += "<li><a href=\"#paper_" + _index + "\">" + _index + "</a></li>";

                                });
                                result += "</div>";
                            } else {
                                _index++;
                                result += "<div class='question_all_same' id='paper_" + _index + "'><div class='layui-form question_content'><div class='question_title'><pre><span class='num'>" + _index + "</span>"
                                    + setImages(item.primQuestion, item.primPic) + "</pre>" + setAudio(item.audioFiles) + "</div>" + setContent(item, items, _index) + "</div></div>";
                                _selauto += "<li><a href=\"#paper_" + _index + "\">" + _index + "</a></li>";
                            }
                        });
                        result += "</div>";
                        _selauto += "</ul></div>";
                    }
                });
                $("#sel_auto").html(_selauto);
                $("#examContent").html(result);
                $(".testing_select").html(_select);
                $("#full").text(_total);
                $("#tcunt").text(_index);
                $("#tlimt").text(data.timelimit);
                $("#exname").text(data.examName);
                _code = data.examTypeCode;
                _style = data.examstyle;
                maxtime = parseInt(data.timelimit) * 60;
                setTimes();
                form.render();
                $(".testing_select a").on('click', function () {
                    $(this).addClass("col_qing").siblings().removeClass("col_qing");
                });
                $(".q_tag").on('click', function () {
                    $(this).toggleClass("change");
                    $(this).parent().siblings(".biaoji").toggle();
                    var id = $(this).parents(".question_all_same").attr('id');
                    $('.single_list a[href="#' + id + '"]').parent().toggleClass('icon_tag');
                });
                //报错弹出框
                $(".q_wrong").on("click", function () {
                    if (_account == "f46354b31ec64c9c96919e12a9bbd610") {
                        layer.msg("游客模式下无法使用此功能，请登录后使用。");
                    } else {
                        layer.open({
                            type: 2,
                            title: "报错",
                            content: "error_layer.html",
                            area: ['600px', '580px'],
                            skin: 'demo-class',
                            closeBtn: 1
                        });
                    }
                });
                $(".q_collect").on("click", function (e) {
                    if (_account == "f46354b31ec64c9c96919e12a9bbd610") {
                        layer.msg("游客模式下无法使用此功能，请登录后使用。");
                    } else {
                        if ($(this).hasClass("change")) {
                            $(this).removeClass("change");
                            RequestJson("questioncollect/deleteQCollect.action", { account: _account, token: _token, QuestionCode: $(this).data("id") }, function (data) {
                                if (data.code == "1") {
                                    $(this).removeClass("change");
                                }
                                layer.msg("取消收藏成功！");
                            });
                        } else {
                            $(this).addClass("change");
                            RequestJson("questioncollect/addQCollect.action", { account: _account, token: _token, ExamID: _exid, QuestionCode: $(this).data("id") }, function (data) {
                                if (data.code == "1") {
                                    $(this).addClass("change");

                                }
                                layer.msg(data.msg);
                            });
                        }

                    }
                });
            } else {
                if (data.code == "9") {
                    // layer.open({
                    //     type: 1,
                    //     title: false,
                    //     closeBtn: false,
                    //     area: '40%;',
                    //     shade: 0.1,
                    //     id: 'iplimit',
                    //     scrollbar: false,
                    //     content: "<div class='iplimit'>您的账号已在其他设备上登录，如需继续操作请重新登录。</div>",
                    //     btnAlign: 'c',
                    //     btn: '确 定',
                    //     yes: function (index, layero) {
                    //         document.location = "sdtsglogin.html";
                    //     }
                    // });
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: false,
                        area: '40%;',
                        shade: 0.1,
                        id: 'iplimit',
                        scrollbar: false,
                        content: "<div class='iplimit'>该文件出错了，需要修复。</div>",
                        btnAlign: 'c',
                        btn: '确 定',
                        yes: function (index, layero) {
                            layer.close(index);
                        }
                    });
                } else {
                    layer.msg(data.msg);
                    console.log(data.msg);
                }

            }

        });
    }
    // loadQuestions();

    function loadStartFirst() {
        $(".hand_paper .layui-btn").addClass("layui-disabled");
        $("#StartForm").addClass("layui-disabled");
        alert("试卷加载失败问题已修复！抱歉👉👈 有问题可随时联系");
    }
    loadStartFirst();

    function setContent(obj, items, index) {
        var content = "";
        var iChoose = (items.basic == "2" || items.basic == "4" || items.basic == "6" || items.basic == "7") ? 1 : 0;
        var _collect = "collect_" + index;
        if (setImages(obj.first, obj.firstPic) != "") {
            content += "<div class='layui-form-item'>"
                + setOptions(setImages(obj.first, obj.firstPic), "A", iChoose, index)
                + setOptions(setImages(obj.second, obj.secondPic), "B", iChoose, index)
                + setOptions(setImages(obj.third, obj.thirdPic), "C", iChoose, index)
                + setOptions(setImages(obj.fourth, obj.fourthPic), "D", iChoose, index)
                + setOptions(setImages(obj.fifth, obj.fifthPic), "E", iChoose, index)
                + "</div>";

        } else {
            content += (iChoose == 0) ? "<div class=\"layui-form-item\"><input type=\"text\" name=\"title\" autocomplete=\"off\" class=\"layui-input\"></div>" : "<div class=\"layui-form-item\"><textarea placeholder=\"请输入内容\" class=\"layui-textarea\"></textarea></div>";
        }
        content += "<form><input type='hidden' name='questionCode' value='" + obj.questionCode + "'/><input type='hidden' class='tmp' name='refAnswer' value=''/><input type='hidden' name='grade' value='" + items.grade + "'/><input type='hidden' name='basic' value='" + items.basic + "'/><input type='hidden' name='questiontype' value='" + items.ename + "'/></form>";
        content += "<div class=\"question_btn\"><div class=\"q_tag\"><i></i>标记</div><div class=\"q_wrong\"><i></i>报错</div>";
        if (obj.isCollect == "1") {
            content += "<div class=\"q_collect change\"  data-id='" + obj.questionCode + "' data-prim='" + obj.primQuestion + "' data-sec='" + obj.secondQuestion + "' data-pimg='" + obj.primPic + "' data-simg='" + obj.subPrimPic + "'><i></i>收藏</div>";
        } else {
            content += "<div class=\"q_collect\" data-id='" + obj.questionCode + "' data-prim='" + obj.primQuestion + "' data-sec='" + obj.secondQuestion + "' data-pimg='" + obj.primPic + "' data-simg='" + obj.subPrimPic + "'><i></i>收藏</div>";
        }
        content += "<div class='q_answer' onclick=\"lookAnswer('popup" + index + "')\"><i></i>查看答案</div></div><div class=\"biaoji\"></div> <div class='analysis' style='display:none;'><div class='daan'><span>标准答案：" + obj.refAnswer + "</i></span></div>";
        if (setImages(obj.discription, obj.discPic) != "") {
            content += "<div class='daan_jiexi'><span>知识点解析：" + setImages(obj.discription, obj.discPic) + "</span></div></div>";
        } else {
            content += "<div class='daan_jiexi'><span>知识点解析：暂无解析</span></div></div>";
        }
        var result = "<fieldset class=\"layui-elem-field layui-field-title vefixed\"><legend>标准答案</legend><div class=\"layui-field-box\"><pre>" + setImages(obj.refAnswer, obj.answerPic) + "</pre></div></fieldset>";
        if (obj.originalText != "") {
            result += "<fieldset class=\"layui-elem-field layui-field-title vefixed\"><legend>听力原文</legend><div class=\"layui-field-body\"><pre>" + obj.originalText + "</pre></div></fieldset>";
        }
        if (setImages(obj.discription, obj.discPic) != "") {
            result += "<fieldset class=\"layui-elem-field layui-field-title vefixed\"><legend>知识点解析</legend><div class=\"layui-field-body\"><pre>" + setImages(obj.discription, obj.discPic) + "</pre></div></fieldset>";
        }
        content += "<div id='popup" + index + "' class='pop-up2'>" + result + "</div>";
        return content;
    }

    function setOptions(txt, head, mark, index) {
        var options = "";
        if (mark == 0) {
            options = txt != "" ? "<pre><input type='radio' name='paper_" + index + "' value='" + head + "' title='" + head + "、" + txt + "' lay-filter='rd" + head + "'></pre>" : "";
            form.on('radio(rd' + head + ')', function (data) {
                var id = $(data.elem).attr("name");
                $('.single_list a[href="#' + id + '"]').addClass('add_color');
                $("#" + id + " .tmp").val(data.value);
            });
        } else {
            options = txt != "" ? "<pre><input type='checkbox' name='paper_" + index + "' value='" + head + "' title='" + head + "、" + txt + "' lay-skin=\"primary\" lay-filter='ck" + head + "'></pre>" : "";
            form.on('checkbox(ck' + head + ')', function (data) {
                var id = $(data.elem).attr("name");
                $('.single_list a[href="#' + id + '"]').addClass('add_color');
                var ckv = $("#" + id + " .tmp");
                setChk(ckv, data.value);
            });
        }
        return options;
    }

    function setChk(obj, v) {
        var result = obj.val();
        if (result.indexOf(v) > -1) {
            result = result.replace(eval('/' + v + '/g'), '');
        } else {
            result += v;
        }
        var _arr = result.split('');
        _arr.sort();
        obj.val(_arr.join(''));
    }

    function setImages(txt, pic) {
        var result = "";
        if (pic && pic.length > 0) {
            pic = pic.replace('，', ',');
            var pary = pic.split(',');
            var tary = txt.split('[*]');
            for (var i = 0; i < pary.length; i++) {
                tary[i] = tary[i] + "<img src=\"http://rang.vipexam.org/images/" + pary[i] + ".jpg\">";
            }
            result = tary.join('');
        } else {
            result = txt;
        }
        return result;
    }

    function setAudio(_audio) {
        var audioStr = (_audio != "" && _audio != "*") ? "<audio controls=\"controls\"><source src='http://rang.vipexam.org/Sound/" + _audio + ".mp3' type=\"audio/mpeg\"></audio>" : "";
        return audioStr;
    }

    var countDown = function () {
        if (maxtime > 0) {
            setTimes();
            --maxtime;
        } else {
            SubmitFom();
        }
    }

    function setTimes() {
        hour = Math.floor(maxtime / 3600);
        minute = Math.floor(maxtime % 3600 / 60);
        second = Math.floor(maxtime % 60);
        $("#countDown").html("<i>" + hour + "</i>小时<i>" + minute + "</i>分<i>" + second + "</i>秒");
    }

    function Start() {
        timer = setInterval(countDown, 1000);
    }

    $("#SelectExam").on("click", function () {
        console.log(123);
        if ($(this).text() == "选择试卷") {
            console.log(45);

            // layer.alert("真题",{
            //     title: '请选择护理学试卷【卫生事业招聘】',
            //     content: '专业知识真题 || 专业知识模考<br/>基础知识真题 || 基础知识模考',
            //     btn: [  '专真1','专真2','专真3','专真4','专真5','专真6','专真7','专真8','专真9','专真10','专真11','专真12','专真13','专真14',
            //             '专模1','专模2','专模3','专模4','专模5','专模6','专模7','专模8','专模9','专模10','专模11','专模12','专模13','专模14',
            //             '专模15','专模16','专模17','专模18','专模19','专模20',
            //             '基模1','基模2','基模3','基模4','基模5','基模6','基模7','基模8','基模9','基模10','基模11','基模12','基模13'
            //         ],
            //     btnAlign: 'c',//剧中
            //     btn1: function(){
            //         loadQuestions('执业护士（实践能力）历年真题试卷汇编13');
            //         layer.msg('专业知识真题1已加载完毕！');
            //     }
            // });
            layer.open({
                type: 2,//页面
                title: '请选择试题',
                area: ['800px', '350px'],
                shade: 0.8,
                content: 'iframe.html',
                btn: ['确定', '取消'],
                offset: ['120px','300px'],
                yes: function (index, layero) {
                    // loadQuestions('zz1');
                    layer.close(index);
                    var body = layer.getChildFrame('body', index);
                    // console.log($(layero).find("iframe")[0].contentWindow);
                    // console.log( window[layero.find('iframe')[0]['name']]);
                    console.log(body.find("#demo-select-filter3").val());
                    //判断进入哪个文件夹：
                    var examType = body.find("#demo-select-filter").val();
                    var zhentiOrmoni = body.find("#demo-select-filter2").val();
                    if(examType == "AAA"){
                        loadQuestions("data/getExamList." + body.find("#demo-select-filter3").val());
                    }else if(examType == "BBB"){
                        if(zhentiOrmoni == "AAA"){
                            loadQuestions("护资/专业务实/真题/" + body.find("#demo-select-filter3").val());
                        }
                        if(zhentiOrmoni == "BBB"){
                            loadQuestions("护资/专业务实/模拟/" + body.find("#demo-select-filter3").val());
                        }
                    }else if(examType == "CCC"){
                        if(zhentiOrmoni == "AAA"){
                            loadQuestions("护资/实践能力/真题/" + body.find("#demo-select-filter3").val());
                        }
                        if(zhentiOrmoni == "BBB"){
                            loadQuestions("护资/实践能力/模拟/" + body.find("#demo-select-filter3").val());
                        }
                    }else{

                    }

                    // loadQuestions(body.find("#demo-select-filter3").val());
                    layer.msg(body.find("#demo-select-filter3 option:selected").text() + '已加载完毕！');
                },
                cancel: function (index, layero) {
                    layer.close(index);
                }
            });
            // $(this).text("试卷锁定");
            $("#StartForm").removeClass("layui-disabled");
            console.log(67);
        } else {
            layer.msg("请先停止作答再选试卷哦");
        }
    });


    //原来的：
    $("#SelectExam1").on("click", function () {
        console.log(123);
        if ($(this).text() == "选择试卷") {
            console.log(45);

            layer.alert("真题", {
                title: '请选择护理学试卷【卫生事业招聘】',
                content: '专业知识真题 || 专业知识模考<br/>基础知识真题 || 基础知识模考',
                btn: ['专真1', '专真2', '专真3', '专真4', '专真5', '专真6', '专真7', '专真8', '专真9', '专真10', '专真11', '专真12', '专真13', '专真14',
                    '专模1', '专模2', '专模3', '专模4', '专模5', '专模6', '专模7', '专模8', '专模9', '专模10', '专模11', '专模12', '专模13', '专模14',
                    '专模15', '专模16', '专模17', '专模18', '专模19', '专模20',
                    '基模1', '基模2', '基模3', '基模4', '基模5', '基模6', '基模7', '基模8', '基模9', '基模10', '基模11', '基模12', '基模13'
                ],
                btnAlign: 'c',//剧中
                btn1: function () {
                    loadQuestions('zz1');
                    layer.msg('专业知识真题1已加载完毕！');
                },
                btn2: function () {
                    loadQuestions('zz2');
                    layer.msg('专业知识真题2已加载完毕！');
                },
                btn3: function () {
                    loadQuestions('zz3');
                    layer.msg('专业知识真题3已加载完毕！');
                },
                btn4: function () {
                    loadQuestions('zz4');
                    layer.msg('专业知识真题4已加载完毕！');
                },
                btn5: function () {
                    loadQuestions('zz5');
                    layer.msg('专业知识真题5已加载完毕！');
                },
                btn6: function () {
                    loadQuestions('zz6');
                    layer.msg('专业知识真题6已加载完毕！');
                },
                btn7: function () {
                    loadQuestions('zz7');
                    layer.msg('专业知识真题7已加载完毕！');
                },
                btn8: function () {
                    loadQuestions('zz8');
                    layer.msg('专业知识真题8已加载完毕！');
                },
                btn9: function () {
                    loadQuestions('zz9');
                    layer.msg('专业知识真题9已加载完毕！');
                },
                btn10: function () {
                    loadQuestions('zz10');
                    layer.msg('专业知识真题10已加载完毕！');
                },
                btn11: function () {
                    loadQuestions('zz11');
                    layer.msg('专业知识真题11已加载完毕！');
                },
                btn12: function () {
                    loadQuestions('zz12');
                    layer.msg('专业知识真题12已加载完毕！');
                },
                btn13: function () {
                    loadQuestions('zz13');
                    layer.msg('专业知识真题13已加载完毕！');
                },
                btn14: function () {
                    loadQuestions('zz14');
                    layer.msg('专业知识真题14已加载完毕！');
                },
                btn15: function () {
                    loadQuestions('zm1');
                    layer.msg('专业知识模考1已加载完毕！');
                },
                btn16: function () {
                    loadQuestions('zm2');
                    layer.msg('专业知识模考2已加载完毕！');
                },
                btn17: function () {
                    loadQuestions('zm3');
                    layer.msg('专业知识模考3已加载完毕！');
                },
                btn18: function () {
                    loadQuestions('zm4');
                    layer.msg('专业知识模考4已加载完毕！');
                },
                btn19: function () {
                    loadQuestions('zm5');
                    layer.msg('专业知识模考5已加载完毕！');
                },
                btn20: function () {
                    loadQuestions('zm6');
                    layer.msg('专业知识模考6已加载完毕！');
                },
                btn21: function () {
                    loadQuestions('zm7');
                    layer.msg('专业知识模考7已加载完毕！');
                },
                btn22: function () {
                    loadQuestions('zm8');
                    layer.msg('专业知识模考8已加载完毕！');
                },
                btn23: function () {
                    loadQuestions('zm9');
                    layer.msg('专业知识模考9已加载完毕！');
                },
                btn24: function () {
                    loadQuestions('zm10');
                    layer.msg('专业知识模考10已加载完毕！');
                },
                btn25: function () {
                    loadQuestions('zm11');
                    layer.msg('专业知识模考11已加载完毕！');
                },
                btn26: function () {
                    loadQuestions('zm12');
                    layer.msg('专业知识模考12已加载完毕！');
                },
                btn27: function () {
                    loadQuestions('zm13');
                    layer.msg('专业知识模考13已加载完毕！');
                },
                btn28: function () {
                    loadQuestions('zm14');
                    layer.msg('专业知识模考14已加载完毕！');
                },
                btn29: function () {
                    loadQuestions('zm15');
                    layer.msg('专业知识模考15已加载完毕！');
                },
                btn30: function () {
                    loadQuestions('zm16');
                    layer.msg('专业知识模考16已加载完毕！');
                },
                btn31: function () {
                    loadQuestions('zm17');
                    layer.msg('专业知识模考17已加载完毕！');
                },
                btn32: function () {
                    loadQuestions('zm18');
                    layer.msg('专业知识模考18已加载完毕！');
                },
                btn33: function () {
                    loadQuestions('zm19');
                    layer.msg('专业知识模考19已加载完毕！');
                },
                btn34: function () {
                    loadQuestions('zm20');
                    layer.msg('专业知识模考20已加载完毕！');
                },

                btn35: function () {
                    loadQuestions('jm1');
                    layer.msg('基础知识模考1已加载完毕！');
                },
                btn36: function () {
                    loadQuestions('jm2');
                    layer.msg('基础知识模考2已加载完毕！');
                },
                btn37: function () {
                    loadQuestions('jm3');
                    layer.msg('基础知识模考3已加载完毕！');
                },
                btn38: function () {
                    loadQuestions('jm4');
                    layer.msg('基础知识模考4已加载完毕！');
                },
                btn39: function () {
                    loadQuestions('jm5');
                    layer.msg('基础知识模考5已加载完毕！');
                },
                btn40: function () {
                    loadQuestions('jm6');
                    layer.msg('基础知识模考6已加载完毕！');
                },
                btn41: function () {
                    loadQuestions('jm7');
                    layer.msg('基础知识模考7已加载完毕！');
                },
                btn42: function () {
                    loadQuestions('jm8');
                    layer.msg('基础知识模考8已加载完毕！');
                },
                btn43: function () {
                    loadQuestions('jm9');
                    layer.msg('基础知识模考9已加载完毕！');
                },
                btn44: function () {
                    loadQuestions('jm10');
                    layer.msg('基础知识模考10已加载完毕！');
                },
                btn45: function () {
                    loadQuestions('jm11');
                    layer.msg('基础知识模考11已加载完毕！');
                },
                btn46: function () {
                    loadQuestions('jm12');
                    layer.msg('基础知识模考12已加载完毕！');
                },
                btn47: function () {
                    loadQuestions('jm13');
                    layer.msg('基础知识模考13已加载完毕！');
                },
            });
            // layer.open({
            //     type: 1 ,//页面
            //     title: '请选择真题',
            //     area: '300px',
            //     shade: 0.8,
            //     id: 'pop-up3'
            // });
            // $(this).text("试卷锁定");
            $("#StartForm").removeClass("layui-disabled");
            console.log(67);
        } else {
            layer.msg("请先停止作答再选试卷哦");
        }
    });


    $("#StartForm").on("click", function () {
        if ($(this).text() == "开始答题") {
            $(this).text("暂停答题");
            $(".overmark").fadeOut();
            _begin = true;
            $(".hand_paper .layui-btn").removeClass("layui-disabled");
            $("#SelectExam").text("试卷锁定");
            $("#SelectExam").addClass("layui-disabled");
            Start();
        } else {
            $(this).text("开始答题");
            clearInterval(timer);
            $(".overmark").fadeIn();
            _begin = false;
            $(".hand_paper .layui-btn").addClass("layui-disabled");
            $("#SelectExam").text("选择试卷");
            $("#SelectExam").removeClass("layui-disabled");
        }
    });

    // 调整背景
    $(".change_color span").click(function () {
        var bgColor = $(this).css("background-color");
        $('body').css("background-color", bgColor);
    });
    // 调整字体大小
    $(".change_font i").click(function () {
        var fontSize = $(this).text();
        $('.question_content').attr("style", "font-size:" + fontSize + "px");
        $('.question_content .question_title').attr("style", "font-size:" + fontSize + "px");
        $('.question_content .options_l').attr("style", "font-size:" + fontSize + "px");
    });

    //论述题
    function textSelect(item) {
        var test = $(item).val();
        var id = $(item).parents('.question_all_same').attr('id');
        if (test == '') {
            $('.single_list a[href="#' + id + '"]').removeClass('add_color');
        } else {
            $('.single_list a[href="#' + id + '"]').addClass('add_color');
        }
    }

    // 论述题,完形填空标记
    $(".question_all").on('blur', "textarea", function () {
        textSelect(this);
    }).on('blur', "input", function () {
        textSelect(this);
    });

    var audios = document.getElementsByTagName("audio");

    function pauseAll() {
        layui.each(audios, function (i, item) {
            item.pause();
        });
    }

    /**button**/
    $("#SendForm").on("click", function () {
        if (!_begin) {
            layer.msg("请点击开始答题按钮。");
        } else {
            SubmitFom();
        }
    });

    //点击弹窗让试题下方的内容显示
    $(".close").on("click", function () {
        $(".analysis").show();
        $(".submit_layer").hide();
    });

    function SubmitFom() {
        clearInterval(timer);
        _json = {
            account: _account,
            token: _token,
            examID: _exid,
            examTypeCode: _code,
            examStyle: _style,
            examName: $("#exname").text(),
            count: $("#tcunt").text(),
            TestQuestion: CreateJson()
        };
        // 
        // RequestJson("exam/TiJiaoTest", {data: JSON.stringify(_json)}, function (res) {
        //     //弹窗展示试卷名字
        //     $("#examName").text(examName);
        //     showResult(res.gradedCount);
        //     //让弹窗显示
        //     $(".submit_layer").show();

        //     // layer.alert("<span style='color:red'>注：系统只提供客观题部分成绩。</span><br/>您的本次成绩：" + res.grade + " 分");
        // });
        // 注释掉提交，这里我让他直接显示 答案
        $(".submit_layer").show();
    }

    //点击交卷时的弹窗展示内容
    function showResult(gradedCount) {
        var interceptionCollection = gradedCount.split(";");
        if (interceptionCollection.length == 1) {
            var topic = gradedCount.split("-");
            var accuracy = (((topic[2] * 1) / (topic[1] * 1)) * 100).toFixed(2);
            $(".tbodyTopic").html("<tr><td>" + topic[0] + "</td><td>" + topic[1] + "</td><td>" + topic[2] + "</td><td>" + accuracy + "%" + "</td></tr><tr><td>综合成绩</td><td>" + topic[1] + "</td><td>" + topic[2] + "</td><td>" + accuracy + "%" + "</td></tr>");
        } else {
            var _result = "";
            var count1 = 0;
            var count = 0;
            var accurateCount1 = 0;
            var accurateCount = 0;
            layui.each(interceptionCollection, function (m, items) {
                var topicArray = items.split("-");
                count = (topicArray[1] * 1) + (count1 * 1);
                accurateCount = (topicArray[2] * 1) + (accurateCount1 * 1);
                var accuracy = (((topicArray[2] * 1) / (topicArray[1] * 1)) * 100).toFixed(2);
                _result += "<tr><td>" + topicArray[0] + "</td><td>" + topicArray[1] + "</td><td>" + topicArray[2] + "</td><td>" + accuracy + "%" + "</td></tr>";
                count1 = count;
                accurateCount1 = accurateCount;
            });
            var accuracyCount = (((accurateCount1 * 1) / (count1 * 1)) * 100).toFixed(2);
            _result += "<tr><td>综合成绩</td><td>" + count1 + "</td><td>" + accurateCount1 + "</td><td>" + accuracyCount + "%" + "</td></tr>";
            $(".tbodyTopic").html(_result);
        }
    }

    function CreateJson() {
        var questions = [];
        $("form").each(function () {
            if ($(this).serializeArray()[1].value == "") {

            } else {
                questions.push(JsonTools($(this).serializeArray()));
            }

        });
        return questions;
    }

    function JsonTools(json) {
        var jsonArray = {};
        for (var k in json) {
            jsonArray[json[k].name] = json[k].value;
        }
        return jsonArray;
    }

    window.Collections = function (_qcode, _prim, _second, _primpic, _secondpic, that) {
        if (_account == "f46354b31ec64c9c96919e12a9bbd610") {
            layer.msg("游客模式下无法使用此功能，请登录后使用。");
        } else {
            RequestJson("questioncollect/addQCollect.action", {
                account: _account,
                token: _token,
                ExamID: _exid,
                QuestionCode: _qcode
            }, function (data) {

                if (data.code == "1") {
                    $(that).toggleClass("change");
                }
                layer.msg(data.msg);
            });
        }
    }
    window.lookAnswer = function (id) {
        layer.open({
            type: 1,
            title: "查看答案",
            content: $("#" + id),
            area: ['500px', '350px'],
            skin: 'demo-class',
            closeBtn: 1,
            btn: '关 闭',
            btnAlign: 'c',
            offset: ['120px','300px'],
            scrollbar: false
        });
    }

    function GetTxt(txt) {
        return txt.replace(eval("/'/g"), "‘");
    }

    //中间选择题型
    $(function () {
        $(window).scroll(function () {
            var top = $(this).scrollTop();
            if (top >= 146) {
                $(".testing_select").addClass("active")
            } else {
                $(".testing_select").removeClass("active")
            }
        })
    });
    $("#downLoad").on("click", function () {


        if (_storage.user.role <= 4) {
            invisits(special, visits);
            $("#downLoad").attr("href", "web/getExamWordByStu?examID=" + _exid + "&account=" + _account + "&token=" + _token);
        } else {
            layer.msg("请登录后下载试卷 😇😇");
        }
    });
    loadWord();
    function loadWord() {
        if (_storage.user.role == "3") {
            invisits(special, visits);

            $("#outWord").attr("href", "web/getExamWord?examID=" + _exid + "&account=" + _account + "&token=" + _token);
        } else {
            $("#outWord").on("click", function () {
                if (!_begin) {
                    layer.msg("请点击开始答题按钮。");
                } else {
                    // layer.msg("抱歉！您的权限不足，请使用教师账号下载文件。");
                    layer.msg("抱歉哈！您的权限不足，请联系 Mr.ZCY 下载文件 😁😁");
                }
            }
            );
        }
    }

});
