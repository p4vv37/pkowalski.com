---
title: "Checking results of text -> Concept art -> 3D assets pipeline with SDXL and Stable zero123"
slug: "checking-results-of-text-concept-art-3d-assets-pipeline-with-sdxl-and-stable-zero123"
date: "2024-02-22"
description: "Preparation Creating a complete scene from scratch should be a nice way to check the limitations of this technology. I'm starting with the generation of concept art for some assets…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2511
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/02/ComfyUI_00326_-1-1.png"
---
<!-- wp:heading -->
<h2 class="wp-block-heading">Preparation</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Creating a complete scene from scratch should be a nice way to check the limitations of this technology. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>I'm starting with the generation of concept art for some assets with SDXL, with prompts such as:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li><em>A color concept art drawing of a stylized wooden chair of a witch, old, wooden, solo, white background, artstation</em></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><em>A color concept art drawing of a stylized big wooden table of a witch, old, wooden, solo, white background, artstation</em></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><em>A concept art drawing of a stylized bottle of a magical potion, solo, single bottle, white background</em></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>I selected a few examples that looked good and presented some potential problems, that I wanted to test, like:</p>
<!-- /wp:paragraph -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_.png","id":2512,"dimRatio":50,"style":{"color":{}}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2512" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Asset with transparency</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_.png","id":2513,"dimRatio":50,"style":{"color":{}}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2513" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Multiple objects on a single image</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00374_.png","id":2515,"dimRatio":50,"style":{"color":{}}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2515" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00374_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Asset with complex shapes</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_.png","id":2516,"dimRatio":50,"style":{"color":{}}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2516" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Very unrealistic object</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00419_.png","id":2517,"dimRatio":50,"minHeight":430,"minHeightUnit":"px","style":{"color":{}}} -->
<div class="wp-block-cover" style="min-height:430px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2517" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00419_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Complex spatial structure in single image</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:cover {"url":"https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00429_.png","id":2518,"dimRatio":50,"style":{"color":{}}} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background wp-image-2518" alt="" src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00429_.png" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Image, that that does not make sense in 3D</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->

<!-- wp:paragraph -->
<p>I started by removing the background from each of the 27 images selected for this experiment. I did it by hand, in Photopea. It was easy for most of them, but some had complex backgrounds and required a bit of work.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2520,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00353_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00353_-1.png" alt="" class="wp-image-2520"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>I created a script, that executed generation for every file:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#!/bin/bash

dir="./images/"

for fullpath in "$dir"*
do
  filename=$(basename "$fullpath")
  python launch.py --config  configs/stable-zero123_small.yaml --train --gpu 0 data.image_path="$dir$filename" use_timestamp=False name=asset_generation tag="$filename"
done</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Config file stable-zero123_small.yaml is a modified version of stable-zero123.yaml with two times smaller batch size, to make it for in my VRAM, accumulate_grad_batches set to 4, max_steps increased to 4800 and every_n_train_steps to 600, to lower the number of generated previews.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Results</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Simple, single assets generated nice results. Front view of the asset is usually more detailed then back view. </p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2528,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00327_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00327_-1.png" alt="" class="wp-image-2528"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2527} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Some are a bit flatter than I'd expect, but still look good. I suppose, that "baked" shadow might be a result of the thick, black outline on that image. I'll have to redo this test with more realistic examples to verify this.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2531,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00328_-1-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00328_-1-1.png" alt="" class="wp-image-2531"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2530} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-2.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Transparency was handled well, but I expect, that generation of mesh will be problematic.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2534,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_-1-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_-1-1.png" alt="" class="wp-image-2534"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2533} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-3.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>If there are some additional elements, floating around the asset, they usually land on the plane parallel to the view. However, they did not reduce the quality of the result.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2536,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00329_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00329_-1.png" alt="" class="wp-image-2536"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2537} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-4.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Rendering multiple simple assets from one image created results with similar quality. The network did not manage to handle the edges of the bottles: It did not figure out how the border should be treated.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2538,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_-2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_-2.png" alt="" class="wp-image-2538"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2539} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-5.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:image {"id":2540,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00325_-1.png" alt="" class="wp-image-2540"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2541} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-6.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>I also tried more complex assets in large numbers.  The results are way worse. With this said, the network was not able to generate nice assets from this table even when it was separated. It might be too stylized. </p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2543,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00365_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00365_-1.png" alt="" class="wp-image-2543"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2546} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-9.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video {"id":2569} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-14.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Some other assets in a similar style generated nicer results. The stylized shadow was not recognized correctly:<strong> I should have removed them before generation.</strong></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2547,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00369_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00369_-1.png" alt="" class="wp-image-2547"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2548} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-10.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:image {"id":2549,"width":"750px","height":"auto","sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full is-resized"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00373_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00373_-1.png" alt="" class="wp-image-2549" style="width:750px;height:auto"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2550} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-11.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:image {"id":2551,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00374_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00374_-1.png" alt="" class="wp-image-2551"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2552} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-12.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>As expected: The heavily stylized assets that did not make sense in 3D did not generate nice results.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2555,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00429_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00429_-1.png" alt="" class="wp-image-2555"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2557} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test-13.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Some of such images generated even weirder results:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2562,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00422_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00422_-1.png" alt="" class="wp-image-2562"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2561} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it1200-val.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Unfortunately, the process failed for most of the images (14 of 27 tested). They crashed with OOM errors. After lowering the batch size, the crashes stopped, but they did not generate any reasonable results:</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2563} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it636-test.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>The log was filled with warnings:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>"&#91;WARNING] Empty rays_indices!" </code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p> This included all the cats :(</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>I'll try to debug the cause of that soon</strong>.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2565,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-15.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-15.png" alt="" class="wp-image-2565"/></a><figcaption class="wp-element-caption">Generation failed for all of those examples</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p> </p>
<!-- /wp:paragraph -->