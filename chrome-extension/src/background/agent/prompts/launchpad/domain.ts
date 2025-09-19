export const launchpadDomainKnowledge = `

### **Library**

In Launchpad, a **library** is a logical grouping of rules that defines the scope for various components in your application. When creating a new rule, you will often see a "Library" dropdown. You should select the appropriate library and should not typically need to create a new one unless specifically instructed.

### **Integration Systems**

An **Integration System** is a reusable component that establishes a secure and reliable connection between a Launchpad application and an external system.

**Key Features:**

  - **Defines Connection Details**: Specifies the base URL for the external service.
  - **Manages Authentication**: Configures the authentication method (e.g., API keys, OAuth) required for a secure connection.

**Required Configuration to be provided:**

  - **Base URL Source**: The Base URL source can be set as a constant value or sourced dynamically from a \`Configuration Setting\` rule. Assume the source as Constant unless otherwise specified.
  - **Base URL**: Provide a fixed base URL directly in the "Base URL" field if you selected "Constant" as the source above.
  - **Authentication Profile**: Select or create an appropriate authentication profile using the picker dropdown in the UI.

### **REST Connectors**

A **REST Connector** enables your application to integrate with external systems by communicating with specific endpoints to retrieve or send data using standard HTTP methods.

**Key Features:**

  - **HTTP Methods**: Supports standard methods like GET, POST, PUT, and DELETE.
  - **Resource Path Parameters**: Allows dynamic segments in the resource path using input parameters.
  - **Request and Response Handling**: Provides configuration for request headers, query parameters, and the request body.

#### **Example: Configuring a \`PUT\` Endpoint**

Let us create a REST Connector for a \`PUT\` endpoint with a path parameter, based on the following OpenAPI specification:

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

To create or update the connector for the \`PUT /api/v1/Books/{id}\` endpoint, follow these steps:

1. To create a new REST Connector, follow the navigation steps to create a new rule of type **Rest Connector**.
    1. Provide appropriate values e.g. Name, Description and select an appropriate **Library**  using the picker dropdown in the Create new rule dialog.
    2. If you are unsure which Library to select, choose the first option in the list.

2. To open and edit an existing REST Connector, follow the navigation steps to open a rule of type **Rest Connector**.

3. Select or Create an **Integration System** based on the suggested plan using the picker dropdown in the **Service** tab.
    1. In the example above, we should create a new **Integration System** named \`BooksAPISystem\` with the Base URL set to a constant \`https://example.com\` and select appropriate authentication like oauth.
    2. Since this rule creation will open a new tab, recall instructions for creating a new rule in a separate tab as part of an ongoing flow, to create a new rule instance as part of an ongoing flow.

4. **Define Input Parameter** using Parameter tab
    1. Identify the path parameter from the OpenAPI spec. In this case, we have one path parameter named \`id\`. 
    2. Navigate to the **Parameters** tab.
    3. Add a new input parameter.
    4. Set its **Name** to \`id\`.
    5. Based on the schema (\`type: "integer"\`), set its **Type** to **Integer** using the "Type Selector" dropdown

5.  **Configure HTTP method**
    1.  Navigate back to the **Service** tab.
    2.  In the **Method** dropdown, select **PUT**.

6.  **Configure Resource Path Parameters**
    In the **Resource path parameters** section, add four parameters in sequence to construct the full path corresponding to each element in our example path - \`/api/v1/Books/{id}\`

      - **Parameter #1 (Static Parameter \`api\`)**

        1. Set the **Name** to \`path_segment_1\`.
        2. For the **Parameter value**, select **Static(Text)**, and enter \`api\` in the text box using the "composite UI component".
        3. Choose **encoding** as **None**.

      - **Parameter #2 (Static Parameter \`v1\`)**

        1. Set the **Name** to \`path_segment_2\`.
        2. For the **Parameter value**, select **Static(Text)** and enter \`v1\` in the text box using the "composite UI component".
        3. Choose **encoding** as **None**.

      - **Parameter #3 (Static Parameter \`Books\`)**

        1. Set the **Name** to \`path_segment_3\`.
        2. For the **Parameter value**, select **Static(Text)** and enter \`Books\` in the text box using the "composite UI component".
        3. Choose **encoding** as **None**.

      - **Parameter \#4 (Variable Parameter \`id\`)**

        1. Set the **Name** to \`id\` (to match the OpenAPI parameter).
        2. For the **Parameter value**, click the dropdown trigger, select **Source from Variable**, and select \`id\` from the drop down using the "composite UI component". This will reference the input parameter, \'id\' we defined earlier.
        3. Choose Empty behavior as **Throw error/Required** by clicking the dropdown.
        3. Choose **encoding** as **None**.

7. **Finalize**
      - After configuring all four path parameters, click the **Save** or **Create** button to complete the setup.


`;
