export const policyTemplates = [
  {
    slug: "information-security-policy",
    name: "Information Security Policy",
    description: "Top level security policy",
    template: `# Information Security Policy\n\nOrganization: {{organization.name}}\nEffective date: {{date}}\nOwner: {{owner}}\n\n## Purpose\nThis policy defines the security objectives and expectations for {{organization.name}}.\n\n## Scope\nAll personnel, systems, and information assets.\n\n## Principles\n- Protect confidentiality, integrity, and availability.\n- Follow least privilege and need to know.\n- Report incidents quickly.\n\n## Governance\nSecurity is reviewed at least annually and after major changes.\n`
  },
  {
    slug: "access-control-policy",
    name: "Access Control Policy",
    description: "Access control rules and procedures",
    template: `# Access Control Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Rules\n- Access is granted by role and approved by managers.\n- MFA is required for privileged access.\n- Access reviews occur quarterly.\n`
  },
  {
    slug: "asset-management-policy",
    name: "Asset Management Policy",
    description: "Asset inventory and lifecycle policy",
    template: `# Asset Management Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Requirements\n- All assets are inventoried with an owner.\n- Assets are classified by sensitivity.\n- Assets are returned or disposed on exit.\n`
  },
  {
    slug: "incident-response-policy",
    name: "Incident Response Policy",
    description: "Incident response policy and roles",
    template: `# Incident Response Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Goals\nDetect, respond, and recover quickly while preserving evidence.\n\n## Reporting\nIncidents are reported via {{incident_channel}}.\n`
  },
  {
    slug: "backup-policy",
    name: "Backup Policy",
    description: "Backup and recovery policy",
    template: `# Backup Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Backup Standards\n- Critical systems backed up daily.\n- Backups tested at least quarterly.\n`
  },
  {
    slug: "business-continuity-plan",
    name: "Business Continuity Plan",
    description: "BCP and recovery objectives",
    template: `# Business Continuity Plan\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Objectives\nRTO: {{rto}}\nRPO: {{rpo}}\n\n## Recovery\nDefine recovery steps and communication plan.\n`
  },
  {
    slug: "risk-assessment-methodology",
    name: "Risk Assessment Methodology",
    description: "Risk scoring and treatment process",
    template: `# Risk Assessment Methodology\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Scoring\nRisk = Likelihood x Impact\nScale: 1-5 for each.\n\n## Treatment\nAccept, Mitigate, Transfer, or Avoid.\n`
  },
  {
    slug: "supplier-security-policy",
    name: "Supplier Security Policy",
    description: "Supplier security requirements",
    template: `# Supplier Security Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Requirements\n- Suppliers are assessed before onboarding.\n- Security clauses are included in contracts.\n`
  },
  {
    slug: "acceptable-use-policy",
    name: "Acceptable Use Policy",
    description: "Acceptable use of systems and data",
    template: `# Acceptable Use Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Rules\n- Use company systems for business purposes.\n- Do not share credentials.\n`
  },
  {
    slug: "password-policy",
    name: "Password Policy",
    description: "Password and authentication standards",
    template: `# Password Policy\n\nOrganization: {{organization.name}}\nOwner: {{owner}}\n\n## Requirements\n- Minimum length: {{min_length}}\n- MFA required for privileged access.\n`
  }
];
