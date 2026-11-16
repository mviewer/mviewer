import { deepExtend } from "./deepExtend.js";
import { xmlToJson } from "./xml2json.js";
import { Cluster } from "./cluster.js";
import { getClickedFeatures, createFeatureClickEvent } from "../infos/featureClick.js";
import { sld2VectorLayer, sldFile2VectorLayer } from "./geostyler/geostyler.js";
import { sld2Legend } from "./geostyler/geostylerLegend.js";
import { resolveLocalWmsSld, testSld } from "./sld.js";
import {
  detectPointStacker,
  pointStackerToOlCluster,
} from "./geostyler/geostylerPointStacker.js";
// Expose module exports to classic scripts such as configuration.js.
utils.Cluster = Cluster;
utils.getClickedFeatures = getClickedFeatures;
utils.createFeatureClickEvent = createFeatureClickEvent;
utils.detectPointStacker = detectPointStacker;
utils.pointStackerToOlCluster = pointStackerToOlCluster;
utils.resolveLocalWmsSld = resolveLocalWmsSld;
utils.testSld = testSld;
utils.deepExtend = deepExtend;
utils.xmlToJson = xmlToJson;
utils.sld2VectorLayer = sld2VectorLayer;
utils.sldFile2VectorLayer = sldFile2VectorLayer;
utils.sld2Legend = sld2Legend;
