sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
   "use strict";
   return Controller.extend("sap.ui.demo.walkthrough.controller.App", {

      onInit: function () {
         this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

         var oView = this.getView();

         this.oModel = new JSONModel({
            bIsExpiring: true,
            iSecondsLeft: 99
         });

         oView.setModel(this.oModel);

         this.setTimeOutDialog();

         var oEventBus = this.getOwnerComponent().getEventBus();

         oEventBus.subscribe("resetTimeOutdialog", this.resetTimeOutdialog, this);
      },

      setTimeOutDialog: function () {
         var self = this;
         this.intervalHandle = setInterval(function () {
            self.handleOpenDialog();
         }, 10000);
      },

      resetTimeOutdialog: function () {
         clearInterval(this.intervalHandle);
         this.setTimeOutDialog();
      },

      handleOpenDialog: function () {
         if (!this._oDialog) {
            Fragment.load({
               name: "sap.ui.demo.walkthrough.view.TimeoutDialog",
               controller: this
            }).then(function (oDialog) {
               this._oDialog = oDialog;

               this.getView().addDependent(this._oDialog);

               this.onDialogOpen();
            }.bind(this));
         } else {
            this.onDialogOpen();
         }
      },

      onDialogOpen: function () {
         this._oDialog.open();
         this._startCounter();
      },

      onDialogClose: function () {
         this._oDialog.close();
         this._stopCounter();
      },

      onSignIn: function () {
         this.onDialogClose();

         // Insert your Sign In Logic here...

      },

      onExit: function () {
         this._stopCounter();
      },

      _decrementCounter: function () {
         this._onUpdateStatus();
         if (this.iSeconds === 0) {
            this._stopCounter();
            this._onCounterEnd();
            return;
         }
         this.iSeconds--;
      },

      _startCounter: function () {
         this.iSeconds = 5;
         this._onCounterStart();
         clearInterval(this.oTimer);
         this.oTimer = setInterval(this._decrementCounter.bind(this), 1000);
      },

      _stopCounter: function () {
         clearInterval(this.oTimer);
         this.oTimer = null;
      },

      _onUpdateStatus: function () {
         this.oModel.setProperty('/iSecondsLeft', this.iSeconds);
      },

      _onCounterStart: function () {
         this.oModel.setProperty('/bIsExpiring', true);
         this.oModel.setProperty('/iSecondsLeft', this.iSeconds);
         this.iSeconds--;
      },

      _onCounterEnd: function () {
         this.oModel.setProperty('/bIsExpiring', false);
      }

   });
});