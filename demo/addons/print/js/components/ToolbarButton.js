/**
 * Public Method: _initTool exported as init
 */

// Add button to toolstoolbar
const tooltip = "Imprimer la carte";

const template = `
<button id="printBtn" class="btn btn-default btn-raised"
  onclick="$('#printModal').modal('show');"  title="${tooltip}"
  tabindex="116" accesskey="f">
  <span class="glyphicon glyphicon-print" aria-hidden="true"></span>
</button>`;

export default () => {
  $("#toolstoolbar").append(template);
};
