sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, Fragment, syncStyleClass, JSONModel) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.HelloPanel", {

		onInit: function () {
			var oView = this.getView();

			this.oModel = new JSONModel({
				bIsExpiring: true,
				iSecondsLeft: 99
			});

			oView.setModel(this.oModel);

			this.setTimeOutDialog();
		},

		onShowHello: function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);
			// show message
			MessageToast.show(sMsg);
		},

		onOpenDialog: function () {

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "sap.ui.demo.walkthrough.view.HelloDialog"
				}).then(function (oDialog) {
					// forward compact/cozy style into dialog
					syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), oDialog);
					return oDialog;
				}.bind(this));
			}
			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		onCloseDialog: function () {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("helloDialog").close();
		},

		setTimeOutDialog: function() {
			var self = this;
			this.intervalHandle = setInterval(function() { 
				self.handleOpenDialog();
			 },  15000);
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
			this.iSeconds = this.getView().byId("expirationInput").getValue();
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