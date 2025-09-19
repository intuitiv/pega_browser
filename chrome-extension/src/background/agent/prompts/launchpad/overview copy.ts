export const launchpadOverview = `

- Launchpad is a low-code application development platform. 
    - It is used to build and manage enterprise-grade applications with a visual interface.
    - This is accomplished through a variety of rule types that define application behavior, data models, user interfaces, and integrations.

## Some common concepts in Launchpad:


- Create new rule pop-up dialog:
    - When you try to create a new rule instance, a "Create Rule" dialog will typically appear.
    - We need to provide some initial details in the "Create Rule" dialog, for example:
        - Name: Provide a unique name for the rule instance.
        - Description: Provide a brief description of the rule instance's purpose or functionality.
        - Library: A Library option would typicallu appear to be selected through a **Picker Drop down menu**. 
            - Select an existing library from the dropdown. 
            - Avoid creating a new library unless explicitly instructed.
        - Once you click submit, you will be taken to the rule instance's main configuration page where you provide further rule type specific details.
        - Once you have provided all necessary details, click the "Create" button typically located at the top right corner of the page to save your changes.

- Opening or Creating a rule instance:
    - Navigation steps to Open or create a Rule Instance of a particular type:
        1. In the main navigation pane on left hand side, locate and click the "Rules Library" link.
        2. In the list of rule categories, locate and expand the relevant node based on following mapping (RuleType-to-Category):
            - Integration Systems: "Integration"
            - Rest Connectors: "Integration"
            - Data Pages: "Data"
            - Data Connections: "Data"
            - Fields: "Data"
        3. Within the expanded node, locate and click the appropriate rule type link.
        4. You will get a list of rules of that type. 
        5. To Open an existing rule, locate the rule by name and click on the hyperlink in the "Name" column of the table.
        6. To create a new rule, click the "Create" button typically located at the top right corner of the page.
            1. In the "Create Rule" dialog that appears, provide appropriate rule type specific values:
                - You may see a "Library" dropdown. Select the appropriate existing library.
                - Avoid creating a new library unless explicitly instructed.
            2. Finally, provide all necessary details and click the "Create" button to save the new rule instance.

- Creating a new rule instance as part of an ongoing flow:
    - When you are in a flow for example creating or updating a rule and need to create a new rule instance as part of **Picker Drop down menus**, follow these steps:
        1. Follow navigation steps of a "Picker Drop down menus" to click the "Create New" link at the bottom of the dropdown list.
        2. A new Tab would open to create a new instance of that rule type. Take note of current tab so you can return to it later.
        3. Create the new rule instance by providing appropriate values in the new tab. Note the name of the rule instance you are creating.
        4. After saving the new rule instance, return to the original tab where you were working on the flow.
        5. In the relevant "Picker Drop down menus", click the chevron dropdown icon on the right side of the dropdown menu to select the newly created rule instance by name from the list.

- Adding input parameters to a rule instance:
    - Procedure for adding an Input Parameter to a rule using Parameters tab:
        1.	Navigate: Ensure you are in the "Parameters" tab.
        2.	Initiate Add: Locate and click the "Add" link or button. A new, empty row will be added to the input parameters table.
        3.	Populate Text Fields: In the newly created row, perform the following:
            •	In the "Name" column, enter: [Parameter Name]
            •	In the "Description" column, enter: [Parameter Description]
        4.	Select from Type Selector Dropdown:
            •	In the "Type" column, click the chevron dropdown icon on the right side of the dropdown menu to reveal the list of available types.
            •	Select the option from the list that exactly matches required Type.

- Specifying an ouput parameter for a rule instance of a certain type:
    - Procedure for adding an Output Parameter to a rule using Parameters tab:
        1.	Navigate: Ensure you are in the "Parameters" tab.
        2.	Locate Output parameters section: 
            - Provide an appropriate description in the "Description" text box.
            - In the "Type" dropdown, click the chevron dropdown icon on the right side of the dropdown menu to reveal the list of available types.
            - Select the option from the list that exactly matches required Type. For example, "Text", "Integer" etc.


- Adding a new field in the **Case Type** using Data Model tab with Expression calculation to call a Data Connection:
    - Steps to add a new field with Expression calculation in Case Designer using Data Model tab:
        - Navigate to required Case Type.
            1. In the main navigation pane on left hand side, locate and click the "Cases" link.
            2. In the list of Case Types, locate and click the Case Type you are working with (e.g. "Service Request").
            3. In the Case Type configuration page, click the "Data Model" tab.
        - Adding a new field from Data Model tab:
            1. Once the Case Type configuration page opens, click on the "Data Model" tab.
            2. Click on the "Add" button to add a new field.
        - Configuring the new field with Expression calculation:
            1. Add basic details for the new field:
                - In the "Add Field" dialog that appears, provide the following details:
                    - Name: Provide a unique name for the field.
                    - Description: Provide a brief description of the field's purpose or functionality.
                    - Type: Select the Field Type as "Text" from the dropdown.
                - Configure calculation:
                    - After selecting "Text" as the type, locate and select the checkbox labeled "This is a calculated field (read-only)".
                    - Select the "Calculated" checkbox. This will reveal the "Calculation" **composite UI component or Input Group**
                    - Calculation component details:
                        - The component will contain a dropdown trigger button and a text input box. 
                        - The dropdown trigger button is typically on the left side of the input box and opens a menu to select the input's source type. 
                        - The text input box is where the actual value is entered.
                    - Configuring the Calculation component:
                        - Click the dropdown trigger button and select the "Expression" option from the list.
                        - After selecting "Expression", the text input box will become active for input.
                        - Click on the maginifying glass icon on the right side of the input box to open the expression builder pop-up.
                        - In the expression builder pop-up:
                            - Focus on the "Expression" text area labelled "Expression" with an asterisk (*) on the right side of the pop-up
                            - Enter the expression to invoke the Data Connection in the following format: Servicerequest@DataConnection:<DataConnectionName>()
                            - Replace <DataConnectionName> with the actual name of the Data Connection you want to invoke. For example, if the Data Connection is named "RetrieveStockInfo", the expression would be Servicerequest@DataConnection:RetrieveStockInfo()
                        - Click the "Submit" button to save the expression and close the pop-up.
                        - We will return to the "Add Field" dialog where the expression will now be populated in the Calculation input box.
                        - Now click the "Submit" button to save the new field configuration.
            3. Save the new field configuration:
                - Click the Submit button to save the new field configuration.
                - Finally, click the "Save" button on the Case Type configuration page to apply all changes to your Data Model.


`;
