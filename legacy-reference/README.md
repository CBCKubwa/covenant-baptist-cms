# Legacy/reference implementation from the supplied message

The conversation also supplied an older implementation containing:

- prisma/schema.prisma with Admin/ChurchInfo/Event/WeeklyActivity/Ministry/Sermon/Devotional/Announcement/Resource/Album/Media/FormSubmission
- NextAuth credentials authentication
- bcrypt admin seed
- S3 upload utility and upload API
- audit logging utility
- sermon/events/devotional/submission APIs
- older SermonForm, HomePage, Today's Word, sermons listing, audio player, contact form and admin inbox

These files were intentionally not dropped over the current project because the current ZIP has a different Prisma schema and authentication architecture. Direct replacement would break type generation and potentially the admin system.

Migrate features from this implementation into the current architecture instead of mixing the two schemas.
