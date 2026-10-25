---
title: "Fast comparison of Stable Zero123 and TripoSR"
slug: "fast-comparison-of-stable-zero123-and-triposr"
date: "2024-03-05"
description: "In the previous posts, I explored the results of Stable Zero 123, a tool that can generate 3D models from a single image. Recently, Tripo AI and Stability AI released TripoSR, an…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2630
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/03/Screenshot-from-2024-03-05-09-40-47.png"
---
<!-- wp:paragraph -->
<p>In the previous posts, I explored the results of Stable Zero 123, a tool that can generate 3D models from a single image.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="https://huggingface.co/spaces/stabilityai/TripoSR">Recently, Tripo AI and Stability AI released TripoSR, an open-source model that claims to achieve state-of-the-art performance in fast feedforward 3D reconstruction.</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>How does TripoSR compare to Stable Zero 123? That's what I want to find out in this post. To do a quick test, I will use the default settings of both tools and see how they handle some challenging images. A more thorough evaluation will follow in a future post.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Bottles:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2631,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/03/image-1.png" alt="" class="wp-image-2631"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Stable Zero123:</p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>TripoSR:</p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/1-2024-03-05_08.58.54.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-2.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/2-2024-03-05_09.04.52.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-3.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/3-2024-03-05_09.06.19.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-6.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/4-2024-03-05_09.08.56.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>All the tested bottles look flat, some are weirdly deformed. Transparency was not handled well, but this comparison is not fair, as it had to be projected on texture in case of Tripo. The generation of multiple objects at the same time did not cause any errors or failures, but the quality of the output was still poor. The deformation and flattening of the bottles suggest that there are some issues with the calibration or the parameters of the 3D printer.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The resolution of textures is way worse than in case of Stable Zero 123, but the speed is amazing! It takes seconds to generate the results.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>TABLES AND CHAIRS:</p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-9.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/5-2024-03-05_09.10.32.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-14.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/6-2024-03-05_09.11.28.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-test-10.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/7-2024-03-05_09.14.22.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>The program can generate chairs and simple objects with reasonable accuracy. However,  the low resolution of the textures is still a problem, which makes the images look blurry and pixelated. </p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-val-2.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/7-2024-03-05_09.14.22-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/02/it4800-val-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/8-2024-03-05_09.16.55.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/10-2024-03-05_09.20.58.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp-content/uploads/2024/03/11-2024-03-05_09.22.05.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>The network demonstrated its robustness by successfully generating objects from all the examples that caused the Stable Zero 123 to fail. It also showed its superiority over the Stable Zero 123 by handling complex shapes, such as concave ones, with ease.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>To sum up, the new network is faster and performs better on some shapes, even complex ones. But sometimes it struggles with even the simplest ones, producing distorted or flattened results. Another issue is the low resolution of the texture. I've still got to check if this might be improved by adjusting some parameters. I'll have to spend some time with it to understand how the new network works and to evaluate its capabilities more thoroughly.</p>
<!-- /wp:paragraph -->