=== Advanced Posts Blocks ===
Contributors:      Toro_Unit
Donate link:       https://www.paypal.me/torounit
Tags:              posts, block
Requires at least: 5.0
Tested up to:      5.0
Requires PHP:      7.0
Stable tag:        nightly
License:           GPLv3 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Create Blocks filtered by any post type and any categories, tags or custom taxonomy terms.

== Description ==

Add Custom Dynamic Blocks for Render Post and Posts.

= Posts Block =

Create Posts Block filtered post type. (ex. post, page) and filter posts by multiple categories, tags or custom taxonomy terms.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/posts.php` exists in your theme, replace default view.

= Post Block =

Create Single Post/Page Block.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/post.php` exists in your theme, replace default view.


= Override Template =

Support template hierarchy. The templates are searched in the following order.

1. template-parts/blocks/advanced-posts-blocks/posts/{postType}-{style}.php
2. template-parts/blocks/advanced-posts-blocks/posts/{postType}.php
3. template-parts/blocks/advanced-posts-blocks/posts-{style}.php
4. template-parts/blocks/advanced-posts-blocks/posts.php


= Credits =
* [Icons - Material Design](https://material.io/tools/icons/) (Apache License Version 2.0)

== Changelog ==

= 0.1.0 =
* first release.

