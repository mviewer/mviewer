export const updateViewPort = function (s, displayMode) {
    window.mobile = s === "xs";
    if (s === "xs") {
        const selectors = [...document.querySelectorAll("#wrapper, #main")];
        selectors.forEach(el => {
            el.classList.remove("xl");
            el.classList.add("xs");
        });
        $("#menu").appendTo("#thematic-modal .modal-body");
        $("#legend").appendTo("#legend-modal .modal-body");
        if (displayMode) {
            selectors.forEach(el => el.classList.add("mode-" + displayMode));
            $("#page-content-wrapper").append(`
                    <a
                        id="btn-mode-su-menu"
                        class="btn btn-sm btn-default"
                        type="button"
                        href="#"
                        data-toggle="modal"
                        data-target="#legend-modal"
                        title="Afficher la légende"
                        i18n="data.toggle">
                        <i class="fas fa-layer-group"></i>
                        <span i18n="data.toggle"> Afficher la légende</span>
                    </a>`);
            if (displayMode === "u") {
                document.querySelector("#mv-navbar").remove()
            }
        }
    } else {
        [...document.querySelectorAll("#wrapper, #main")].forEach(el => {
            el.classList.remove("xs");
            el.classList.add("xl");
        });
        $("#menu").appendTo("#sidebar-wrapper");
        $("#legend").appendTo("#layers-container-box");
    }
};

export const updateMedia = function (size, mediaSize) {
    switch (size) {
        case "xs":
        case "sm":
            if (mediaSize === "xl") {
                updateViewPort("xs");
            }
            break;
        case "md":
        case "lg":
            if (mediaSize === "xs") {
                updateViewPort("xl");
            }
            break;
    }
}

export const initDisplayMode = () => {
    let displayMode = "d"; /* d :default, s: simple, u: ultrasimple */
    window.mobile = false;
    let mediaSize = "xl";

    if (API.mode && (API.mode === "s" || API.mode === "u")) {
        displayMode = API.mode;
        if (API.mode === "u") {
            //Show searchtool on main div
            $("#searchtool").appendTo("#main");
            document.querySelector("#searchtool").classList.removeClass("navbar-form");
        }
    }
    const htmlScreen = document.querySelector('html');

    if (htmlScreen.clientWidth < 992 || displayMode !== "d") {
        mediaSize = "xs";
        window.mobile = true;
    } else {
        mediaSize = "xl";
        window.mobile = false;
    }
    if (mediaSize === "xs") {
        updateViewPort("xs", displayMode);
    }
    // default mode
    if (displayMode === "d") {
        $(window).resize(function () {
            let newWidth = htmlScreen.clientWidth;
            let bootstrapSize = "";
            if (newWidth < 768) {
                bootstrapSize = "xs";
            } else if (newWidth < 992) {
                bootstrapSize = "sm";
            } else if (newWidth < 1200) {
                mediabootstrapSizeSize = "md";
            } else if (newWidth >= 1200) {
                bootstrapSize = "lg";
            }
            // TODO : control current size to avoid useless updateMedia
            updateMedia(bootstrapSize, mediaSize);
        });
    }
    if (window.mobile) {
        $("#thematic-modal .modal-body").append(
            '<ul class="sidebar-nav nav-pills nav-stacked" id="menu"></ul>'
        );
        $("#legend").appendTo("#legend-modal .modal-body");
    } else {
        $("#sidebar-wrapper").append(
            '<ul class="sidebar-nav nav-pills nav-stacked" id="menu"></ul>'
        );
    }

    [...document.querySelectorAll(".navbar-collapse a, #map")].forEach(el => {
        el.addEventListener("click", () => {
            const classList = document.querySelector(".navbar-collapse").classList;
            if (classList.contains("in")) {
                document.querySelector(".navbar-toggle").click()
            }
        })
    })
}