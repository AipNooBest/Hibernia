/* Создание процедур */
-- Процедура для добавления ученика в таблицу учёта accounting
CREATE OR REPLACE PROCEDURE add_pupil_to_accounting(pupil_id int, paid money, discount money, membership_id int)
AS $$
BEGIN
    INSERT INTO accounting (active_membership_id, acc_month, acc_year, pupil_id, discount, paid)
    VALUES ($4, date_part('month', now()), date_part('year', now()), $1, $3, $2);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON FUNCTION add_pupil_to_accounting(int, money, money, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION add_pupil_to_accounting(int, money, money, int) TO teacher;

-- Процедура для удаления ученика из всех таблиц
CREATE OR REPLACE PROCEDURE delete_pupil(id int)
-- Процедура будет выполняться от имени владельца БД
-- Делается это чтобы не давать отдельно учителю права на удаление ролей.
SECURITY DEFINER
AS $$
    DECLARE username text;
BEGIN
    SELECT pupils.username INTO username FROM pupils WHERE pupils.id = $1;
    IF username IS NULL THEN
        RAISE EXCEPTION 'Ученик с ID % не существует', $1;
    END IF;
    DELETE FROM accounting WHERE pupil_id = $1;
    DELETE FROM concert_dance_lists WHERE pupil_id = $1;
    DELETE FROM costume_ownership WHERE pupil_id = $1;
    EXECUTE format('DROP USER %I', username);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_pupil(int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_pupil(int) TO teacher;

CREATE OR REPLACE PROCEDURE delete_pupil(username text)
SECURITY DEFINER
AS $$
    DECLARE user_id int;
BEGIN
    SELECT pupils.id INTO user_id FROM pupils WHERE pupils.username = $1;
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Ученик с ником % не существует', $1;
    END IF;
    DELETE FROM accounting WHERE pupil_id = user_id;
    DELETE FROM concert_dance_lists WHERE pupil_id = user_id;
    DELETE FROM costume_ownership WHERE pupil_id = user_id;
    DELETE FROM pupils WHERE pupils.username = $1;
    EXECUTE format('DROP USER %I', username);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_pupil(text) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_pupil(text) TO teacher;