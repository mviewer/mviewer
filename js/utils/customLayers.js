export const loadCustomLayerFile = async (id, url) => {
    return new Promise((resolve, denied) => {
        const request = fetch(url);
        const blobFile = request.blob;
        var objectURL = URL.createObjectURL(blobFile);
        var scriptNode = document.createElement("script");
        scriptNode.setAttribute("src", objectURL);
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.onload = resolve(id);
        document.head.appendChild(scriptNode);
    })
}

