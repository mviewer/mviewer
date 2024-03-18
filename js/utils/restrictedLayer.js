export const onRestrictedLayerClick = () => {
    // Infos de connexion pour les couches à accès restreint
    document.querySelector("#savelogin").addEventListener("click", () => {
        const _service_url = $("#service-url").val();
        const _layer_id = $("#layer-id").val();
        sessionStorage.removeItem(_service_url);
        if ($("#user").val() != "" && $("#pass").val() != "")
            sessionStorage.setItem(_service_url, $("#user").val() + ":" + $("#pass").val());

        $("#loginpanel").modal("hide");
        // Refresh du layer
        mviewer.getMap().getLayers().getArray().forEach(lyr => {
            if (_layer_id == lyr.get("mviewerid")) {
                lyr.getSource().refresh();
            }
        })
    });
};