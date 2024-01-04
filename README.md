# Material Design Icons for Pencil

All 7,400+ icons from [Material Design Icons](https://pictogrammers.com/library/mdi) as a [Pencil](https://pencil.evolus.vn) stencil collection.

Contains original SVG and 24px PNG variants.

## Installation

- Download the [latest release ZIP file](https://github.com/MatthiasMaar/MaterialDesign-Pencil/releases/latest).
- Install the collection in Pencil by navigating to _Tools > Manage Collections... > Install From File..._ and selecting the downloaded ZIP file.

## Uninstall

Right-click on the collection in Pencil's sidebar and select _Uninstall_ OR navigate to _Tools > Manage Collections..._ and click the uninstall icon on the collection's card.

## Updating

Follow the uninstall and installation steps above.

## Custom Build

- Clone this repo.
- Install the dependencies and run the build script (e.g. using `npm`):

```
npm install
npm run build
```

This will

- create a `dist` folder,
- copy the SVG files in a `vectors` subfolder (using `width` and `height` attributes instead of `viewBox`)
- generate PNG thumbnails in a `icons` subfolder,
- create the main definition XML and
- create a ZIP file containing the files above.

The ZIP file in the root folder can be installed in Pencil.

## License

The source code for generating this Pencil stencil collection is released under the [MIT License](https://opensource.org/licenses/MIT).

The [icon collection](https://github.com/Templarian/MaterialDesign-SVG) is released by the [Pictogrammers](http://pictogrammers.com) icon group under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0) and accompanied by the following statement:

> Some of the icons are redistributed under the Apache 2.0 license. All other icons are either redistributed under their respective licenses or are distributed under the Apache 2.0 license.
