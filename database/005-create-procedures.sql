/* Создание процедур */
-- Процедура для добавления ученика в таблицу учёта accounting
CREATE OR REPLACE PROCEDURE add_pupil_to_accounting(pupil_id int, paid money, discount money, membership_id int)
AS $$
BEGIN
    INSERT INTO accounting (active_membership_id, acc_month, acc_year, pupil_id, discount, paid)
    VALUES ($4, date_part('month', now()), date_part('year', now()), $1, $3, $2);
END;
$$ LANGUAGE plpgsql;

-- Процедура для удаления ученика из всех таблиц
CREATE OR REPLACE PROCEDURE delete_pupil(id int)
AS $$
    DECLARE username text;
BEGIN
    SELECT pupils.username INTO username FROM pupils WHERE pupils.id = $1;
    IF username IS NULL THEN
        RAISE EXCEPTION 'Pupil with id % does not exist', $1;
    END IF;
    DELETE FROM accounting WHERE pupil_id = $1;
    DELETE FROM concert_dance_lists WHERE pupil_id = $1;
    DELETE FROM costume_ownership WHERE pupil_id = $1;
    EXECUTE format('DROP USER %I', username);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_pupil(username text)
AS $$
    DECLARE user_id int;
BEGIN
    SELECT pupils.id INTO user_id FROM pupils WHERE pupils.username = $1;
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Pupil with username % does not exist', $1;
    END IF;
    DELETE FROM accounting WHERE pupil_id = user_id;
    DELETE FROM concert_dance_lists WHERE pupil_id = user_id;
    DELETE FROM costume_ownership WHERE pupil_id = user_id;
    DELETE FROM pupils WHERE pupils.username = $1;
    EXECUTE format('DROP USER %I', username);
END;
$$ LANGUAGE plpgsql;