---
title: "Generating mesh & texture from results of stable-zero123"
slug: "generating-mesh-texture-from-results-of-stable-zero123"
date: "2024-02-11"
description: "In the previous post, I explored how to improve the results of generating 3D objects with zero-1-to-3, a technique that allows us to control the shape and appearance of the objects.…"
categories: ["General"]
tags: []
draft: false
wordpressId: 2508
format: "wordpress-blocks"
image: "/wp-content/uploads/2024/02/image-6.png"
---
<!-- wp:paragraph -->
<p>In the previous post, I explored how to improve the results of generating 3D objects with zero-1-to-3, a technique that allows us to control the shape and appearance of the objects. For almost any real-life usage of the result of generation, we need to convert it to a mesh with texture, as that's the most popular way to represent 3D objects (for now). They are the most widely supported and easiest to edit and manipulate medium for such data. So, in this post, I generate a mesh and texture from the result and check available parameters.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This time, I used 4800 steps to train the model, which should result in slightly better quality than before. The loss stopped decreasing after that point, so more steps would not improve the quality significantly. You can see the running average of the loss for a 10-step window in the figure below.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2495,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-7.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-7-1024x536.png" alt="" class="wp-image-2495"/></a></figure>
<!-- /wp:image -->

<!-- wp:video {"id":2493} -->
<figure class="wp-block-video"><video controls src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/it4800-test.mp4"></video></figure>
<!-- /wp:video -->

<!-- wp:paragraph -->
<p>To convert a NeRF into a mesh, we need to use a process called surface extraction. Surface extraction is a technique that finds the boundary between occupied and empty cells in the voxel grid, and creates a mesh that follows that boundary. Threestudio supports two methods for surface extraction: Marching Tetrahedra and Marching Cubes. Both of them extract a polygonal mesh of an isosurface from a 3-D volume. They both work by dividing the volume into cells and finding the intersections of the isosurface with the cell edges. Isosurface is a surface defined by a certain value in the space of a field - like lines of the contour map. </p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Marching Cubes - argument: <code>system.geometry.isosurface_method=mc-cpu</code> - It uses the original twelve edges of the cube to find the intersections with the isosurface. It has more configurations (256) than Marching Tetrahedra (16), increasing the lookup tables' size. The other downside of this method is that some ambiguities can cause holes in the mesh. In threestudio implementation of this method, there are no predefined resolutions, with VRAM being the only limiting factor. I was able to generate a mesh with a resolution of 300, which created a way denser mesh, than the default Marching Tetrahedra method.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"align":"center","id":2491,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-6.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-6.png" alt="" class="wp-image-2491"/></a><figcaption class="wp-element-caption">The originally published 15 cube configurations. <a href="https://en.wikipedia.org/wiki/Marching_cubes">Source</a></figcaption></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Marching Tetrahedra - default, argument: <code>system.geometry.isosurface_method=mt </code>- It splits each cube into six irregular tetrahedra by cutting diagonally through each of the three pairs of opposing faces. It computes up to nineteen edge intersections per cube, whereas Marching Cubes only requires twelve. It has fewer configurations (16) than Marching Cubes (256), which reduces the size of the lookup tables. Furthermore, it does not suffer from ambiguities that can cause holes in the mesh, because each tetrahedron has a unique way to separate the positive and negative vertices. It provides a slightly better sampling resolution than Marching Cubes, because of the additional intersections. Threestudio implements only 3, predefined, resolutions for this method: 32, 64, and 128 (default). The downside of this method is that the tessellation of a cube with tetrahedra requires a choice regarding the orientation of the tetrahedra, which may produce artificial "bumps" in the isosurface because of interpolation along the face diagonals. That effect was visible in the generated examples.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Marching_tetrahedrons.png" alt=""/><figcaption class="wp-element-caption">A cube divided into six tetrahedra, with one tetrahedron shaded. <a href="https://en.wikipedia.org/wiki/Marching_tetrahedra">Source</a></figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>UV unwrapping is done <a href="https://github.com/jpcy/xatlas">XAtlas</a> library. After the mesh UVs generation, colors are sampled in <a href="https://github.com/threestudio-project/threestudio/blob/bb4b43ea32f5ba595074bfddac6e0ef791f098c0/threestudio/models/exporters/mesh_exporter.py#L53C9-L53C28">export_obj_with_mtl</a> method. <a href="https://github.com/threestudio-project/threestudio/blob/bb4b43ea32f5ba595074bfddac6e0ef791f098c0/threestudio/models/exporters/mesh_exporter.py#L96">CV2 inpainting</a> is used for filling UV island padding. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Generated meshes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>I started with default values:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2497,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-8.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-8.png" alt="" class="wp-image-2497"/></a><figcaption class="wp-element-caption">Mesh exported with default values</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Some glitches are clearly visible. Firstly: bumps on smooth surfaces, as mentioned earlier, can be noticed. Change to Marching cube algorithm should fix that:<br></p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2498,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-9.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-9-1024x563.png" alt="" class="wp-image-2498"/></a><figcaption class="wp-element-caption">"bump" artifacts on smooth surfaces</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>There are white parts of the model: I think, that those could be fixed by moving isosurface "inside" the object by increasing the <code>system.geometry.isosurface_threshold</code> value. But, just to check how it will look like, I tried lower value first:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2499,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-10.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-10.png" alt="" class="wp-image-2499"/></a><figcaption class="wp-element-caption">Exporting with way too small value of isosurface_threshold</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The result matched expectations: There are a lot more white, blocky elements. I tried a few more values to find a sweet spot:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2500,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-11.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-11-1024x233.png" alt="" class="wp-image-2500"/></a><figcaption class="wp-element-caption">Meshes exported with different values for isosurface_threshold. From the left: 10, 25 (default), 50, 75 (IMO the best one), 100, 150</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The value of 75 seems to produce the least amount of white artifacts without removing too much of the volume from the objects. Doing that results in artifacts visible on the lest two meshes from the right.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2501,"sizeSlug":"full","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-full"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-12.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-12.png" alt="" class="wp-image-2501"/></a><figcaption class="wp-element-caption">Artifacts caused by the too high value of isosurface_threshold: missing parts of the object, floating elements, and incorrect colors</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>With the Marching Cubes algorithm, I was able to generate a mesh with a resolution of 300. The bump artifacts are gone, mesh is way smoother, but also way denser:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2503,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-13.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-13-1024x583.png" alt="" class="wp-image-2503"/></a><figcaption class="wp-element-caption">Marching Tetrahedra (left) compared with Marching Cubes (Right)</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"align":"center","id":2504,"sizeSlug":"large","linkDestination":"media"} -->
<figure class="wp-block-image aligncenter size-large"><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-14.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/2024/02/image-14-1024x634.png" alt="" class="wp-image-2504"/></a><figcaption class="wp-element-caption">Wireframe view of meshes</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The mesh is way too dense for any real-life use cases. It should be refined, with remeshing and decimation.</p>
<!-- /wp:paragraph -->