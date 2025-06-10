(function () {
  // Step 1: Get the bot ID from the script tag
  const scriptTag = document.currentScript;
  const botId = scriptTag.getAttribute('data-project-id');

  // Step 2: Create an iframe pointing to your chatbot embed URL
  const chatWidget = document.createElement('iframe');
  chatWidget.src = `http://localhost:3000/bubble?botId=${botId}`;
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
// iframe.style.position = "fixed";
// iframe.style.bottom = "20px";
// iframe.style.right = "20px";
// iframe.style.width = "430px";
// iframe.style.height = "480px";
// iframe.style.border = "none";
// iframe.style.zIndex = "999999";
// iframe.style.borderRadius = "12px";
// iframe.allowTransparency = true; // 👈 For legacy browser support

// document.body.appendChild(iframe);
// })();