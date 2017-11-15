/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};

require("./theme");

const Router = require("sf-core/ui/router");
const stylerBuilder = require("library/styler-builder");
const settings = require("./settings.json");
stylerBuilder.registerThemes(settings.config.theme.themes || "Defaults");
stylerBuilder.setActiveTheme(settings.config.theme.currentTheme);

const Shopify = require("sf-extension-shopify");
const Config = require("config.js");
Shopify.Authentication.setAPIKey(Config.SHOPIFY_APIKey);
Shopify.Authentication.setPassword(Config.SHOPIFY_PASSWORD);
Shopify.Authentication.setStoreName(Config.SHOPIFY_STORENAME);


// Define routes and go to initial page of application
// Router.add("page1", require("./pages/page1"));
// Router.add("page2", require("./pages/page2"));
Router.add("pgLogin", require("./pages/pgLogin"));
Router.add("pgList", require("./pages/pgList"));
Router.go("pgLogin");
