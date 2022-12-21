/* Создание процедур */
-- Процедура для добавления ученика в таблицу учёта accounting
CREATE OR REPLACE PROCEDURE add_pupil_to_accounting(pupil_id int, paid money, discount money, membership_id int)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO accounting (active_membership_id, acc_month, acc_year, pupil_id, discount, paid)
    VALUES ($4, date_part('month', now()), date_part('year', now()), $1, $3, $2);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_pupil_to_accounting(int, money, money, int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_pupil_to_accounting(int, money, money, int) TO teacher;

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

/* Процедура для добавления ученика в БД
 * Плюс создание пользователя БД с именем, введённым при добавлении ученика
 * Если ник при добавлении ученика не введен, то он генерируется из ФИО ученика */
CREATE OR REPLACE PROCEDURE add_pupil(last_name text, first_name text, second_name text, age int, sex bit, begin_date date, status smallint, group_id int, username text, password text)
SECURITY DEFINER
AS $$
BEGIN
    IF username IS NULL THEN
        username := transliterate(last_name || SUBSTR(first_name, 1, 3) || SUBSTR(second_name, 1, 3));
    END IF;
    IF user_exists(username) THEN
        RAISE EXCEPTION 'Пользователь с ником % уже существует', username;
    END IF;
    INSERT INTO pupils (last_name, first_name, second_name, age, sex, begin_date, status, group_id, username)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    EXECUTE format('CREATE USER %I WITH PASSWORD %L IN ROLE %I', username, password, 'pupil');
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_pupil(text, text, text, int, bit, date, smallint, int, text, text) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_pupil(text, text, text, int, bit, date, smallint, int, text, text) TO teacher;

-- Добавление нового концерта
CREATE OR REPLACE PROCEDURE add_concert(date date, place text)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO concerts (beginning_time, address) VALUES ($1, $2);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_concert(date, text) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_concert(date, text) TO teacher;

-- Добавление ученика в качестве участника концерта
CREATE OR REPLACE PROCEDURE add_pupil_to_concert(pupil_id int, concert_id int, dance_id int)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO concert_dance_lists (pupil_id, concert_id, dance_id) VALUES ($1, $2, $3);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_pupil_to_concert(int, int, int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_pupil_to_concert(int, int, int) TO teacher;

-- Удаление ученика из списка участников концерта
CREATE OR REPLACE PROCEDURE delete_pupil_from_concert(concert_id int, pupil_id int)
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM concert_dance_lists AS cdl WHERE cdl.concert_id = $1 AND cdl.pupil_id = $2;
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_pupil_from_concert(int, int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_pupil_from_concert(int, int) TO teacher;

-- Удаление концерта
CREATE OR REPLACE PROCEDURE delete_concert(concert_id int)
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM concert_dance_lists AS cdl WHERE cdl.concert_id = $1;
    DELETE FROM concerts WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_concert(int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_concert(int) TO teacher;

-- Добавление нового танца
CREATE OR REPLACE PROCEDURE add_dance(name text, type bit, duration time, difficulty smallint, music_name text, is_for_kids bool)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO dances (name, type, duration, difficulty, music_name, is_for_kids) VALUES ($1, $2, $3, $4, $5, $6);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_dance(text, bit, time, smallint, text, bool) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_dance(text, bit, time, smallint, text, bool) TO teacher;

-- Удаление танца
CREATE OR REPLACE PROCEDURE delete_dance(dance_id int)
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM concert_dance_lists AS cdl WHERE cdl.dance_id = $1;
    DELETE FROM dances WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_dance(int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_dance(int) TO teacher;

-- Добавление нового костюма
CREATE OR REPLACE PROCEDURE add_costume(type text, color text, size smallint, cost money)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO costumes (type, color, clothes_size, cost) VALUES ($1, $2, $3, $4);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_costume(text, text, smallint, money) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_costume(text, text, smallint, money) TO teacher;

-- Удаление костюма
CREATE OR REPLACE PROCEDURE delete_costume(costume_id int)
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM costume_ownership AS co WHERE co.costume_id = $1;
    DELETE FROM costumes WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_costume(int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_costume(int) TO teacher;

-- Добавление нового ученика в качестве владельца костюма
CREATE OR REPLACE PROCEDURE add_pupil_to_costume(pupil_id int, costume_id int, is_owned bool)
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO costume_ownership (pupil_id, costume_id, is_owned) VALUES ($1, $2, $3);
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE add_pupil_to_costume(int, int, bool) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE add_pupil_to_costume(int, int, bool) TO teacher;

-- Удаление ученика из списка владельцев костюма
CREATE OR REPLACE PROCEDURE delete_pupil_from_costume(pupil_id int, costume_id int)
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM costume_ownership AS co WHERE co.pupil_id = $1 AND co.costume_id = $2;
END;
$$ LANGUAGE plpgsql;
REVOKE ALL ON PROCEDURE delete_pupil_from_costume(int, int) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE delete_pupil_from_costume(int, int) TO teacher;
