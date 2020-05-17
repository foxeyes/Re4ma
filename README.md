# Re4ma - magic site generator based on HTML-blocks and Puppeteer
## (Concept WIP)

* Generates lightweight static HTML pages without JavaScript frameworks

### Usage:
```html
<!-- Import HTML block: -->
<re-html src="html/page.html"><re-html>

<!-- Import Markdown block: -->
<re-md src="md/article.md"><re-md>

<!-- Import Javascript: -->
<re-script src="js/app.js"><re-script>
```
### Named Slots:
```html
<re-html src="html/page.html">
  <div slot="content"></div>
<re-html>
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
<re-html src="html/page.html" text="My Text" color="#f00"><re-html>
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
## Build Site
```
npm run build
```
