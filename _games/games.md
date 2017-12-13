---
layout: default
title: "Games"
permalink: /games/index.html
---
## Want to play?

{% for game in site.games %}
{% if game.title != "Games" %}
* {{ game.title }}
    * Link: [Click me!]({{ site.url }}{{ game.url }})
    * Command: Run `{{ game.command }}` in Start->Run
{% endif %}
{% endfor %}

## Have fun!