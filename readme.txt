=== Advanced Posts Blocks ===
Contributors:      Toro_Unit
Donate link:       https://www.paypal.me/torounit
Tags:              posts, blocks
Requires at least: 5.0
Tested up to:      5.0
Requires PHP:      7.0
Stable tag:        nightly
License:           GPLv3 or later
License URI:       https://www.gnu.org/licenses/gpl-3.0.html

Create Blocks filtered by any post type and any categories, tags or custom taxonomy terms.

== Description ==

Add Custom Dynamic Blocks for Render Post and Posts.

= Posts Block =

Posts Block filtered post type. (ex. post, page) and filter posts by multiple categories, tags or custom taxonomy terms.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/posts.php` exists in your theme, replace default view.

= Post Block =

Single Post/Page Block.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/post.php` exists in your theme, replace default view.

= Children Block =

Children Posts Blocks.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/children.php` exists in your theme, replace default view.



= Override Template =

Support template hierarchy. The templates are searched in the following order.

1. `template-parts/blocks/advanced-posts-blocks/{Block_Type}/{Post_Type}-{Style}.php`
2. `template-parts/blocks/advanced-posts-blocks/{Block_Type}/{Post_Type}.php`
3. `template-parts/blocks/advanced-posts-blocks/{Block_Type}-{Style}.php`
4. `template-parts/blocks/advanced-posts-blocks/{Block_Type}.php`

`{Block_Type}` is posts, post or children.


= Credits =

* [Icons - Material Design](https://material.io/tools/icons/) (Apache License Version 2.0)
* [feathericon](https://feathericon.com/)

== Changelog ==

= 0.2.0 =
* Remove wpautop in template.

= 0.1.6 =
* Default template bug fix.

= 0.1.4 =
* Bug fix.

= 0.1.0 =
* first release.

