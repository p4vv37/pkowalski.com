---
title: "Python API in 3D computer graphics software: examplary scripts"
slug: "python-api-in-3d-computer-graphics-software-examplary-scripts"
date: "2021-11-13"
description: "Python API in 3D computer graphics software: examplary scripts Code on GitHub Example of Python scripts for Autodesk 3D Studio Max, Autodesk Maya and Blender. Those scripts use Python…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2358
format: "wordpress-blocks"
image: "/wp-content/uploads/2016/06/2506_out_script_3DsMax_mk4.jpg"
---
<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Python API in 3D computer graphics software: examplary scripts</strong></h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><a href="https://github.com/p4vv37/3D_Software_and_Python">Code on GitHub</a></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Example of Python scripts for Autodesk 3D Studio Max, Autodesk Maya and Blender. Those scripts use Python API to create simmilar scene in: Autodesk 3D Studio Max, Autodesk Maya and Blender. Created to show the basics of using Python in those applications.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Final result example(3Ds Max):</h3>
<!-- /wp:heading -->

<!-- wp:embed {"url":"https://vimeo.com/172206485","type":"video","providerNameSlug":"vimeo","responsive":true,"className":"wp-embed-aspect-4-3 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-4-3 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://vimeo.com/172206485
</div></figure>
<!-- /wp:embed -->

<!-- wp:paragraph -->
<p>Every script has a number of suport functions and seven major functions:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>prepare_scene(path) - The function sets the basic parameters of the scene: time range, tangent type of keyframes and render settings.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>import_and_animate_basic_meshes(path) - This function imports some objects and animates them. It was created to show how to import objects and present one way of creating keyframes of animation.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>create_shark_and_cloud() - Creates meshes from vertex and face data. Similar functions can be used in importer plugin.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>create_chest() - Function creates an object with a use ofrecorded macros, if such function is avaible in software. Macros are a very simple way of creating basic scripts.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>create_and_animate_trees() - Function uses the create_palm() support function to create and animate some palm trees. It was created to show how to create basic geometry objects, use instances and use modificators.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>change_hierarchy_and_animate() - Function modifies the hierarchy of scen and creates some final animations, that ware not possible to create earlier. It also creates cameras and lights.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>create_and_assign_materials() - Function creates and applies materials to the objects. It was created to show how to handle materials.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>All scripts have simple GUIs</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><a href="https://github.com/p4vv37/3D_Software_and_Python/blob/master/README.md#how-to-use"></a>How to use:</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Download the content of the "common" directory. Script will ask for path to those files before running</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Read the Readme.md file inside directory wit a script for choosen software and fallow the instructions. Every software has a different way of running scripts</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->