# Print

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

## Create you own template

According to the previous configuration, you can use a custom layout template by mviewer application.

### What is a layout template ?

A template represents the configuration of the elements to be printed in a JSON file.

The default template is available in `demo/addons/print/layouts/standard.json`.

We will describe it to understand how to create you own template.

### Template items

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


