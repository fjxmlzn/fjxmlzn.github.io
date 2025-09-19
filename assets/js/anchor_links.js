// From: https://blog.briandrupieski.com/generate-anchors-in-jekyll-blog-post

$(function() {
    // if a p only has an img inside of it, urlify the alt text 
    // of the img and set that as the p's id so anchors can use it
    $(".post_content p > img").each(function(idx, el) { 
        var $el = $(el);
        var idText = anchors.urlify("img-" + $el.attr("alt")); 
        $el.parent().attr("id", idText); 
    });
    // if a table has the "alt" property, use it to set the table's 
    // id otherwise just use the index of that table within .post-content
    $(".post_content table").each(function(idx, el) { 
        var $el = $(el);
        var uniqueTextForTable = $el.attr("alt") ? $el.attr("alt") : idx;
        var idText = anchors.urlify("table-" + uniqueTextForTable); 
        $el.attr("id", idText); 
    });
    anchors.options.visible = 'always'; 
    anchors.add('.post_content h1, h2, h3, h4, h5, h6');
    anchors.options.icon = '❡';
    anchors.options.placement = 'left';
    anchors.options.visible = 'hover';
    anchors.add('.post_content p');
    anchors.add('.post_content table');
});