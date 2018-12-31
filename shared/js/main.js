$('document').ready(function(){
  var body = $('body');
  var qtimg = $('.qtimg');
  var qttime = $('.qttime');
  var qtname = $('.qtname');
  var qtleft = $('.qtleft');
  var qtright = $('.qtright');
  var pathImg = 'shared/img/question/';
  var imgJpg = '.jpg';
  var soundShared = 'shared/sound/';
  var uiBtn = $('.ui-btn, .ui-btn-left, .ui-btn-right, .lvg_class, .zkbtn span, .zkbtn-circle a, .zkbtn-sound');
  var qtstar = $('.qtstar');
  var qtnotify = $('.qtnotify');
  var progessBar = $('#progressBar');
  var qtscore = $('.qtscore');
  var qthighscore = $('.qthighscore');
  var qtnewscore = $('.qtnewscore');
  var gameSuccess = 'shared/img/common/success.gif';
  var gameFailed = 'shared/img/common/failed.gif';
  var gameStart = 'shared/img/common/start.gif';
  var gameTimeup = 'shared/img/common/timeup.gif';
  var totalScore = 0;
  var txtWrong = 'Sai mất rồi!';
  var txtTimeup = 'Hết giờ rồi!';
  var btnAnswer = $('.btn-answer');
  var storage = window.localStorage;
  var quesStack = ques_stack_vn;
  var totalTime = 3; //time for progress bar
  var randomMax = quesStack.length - 1; //maximum show question
  var qtHeart = $('.qtheart');
  var zkapp_name = 'Câu Đố Liên Quân';

  //reset all
//  storage.setItem("totalScore", 10);
  // storage.setItem('firstscreen', '');
  // storage.setItem('zkheart', 1);

  /* Show Rank */
  getRank();

  /* Shared link */
  var zksharedLink = $('.zkshared_link');
  var check_name_str = storage.getItem('zkname_fm_str');
  if(check_name_str !== null){
    zksharedLink.show();
  }
  zksharedLink.children('a').click(function() {
    var zksharedLink_name = $('.zkname-main-user').text();
    var zksharedLink_rank = $('.zkshared_link_name span').text();
    var zksharedLink_point = $('.op_get_fb_share span').text();
    var zksharedLink_img = $('.qtrankimg img').attr('src');
    var zksharedLink_img_split1 = zksharedLink_img.split('/');
    var zksharedLink_img_split2 = zksharedLink_img_split1[3].split('.');
    window.open('http://lvgames.net/shared/lqm/?lqmtitle=Chúc mừng '+ zksharedLink_name +' đạt '+ zksharedLink_rank + ' tại ' + zkapp_name + '&lqmimg=http://lvgames.net/shared/lqm/'+ zksharedLink_img_split2[0] +'.jpg&lqmdesc=Bạn được '+ zksharedLink_point +' điểm tương đương bậc '+ zksharedLink_rank +' tại ứng dụng ' + zkapp_name, 'Chia sẻ điểm hạng tới FB', 'menubar=no,toolbar=no,resizable=no,width=100,height=100');
  });

  /* Get Ranking Json */
  var btnRanking = $('a[href*="rank"]');
  btnRanking.click(function(){
    getRankingAjax();
    append_rank_to_tbl();
  });

  function getRankingAjax(){
    $.ajax({
      url: "http://lvgames.net/bxh/bxhlqmjson/",
      type: 'GET',
      success: function (result) {
        storage.setItem('ranking_current', result);
      }
    });
  }

  function append_rank_to_tbl(){
    var zkrankingBoard = $('#zkranking-board');
    zkrankingBoard.children().remove();
    zkrankingBoard.append('<p>Đợi xíu...</p>');
    setTimeout(function(){
      zkrankingBoard.children().remove();
      var ranking_str = storage.getItem('ranking_current');
      if(ranking_str !== null){
        zkrankingBoard.append('<table><tr><th>Xếp Hạng</th><th>Tên</th><th>Số Điểm</th><th>Danh Hiệu</th></tr></table>');
        var output = $.parseJSON(ranking_str);
        for(var i=0; i<output.length; i++){
          var runName = output[i].name;
          zkrankingBoard.children('table').append('<tr><td>'+ output[i].no +'</td><td><span class="bxh_tbl_name">'+ output[i].title +'</span><i>BH: '+ runName.substr(-4) +'</i></td><td>'+ output[i].point +'</td><td>'+ output[i].rank +'</td></tr>');
        }
      }else{
        zkrankingBoard.children().remove();
        zkrankingBoard.append('<p>Hiện tại chưa có ai. hãy là người đầu tiên nào!!</p>');
      }
    },3000);
  }

  /* Form submit */
  var btnbBxhPage = $('.btn-bxh-page span');
  var btnSendPoint = $('.btn-send-point');
  var frm_zkname = $('#zkname_fm');
  var frm_zkname_val = $('#zkname_fm_val');
  var frm_zkphone = $('#zkphone_fm');
  var frm_zkphone_val = $('#zkphone_fm_val');
  var frm_zkpoint = $('#zkpoint_fm, #zkpoint_fm_val');
  var frm_zkrank = $('#zkrank_fm, #zkrank_fm_val');
  var frm_zknumber = $('#zknumber_fm');
  var frm_zknumber_val = $('#zknumber_fm_val');
  var frm_zkdate = $('#zkdate_fm');
  var check_zkname = storage.getItem('zkname_fm_str');
  var check_zknumber = storage.getItem('zknumber_fm_str');
  var zknameMain = $('.zkname-main');
  var zknameMainUser = $('.zkname-main-user');
  var zknameMainBh = $('.zkname-main-bh');

  if(check_zkname !== null && check_zknumber !== null){
    zknameMain.show();
    zknameMainUser.text(check_zkname);
    zknameMainBh.children().text(check_zknumber);
  }

  var send_point_bxh_url = 'http://lvgames.net/bxh/bxhlqm/';
  var check_frm_ok = 0;
  btnbBxhPage.click(function() {
    if($.trim(frm_zkname_val.val()) === ''){
      alert('Chưa nhập Tên.');
      frm_zkname_val.focus();
    }else{
      if(frm_zkphone_val.val() === ''){
        alert('Chưa nhập Số điện thoại.');
        frm_zkphone_val.focus();
      }else{
        if(!$.isNumeric($.trim(frm_zkphone_val.val()))){
          alert('Số điện thoại sai ời.');
          frm_zkphone_val.focus();
        }else{
          if($.trim(frm_zkphone_val.val()).length != 10){
            alert('Số điện thoại chưa đủ.');
            frm_zkphone_val.focus();
          }else{
            check_frm_ok = 1;
          }
        }
      }
    }

    if(check_frm_ok != 0){
      storage.setItem('zkname_fm_str', frm_zkname_val.val());
      frm_zkname.val(frm_zkname_val.val());
      frm_zkname_val.prop('disabled', true);
      send_point_bxh_url += '?zkname_fm=' + frm_zkname_val.val();

      storage.setItem('zkphone_fm_str', frm_zkphone_val.val());
      frm_zkphone.val(frm_zkphone_val.val());
      send_point_bxh_url += '&zkphone_fm=' + frm_zkphone_val.val();
      send_point_bxh_url += '&zkpoint_fm=' + frm_zkpoint.val();
      send_point_bxh_url += '&zkrank_fm=' + frm_zkrank.val();
      send_point_bxh_url += '&zknumber_fm=' + frm_zknumber.val();
      send_point_bxh_url += '&zkdate_fm=' + frm_zkdate.val();

      $.ajax({
        url: send_point_bxh_url,
        success: function (result) {
          zksharedLink.show();
          zknameMain.show();
          zknameMainUser.text(storage.getItem('zkname_fm_str'));
          zknameMainBh.children().text(storage.getItem('zknumber_fm_str'));
          $.mobile.changePage('#rank');
          getRankingAjax();
          append_rank_to_tbl();
        }
      });
    }
  });

  btnSendPoint.click(function() {
    var val_zkname = storage.getItem('zkname_fm_str');
    var val_zkphone = storage.getItem('zkphone_fm_str');
    var val_zkpoint = storage.getItem('totalScore');
    var val_zkrank = $('#restart .qtrank span').text();
    var val_zkdate_time = new Date();
    var val_zknumber_txt = addZ(val_zkdate_time.getSeconds()) + addZ(val_zkdate_time.getMinutes());
    var val_zknumber = storage.getItem('zknumber_fm_str');

    if(val_zkname !== null){
      frm_zkname.val(val_zkname);
      frm_zkname_val.val(val_zkname);
      frm_zkname_val.prop('disabled', true).parent('.ui-input-text').addClass('ui-state-disabled');
    }

    if(val_zkphone !== null){
      frm_zkphone.val(val_zkphone);
      frm_zkphone_val.val(val_zkphone);
    }

    frm_zkpoint.val(val_zkpoint);
    frm_zkrank.val(val_zkrank);
    if(val_zknumber === null){
      storage.setItem('zknumber_fm_str', val_zknumber_txt);
      frm_zknumber.val(val_zknumber_txt);
      frm_zknumber_val.hide();
    }else{
      frm_zknumber.val(val_zknumber);
      frm_zknumber_val.show().children().text(val_zknumber);
    }
    frm_zkdate.val(val_zkdate_time.getFullYear() + '-' + addZ(val_zkdate_time.getMonth()+1) + '-' + addZ(val_zkdate_time.getDate()) + ' ' + addZ(val_zkdate_time.getHours()) + ':' + addZ(val_zkdate_time.getMinutes()) + ':' + addZ(val_zkdate_time.getSeconds()));

  });

  function addZ(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* First Screen */
  var valFirstScreen = storage.getItem('firstscreen');
  var idFirstScreen = $('#first-screen');
  var btnFirstScreen = $('.zkbtnfirstscreen span');
  if(valFirstScreen === null || valFirstScreen === ''){
    idFirstScreen.show();
  }
  $('a[href*="#info"], .fs-style .close').click(function(){
    idFirstScreen.css({'display': ''}).toggleClass('active');
  });

  var zkHeart = parseInt(storage.getItem('zkheart'));
  var zkHeartShow = $('.bgheart-show');
  var bgheartCountdown = $('.bgheart-countdown');
  var bgheartBtn = $('.bgheart-btn');
  var bgheartTxt = $('.bgheart-txt');
  var timecd_heart = '0:60';

  btnFirstScreen.click(function(){
    idFirstScreen.hide();
    storage.setItem('firstscreen', 1);
    storage.setItem('zkheart', 3);
    qtHeart.children().text('3');
    zkHeartShow.text('3');
  });

  qtHeart.children().text(zkHeart);
  zkHeartShow.text(zkHeart);

  if(zkHeart < 3){
    time_countdown(bgheartCountdown, timecd_heart, function(){
      bgheartBtn.addClass('animated infinite pulse');
      bgheartTxt.show();
    });
  }else{
    bgheartCountdown.hide();
    bgheartBtn.addClass('disable');
  }

  bgheartBtn.click(function(){
    var heart_current = parseInt(storage.getItem('zkheart'));
    bgheartBtn.removeClass('animated infinite pulse');
    bgheartTxt.hide();
    if(heart_current < 3){
      var heart_new = heart_current + 1;
      storage.setItem('zkheart', heart_new);
      qtHeart.children().text(heart_new);
      zkHeartShow.text(heart_new);
      if(heart_new < 3){
        bgheartBtn.removeClass('disable');
        time_countdown(bgheartCountdown, timecd_heart, function(){
          bgheartBtn.addClass('animated infinite pulse');
          bgheartTxt.show();
        });
      }else{
        bgheartBtn.addClass('disable');
      }
    }else{
      bgheartBtn.addClass('disable');
    }
  });

  /* Show High Score */
  var currentScore = storage.getItem("totalScore");
  if(currentScore === null || currentScore === ''){
    currentScore = 1;
  }
  qthighscore.children().text(currentScore);

  randomGenerator.prototype = {
    reset: function() {
      this.remaining = [];
      for (var i = this.low; i <= this.high; i++) {
        this.remaining.push(i);
      }
    },
    get: function() {
      if (!this.remaining.length) {
        this.reset();
      }
      var index = Math.floor(Math.random() * this.remaining.length);
      var val = this.remaining[index];
      this.remaining.splice(index, 1);
      return val;        
    }
  }  

  var r = new randomGenerator(0, randomMax);
  var progDelay;

  var dialogConfirm = $("#dialog-confirm");
  btnAnswer.click(function() {
    var answerSelect = $(this).children().attr('data-answer');
    clearTimeout(progDelay);
    if(answerSelect != 0){
      soundRun('true_click');
      effectPages(function(){
        calcScore(progessBar.children().attr('data-time'));
        insertQuestion(quesStack,r);
        getStar();
        progressTime(totalTime, totalTime, progessBar);
      },gameSuccess,1000);
    }else{
      var zkHeart = parseInt(storage.getItem('zkheart'));
      if(zkHeart > 0){
        popup_question(dialogConfirm, zkHeart, function(){
          soundRun('true_click');
          effectPages(function(){
            insertQuestion(quesStack,r);
            getStar();
            progressTime(totalTime, totalTime, progessBar);
          },gameSuccess,1000);
          zkHeart--;
          storage.setItem('zkheart', zkHeart);
          qtHeart.children().text(zkHeart);
          if(zkHeart < 3){
            zkHeartShow.text(zkHeart);
            if(bgheartBtn.hasClass('animated') || bgheartCountdown.hasClass('running')){}else{
              time_countdown(bgheartCountdown, timecd_heart, function(){
                bgheartBtn.addClass('animated infinite pulse');
                bgheartTxt.show();
              });
            }
          }
        }, function(){
          soundRun('false_click');
          effectPages(function(){
            redirectPages('#restart', 'none');
            getHighscore();
            getNotify(txtWrong);
            getRank();
          },gameFailed,2000);
        });
      }else{
        soundRun('false_click');
        effectPages(function(){
          redirectPages('#restart', 'none');
          getHighscore();
          getNotify(txtWrong);
          getRank();
        },gameFailed,2000);
      }
    }
  });

  function getTimeup(){
    var zkHeart = parseInt(storage.getItem('zkheart'));
    if(zkHeart > 0){
      popup_question(dialogConfirm, zkHeart, function(){
        soundRun('true_click');
        effectPages(function(){
          insertQuestion(quesStack,r);
          getStar();
          progressTime(totalTime, totalTime, progessBar);
        },gameSuccess,1000);
        zkHeart--;
        storage.setItem('zkheart', zkHeart);
        qtHeart.children().text(zkHeart);
        if(zkHeart < 3){
          zkHeartShow.text(zkHeart);
          if(bgheartBtn.hasClass('animated') || bgheartCountdown.hasClass('running')){}else{
            time_countdown(bgheartCountdown, timecd_heart, function(){
              bgheartBtn.addClass('animated infinite pulse');
              bgheartTxt.show();
            });
          }
        }
      }, function(){
        soundRun('timeup_click');
        effectPages(function(){
          getHighscore('timeup');
          getNotify(txtTimeup);
          getRank();
          redirectPages('#restart', 'none');
        },gameTimeup,2000);
      });
    }else{
      soundRun('timeup_click');
      effectPages(function(){
        getHighscore('timeup');
        getNotify(txtTimeup);
        getRank();
        redirectPages('#restart', 'none');
      },gameTimeup,2000);
    }
  }

  $('.btn-start span').click(function() {
    effectPages(function(){
      resetScore();
      insertQuestion(quesStack,r);
      redirectPages('#main', 'none');
      progressTime(totalTime, totalTime, progessBar);
    },gameStart,2000);
  });

  $('.btn-restart span').click(function() {
    effectPages(function(){
      resetScore();
      insertQuestion(quesStack,r);
      redirectPages('#main', 'none');
      progressTime(totalTime, totalTime, progessBar);
    },gameStart,2000);
  });

  /* Functions */
  function getRank(){
    var element;
    var rankScore = storage.getItem("totalScore");
    var qtrank = $('.qtrank');
    var qtrankimg = $('.qtrankimg');
    var rankArray = [
      {id: 'go3', name: 'Gỗ 3', img: 'shared/img/common/rank_go.png'},
      {id: 'go2', name: 'Gỗ 2', img: 'shared/img/common/rank_go.png'},
      {id: 'go1', name: 'Gỗ 1', img: 'shared/img/common/rank_go.png'},
      {id: 'sat3', name: 'Sắt 3', img: 'shared/img/common/rank_sat.png'},
      {id: 'sat2', name: 'Sắt 2', img: 'shared/img/common/rank_sat.png'},
      {id: 'sat1', name: 'Sắt 1', img: 'shared/img/common/rank_sat.png'},
      {id: 'dong3', name: 'Đồng 3', img: 'shared/img/common/rank_dong.png'},
      {id: 'dong2', name: 'Đồng 2', img: 'shared/img/common/rank_dong.png'},
      {id: 'dong1', name: 'Đồng 1', img: 'shared/img/common/rank_dong.png'},
      {id: 'bac3', name: 'Bạc 3', img: 'shared/img/common/rank_bac.png'},
      {id: 'bac2', name: 'Bạc 2', img: 'shared/img/common/rank_bac.png'},
      {id: 'bac1', name: 'Bạc 1', img: 'shared/img/common/rank_bac.png'},
      {id: 'vang4', name: 'Vàng 4', img: 'shared/img/common/rank_vang.png'},
      {id: 'vang3', name: 'Vàng 3', img: 'shared/img/common/rank_vang.png'},
      {id: 'vang2', name: 'Vàng 2', img: 'shared/img/common/rank_vang.png'},
      {id: 'vang1', name: 'Vàng 1', img: 'shared/img/common/rank_vang.png'},
      {id: 'ruby4', name: 'Ruby 4', img: 'shared/img/common/rank_ruby.png'},
      {id: 'ruby3', name: 'Ruby 3', img: 'shared/img/common/rank_ruby.png'},
      {id: 'ruby2', name: 'Ruby 2', img: 'shared/img/common/rank_ruby.png'},
      {id: 'ruby1', name: 'Ruby 1', img: 'shared/img/common/rank_ruby.png'},
      {id: 'kc', name: 'Kim Cương', img: 'shared/img/common/rank_kc.png'},
    ];

    switch(true){
      case rankScore <= 50: element = 'go3'; break;
      case rankScore <= 100: element = 'go2'; break;
      case rankScore <= 150: element = 'go1'; break;
      case rankScore <= 200: element = 'sat3'; break;
      case rankScore <= 250: element = 'sat2'; break;
      case rankScore <= 300: element = 'sat1'; break;
      case rankScore <= 350: element = 'dong3'; break;
      case rankScore <= 400: element = 'dong2'; break;
      case rankScore <= 450: element = 'dong1'; break;
      case rankScore <= 500: element = 'bac3'; break;
      case rankScore <= 550: element = 'bac2'; break;
      case rankScore <= 600: element = 'bac1'; break;
      case rankScore <= 650: element = 'vang4'; break;
      case rankScore <= 700: element = 'vang3'; break;
      case rankScore <= 750: element = 'vang2'; break;
      case rankScore <= 800: element = 'vang1'; break;
      case rankScore <= 850: element = 'ruby4'; break;
      case rankScore <= 900: element = 'ruby3'; break;
      case rankScore <= 950: element = 'ruby2'; break;
      case rankScore <= 1000: element = 'ruby1'; break;
      case rankScore <= 1050: element = 'kc'; break;
      default: element = 'kc1'; break;
    }

    if(element == 'kc1'){
      var valRank = parseInt(((rankScore - 1000) / 100), 10);
      var rankCT;
      if(valRank >= 1){
        rankCT = 'Kim Cương ' + valRank;
      }else{
        rankCT = 'Kim Cương';
      }
      qtrank.children().text(rankCT);
      qtrankimg.children().attr('src', 'shared/img/common/rank_kc.png');
    }else{
      for(var i = 0; i<rankArray.length; i++){
        if(rankArray[i].id == element){
          qtrank.children().text(rankArray[i].name);
          qtrankimg.children().attr('src', rankArray[i].img);
        }
      }
    }

    clearTimeout(time);
    $('.qtrankimg img').addClass('animated tada');
    var time = setTimeout(function(){
      $('.qtrankimg img').removeClass('tada').addClass('infinite pulse');
    },2000);
  }

  function getStar() {
    if(qtname.attr('data-star') == 1){
      qtstar.addClass('active');
    }else{
      qtstar.removeClass('active');
    }
    return qtname.attr('data-star');
  }

  function getNotify($text){
    qtnotify.children().text($text);
  }

  function getHighscore(zkimgcheck){
    var qtcurrentscore = qtscore.children().text();
    var pointRound = parseInt(qtcurrentscore,10);
    var oldHighscore = storage.getItem("totalScore");
    var qthighscorestage = $('.qthighscorestage');
    var zkimg02 = $('.zkimg02');
    zkimg02.removeClass('animated tada infinite pulse');
    clearTimeout(time);
    zkimg02.addClass('animated tada').hide();
    var time = setTimeout(function(){
      zkimg02.removeClass('tada').addClass('infinite pulse');
    },1000);
    
    if(pointRound > oldHighscore){
      storage.setItem("totalScore", pointRound);
      qthighscore.children().text(storage.getItem("totalScore"));
      qthighscorestage.show().children('.zkpanel-span').text(qtcurrentscore);
      qtnewscore.hide();
      zkimg02.show().children('img').attr('src', 'shared/img/common/zuka02.png');
      zkimg02.children('span').html('Dze!! Có tiến bộ rùi<br>Cố lên nửa nào!!');
    }else{
      qthighscorestage.hide();
      qtnewscore.show().children().text(qtcurrentscore);
      zkimg02.show().children('img').attr('src', 'shared/img/common/zuka03.png');
      if(zkimgcheck == 'timeup'){
        zkimg02.children('span').html('Hết giờ rùi tiếc quá!!<br>Chơi lại cái nà!!');
      }else{
        zkimg02.children('span').html('Ôi!! Sai mất rồi!!<br>Chơi lại nào!!');
      }
    }
  }

  function calcScore(score){
    var valStar = getStar();
    var intScore = parseInt(score) + 1;
    var curScore = parseInt(qtscore.children().text(), 10);
    var scoreX;
    if(valStar == 1){
      scoreX = 5*2;
    }else{
      scoreX = 5;
    }
    var calc = curScore + (intScore > 3 ? 3 : intScore)*scoreX;
    qtscore.children().prop('number', curScore).animateNumber({
      number: calc
    },1000);
    qtscore.addClass('animated bounceIn');
    setTimeout(function() {
      qtscore.removeClass('animated bounceIn');
    }, 1000);
  }

  function resetScore(){
    qtscore.children().text(0);
  }

  function progressTime(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find('div').stop().animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, 'linear').attr('data-time', timeleft);
    if(timeleft >= 0) {
      progDelay = setTimeout(function() {
        progressTime(timeleft - 1, timetotal, $element);
      }, 1000);
    }else{
      btnDisOrNot(btnAnswer,1);
      getTimeup();
    }
  }

  function btnDisOrNot(btn,stt) {
    if(stt == 1){
      btn.addClass('disable');
    }else{
      btn.removeClass('disable');
    }
  }

  function effectPages(object,type,time){
    clearTimeout(timeDelay);
    $('.result-panel').addClass('active').children().attr('src', type);
    var timeDelay = setTimeout(function() {
      $('.result-panel').removeClass('active');
      object();
    }, time);
  }

  function insertQuestion(newArr, r){
    btnDisOrNot(btnAnswer, 0);
    var elementArr = newArr[r.get()];
    qtimg.children('.zkquesimg').css({'background-image': 'url(' + pathImg + elementArr.img + imgJpg + ')'});
    qtname.text(elementArr.name).attr({'data-star': elementArr.star});
    qtleft.children().attr({'data-answer': elementArr.anleft});
    qtright.children().attr({'data-answer': elementArr.anright});
  };

  function redirectPages(page,effect){
    if(effect !== null){
      $.mobile.changePage( page, { transition: effect} );
    }else{
      $.mobile.changePage( page );
    }
  }

  function randomGenerator(low, high) {
    if (arguments.length < 2) {
      high = low;
      low = 0;
    }
    this.low = low;
    this.high = high;
    this.reset();
  }

  function time_countdown(selector, time_str, output){
    selector.addClass('running').text(time_str).show();
    selector.parent().addClass('disable');
    var interval = setInterval(function() {
      var timer = time_str.split(':');
      var minutes = parseInt(timer[0], 10);
      var seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0){
        clearInterval(interval);
        selector.removeClass('running').hide();
        selector.parent().removeClass('disable');
        output();
      }
      seconds = (seconds < 0) ? 59 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      selector.text(minutes + ':' + seconds);
      time_str = minutes + ':' + seconds;
    }, 1000);
  }

  function popup_question(selector, heart_v, cont_f, stop_f){
    selector.dialog({
      show: {effect: 'fade', duration: 250},
      hide: {effect: 'fade', duration: 150},
      dialogClass: "zkdialogcontinue",
      open: function() {
        $(this).html('<p>Đang có '+ heart_v +' <img src="shared/img/common/heart.png" alt="">, tiếp tục nào!!</p>');
      },
      buttons: {
        "Tiếp tục": function () {
          $(this).dialog('close');
          cont_f();
        },
        "Dừng lại": function () {
          $(this).dialog('close');
          stop_f();
        }
      }
    });
  }

  /* Main click */
  var click03 = soundShared + 'click03.wav';
  var clickTrue = soundShared + 'true.mp3';
  var clickFalse = soundShared + 'false.mp3';
  var clickTimeup = soundShared + 'timeup.mp3';
  var bgMusic = soundShared + 'bg.mp3';
  var typeOgg = 'audio/ogg';
  var typeWav = 'audio/wav';
  var typeMpeg = 'audio/mpeg';
  body.append('<audio id="main_click" src="'+ click03 +'" type="'+ typeWav +'"></audio>');
  body.append('<audio id="true_click" src="'+ clickTrue +'" type="'+ typeMpeg +'"></audio>');
  body.append('<audio id="false_click" src="'+ clickFalse +'" type="'+ typeMpeg +'"></audio>');
  body.append('<audio id="timeup_click" src="'+ clickTimeup +'" type="'+ typeMpeg +'"></audio>');

  var bgmusicStore = storage.getItem('bgmusic');
  if(bgmusicStore === 'true'){
    body.append('<audio id="bg_music_click" src="'+ bgMusic +'" type="'+ typeMpeg +'" loop></audio>');
    $('a[href*="bgmusic"]').addClass('active');
  }else{
    setTimeout(function(){
      body.append('<audio id="bg_music_click" src="'+ bgMusic +'" type="'+ typeMpeg +'" loop autoplay></audio>');
    }, 3000);
  }

  $('a[href*="bgmusic"]').click(function(){
    if($(this).hasClass('active')){
      $('a[href*="bgmusic"]').removeClass('active');
      $('#bg_music_click').get(0).play();
      storage.setItem('bgmusic', 'false');
    }else{
      $('a[href*="bgmusic"]').addClass('active');
      $('#bg_music_click').get(0).pause();
      storage.setItem('bgmusic', 'true');
    }
  });

  uiBtn.on('click', function(){
    soundRun('main_click');
  });

  function soundRun(item){
    $('#' + item).get(0).play();
  }

});