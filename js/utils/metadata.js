
export const getLayerMetadata = (id, mvLayers) => {
    return { url: mvLayers[id].metadata, csw: mvLayers[id].metadatacsw };
}