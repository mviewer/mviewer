#!/usr/bin/env python
 # -*- coding: UTF-8 -*-
from xml.dom import minidom
doc = minidom.Document()
#create <config> node
config = doc.createElement('config')
doc.appendChild(config)
#create <config><application> node
application = doc.createElement('application')
application.setAttribute('title', 'mviewer')
application.setAttribute('style', 'css/apps/kartenn_eolien.css')
application.setAttribute('logo', 'img/logo/geobretagne.png')
config.appendChild(application)
#create <config><mapoptions> node
mapoptions = doc.createElement('mapoptions')
mapoptions.setAttribute('maxzoom', '19')
mapoptions.setAttribute('projection', 'EPSG:3857')
mapoptions.setAttribute('center', '-220750.13768758904,6144925.57790189')
mapoptions.setAttribute('zoom', '8')
mapoptions.setAttribute('projextent', '-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244')
config.appendChild(mapoptions)
#create <config><baselayers> node
baselayers = doc.createElement('baselayers')
baselayers.setAttribute('style', 'default')
config.appendChild(baselayers)
#Setting parameters for each baselayer
dic_baselayer = [
    {
        'type': 'OSM',
        'id':'osm1',
        'label': 'OpenStreetMap',
        'title': 'OpenStreetMap',
        'thumbgallery': 'img/basemap/osm.png',
        'url': 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'visible': 'true',
        'attribution': '© MapQuest. Données : les contributeurs d\'<a href=\'http://www.openstreetmap.org/\'' \
                         'target=\'_blank\'>OpenStreetMap </a>, <a href=\'http://www.openstreetmap.org/copyright\''\
                         'target=\'_blank\'>ODbL </a>'
     },
    {
        'type': 'WMTS',
        'id': 'ortho1',
        'label': 'Photo aérienne',
        'title': 'GéoBretagne',
        'thumbgallery': 'img/basemap/ortho.jpg',
        'url': 'http://tile.geobretagne.fr/gwc02/service/wmts',
        'layers': 'satellite',
        'visible': 'false',
        'style': '_null',
        'matrixset': 'EPSG:3857',
        'fromcapacity': 'false',
        'attribution': '<a href=\'http://applications.region-bretagne.fr/geonetwork/?uuid=3a0ac2e3-7af1-4dec-9f36-dae6b5a8c731\''\
                                 'target=\'_blank\' >partenaires GéoBretagne - IGN RGE BD ORTHO - PlanetObserver</a>'
    }
]
#create <config><baselayers><baselayer> nodes for each baselayer
for bl in dic_baselayer:
    baselayer = doc.createElement('baselayer')
    for attr in bl:
        baselayer.setAttribute(attr, bl[attr])
    baselayers.appendChild(baselayer)

#create <config><themes> node
themes = doc.createElement('themes')
config.appendChild(themes)
#Setting parameters for each theme
dic_theme = [
    {
        'name': 'Territoires',
        'id': 'territoires',
        'icon': 'home'
        
    }
]
#create <config><themes><theme> node for each theme
for th in dic_theme:
    theme = doc.createElement('theme')
    for attr in th:
        theme.setAttribute(attr, th[attr])
    themes.appendChild(theme)

#setting parameters for each layer
dic_layer = [
    {
        'id': 'buildup',
        'theme': 'territoires',
        'name': 'Zones artificialisées',
        'visible': 'true',
        'opacity': '0.5',
        'tiled': 'false',
        'url': 'http://geobretagne.fr/geoserver/europe/wms',
        'timefilter': 'true',
        'timecontrol': 'slider',
        'timevalues': '1975,1990,2000,2014',
        'metadata-csw': '',
        'metadata': ''
    }
]
#create <config><themes><theme><layer> node for each layer
for l in dic_layer:
    layer = doc.createElement('layer')
    currentTheme = l['theme']
    for attr in l:
        layer.setAttribute(attr, l[attr])
    #Find the theme to append
    for t in themes.childNodes:
        if (t.getAttribute('id') == currentTheme):
            t.appendChild(layer)
    
#write config.xml file
xml_str = doc.toprettyxml(indent="  ")
with open("agrocampus.xml", "w") as f:
    f.write(xml_str)
