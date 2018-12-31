/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.addEventListener("backbutton", function (e) { e.preventDefault(); }, false );
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        StatusBar.hide();

        var admobid = {
            banner: 'ca-app-pub-1308924557880612/9846123797',
            interstitial: 'ca-app-pub-1308924557880612/1776062085',
        };

        AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            isTesting: false,
            overlap: false,
            offsetTopBar: false,
            bgColor: 'black'
        });

        call_interstitial_prepare(admobid.interstitial);

        document.addEventListener('onAdDismiss', function(){
            call_interstitial_prepare(admobid.interstitial);
        });

        function call_interstitial_prepare(inter_id){
            AdMob.prepareInterstitial({
            adId: inter_id,
            isTesting: false,
            autoShow: false
            });
        }

        $('document').ready(function(){
            var storage = window.localStorage;
            var wrapCountdown = $('#wrap-countdown');
            var timeClickShowBanner = 90000;
            var delayShowBanner = setTimeout(function(){
                wrapCountdown.addClass('allready');
            }, timeClickShowBanner);

            var show_brn_full = function() {
                var countdownClass = wrapCountdown.attr('class');
                if(countdownClass == "allready"){
                    clearTimeout(delayShowBanner);
                    wrapCountdown.removeClass('allready').addClass('notready');
                    AdMob.showInterstitial();
                    delayShowBanner = setTimeout(function(){
                        wrapCountdown.removeClass('notready').addClass('allready');
                    }, timeClickShowBanner);
                }
            };

            var btn_show_brn_full = $('.btn-answer');
            btn_show_brn_full.click(function() {
                var answerSelect = $(this).children().attr('data-answer');
                if(answerSelect == 0){
                    show_brn_full();
                }
            });

            var appVersion = $('body').attr('data-appversion');
            $.ajax({
                cache: false,
                type: "GET",
                url: "http://lvgames.net/lvgversion/lvg_caudolienquan.json",
                async: false,
                success : function(val){
                    if(val.version_code > appVersion){
                        $('#wrap-updated').addClass('active');
                    }
                    storage.setItem('app_store_url', val.store_url);
                }
            });

            var store_app_url = storage.getItem('app_store_url');
            if(store_app_url !== null){
                $('#wrap-updated').find('.op-btn-update').attr('href', store_app_url);
                $('#wrap-review').find('.op-btn-review').attr('href', store_app_url);
            }else{
                $('#wrap-updated').hide();
                $('#wrap-review').hide();
            }

            var idWrapreview = $('#wrap-review');
            var btnReview = $('#wrap-review .op-btn-review');
            var btnReviewclose = $('#wrap-review .btn-close');
            setTimeout(function(){
                idWrapreview.addClass('already');
            }, 200000);

            if (storage.getItem("storage_review_check") === null) {
                storage.setItem('storage_btn_review', '1');
            }else{
                storage.removeItem('storage_btn_review');
            }

            $('a[href*="rank"]').click(function(){
                if (storage.getItem("storage_btn_review") !== null) {
                    if(idWrapreview.hasClass('already')){
                        if (storage.getItem("storage_review_check") === null) {
                            idWrapreview.addClass('active');
                            storage.setItem('storage_btn_review', '1');
                        }
                    }
                }
            });
            btnReview.click(function() {
             idWrapreview.removeClass('active');
             storage.setItem("storage_review_check", "1");
            });
            btnReviewclose.click(function() {
             idWrapreview.removeClass('active');
             storage.removeItem('storage_btn_review');
            });

        });

        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("menubutton", onMenuKeyDown, false);
    }
};

function onPause() {
    $('#bg_music_click').get(0).pause();
}

function onResume() {
    var storage = window.localStorage;
     var bgmusicStore = storage.getItem('bgmusic');
    if(bgmusicStore === 'true'){
        //nothing
    }else{
        $('#bg_music_click').get(0).play();
    }
}

function onMenuKeyDown() {
    $('#bg_music_click').get(0).pause();
}

app.initialize();