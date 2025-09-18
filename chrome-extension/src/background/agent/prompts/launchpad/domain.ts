export const launchpadDomainKnowledge = `
- Integration Systems Rule types
    Summary: Defines the connection endpoint and authentication used by Launchpad connectors and integration rules. Keep this rule reusable across the app.

    Key aspects:
    - Base URL Source: it can be constant or of configuration setting rule type
    - Base URL: base endpoint URL
    - Authentication profile: None | Basic | Bearer | API Key | OAuth2
    - reusable: referenced by connectors to centralize config
`;
