(function () {
  // Step 1: Get the bot ID from the script tag
  const scriptTag = document.currentScript;
  const botId = scriptTag.getAttribute('data-project-id');

  // Step 2: Create an iframe pointing to your chatbot embed URL
  const chatWidget = document.createElement('iframe');
  chatWidget.src = `https://dev.sonicpad.ai/bubble?botId=${botId}`;
  chatWidget.style.position = 'fixed';
  chatWidget.style.bottom = '20px';
  chatWidget.style.right = '20px';
  chatWidget.style.width = '500px';
  chatWidget.style.height = '500px';
  chatWidget.style.border = 'none';
  chatWidget.style.zIndex = '99999';
  chatWidget.style.borderRadius = '10px';
  chatWidget.allowTransparency = true;

  // Step 3: Inject the iframe into the page
  document.body.appendChild(chatWidget);
})();