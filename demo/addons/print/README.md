# Print

This extension provides a map layout interface to create and print a personalised PDF file.

Only A4 (portrail/landscape) are available for this version.

![image](https://github.com/jdev-org/mviewer/assets/16317988/e84fd308-e08d-4314-812c-1f1403beba92)

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


