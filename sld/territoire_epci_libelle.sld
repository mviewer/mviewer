<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <sld:NamedLayer>
    <sld:Name>dreal_b:EPCI_053</sld:Name>
    <sld:UserStyle>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:MaxScaleDenominator>1300000</sld:MaxScaleDenominator>
          <sld:Name>Classe_1985</sld:Name>
          <sld:Title>epci_libelle</sld:Title>
          <sld:TextSymbolizer>
            <sld:Label>
              <ogc:PropertyName>NOM_EPCI</ogc:PropertyName>
            </sld:Label>
            <sld:Font>
              <sld:CssParameter name="font-family">Arial</sld:CssParameter>
              <sld:CssParameter name="font-size">10</sld:CssParameter>
              <sld:CssParameter name="font-weight">bold</sld:CssParameter>
              <sld:CssParameter name="font-color">#616161</sld:CssParameter>
            </sld:Font>
            <sld:LabelPlacement>
               <sld:PointPlacement>
                 <sld:AnchorPoint>
                   <sld:AnchorPointX>0.5</sld:AnchorPointX>
                   <sld:AnchorPointY>0</sld:AnchorPointY>
                 </sld:AnchorPoint>
               </sld:PointPlacement>
             </sld:LabelPlacement>
            <sld:Halo>
              <sld:Radius>2</sld:Radius>
              <sld:Fill>
                <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
                <sld:CssParameter name="fill-opacity">1</sld:CssParameter>
              </sld:Fill>
            </sld:Halo>
          </sld:TextSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>


