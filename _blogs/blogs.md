---
layout: default
title: "Blogs"
permalink: /blogs/index.html
class: "blog"
---
## Blogs

{% for blog in site.blogs %}
{% if blog.title != "Blogs" %}
* ({{ blog.show_date }}) [{{blog.title}}]({{ site.url }}{{ blog.url }}#post)
    * {{ blog.desc }}
{% endif %}
{% endfor %}
