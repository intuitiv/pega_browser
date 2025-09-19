export const launchpadUiKnowledge = `

# Typical User Interface Elements in Launchpad:

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
		- You may see a "Library" dropdown. Select the appropriate library (e.g., "My Company").

- Procedure for adding an Input Parameter to a rule using Parameters tab:
	1.	Navigate: Ensure you are in the "Parameters" tab.
	2.	Initiate Add: Locate and click the "Add" link or button. A new, empty row will be added to the input parameters table.
	3.	Populate Text Fields: In the newly created row, perform the following:
		•	In the "Name" column, enter: [Parameter Name]
		•	In the "Description" column, enter: [Parameter Description]
	4.	Select from Type Selector Dropdown:
		•	In the "Type" column, click the chevron dropdown icon on the right side of the dropdown menu to reveal the list of available types.
		•	Select the option from the list that exactly matches required Type.

- Instruction for handling **Picker Drop down menus** in Launchpad UI:
    1. To select an item from a picker dropdown list, first click on the dropdown arrow or chevron icon on the right-most section of the dropdown element. 
    2. Then, from the expanded list, select the desired item. 
    3. The list is typically dynamically loaded, with instances of the relevant rule type. 
	4. The selected item would typically be a hyperlink to the rule instance.
	5. Do not click on the main link/text if you want to open the picker list. Only click the dropdown arrow/chevron icon.
	6. At the bottom of the dropdown List, there will be a "Create New" link. Clicking this link will open a new tab to create a new instance of that rule type. Use this if you want to create a new instance instead of selecting an existing one.

- Instruction for Table Navigation:
	1.	Condition Check: First, verify that the current page displays data in a table format.
	2.	Locate Target: To open a specific rule, scan the column explicitly titled "Name" to find the row containing the target rule's name.
	3.	Execute Action: Click the hyperlink located within that same row (often on the name itself) to navigate to the rule's detail page.

- Instruction for handling with **composite UI component or Input Group** with a Dropdown Button:, 
	1. You may typically see this to provide a "Value" in various rule forms for e.g. a under a "Parameter value" or "Value" column form
	2. It can contain a dropdown trigger button and a text input box. 
		1. The dropdown trigger button is typically on the left side of the input box and opens a menu to select the input's source type. 
		2. The text input box is where the actual value is entered. 
	3. Your task is to configure a parameter by first setting its input mode (e.g., Static vs. Variable) and then providing the corresponding value.
	4. You must first click the trigger and select the correct source type before typing in the value.
	5. Select "Static(Text)" if you want to enter a fixed text value.
	6. Select "Source from Variable" if you want to reference a variable whose value will typically be sourced from "Input parameters" section of "Parameters" tab of the rule.
	7. Make sure if you select "Source from Variable", the variable name you enter in the text box matches exactly (case-sensitive) with one of the defined input parameters.
		8. Revisit the procedure for adding an Input Parameter to a rule above if you need to define a new input parameter.


# Error Handling:

- Handling validation errors related to missing values:
	1. If a rule save fails, with an error such as "Please fill in all the required fields", then try to identify the missing field by looking at highlighted fields or error messages.
	2. Once you have identified the missing field, fill in the appropriate assumed value for that field and attempt to save again.
	3. The missing field might be a input box, a picker dropdown, or a table entry. Use the relevant instructions above to fill in the value.

`;
