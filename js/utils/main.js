import { deepExtend } from "./deepExtend.js";
import { xmlToJson } from "./xml2json.js";
import { sld2VectorLayer, sldFile2VectorLayer, sld2Legend } from "./geostyler.js";
utils.deepExtend = deepExtend;
utils.xmlToJson = xmlToJson;
utils.sld2VectorLayer = sld2VectorLayer;
utils.sldFile2VectorLayer = sldFile2VectorLayer;
utils.sld2Legend = sld2Legend;
