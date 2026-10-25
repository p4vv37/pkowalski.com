---
title: "Paper plane flight simulation by RNN"
slug: "paper-plane-flight-simulation-by-rnn"
date: "2023-03-21"
description: "In Browser demo Simple physics simulation: Recurrent Neural Network predicts a flight of a plane and takes a blowing wind int an account. There are 3 versions of the network that…"
categories: ["General"]
tags: ["3D", "DNN", "hartshorn", "Houdini"]
draft: false
wordpressId: 2270
format: "wordpress-classic"
image: "/wp-content/uploads/2020/03/demo.png"
---
<h3> <a href="http://www.pkowalski.com/demo" rel="nofollow">In Browser demo</a></h3>
Simple physics simulation: Recurrent Neural Network predicts a flight of a plane and takes a blowing wind int an account. There are 3 versions of the network that predict:
<ul>
 	<li>a position of a plane (1 point)</li>
 	<li>a position of few key vertices of a plane (6 points)</li>
 	<li>a position of every vertex of an original plane model (14 points) <a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/3.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/3.gif" alt="Example" /></a> <a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/2.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/2.gif" alt="Example" /></a> <a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/1.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/1.gif" alt="Example" /></a></li>
</ul>
Networks ware trained with different lengths of samples, which is the number of keyframes used to create a prediction on the next one. 1, 3, 5, 7 9 or 11 frames ware used.

To train the network a number of plane flight simulations were generated in Houdini with Vellum. In this simulation, a turbulence force was provided so the plane would not take the same path every flight and so the path would be more interesting. There's also a wind that blows for a random time starting at the random frame.

Every flight was saved as a separate .npy file with an array that contains positions of plane vertices at different frames.

The network did manage to learn how wind or hitting the ground affect the shape of the plane:

<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/prev_wings.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/prev_wings.gif" alt="Example" /></a>
<h2></h2>
<h2>.hip file</h2>
<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/hip.png" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/hip.png" alt="Preview of demo" /></a>
<ul>
 	<li>A plane simulation is generated in <code>/obj/generate_data</code> geometry node</li>
 	<li>Trained models are used in <code>test_single_point</code>, <code>/obj/test_all_points</code> or <code>/obj/test_all_points</code> to generate animation. To do this use the interface of a <code>create_keyframes</code> node to set desired parameters and evaluate it. To play animation use <code>switch1</code> node.</li>
 	<li>To generate samples use <code>/out/wedge1</code>. It randomizes parameters and creates samples. Multiple instances of Houdini can be used to do this faster: a PID of a Houdini process is used in a filename so instances of software would not overwrite files created by other instances.</li>
 	<li>Use <code>plane.ipynb</code> to train models.</li>
</ul>
<h2></h2>
<h2>In-Browser demonstration</h2>
A demonstration of networks that predict positions of key vertices position is available on <a href="http://www.pkowalski.com/demo" rel="nofollow">http://www.pkowalski.com/demo</a>

<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/prev.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/prev.gif" alt="Preview of demo" /></a>

It was written in JS and uses libraries:
<ul>
 	<li><a href="https://threejs.org/" rel="nofollow">three.js</a></li>
 	<li><a href="https://www.tensorflow.org/js" rel="nofollow">tf.js</a></li>
 	<li><a href="https://github.com/mrdoob/stats.js/">stats.js</a></li>
</ul>
Keras models ware converted for tf.js with the command:
<pre><code>tensorflowjs_converter  --input_format keras src_model trg_dir
</code></pre>
<h3></h3>
<h3>How to use</h3>
The demonstration should start after page was loaded. To change simulation parameters use the UI that appears at the top right part of the page. To apply selected parameters and restart simulation click <code>Apply</code>.

A graph on the top-left part of the screen shows a time taken by the neural network to predict the next frame.

<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/demo.png" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/demo.png" alt="Screenshot of demo" /></a>
<h3></h3>
<h3>Comment</h3>
First <code>N</code> frames are generated by offsetting the start position, where <code>N</code> is a length of a sample that network uses to predict the next one. This is why a sudden change in the shape of a plane:

<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/first_frames.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/first_frames.gif" alt="Example" /></a>

Due to a small number of samples that networks ware trained on there are some combinations of parameters that cause the animation to break:

<a href="https://github.com/p4vv37/3dml/blob/master/4_plane/img/prev_broken.gif" target="_blank" rel="noopener noreferrer"><img src="https://github.com/p4vv37/3dml/raw/master/4_plane/img/prev_broken.gif" alt="Broken example" /></a>