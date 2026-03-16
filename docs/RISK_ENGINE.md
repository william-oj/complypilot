# Risk Engine

Risk is calculated as:

```
Risk Score = Likelihood x Impact
```

Default scale (1-5):
- Likelihood: Rare, Unlikely, Possible, Likely, Almost certain
- Impact: Negligible, Minor, Moderate, Major, Severe

Severity tiers:
- 1-5 Low
- 6-11 Medium
- 12-19 High
- 20-25 Critical

See `backend/src/utils/risk.ts`.
