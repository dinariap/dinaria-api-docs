---
title: API Specification
nav_order: 3
---

<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">

<div id="swagger-ui"></div>

<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

<script>
  window.onload = () => {
    SwaggerUIBundle({
      url: "{{ 'https://dinariap.github.io/dinaria-api-docs/paymentAPI.yaml' | relative_url }}",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout"
    });
  };
</script>
