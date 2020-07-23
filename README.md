# Re4ma - magic site generator based on smart HTML-blocks
## (Concept WIP)

* Generates lightweight static HTML pages without JavaScript frameworks

### Usage:
```html
<!-- Import HTML block: -->
<re-htm src="html/page.htm"><re-htm>

<!-- Import Markdown block: -->
<re-md src="md/article.md"><re-md>

<!-- Import Javascript: -->
<re-script src="js/app.js"><re-script>
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
<style>
  .container {
    display: flex;
  }
</style>
<div class="container">
  <slot name="content"></slot>
</div>
```
### Placeholders:
Define HTML attributes:
```html
<re-htm src="html/page.htm" text="My Text" color="#f00"><re-htm>
```
Then use them in templates:
```html
<style>
  .container {
    display: flex;
    color: --color--;
  }
</style>
<div class="container">--text--</div>
```
## Build stage helper attributes
Clear element content (remove children):
```html
<my-component re-clear><my-component>
```

Remove cetrain element:
```html
<my-component re-move><my-component>
```
## Build Site
```
node --experimental-modules <path>/builder.mjs
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
