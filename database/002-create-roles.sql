/* Разграничение ролей */

CREATE ROLE admin WITH CREATEROLE;
CREATE ROLE teacher;
CREATE ROLE pupil;

-- Разрешаем админу все действия, кроме дропа таблиц и БД
-- Даже админы не должны уметь полностью ронять БД :^)
-- Пускай этим занимается суперпользователь в лице какого-нибудь тех. админа
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO admin;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO teacher;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pupil;

GRANT USAGE ON SEQUENCE pupils_id_seq TO teacher;

REVOKE SELECT ON group_management FROM pupil;