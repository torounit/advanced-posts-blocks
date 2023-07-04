# Advanced Posts Blocks
Contributors:      Toro_Unit
Donate link:       https://www.paypal.me/torounit
Tags:              posts, blocks
Requires at least: 6.1
Tested up to:      6.2
Requires PHP:      7.3
Stable tag:        5.0.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Create Blocks filtered by any post type and any categories, tags or custom taxonomy terms.

<!-- only:github/ -->
[![Latest Stable Version](https://img.shields.io/wordpress/plugin/v/advanced-posts-blocks?style=for-the-badge)](https://wordpress.org/plugins/advanced-posts-blocks/)
[![License](https://img.shields.io/github/license/torounit/advanced-posts-blocks?style=for-the-badge)](https://github.com/torounit/advanced-posts-blocks/blob/master/LICENSE)
[![Downloads](https://img.shields.io/wordpress/plugin/dt/advanced-posts-blocks.svg?style=for-the-badge)](https://wordpress.org/plugins/advanced-posts-blocks/)
[![Tested up](https://img.shields.io/wordpress/v/advanced-posts-blocks.svg?style=for-the-badge)](https://wordpress.org/plugins/advanced-posts-blocks/)
[![wp.org rating](https://img.shields.io/wordpress/plugin/r/advanced-posts-blocks.svg?style=for-the-badge)](https://wordpress.org/plugins/advanced-posts-blocks/)
[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/torounit/advanced-posts-blocks/push-on-test.yml?branch=main&style=for-the-badge)](https://github.com/torounit/advanced-posts-blocks/actions)



[![](https://ps.w.org/advanced-posts-blocks/assets/banner-1544x500.png?rev=1044335)](https://wordpress.org/plugins/advanced-posts-blocks/)
<!-- /only:github -->

## Description

Add Custom Dynamic Blocks for Render Post and Posts.

### Multiple Posts Block

Displays a list of posts.

Posts Block filtered post type. (ex. post, page) and filter posts by multiple categories, tags or custom taxonomy terms.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/posts.php` exists in your theme, replace default view.

### Single Post Block

Displays the selected page or single post.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/post.php` exists in your theme, replace default view.

### Child Posts Block

Displays the child posts on the selected page or post.

Override template by your theme. if `template-parts/blocks/advanced-posts-blocks/children.php` exists in your theme, replace default view.



### Override Template

Support template hierarchy. The templates are searched in the following order.

1. `template-parts/blocks/advanced-posts-blocks/{Block_Type}/{Post_Type}-{Style}.php`
2. `template-parts/blocks/advanced-posts-blocks/{Block_Type}/{Post_Type}.php`
3. `template-parts/blocks/advanced-posts-blocks/{Block_Type}-{Style}.php`
4. `template-parts/blocks/advanced-posts-blocks/{Block_Type}.php`

`{Block_Type}` is posts, post or children.

### Template variables

* `$class_name` (string) Block style class names.
* `$query` (WP_Query) Query for block.

## Screenshots

1. Blocks
2. Multiple Posts Block
3. Child Posts Block
4. Single Post Block

## Frequently Asked Questions

### How add another block style ?


Register your block style.

```php
register_block_style(
    'advanced-posts-blocks/post', // or 'advanced-posts-blocks/posts', 'advanced-posts-blocks/children'
    array(
        'name'  => 'your-style',
        'label' => 'Your Style',
    )
);
```

Create template `template-parts/blocks/advanced-posts-blocks/post-your-style.php`

```php
if ( $query->have_posts() ) :
    while ( $query->have_posts() ) :
        $query->the_post();
        // write template tag!
    endwhile;
    wp_reset_postdata();
endif;
```

## Changelog

### 5.1.0
* Tested on WP 6.2 and PHP 8.2.
* add `attributes` parameter to `advanced_posts_blocks_posts_query` filter.

### 5.0.0
* Change icons.
* Refactor code.
* Tested WP 6.0.
* Use SSR only for Preview.
* Support query for ignore terms.

### 4.0.0
* add `advanced_posts_blocks_use_default_template` filter.

### 3.0.1
* Child Posts Block: Bug fix for post type selector.

### 3.0.0
* Single Post Block: Changed to fetch the post after the keyword is entered.
* Optimize code.

### 2.1.0
* Multiple posts block: Support menu_order attributes.
* Child posts block, Multiple posts block: Re-order query controls.
* Refactoring components.

### 2.0.0
* Refactoring release.
* Drop WordPress 5.5 and PHP 7.2
* Single post block: `Use ComboboxControl` for post selector.

### 1.0.3
* Taxonomy panel bug fix.

### 1.0.0
* Support internal taxonomies. ( `publicly_queryable: false` )
* WordPress 5.6-beta-4 tested.

### 0.9.0
* Multiple posts block: fix react hooks violation.

### 0.8.3
* Multiple posts block: block bug fix.
* add `block.json`.

### 0.8.2
* Update build task.

### 0.8.0
* Add filter `advanced_posts_blocks_default_template_path` .
* support `$args` in template.
* Tested WordPress 5.5.

### 0.7.2
* bug fix for single post block.

### 0.7.0
* Allow select hidden post type.

### 0.6.0
* Posts Block: Support ignore sticky posts.

### 0.5.0
* Separate block script.
* Refactoring.

### 0.4.0
* use react hooks.

### 0.3.3
* Term attribute bug fix.
* Term control key fix.

### 0.3.2
* attribute bug fix.


### 0.3.0
* [Multiple Posts Block] Support offset attribute.

### 0.2.2
* Fixed typo.

### 0.2.0
* Remove wpautop in template.

### 0.1.6
* Default template bug fix.

### 0.1.4
* Bug fix.

### 0.1.0
* first release.

