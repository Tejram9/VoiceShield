# VoiceShield - Database Architecture & Entities

This directory will store database migration scripts, ORM model schemas, and database initialization utilities for PostgreSQL.

> [!IMPORTANT]
> **Foundation Status**: Production schema definition files will be added in subsequent database milestone tasks.

## Planned Data Model & Entities

The PostgreSQL relational database will persist the following key domain models:

1. **`users`**: Account records, system access credentials, user roles, and security preferences.
2. **`sessions`**: Active user authentication tokens, device fingerprints, and connection state logs.
3. **`trusted_contacts`**: Profiles of verified individuals (e.g., family members, corporate executives) authorized for voice identity matching.
4. **`reference_voice_metadata`**: Metadata, vector embedding references, enrollment timestamps, and audio quality scores for trusted speaker profiles.
5. **`calls`**: Live and historic voice call sessions, caller ID metadata, timestamps, call duration, and call status.
6. **`risk_scores`**: Calculated multi-factor risk assessments per call frame, breakdown of individual signal scores (spoof score, speaker match score, social engineering threat score), and overall risk level (Low / Medium / High).
7. **`incidents`**: Flagged high-risk events, voice spoof alerts, escalation records, and user resolution actions.
8. **`audit_events`**: Immutable system audit logs for administrative actions, policy adjustments, and security event verifications.
