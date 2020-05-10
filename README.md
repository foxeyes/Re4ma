# Re4ma - magic site generator based on import-blocks (Custom Elements) and Puppeteer

* Generates lightweight static HTML pages without JavaScript frameworks

### Usage:
```html
<!-- Import HTML block: -->
<import-html src="html/page.html"><import-html>

<!-- Import Markdown block: -->
<import-md src="md/article.md"><import-md>

<!-- Import Javascript: -->
<import-script src="js/app.js"><import-script>
```
### Named Slots:
```html
<import-html src="html/page.html">
  <div slot="content"></div>
<import-html>
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
<import-html src="html/page.html" text="My Text" color="#f00"><import-html>
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
