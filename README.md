# Re4ma - magic HTML-page generator
## (Concept WIP)

* Generates lightweight static HTML pages from simple external resource imports

### Usage:
```html
<!-- Import any external HTML chunk or component: -->
<re-htm src="htm/page.htm"><re-htm>

<!-- Import and render Markdown: -->
<re-md src="md/article.md"><re-md>

<!-- Import Javascript on demand: -->
<re-js src="js/app.js"><re-js>

<!-- Import styles: -->
<re-css src="css/styles.css"><re-css>

<!-- Adaptive images: -->
<re-img src="img/peacture.jpg"><re-img>

<!-- Rendering from external data endpoint: -->
<re-peat 
  template-src="htm/user-card-template.htm"
  data-src="data/users.json">
<re-peat>
```
Use *.html file names for entry points and *.htm for chunks

### Named Slots:
```html
<re-htm src="html/page.htm">
  <div slot="content"></div>
<re-htm>
```
In HTML Chunk:
```html
<div>
  <slot name="content"></slot>
</div>
```
### Placeholders for arttribute values:
Set custom HTML attributes:
```html
<re-htm src="html/page.htm" text="My Text"><re-htm>
```
Then use values in template:
```html
<div>{{text}}</div>
```
## Build stage helper attributes
Clear element content (remove children):
```html
<my-component re-clear><my-component>
```

Remove cetrain element after render:
```html
<my-component re-move><my-component>
```
## Build Site
```
node <path>/builder.mjs
```
## Configuration file (re4ma.cfg.json)
```json
{
  "port": 3000,
  "renderItems": [
    {
      "source": "test",
      "output": "dist"
    }
  ],
  "minify": true
}
```
