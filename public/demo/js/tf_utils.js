async function load_model(sampleSize) {
  const previousModel = window.model;
  window.model = null;
  const status = document.getElementById('demo-status');
  status.hidden = false;
  status.textContent = 'Loading the neural network…';
  try {
    const loadedModel = await tf.loadLayersModel(
      "models/model_multiple_points_" + sampleSize + "_js/model.json"
    );
    if (previousModel) previousModel.dispose();
    window.model = loadedModel;
    status.hidden = true;
  } catch (error) {
    status.textContent = 'The model could not be loaded. Please reload the page. ' + error.message;
  }
}
