export const launchpadOverview = `

- Launchpad is a low-code application development platform. 
    - It is used to build and manage enterprise-grade applications with a visual interface.
    - This is accomplished through a variety of rule types that define application behavior, data models, user interfaces, and integrations.

## Some common concepts in Launchpad:

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
        7. In the "Create Rule" dialog that appears, provide appropriate rule type specific values:
            - You may see a "Library" dropdown. Select the appropriate existing library.
            - Avoid creating a new library unless explicitly instructed.

- Creating a new rule instance as part of an ongoing flow:
    - When you are in a flow for example creating or updating a rule and need to create a new rule instance as part of **Picker Drop down menus**, follow these steps:
        1. Follow navingation steps of a "Picker Drop down menus" to click the "Create New" link at the bottom of the dropdown list.
        2. A new Tab would open to create a new instance of that rule type. Take note of current tab so you can return to it later.
        3. Create the new rule instance by providing appropriate values in the new tab. Note the name of the rule instance you are creating.
        4. After saving the new rule instance, return to the original tab where you were working on the flow.
        5. In the relevant "Picker Drop down menus", click the chevron dropdown icon on the right side of the dropdown menu to select the newly created rule instance by name from the list.

- Adding parameters to a rule instance:
    - Procedure for adding an Input Parameter to a rule using Parameters tab:
        1.	Navigate: Ensure you are in the "Parameters" tab.
        2.	Initiate Add: Locate and click the "Add" link or button. A new, empty row will be added to the input parameters table.
        3.	Populate Text Fields: In the newly created row, perform the following:
            •	In the "Name" column, enter: [Parameter Name]
            •	In the "Description" column, enter: [Parameter Description]
        4.	Select from Type Selector Dropdown:
            •	In the "Type" column, click the chevron dropdown icon on the right side of the dropdown menu to reveal the list of available types.
            •	Select the option from the list that exactly matches required Type.
    
`;
