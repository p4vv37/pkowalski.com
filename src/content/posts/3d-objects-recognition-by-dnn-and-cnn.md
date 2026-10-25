---
title: "3D objects recognition by DNN and CNN"
slug: "3d-objects-recognition-by-dnn-and-cnn"
date: "2023-11-13"
description: "Simple Deep neural networks and Convolutional Neural Networks used to recognize deformed 3D objects generated with Houdini. Sources Details Few different representations of objects…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2364
format: "wordpress-blocks"
image: "/wp-content/uploads/2020/03/voxel.png"
---
<!-- wp:paragraph -->
<p>Simple Deep neural networks and Convolutional Neural Networks used to recognize deformed 3D objects generated with Houdini.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="https://github.com/p4vv37/3dml/tree/master/3_recognize_objects">Sources</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/recreating_pivot_learning.ipynb">Details</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Few different representations of objects ware gathered to determinate which will work the best:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Voxels</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/voxel.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/voxel.png" alt="voxel"/></a></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Projection on plane (distance from plane surface)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/plane.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/plane.png" alt="plane"/></a></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Projection on cylinder</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/cylinder.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/cylinder.png" alt="cylinder"/></a></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Projection on sphere</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/sphere.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/sphere.png" alt="sphere"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/generate.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/generate.png" alt="net"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Visualisation of filters</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>To understand networks a little bit better I created a visualization of filters and activations:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/filters.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/filters.png" alt="filters"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>It's in <code>/obj/visualize_filters</code> of <a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/generate_data_18.hiplc">generate_data_18.hiplc</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Testing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Test is in <code>/obj/test</code> of <a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/generate_data_18.hiplc">generate_data_18.hiplc</a></p>
<!-- /wp:paragraph -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/test.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/test.png" alt="test"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Notes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The simple network did not perform well. I've compared it to a network modeled after <a href="https://github.com/SnowMasaya/Generative-and-Discriminative-Voxel-Modeling-Keras/tree/master/src">VoxNet</a> and although differences in network architectures are not that big, the difference in results is great:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/results.png" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/results.png" alt="VoxNet"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Deep dreaming</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>I've tried to use the logic of <a href="https://deepdreamgenerator.com/">Google deep dreaming</a> to create some nice effects by running it on some randomly generated clouds, but, unfortunately, the effect does not look nice at all:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/img/anim.gif" target="_blank" rel="noreferrer noopener"><img src="https://github.com/p4vv37/3dml/raw/master/3_recognize_objects/img/anim.gif" alt="Failed deep dream"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Maybe There's something I'm not doing right, or maybe networks are too simple and filters are not interesting enough. Anyway, this gives some more deep understanding of how neural networks work and how Keras can be used, so to use this deep dreaming implementation:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Generate data with <a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/deep_dream.py">deep_dream.py</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Visualize data with <a href="https://github.com/p4vv37/3dml/blob/master/3_recognize_objects/cloud.hpilc">cloud.hpilc</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">TODO</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>I should try running this deep dreaming implementation with a trained VoxNet network.</p>
<!-- /wp:paragraph -->