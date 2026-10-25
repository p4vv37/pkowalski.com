async function load_model(name) {
  const status = document.getElementById('demo-status');
  try {
    const available = await fetch('models-available.json').then(response => response.json());
    if (!available.includes(name)) {
      status.textContent = 'The interactive demo is currently unavailable. You can still view the original results below and read about the project in the article.';
      document.getElementById('original-output').hidden = false;
      document.getElementById('demo-controls').hidden = true;
      return;
    }
    const previous = window.model;
    window.model = null;
    const loadedModel = await tf.loadLayersModel('models/' + name + '_js/model.json');
    if (previous) previous.dispose();
    window.model = loadedModel;
    status.hidden = true;
    const controls = document.getElementById('demo-controls');
    controls.disabled = false;
    controls.hidden = false;
    generate_image();
  } catch (error) {
    status.textContent = 'The demo could not be loaded. Please try again later.';
    document.getElementById('original-output').hidden = false;
  }
}
