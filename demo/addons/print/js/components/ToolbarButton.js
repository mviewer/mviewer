/**
 * Public Method: _initTool exported as init
 */

// Add button to toolstoolbar
const tooltip = "Imprimer la carte";

const template = `
<button id="printBtn" class="btn btn-light"
  onclick="$('#printModal').modal('show');"  title="${tooltip}"
  tabindex="116" accesskey="f">
  <i class="ri-printer-line"></i>
</button>`;

export default () => {
  $("#toolstoolbar").append(template);
};
