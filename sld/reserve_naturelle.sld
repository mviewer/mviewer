<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0"  xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <sld:NamedLayer>
    <sld:Name>rb:reserve_naturelle_regionale</sld:Name>
    <sld:UserStyle>
      <sld:FeatureTypeStyle>
          <sld:Rule>
            <sld:PolygonSymbolizer>
              <sld:Fill>
                <sld:CssParameter name="fill">#7CC289</sld:CssParameter>
                <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
              </sld:Fill>
              <sld:Stroke>
                <sld:CssParameter name="stroke">#7CC289</sld:CssParameter>
                <sld:CssParameter name="stroke-width">0.8</sld:CssParameter>
              </sld:Stroke>
            </sld:PolygonSymbolizer>
          </sld:Rule>
      </sld:FeatureTypeStyle>
      <sld:FeatureTypeStyle>
        <sld:Transformation>
            <sld:Function name="gs:Centroid">
              <sld:Function name="parameter">
                <sld:Literal>features</sld:Literal>
              </sld:Function>
            </sld:Function>
        </sld:Transformation>
        <sld:Rule>
          <sld:Name>Classe_554</sld:Name>
          <sld:Title>Sans titre 554</sld:Title>
          <sld:PointSymbolizer>
            <sld:Graphic>
              <sld:ExternalGraphic>
                <sld:OnlineResource
                   xlink:type="simple"
                   xlink:href="http://kartenn.region-bretagne.fr/doc/icons_region/reserve_naturelle.svg" />
                 <sld:Format>image/svg</sld:Format>
               </sld:ExternalGraphic>
               <sld:Size>22</sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
        </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>

