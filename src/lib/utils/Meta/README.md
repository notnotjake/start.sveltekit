Uses load functions to set metadata

You can set metadata in the load functions of layouts or pages. (layout.ts, layout.server.ts, page.ts or page.server.ts)

Using layouts is helpful for setting or resetting data for an entire section of the site, say the blog vs the app

The root layout sets the defaults for the site. Any pages or lower routes can override this. It works in a data-cascade.

Supports most common meta tags and allows you to add arbitrary meta, link, and script tags to be mounted to the `<head>` element


**Things this tool is not built to do:**
</br>_You would be better off doing the following in your page or layout's `<svelte:head>` instead of using this tool._
- RSS/XML-Feed
- PWA metadata
- JSON-LD
- Adding stylesheets
- Adding/loading scripts
- Doesn't support meta:keywords as they are irrelevant in ^2024

</br>While this tool could do most of these and can do the last two, you probably shouldn't use it for those. This tool is specifically designed to solve merging of data in a data cascade such as the title of a page. For data that is set only either globally or per-page, it's best to use svelte's built in functionality to declare that data. That will result in a more straightforward codebase.
