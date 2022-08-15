sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
 ], function (Controller, JSONModel, Fragment) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.Overview", {
 
       onInit: function () {
          this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
 
       }
 
    });
 });