![image](https://github.com/jdev-org/mviewer/assets/16317988/bc4b75d3-92a1-42bb-b83b-77df1319bfa2)# Print

This extension provides a map layout interface to create and print a personalised PDF file.

Only A4 (portrail/landscape) are available for this version.

![image](https://github.com/jdev-org/mviewer/assets/16317988/e84fd308-e08d-4314-812c-1f1403beba92)

Here, you can find a simple PDF rendered with this mviewer Print extension :

[mviewer-print-example.pdf](https://github.com/jdev-org/mviewer/files/13376242/mviewer-print-example.pdf)



## Installation

By default, Print extension is already available in the `/demo/addons` directory.

So, use this extension as simple mviewer extension.

1. In you config xml file insert : 
```
<extensions>
  <extension type="component" id="print" path="demo/addons"/>
</extensions>
```

2. To allow many config by mviewer, add an application id inside <application> element :
```
<application id="my_print_app" title="A super title" />
```

3. Now, open demo/addons/print/config.json file and insert you application id to create a dedicated configuration by mviewer app :

In options (create this key if not available), insert `options.mviewer.applicationid` (change applicationid by application id value) like  :
```
"options": {
  "mviewer": {
    "my_print_app": {
    }
  }
}
```
**Now, read the next chapter to set up your app configuration.**

## Configuration

You just have to know that the layout template administration is not required and offer default layout (see next chapter).

Only 3 application properties are possible in the config.json file : 

- `printLayouts` : **required** *string* - layout template (JSON) URL to use
- `ownerLogo` : *string* - default logo to use in informations area
- `ownerInfos` : *string* - default text to use in informations area

  Here a simple example : 

```
  "options": {
    "mviewer": {
      "print": {
        "printLayouts": "demo/addons/print/layouts/standard.json",
        "ownerLogo": "https://avatars.githubusercontent.com/u/114171481?s=400&u=7fcf63ac01887ece3f5f2d5527e92c10527c7a91&v=4",
        "ownerInfos": "This is default text to present mviewer map."
      }
    }
  }
```

**That's all ! Now, learn how to manage and use a custom layout with a simple JSON file.**

## Layout with a JSON template

A template represents the configuration of the elements to be printed in a JSON file.

According to the previous configuration, you can use a custom layout template by mviewer application.

The default template is available in `demo/addons/print/layouts/standard.json`.

We will describe it in next chapters to understand how to create you own template (*open standard.json template beside for a better understanding*) .

## Formats & Orientations

A template will contains only one A4 format with 2 available orientation : landscape / portrait.

![image](https://github.com/jdev-org/mviewer/assets/16317988/2247a5a3-8bef-40ad-8c85-09c264e0fa8f)

So, in a JSON template file, you have to keep 2 entry by orientations : 
```
{
  "A4_LANDSCAPE" : {...},
  "A4_PORTRAIT": {...}
}
```

> You can rename each of this entries but it's not required and have no impact.

In each object (here A4_LANDSCAPE or A4_PORTRAIT), you will find `landscape <boolean>` option to indicate which config is landscape or portrait.

![image](https://github.com/jdev-org/mviewer/assets/16317988/33344031-e78a-4daf-936b-f53cf2b075e5)

If you remove one of this, only one will be available in print UI.

## Template items

By default, the print extension contains this items : 
- map
- legend
- title
- QR code picture
- information area
- comments area

![image](https://github.com/jdev-org/mviewer/assets/16317988/77b466d7-40cf-4245-b3f6-c140948ba0e9)


Each items are resizable and draggable (catch item by click hover grey badge) :

![resize](https://github.com/jdev-org/mviewer/assets/16317988/ced61ebd-fae4-4f40-b5df-514e728d7cb2)

Each item corresponding to a specific key. If a template doesn't contain a key, the corresponding div will not be created and will be not available in the print UI.
So, use this key in the JSON file to set the configuration by item and display / remove an item according to the layout you want.

You can find here the corresponding key for each item :


| Element      | Key          |
|--------------|--------------|
| map          | mapPrint     |
| informations | informations |
| comments     | comments     |
| legend       | legend       |
| title        | title        |
| qrcode       | qrcode       |

## Grid system

The Grid system allow to set an item position by columns and row values (6 row and 6 columns by default).

Here, a draw to understand row / col values : 

![image](https://github.com/jdev-org/mviewer/assets/16317988/9c0bc7d7-323a-45bc-b118-eecad06033ff)

> Here, find some documentation and playground to understand :
> https://developer.mozilla.org/fr/docs/Web/CSS/grid
> https://blog.hubspot.fr/website/css-grid
> https://codepen.io/HubSpot-France/pen/WNJvamo

So, in the layout JSON file, change default values to custom items positions.

Here, mapPrint position in standard layout JSON file : 

```
"mapPrint": {
    "row": "2/7",
    "col": "1/5"
},
```

## Global layout settings

