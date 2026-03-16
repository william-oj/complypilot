# Control Mapping

Risk treatments map to Annex A controls using keyword detection in `backend/src/services/riskTreatmentService.ts`.

Example mappings:
- access -> A.5.15, A.5.16, A.5.17, A.5.18, A.8.5
- backup -> A.8.13, A.5.30
- incident -> A.5.24, A.5.25, A.5.26, A.5.27
- supplier -> A.5.19, A.5.20, A.5.21, A.5.22
- physical -> A.7.1, A.7.2, A.7.3, A.7.4

When no keywords match, a baseline control set is recommended.
