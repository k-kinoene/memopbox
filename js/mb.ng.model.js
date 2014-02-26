memopBox.Model = {
  Header: function (message) {
    this.message = message;
  },
  Main: function (id, title, content, puttable, dbObj, $scope) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.puttable = puttable;
    this.save = function () {
      if (!dbObj.mbAuth.isSignin()) {
        dbObj.mbAuth.signin();
      }

      if (this.content === "") {
        alert("Content is required.");
        return;
      }

      if (this.puttable) {
        if (!confirm("Put a file on your Dropbox?")) {
          return;
        }
      }

      if (this.title === "") {
        if (this.content.length > 10) {
          this.title = this.content.slice(0, 10) + "...";
        } else {
          this.title = this.content;
        }
      }
      var nowTime = new Date().getTime();
      var data = {};
      data[DATA_STORE.COLUMN_NAME.TITLE] = this.title;
      data[DATA_STORE.COLUMN_NAME.CONTENT] = this.content;
      data[DATA_STORE.COLUMN_NAME.DATE] = nowTime;
      data[DATA_STORE.COLUMN_NAME.PUTTABLE] = this.puttable;

      if (this.id !== "") {
        var record = dbObj.mbDatastore.upd(this.id, data);
        for (var i = 0; i < $scope.memos.length; i++) {
          if ($scope.memos[i].id === this.id) {
            $scope.memos.splice(i, 1);
            break;
          }
        }
      } else {
        var record = dbObj.mbDatastore.ins(data);
        this.id = record.getId();
        $("#mb-del-btn").button("enable");
      }

      for (var i = 0; i < $scope.memos.length; i++) {
        $scope.memos[i].selectedClass = "";
      }

      $scope.memos.splice(
          1,
          0,
          new memopBox.Model.Memo(this.id, this.title, this.content, nowTime, this.puttable, false, true, $scope)
      );

      if (this.puttable) {
        dbObj.mbDatastore.putFileAjax($scope);
      } else {
        $scope.header.message = "Saved this memo.";
        setTimeout(
          function () {
            $('#list').listview("refresh");
          },
          1
        );
        $.mobile.silentScroll(0);
      }
    };
    this.del = function () {
      if (!confirm("Delete this memo?(file will remain)")) {
        return;
      }
      if (!dbObj.mbAuth.isSignin()) {
        dbObj.mbAuth.signin();
      }

      dbObj.mbDatastore.del(this.id);
      $scope.header.message = "Deleted a memo.";
      $scope.memos[0].selectedClass = "mb-list-selected";

      for (var i = 0; i < $scope.memos.length; i++) {
        if ($scope.memos[i].id === this.id) {
          $scope.memos.splice(i, 1);
          break;
        }
      }

      this.id = "";
      this.title = "";
      this.content = "";
      this.puttable = false;
      setTimeout(
        function () {
          $("#title").focus();
          $("#mb-content-txt").textinput("refresh");
          $("#mb-file-chk").checkboxradio("refresh");
          $("#mb-del-btn").button("disable");
          $.mobile.silentScroll(0);
        },
        100
      );
    }
  },
  Memo: function (id, title, content, date, puttable, isNewMemo, selected, $scope) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.date = date;
    this.puttable = puttable;
    this.selectedClass = selected ? "mb-list-selected" : "";
    this.icon = isNewMemo ? "action" : "carat-r";
    this.select = function () {
      for (var i = 0; i < $scope.memos.length; i++) {
        $scope.memos[i].selectedClass = "";
      }
      this.selectedClass = "mb-list-selected";
      $scope.main.id = this.id;
      $scope.main.title = isNewMemo ? "" : this.title;
      $scope.main.content = this.content;
      $scope.main.puttable = this.puttable;

      $scope.header.message = isNewMemo ? "New memo" : this.title;

      setTimeout(
        function () {
          $("#mb-content-txt").textinput("refresh");
          $("#mb-file-chk").checkboxradio("refresh");
          $("#mb-del-btn").button(isNewMemo ? "disable" : "enable");
          $("#mb-panel").panel("close");
          $.mobile.silentScroll(0);
        },
        100
      );
    };
  },
  AccountInfo: function (name, email, quotaRatio) {
    this.name = name;
    this.email = email;
    this.quotaRatio = quotaRatio;
  },
  Footer: function (year, author) {
    this.year = year;
    this.author = author;
  }
}
