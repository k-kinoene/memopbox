memopBox.Controller = {
  init: function () {
    this.mbAuth = memopBox.Auth.init();
    this.mbAuth.signin();
    this.mbDatastore = memopBox.Datastore.init(this.mbAuth);

    this.ngModule = angular.module('memopBox', []);

    var __this__ = this;
    this.ngModule.controller('mainCtrl', function ($scope) {
      $.mobile.loading("show", {
        text: "loading...",
        textVisible: true,
        theme: $.mobile.loader.prototype.options.theme,
        textonly: false,
        html: ""
      });

      // header area
      $scope.header = new memopBox.Model.Header("loading...");

      // main area
      $scope.main = new memopBox.Model.Main("", "", "", false, __this__, $scope);

      // left side area (memo list)
      $scope.memos = [new memopBox.Model.Memo("", "New memo", "", "", false, true, true, $scope)];

      // right side area (account info)
      $scope.accountInfo = new memopBox.Model.AccountInfo("loading", "", "");

      // footer
      $scope.footer = new memopBox.Model.Footer("2014", "k_kinoene");

      __this__.mbDatastore.selMemosAjax($scope);
      __this__.mbAuth.getAccountInfoAjax($scope);
    });
  }
};
