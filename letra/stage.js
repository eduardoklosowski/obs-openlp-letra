window.OpenLP = {
    loadService: function () {
        $.getJSON('/api/service/list', function (data) {
            for (var idx in data.results.items) {
                idx = parseInt(idx, 10);
                if (data.results.items[idx].selected) {
                    if (data.results.items[idx].plugin == 'songs') {
                        $('#letra').show();
                    } else {
                        $('#letra').hide();
                    }
                    break;
                }
            }
            OpenLP.updateSlide();
        });
    },

    loadSlides: function () {
        $.getJSON('/api/controller/live/text', function (data) {
            OpenLP.currentSlides = data.results.slides;
            OpenLP.currentSlide = 0;
            for (var idx in data.results.slides) {
                idx = parseInt(idx, 10);
                if (data.results.slides[idx].selected) {
                    OpenLP.currentSlide = idx;
                    break;
                }
            }
            OpenLP.loadService();
        });
    },

    updateSlide: function() {
        $('#letra').html(OpenLP.currentSlides[OpenLP.currentSlide].html);
    },

    pollServer: function () {
        $.getJSON('/api/poll', function (data) {
            if (OpenLP.currentItem != data.results.item ||
                    OpenLP.currentService != data.results.service) {
                OpenLP.currentItem = data.results.item;
                OpenLP.currentService = data.results.service;
                OpenLP.loadSlides();
            } else if (OpenLP.currentSlide != data.results.slide) {
                OpenLP.currentSlide = parseInt(data.results.slide, 10);
                OpenLP.updateSlide();
            }
        });
    }
};

$.ajaxSetup({ cache: false });

setInterval(OpenLP.pollServer, 500);
OpenLP.pollServer();
