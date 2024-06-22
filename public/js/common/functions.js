var Toster = function (type, message, title = null, options = {}) {
  toastr.options = {
    "closeButton": true,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    ...options
  };

  if (title) {
    toastr[type](message, title);
    return;
  };
  toastr[type](message);

};

var setUrlParameter = function (key, value) {
  const url = new URL(location);
  url.searchParams.set(key, value);
  history.pushState({}, "", url);
};

var getUrlParameter = function (key) {
  const url = new URL(location);
  return url.searchParams.get(key);
}

