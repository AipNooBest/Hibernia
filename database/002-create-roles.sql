/* Разграничение ролей */

CREATE ROLE teacher;
CREATE ROLE pupil;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO teacher;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pupil;
REVOKE SELECT ON group_management FROM pupil;