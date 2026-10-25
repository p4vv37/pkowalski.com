---
title: "Trying to generate 3D variations of 2D reference and control features of output & test of SV3D"
slug: "trying-to-generate-3d-variations-of-2d-reference-and-control-features-of-output"
date: "2024-03-21"
description: "In this article, I explore the capability to generate 3D assets based on 2D reference images. The control over the final results is crucial, particularly when the need arises for exact…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2647
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/03/b-2.png"
---
<!-- wp:paragraph -->
<p>In this article, I explore the capability to generate 3D assets based on 2D reference images. The control over the final results is crucial, particularly when the need arises for exact assets, such as a building with a particular architecture or unique adornments.<br><br>For this experiment, I went with architecture. The versatility of buildings allows for a wide range of designs while adhering to a consistent style. The goal was to determine whether it's possible to dictate the style, arrangement of elements, camera angles, and features like the number of stories or the architectural shape of a structure.<br><br>I decided, that it would be a brick building. The process began with assembling a collection of style references in SDXL:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2648,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-2.png" alt="" class="wp-image-2648"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2649,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-3.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-3.png" alt="" class="wp-image-2649"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2650,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-4.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-4.png" alt="" class="wp-image-2650"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Challenges in 3D object generation and FOV issues</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>My initial attempts at generating 3D objects were disappointing:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2651,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-5.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-5-1024x389.png" alt="" class="wp-image-2651"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>It became apparent that the network struggles with this FOV. After some experimentation, I discovered that 35 mm yields accurate results, which I'll need to remember moving forward.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Variations in asset generation, camera parameter control, and basic building shape</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>To keep the building's style consistent, I utilized an IP Adapter. It ensures some output resemblance to the input while allowing flexibility. I hoped it would work well in tandem with a control net to preserve style yet adhere to controller-imposed limitations.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2652,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-6.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-6-1024x527.png" alt="" class="wp-image-2652"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>To ensure scene composition and camera FOV—which I've learned is crucial—I began with a simple Blender scene. It featured a basic building with windows dictating the number of floors and windows per floor, a camera set to the correct FOV, and an output configured for a depth map via compositor nodes.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2653,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-7.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-7-1024x370.png" alt="" class="wp-image-2653"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>In ComfyUI, I employed a Depth controller to fine-tune the results:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2654,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-8.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-8.png" alt="" class="wp-image-2654"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>In tweaking the weight values, I found that 0.5-0.6 hit the sweet spot. Anything less significantly altered the FOV, while anything more just didn't add any excitement, putting undue emphasis on matching the image depth. It's clear that these values aren't one-size-fits-all and will require adjustments based on individual scenarios.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The outcomes were acceptable:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2655,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/a.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/a.png" alt="" class="wp-image-2655"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2656,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b.png" alt="" class="wp-image-2656"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2657,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/c.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/c.png" alt="" class="wp-image-2657"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The aesthetic was on par with my references, yet I maintained control over the final product through camera settings, scene composition, and the building's features like floors and windows, all aligned with my depth map.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>I played around a bit by removing some windows and throwing in an extra floor.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2658,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/ref2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/ref2.png" alt="" class="wp-image-2658"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2659,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/a-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/a-1.png" alt="" class="wp-image-2659"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2660,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b-1.png" alt="" class="wp-image-2660"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Then, I decided to up the ante with a more intricate design:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2661,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/ref3.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/ref3.png" alt="" class="wp-image-2661"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2662,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b-2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/b-2.png" alt="" class="wp-image-2662"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2663,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/d.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/d.png" alt="" class="wp-image-2663"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The end results were a testament to the accuracy of the shape I envisioned</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>When it came to mesh generation from these images, TripoRS, again, was quick but generated low-quality outputs. Despite that, the building's form was mostly correct and didn't suffer the distortion seen in my initial isometric camera experiments:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2664,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-9.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-9.png" alt="" class="wp-image-2664"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The asset's rear side, which wasn't captured in the original image, didn't fare as well:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2665,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-10.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-10.png" alt="" class="wp-image-2665"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>In pursuit of higher-quality assets, I turned to Three Studio and Stable Zero123, following the methodology outlined in my earlier post:</p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/it2400-test-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>The quality is not much better, it looks like the FOV is back.  I did not find any information on best FOV for Stable Zero123, but In the Zero123 paper value of 49.1 is mentioned. </p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/it2400-test-2.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>The results are a bit better, but still far from perfect. To compare them with commercial solution I also tried Meshy.ai, but it failed to generate a nice result as well:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2670,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-11.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-11.png" alt="" class="wp-image-2670"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The pipeline of generating variations of images worked, there exists fine control over the output. But this image gave particularly bad results and the 3d objects are terrible. I should test this pipeline on something less challenging for 2D -&gt; 3D part of the process. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Last hope: <a href="https://sv3d.github.io/">SV3D: Novel Multi-view Synthesis and 3D Generation from a Single Image using Latent Video Diffusion</a></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Stability AI just released a new model: SV3D, so I thought, that such a hard case might be a nice way to try it out.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>And the results are great!<br></p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/000002.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/000003.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>I'll explore it in the future. There is still no way to convert the result to 3D object, but possibly good, old photogrammetry will work?</p>
<!-- /wp:paragraph -->