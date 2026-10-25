---
title: "Reconstructing Shader Inputs with SlangPY and PyTorch"
slug: "reconstructing-shader-inputs-with-slangpy-and-pytorch"
date: "2025-05-27"
description: "Shaders define visual effects by transforming inputs into rendered outputs. But what if we could reverse that process—recover shader inputs directly from the final image? Or adjust…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2705
format: "wordpress-blocks"
image: "/wp-content/uploads/2025/05/image-3.png"
---
<!-- wp:paragraph -->
<p>Shaders define visual effects by transforming inputs into rendered outputs. But what if we could reverse that process—recover shader inputs directly from the final image? Or adjust parameters so that the output matches a given reference? With SlangPY and PyTorch, we can.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>With SlangPY and PyTorch, shader inputs become trainable parameters. Gradient descent lets you optimize these inputs to closely match a target image—similar to training a neural network. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This means you can, for example:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Reconstruct shader parameters to match a photo, concept art, or manually-tuned reference </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tune visual effects automatically based on some objective</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Reverse-engineer material parameters from screenshots or renders</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Automatically optimize shader parameters for best balance between performance and quality</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":2728,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/evolution-4.gif"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/evolution-4.gif" alt="" class="wp-image-2728"/></a></figure>
<!-- /wp:image -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">What is Gradient Descent?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Gradient descent is a method used to find the best values for certain variables by gradually improving them step by step. It works by looking at how a small change affects the result, and then adjusting in the direction that reduces the error. </p>
<!-- /wp:paragraph -->

<!-- wp:video -->
<figure class="wp-block-video"><video controls src="https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4c/Gradient_Descent_in_2D.webm/Gradient_Descent_in_2D.webm.720p.vp9.webm"></video><figcaption class="wp-element-caption">Gradient Descent in 2D<br>Source: <a href="https://en.wikipedia.org/wiki/Gradient_descent">https://en.wikipedia.org/wiki/Gradient_descent</a></figcaption></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>In our case, we use it to tweak inputs to a shader—like brightness or textures—so that the final image looks as close as possible to a given reference image.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>SlangPY bridges Slang shaders and PyTorch, enabling automatic differentiation. With this setup, shader inputs become learnable variables, making it possible to reconstruct or fine-tune them using gradient-based optimization.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This article covers two examples: a basic brightness adjustment and the reconstruction of a full <strong>512×512 grayscale mask</strong>.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">1. Recovering a Brightness Offset</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We begin by solving for a 3-component brightness vector to match a shader's output with a reference image.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Shader (Slang):</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&#91;Differentiable]
float3 brightness(float3 amount, float3 pixel)
{
    pixel += amount;
    return pixel;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>Python Training Loop:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>amount = torch.tensor(&#91;-0.1, 0.1, 0.0], device='cuda', requires_grad=True)  # Learnable brightness offset on GPU
optimizer = torch.optim.Adam(&#91;amount], lr=1e-3)  # Adam optimizer with standard learning rate

for _ in range(1000):
    optimizer.zero_grad()  # Clear previous gradients
    output = module.brightness(amount, source_texture)  # Apply shader to input texture
    loss = F.l1_loss(output, target)  # Measure difference from reference image
    loss.backward()  # Compute gradients w.r.t. brightness
    optimizer.step()  # Update brightness to reduce loss
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Result:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2697,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image size-large"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/image-3.png"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/image-3-1024x354.png" alt="" class="wp-image-2697"/></a></figure>
<!-- /wp:image -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Final amount: &#91;-0.33533716 -0.3212491  -0.3279705 ]</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>After a few hundred iterations, the vector converges and the shader output aligns with the reference image. This demonstrates end-to-end gradient flow through a Slang shader.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">2. Reconstructing a Grayscale Mask</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>In the second example, we reconstruct an entire <strong>512×512 grayscale mask</strong>. The mask is used as input to a shader that produces a colorful RGB output with distortions, making the task slightly more challenging and realistic.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Visual Example:</strong><br></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2692,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/real_map.png"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/real_map.png" alt="" class="wp-image-2692"/></a><figcaption class="wp-element-caption"><em>Original grayscale mask</em>, created in PS: we will try to recreate it</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2724,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/image-5.png"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/image-5.png" alt="" class="wp-image-2724"/></a><figcaption class="wp-element-caption"><em>RGB output generated by the shader using this mask: we will use it as areference</em></figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong>Objective:</strong> Based on the output above find the grayscale mask that, when passed into the shader, produces an output matching the reference image.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">3. Training Loop to Recover the Mask</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Below is a simplified training loop to reconstruct the grayscale input mask:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>H, W, STEPS = 512, 512, 3000
mask = torch.ones((1,1,H,W), device='cuda') * 0.3  # Start with a constant grayscale mask
mask += -torch.randn_like(mask) * 0.05             # Add small noise for variety
mask.requires_grad_(True)                          # Make the mask learnable

opt = torch.optim.AdamW(&#91;mask], lr=2e-3, betas=(0.9, 0.999), weight_decay=1e-7, amsgrad=True)  # AdamW optimizer
sched = OneCycleLR(opt, max_lr=1e-3, total_steps=STEPS, pct_start=0.1, div_factor=10, final_div_factor=1e4)  # Learning rate scheduler

for step in range(STEPS):
    opt.zero_grad()  # Reset gradients
    output = module.rainbow(uv_grid, mask.squeeze())  # Shader output using current mask
    loss = F.l1_loss(output, reference)  # Difference from reference image
    loss.backward()  # Compute gradients
    opt.step(); sched.step()  # Update mask and scheduler

    with torch.no_grad():
        mask.clamp_(0, 1)  # Keep values in valid range</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Each iteration includes:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":1} -->
<ol start="1"><!-- wp:list-item -->
<li>Computing shader output.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Measuring loss against the reference.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Backpropagating to compute gradients.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Updating the mask to minimize loss.</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Using adaptive optimizers like <strong>AdamW</strong> with schedulers such as <strong>OneCycleLR</strong> helps improve convergence.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>And here's the visualization of the training process:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":2721,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/evolution-3.gif"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/evolution-3.gif" alt="" class="wp-image-2721"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"id":2719,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image size-full"><a href="https://www.pkowalski.com/wp-content/uploads/2025/05/heightmaps-1.gif"><img src="https://www.pkowalski.com/wp-content/uploads/2025/05/heightmaps-1.gif" alt="" class="wp-image-2719"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 class="wp-block-heading">4. Summary</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This approach opens doors to inverse rendering, procedural texture fitting, and new ML-powered artistic workflows.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Try it yourself with the full example notebook: <a href="https://github.com/p4vv37/NeuralNetworksSketchbook/blob/main/6_SlangPY.ipynb">View full code and demo</a></p>
<!-- /wp:paragraph -->