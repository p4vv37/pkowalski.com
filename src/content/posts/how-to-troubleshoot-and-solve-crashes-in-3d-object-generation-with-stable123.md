---
title: "How to Troubleshoot and Solve Crashes in 3D Object Generation with Stable123"
slug: "how-to-troubleshoot-and-solve-crashes-in-3d-object-generation-with-stable123"
date: "2024-02-29"
description: "While generating assets, I encountered some crashes and failures. In this post, I will share how I debugged and solved some of these issues. First, I wrote a Python script that…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2572
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/02/movie-1.gif"
---
<!-- wp:paragraph -->
<p>While generating assets, I encountered some crashes and failures. In this post, I will share how I </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>debugged and solved some of these issues.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>First, I wrote a Python script that generated .png files with views of the object, so I could analyze each one of them. Here is the code snippet:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code><pre>import torch
import diffusers
from diffusers import DiffusionPipeline
from PIL import Image
import sys

# Add missing class to diffusers
sys.path.append("threestudio/extern")
from zero123 import Zero123Pipeline
diffusers.Zero123Pipeline = Zero123Pipeline

# Prepare pipeline
pipeline = DiffusionPipeline.from_pretrained("ashawkey/stable-zero123-diffusers",
                                             torch_dtype=torch.float16, trust_remote_code=True)
pipeline.to('cuda:0')

# Prepare input data:
image = Image.open("image.png").convert("RGB").resize((256, 256))
elevations = list()
azimuths = list()
camera_distances = list()
images = list()
for n in range(4):
    elevations.append(torch.tensor(&#91;30.0], dtype=torch.float16).to('cuda:0'))
    azimuths.append(torch.tensor(&#91;45.0 * n], dtype=torch.float16).to('cuda:0'))
    camera_distances.append(torch.tensor(&#91;1.2], dtype=torch.float16).to('cuda:0'))
    images.append(image)

# Generate and save images:
images = pipeline(images,
                  torch.tensor(elevations).to('cuda:0'),
                  torch.tensor(azimuths).to('cuda:0'),
                  torch.tensor(camera_distances).to('cuda:0'),
                  num_inference_steps=50).images

for num, azimuth in enumerate(azimuths):
    images&#91;num].save(F"{float(azimuth)}.png")
</pre></code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>To illustrate how the network works, I will use a simple example that produced a good result. This image was successfully converted into a 3D object, as shown below:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2574,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_-1-2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00326_-1-2.png" alt="" class="wp-image-2574"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2577,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-1-1024x205.png" alt="" class="wp-image-2577"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2586,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie.gif"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie.gif" alt="" class="wp-image-2586"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>However, not all images worked as well. For instance, this image caused some problems:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2618,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_-1.png" alt="" class="wp-image-2618"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2578,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-1-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-1-1.png" alt="" class="wp-image-2578"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The cat looks fine, but the ground and the smoke on the left confused the network. I decided to mask out these parts and try again:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2581,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_-fixes.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00378_-fixes.png" alt="" class="wp-image-2581"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The cat is still a bit flat, but at least it did not crash. It is acceptable:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2588,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-1.gif"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-1.gif" alt="" class="wp-image-2588"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2599} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-val-2.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>Next, I tried another more challenging image:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2579,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00419_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00419_-1.png" alt="" class="wp-image-2579"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2580,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-2.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/0.0-2.png" alt="" class="wp-image-2580"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The network failed to generate a 3D object from this image. After inspecting those results I conclude, that the reason is that the object is too large and goes beyond the frame. I resized the image to make it smaller:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2590,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-2.gif"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-2.gif" alt="" class="wp-image-2590"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Unfortunately, this did not solve all the issues. It fixed the crash, but the shape is concave and very complex. The network was unable to predict the shape of the object. It produced something:</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2598} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-val-1.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>I can guess now, that the lack of space around the object was the cause of most of my crashes. But it does explain this one:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2585,"width":"750px","height":"auto","sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full is-resized"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00363_-1.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/ComfyUI_00363_-1.png" alt="" class="wp-image-2585" style="width:750px;height:auto"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2593,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-3.gif"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-3.gif" alt="" class="wp-image-2593"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The tree-like structure switches positions constantly, and the roots break the legs of the table. This image is too complex for the network to handle. I removed the tree and kept only the table:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2595,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-4.gif"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/movie-4.gif" alt="" class="wp-image-2595"/></a></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>This time, the network was able to generate a 3D object, but with some artifacts. The network added some extra objects at every frame, which are not present in the original image.  Still, the result is not perfect, or terrible:</p>
<!-- /wp:paragraph -->

<!-- wp:video {"id":2597} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-val.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Conclusion</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>From these experiments, I learned that some of the crashes and failures can be fixed by inspecting and modifying the source images. A good practice is to leave some empty space around the main subject in the image and avoid cluttered or noisy backgrounds.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>I'll try making some tools to make this process easier.</p>
<!-- /wp:paragraph -->