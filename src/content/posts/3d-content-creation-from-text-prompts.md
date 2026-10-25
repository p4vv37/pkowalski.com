---
title: "3D content creation from text prompts"
slug: "3d-content-creation-from-text-prompts"
date: "2024-01-23"
description: "Introduction Text-to-3D generation is an exciting and challenging task that aims to synthesize realistic and diverse 3D objects from natural language descriptions. Recently, there have…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2415
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/01/it10000-0.png"
---
<!-- wp:heading -->
<h2 class="wp-block-heading">Introduction</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Text-to-3D generation is an exciting and challenging task that aims to synthesize realistic and diverse 3D objects from natural language descriptions. Recently, there have been many advances in this field, thanks to the development of powerful text-to-image models, neural radiance fields, and gaussian splitting. I will share my experience of testing some of the available methods for 3D content creation from text prompts, using the awesome open source framework <a href="https://github.com/threestudio-project/threestudio#prolificdreamer-">Three Studio</a>.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Methods and results</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>I tested the following methods, which are all available in the Three Studio framework:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong><a href="https://github.com/thu-ml/prolificdreamer">ProlificDreamer</a></strong>: <em><a href="https://arxiv.org/abs/2305.16213">ProlificDreamer: High-Fidelity and Diverse Text-to-3D Generation with Variational Score Distillation</a></em>, A method that uses a pre-trained text-to-image diffusion model to generate multiple 2D views of a 3D object, and then optimizes a neural radiance field to fit the views.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>After 45 minutes of generation, the result did not change much.</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2417} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it25000-test.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p><br><strong><a href="https://github.com/JunzheJosephZhu/HiFA">HiFA</a></strong>: High-fidelity Text-to-3D Generation with Advanced Diffusion Guidance. Another method is based on text2image diffusion models and NERF. It is based on other methods described here but adds some improvements to them. I was not able to run it yet, but it could be a good one. <br><strong><a href="https://arxiv.org/abs/2209.14988">DreamFusion</a></strong>: A method that uses a text-to-image diffusion model to generate a single 2D image of a 3D object, and then optimizes a neural radiance field to match the image. There are two implementations of it in the three studio. One utilities Stable Dffusion model for image generation: </p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2418} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Running 10000 steps took about 20 minutes.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The other one is based on <a href="https://huggingface.co/DeepFloyd/IF-I-XL-v1.0" rel="nofollow">DeepFloyd IF</a>:</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2419} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>10 000 steps took about 15 minutes,</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Both results were not great, but the second one failed absolutely. The first one has a strong Janus effect.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong><a href="https://arxiv.org/abs/2211.10440">Magic3D</a></strong>: A method that uses a coarse-to-fine strategy to generate a high-resolution 3D mesh model from a text prompt, leveraging both low- and high-resolution diffusion priors. <strong>Even though I only tested the 1st, coarse, step, It generated the nicest results.</strong> </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>10 000 steps took about 14 minutes.</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2422} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test-3.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p><strong><a href="https://arxiv.org/abs/2212.00774" title="">Score Jacobian Chaining</a></strong>: The paper proposes to apply chain rule on the learned gradients, and back-propagate the score of a diffusion model through the Jacobian of a differentiable renderer, which we instantiate to be a voxel radiance field. This setup aggregates 2D scores at multiple camera viewpoints into a 3D score, and repurposes a pretrained 2D model for 3D data generation. The first example took only 7 minutes and the 2nd one took 20 minutes. The 1st one renders all scene. I need to take a closer look at this method.</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2423} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test-4.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:video {"id":2424} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it30000-test.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong><a href="https://arxiv.org/pdf/2303.15413v1">Latent-</a><a href="https://github.com/eladrich/latent-nerf" title="">NeRF</a></strong>: A method that uses a latent space to condition the neural radiance field, which can capture the semantic variations of 3D objects from text prompts. 10 000 steps took about 13 minutes</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2425} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test-5.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p><strong><a href="https://www.three-studio.com/">Fantasia3D</a></strong>: A method that uses a progressive editing framework to generate 3D objects from complex text prompts, which can handle multiple attributes and regions. I was not able to run it yet.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong><a href="https://arstechnica.com/information-technology/2022/11/nvidias-magic3d-creates-3d-models-from-written-descriptions-thanks-to-ai/">TextMesh</a></strong>: <em>in this work we propose a novel method for generation of highly realistic-looking 3D meshes. To this end, we extend NeRF to employ an SDF backbone, leading to improved 3D mesh extraction.</em></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Network started generating something looking.. like a shape around the step 5000 (about 10 minutes). but by the step 10 000 it changed to some blurry mess.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2427,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it5000-0.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it5000-0-1024x341.png" alt="" class="wp-image-2427"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2426} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/01/it10000-test-6.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>For this experiment, I ran each model with the same prompt. I just wanted to have a rough idea on how every one of them performed. I will perform more experiments on some of them and test available</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p> parameters.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>As you can see, the methods produce different levels of quality. Some methods can handle fine-grained details and variations, while others produce blurry or distorted results.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>One common problem that I observed in all the methods is the Janus effect. In 3D generation, the Janus effect refers to the situation where the most canonical view of an object (e.g., face or head) appears in other views, resulting in unrealistic or inconsistent 3D models. This problem is caused by the bias of the 2D diffusion models, which tend to generate the most recognizable or salient features of the objects, regardless of the viewing angle or perspective. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Summary</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Based on this simple experiment, Magic3D is a clear winner here. Models that use a single-stage optimization, such as DreamFusion and Latent-NeRF produced very bad results with a strong Janus effect. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>However, none of the methods can completely solve the Janus effect, which seams to be a major challenge for text-to-3D generation. I think this problem requires more research and innovation, such as developing new ways to debias the 2D diffusion models, or designing new architectures or losses to enforce the view consistency of the 3D models. I also think that the evaluation of text-to-3D generation is not well-established, and there is a need for more comprehensive and reliable metrics and benchmarks to measure the quality, diversity, and fidelity of the 3D models.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>I will test more methods, and test some of methods described here in more depth, soon.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->