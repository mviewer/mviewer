export const authent = async (authInfos) => {
    const requestAuthent = await fetch(authInfos.url);
    if (requestAuthent.proxy === "true") {
        $("#login-box").show();
        let title = mviewer.lang ? mviewer.tr("tbar.right.logout") : "Se déconnecter";
        if (response.user != "") {
            $("#login").attr("href", authInfos.logouturl);
            $("#login").attr("title", title);
            $("#login span")[0].className = "fas fa-lock";
            $("#login-box>span").text(response.user);
        } else {
            var url = "";
            if (location.search == "") {
                url = authInfos.loginurl;
            } else {
                url = location.href + authInfos.loginurl.replace("?", "&");
            }
            $("#login").attr("href", url);
        }
    } else {
        console.log(
            [
                "mviewer n'a pas détecté la présence du security-proxy georChestra.",
                "L'accès aux couches protégées et à l'authentification n'est donc pas possible",
            ].join("\n")
        );
    }
}