export const launchpadDomainKnowledge = `



### **Library**

In Launchpad, a **library** is a logical grouping of rules that defines the scope for various components in your application. When creating a new rule, you will see a "Library" dropdown. You should select the appropriate library (e.g., "My Company") and should not typically create a new one unless specifically instructed.

### **Integration Systems**

An **Integration System** is a reusable component that establishes a secure and reliable connection between a Launchpad application and an external system.

**Key Features:**

  - **Defines Connection Details**: Specifies the base URL for the external service.
  - **Manages Authentication**: Configures the authentication method (e.g., API keys, OAuth) required for a secure connection.

**Configuration:**

  - **Base URL Source**: The Base URL can be set as a constant value or sourced dynamically from a \`Configuration Setting\` rule.
      - **Static URL**: Provide a fixed base URL directly in the "Base URL" field.
      - **Dynamic URLs**: Use \`Configuration Setting\` objects to define different base URLs for various environments (e.g., development, staging, production).
  - **Authentication Profile**: Select or create an appropriate authentication profile using the picker dropdown in the UI.

-----

### **REST Connectors**

A **REST Connector** enables your application to integrate with external systems by communicating with specific endpoints to retrieve or send data using standard HTTP methods.

**Key Features:**

  - **HTTP Methods**: Supports standard methods like GET, POST, PUT, and DELETE.
  - **Resource Path Parameters**: Allows dynamic segments in the resource path using input parameters.
  - **Request and Response Handling**: Provides configuration for request headers, query parameters, and the request body.

#### **Example: Configuring a \`PUT\` Endpoint**

Let's configure a REST Connector for a \`PUT\` endpoint with a path parameter, based on the following OpenAPI specification:

\`\`\`json
{
  "/api/v1/Books/{id}": {
    "put": {
      "tags": [ "Books" ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": { "type": "integer", "format": "int32" }
        }
      ],
      "requestBody": {
        "content": {
          "application/json; v=1.0": {
            "schema": { "$ref": "#/components/schemas/Book" }
          }
        }
      }
    }
  }
}
\`\`\`

To configure the connector for the \`PUT /api/v1/Books/{id}\` endpoint, follow these steps:

1.  **Define Input Parameter** using Parameter tab

    1.  Navigate to the **Parameters** tab.
    2.  Add a new input parameter.
    3.  Set its **Name** to \`id\`.
    4.  Based on the schema (\`type: "integer"\`), set its **Type** to **Integer** using the "Type Selector" dropdown

1.  **Configure HTTP method**

    1.  Navigate back to the **Service** tab.
    2.  In the **Method** dropdown, select **PUT**.

3.  **Configure Resource Path Parameters**
    In the **Resource path parameters** section, add four parameters in sequence to construct the full path corresponding to each element in our example path - \`/api/v1/Books/{id}\`

      - **Parameter #1 (Static Segment \`api\`)**

        1.  Set the **Name** to \`path_segment_1\`.
        2.  For the **Parameter value**, select **Static(Text)**, and enter \`api\` in the text box using the "composite UI component".

      - **Parameter #2 (Static Segment \`v1\`)**

        1.  Set the **Name** to \`path_segment_2\`.
        2.  For the **Parameter value**, select **Static(Text)** and enter \`v1\` in the text box using the "composite UI component".

      - **Parameter #3 (Static Segment \`Books\`)**

        1.  Set the **Name** to \`path_segment_3\`.
        2.  For the **Parameter value**, select **Static(Text)** and enter \`Books\` in the text box using the "composite UI component".

      - **Parameter \#4 (Variable Segment \`id\`)**

        1.  Set the **Name** to \`id\` (to match the OpenAPI parameter).
        2.  For the **Parameter value**, click the dropdown trigger, select **Source from Variable**, and enter \`id\` in the text box using the "composite UI component". This must be a case-sensitive match to the input parameter defined in Step 1 where we defined an Input Parameter
1. **Finalize**
      - After configuring all four path parameters, click the **Save** button to complete the setup.


`;
