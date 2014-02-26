memopBox.Auth = {
  init: function () {
    this.client = new Dropbox.Client({ key: DROPBOX_APP_KEY });
    this.client.authenticate({ interactive: false }, function (error) {
      if (error) {
        alert(error);
      }
    });
    return this;
  },
  signin: function () {
    this.client.authenticate();
    if (!this.isSignin()) {
      alert(error);
    }
  },
  signout: function () {
    this.client.signOut({ mustInvalidate: false }, function (error) {
      if (error) {
        alert(error);
      }
    });
    location.reload();
  },
  isSignin: function () {
    return this.client.isAuthenticated();
  },
  getAccountInfoAjax: function ($scope) {
    this.client.getAccountInfo(function (error, account) {
        $scope.accountInfo.countryCode  = account.countryCode;
        $scope.accountInfo.name = account.name;
        $scope.accountInfo.email = account.email;
        $scope.accountInfo.quotaRatio = memopBox.Util.quotaToRatio(account.usedQuota, account.quota);

        $scope.$apply();
    });
  }
};

