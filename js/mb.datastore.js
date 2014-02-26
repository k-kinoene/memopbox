memopBox.Datastore = {
  init: function (auth) {
    this.auth = auth;
    this.client = auth.client;
    this.table = null;
    this.datastoreManager = this.client.getDatastoreManager();
    return this;
  },
  selMemosAjax: function ($scope) {
    var _this = this;
    this.datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert(error);
        $.mobile.loading("hide");
        return;
      }
      _this.table = datastore.getTable(DATA_STORE.TABLE_NAME);
      var records = _this.table.query();
      records.sort(_this.comparertor);

      for (var i = 0, l = records.length; i < l; i++) {
        $scope.memos.push(
          new memopBox.Model.Memo(
            records[i].getId(),
            records[i].get(DATA_STORE.COLUMN_NAME.TITLE),
            records[i].get(DATA_STORE.COLUMN_NAME.CONTENT),
            records[i].get(DATA_STORE.COLUMN_NAME.DATE),
            records[i].get(DATA_STORE.COLUMN_NAME.PUTTABLE),
            false,
            false,
            $scope
          )
        );
      }

      $.mobile.loading("hide");
      $scope.header.message = "New memo";

      $scope.$apply();

      $("#title").focus();
      $("#list").listview("refresh");
      $("#content").textinput("refresh");
    });
  },
  ins: function (data) {
    return this.table.insert(data);
  },
  upd: function (recordId, data) {
    var record = this.table.get(recordId);
    record.set(DATA_STORE.COLUMN_NAME.TITLE,    data[DATA_STORE.COLUMN_NAME.TITLE]);
    record.set(DATA_STORE.COLUMN_NAME.CONTENT,  data[DATA_STORE.COLUMN_NAME.CONTENT]);
    record.set(DATA_STORE.COLUMN_NAME.DATE,     data[DATA_STORE.COLUMN_NAME.DATE]);
    record.set(DATA_STORE.COLUMN_NAME.PUTTABLE, data[DATA_STORE.COLUMN_NAME.PUTTABLE]);
    return record;
  },
  putFileAjax: function ($scope) {
    $.mobile.loading("show", {
      text: "putting a file...",
      textVisible: true,
      theme: $.mobile.loader.prototype.options.theme,
      textonly: false,
      html: ""
    });

    this.client.writeFile(
      $scope.main.title.replace(/\\|\/|\:|\*|\?|\"|\<|\>|\|/g, " ") + ".txt",
      $scope.main.content.replace(/\r\n|\r|\n/g, "\r\n"),
      { noOverwrite: false },
      function (error, stat) {
        if (error) {
          alert(error);
        }
        $.mobile.silentScroll(0);
        $.mobile.loading("hide");
        $scope.header.message = "Saved this memo, and put a file:{DropBox}/" + ($scope.accountInfo.countryCode==="JP"?"アプリ":"Apps") + "/MemopBox/" + stat.name;
        $scope.$apply();
      }
    );
  },
  del: function (recordId) {
    return this.table.get(recordId).deleteRecord();
  },
  comparertor: function (a, b) {
    var d1 = a.get(DATA_STORE.COLUMN_NAME.DATE);
    var d2 = b.get(DATA_STORE.COLUMN_NAME.DATE);
    return d2 - d1;
  }
};