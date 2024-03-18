export const readStats = ({ stats, statsurl }) =>
    stats === "true" && statsurl ? $.get(conf.application.statsurl + "?app=" + document.title) : null;

export const getApplicationTitle = ({ title, htmltitle, statsurl = "", stats = false }) => {
    let appTitle = API.title || title || "";
    if (title) {
        document.title = title;
        appTitle = htmltitle || title;
        $(".mv-title").text("");
        $(".mv-title").append(title);
    }
    if (stats === "true" && statsurl) {
        $.get(statsurl + "?app=" + document.title);
    }
    return appTitle;
}

export const getHelpTitle = ({ titleHelp }) => $("#help h4.modal-title").text(titleHelp)

export const getLanguages = ({ lang }) => {
    const langInfos = { all: [], lang: "" };
    if (lang) {
        // default lang from config file
        const languages = lang.split(",");
        if (languages.length > 1) {
            lang.all = languages;
        }
        lang.default = languages[0];
    }
    if (API.lang && API.lang.length > 0) {
        // apply lang set in URL as param
        langInfos.lang = API.lang;
    }
    return langInfos;
}

export const getLogo = ({ logo }) => logo ? $(".mv-logo").attr("src", logo) : null;

export const showHelpOnStart = ({ showhelp }) => {
    let showOnstart = showhelp === "true";
    // needs regex instead includes
    if (API.popup && API.popup.includes("true", "false")) {
        showOnstart = API.popup === "true";
    }
    return showOnstart;
}

export const getIconHelp = ({ iconhelp }) => iconhelp ? $("#iconhelp span").attr("class", iconhelp) : null;

