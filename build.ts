import archiver from 'archiver';
import * as fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import * as svgson from 'svgson';

const shapeTemplate = `  <Shape id="__id__" displayName="__displayName__" icon="__icon__">
    <Properties>
      <PropertyGroup>
        <Property name="box" displayName="Box" type="Dimension" p:lockRatio="true">__width__, __height__</Property>
      </PropertyGroup>
      <PropertyGroup name="Background">
        <Property name="fillColor" displayName="Color" type="Color">
          <E>$$fillColor</E>
        </Property>
      </PropertyGroup>
    </Properties>
    <Behaviors>
      <For ref="box">
        <Box>$box</Box>
      </For>
      <For ref="icon">
        <Scale>$box.w/__width__, $box.h/__height__</Scale>
        <Fill>$fillColor</Fill>
      </For>
    </Behaviors>
    <p:Content xmlns="http://www.w3.org/2000/svg">
      <rect id="box" style="fill: #000000; fill-opacity: 0; stroke: none;" x="0" y="0"/>
      <g id="icon">
        __svg__
      </g>
    </p:Content>
  </Shape>`;

/*
 * Folders
 */

const srcPath = path.join(__dirname, 'node_modules/@mdi/svg/svg');
const distPath = path.join(__dirname, 'dist');
fs.mkdirSync(distPath, { recursive: true });
const iconsPath = path.join(distPath, 'icons');
fs.mkdirSync(iconsPath);
const vectorsPath = path.join(distPath, 'vectors');
fs.mkdirSync(vectorsPath);

/*
 * Files
 */

const files = fs.readdirSync(srcPath);
let i = 0;
const shapes = [] as string[];
files.forEach(file => {
  if (path.extname(file).toLowerCase() === '.svg') {
    const svg = svgson.parseSync(fs.readFileSync(path.join(srcPath, file), 'utf-8'), {
      transformNode: node => {
        if (node.name === 'svg' && node.attributes.viewBox) {
          const viewBox = node.attributes.viewBox.split(' ');

          if (viewBox.length === 4 && !(node.attributes.width || node.attributes.height)) {
            if (!node.attributes.width) {
              node.attributes.width = viewBox[2];
            }
            if (!node.attributes.height) {
              node.attributes.height = viewBox[3];
            }
          }

          delete node.attributes.viewBox;
        }

        return node;
      }
    });

    const pngName = path.basename(file, path.extname(file)) + '.png';

    const shapeTemplateMapping = {
      __id__: svg.attributes.id,
      __displayName__: svg.attributes.id
        .split('-')
        .slice(svg.attributes.id.startsWith('mdi-') ? 1 : 0)
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
      __icon__: `icons/${pngName}`,
      __width__: svg.attributes.width,
      __height__: svg.attributes.height,
      __svg__: svg.children.map(child => svgson.stringify(child)).join('\r\n        ')
    } as Record<string, string>;
    shapes.push(
      shapeTemplate.replace(/__id__|__displayName__|__icon__|__width__|__height__|__svg__/gi, match => {
        return shapeTemplateMapping[match];
      })
    );

    const modSvg = svgson.stringify(svg);
    fs.writeFileSync(path.join(vectorsPath, file), modSvg);
    sharp(Buffer.from(modSvg)).png().toFile(path.join(iconsPath, pngName));
    i++;
  }
});

/*
 * XML
 */

const xml = `<Shapes
  xmlns="http://www.evolus.vn/Namespace/Pencil"
  xmlns:p="http://www.evolus.vn/Namespace/Pencil"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  id="matthiasmaar-mat-icons"
  displayName="Material Design Icons"
  description="All 7,100+ Material Design Icons from https://pictogrammers.com/library/mdi as a Pencil stencil collection. The icon collection is released by the Pictogrammers icon group under the Apache 2.0 license, while some of the icons are redistributed under the Apache 2.0 license. All other icons are either redistributed under their respective licenses or are distributed under the Apache 2.0 license."
  author="Matthias Maar"
  url="https://github.com/MatthiasMaar/MaterialDesign-Pencil">
  <Properties>
    <PropertyGroup>
      <Property name="fillColor" displayName="Icon Color" type="Color">#000000ff</Property>
    </PropertyGroup>
  </Properties>
  <Script>collection.RESOURCE_LIST = [{name: "Built-in vectors", prefix: "vectors", type: "svg"}];</Script>
${shapes.join('\r\n')}
</Shapes>`;

fs.writeFileSync(path.join(distPath, 'Definition.xml'), xml);

/*
 * ZIP
 */

const output = fs.createWriteStream(
  path.join(__dirname, `MaterialDesign-Pencil-${process.env.npm_package_version}.zip`)
);
const archive = archiver('zip', {
  zlib: { level: 9 }
});
archive.pipe(output);
archive.directory(distPath, false);
archive.finalize();
