memopBox.Util = {
  quotaToRatio: function (qUsed, qAll) {
    var gb = 1024 * 1024 * 1024;
    var ratio =
        (Math.round(10 * qUsed / gb) / 10) + "GB / " +
        (Math.round(10 * qAll / gb) / 10) + "GB (" +
        (Math.round(1000* qUsed / qAll) / 10) + "%)";
    return ratio;
  }
};