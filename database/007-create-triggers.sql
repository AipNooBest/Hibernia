/* Создание триггеров */
-- Триггер для удаления строк из таблицы accounting при удалении ученика
CREATE OR REPLACE FUNCTION delete_accounting_row()
RETURNS trigger AS $$
BEGIN
    DELETE FROM accounting WHERE pupil_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_accounting_row
    BEFORE DELETE ON pupils
    FOR EACH ROW
    EXECUTE PROCEDURE delete_accounting_row();

-- Триггер для удаления строк из таблицы accounting в случае, если прошло уже больше 12 месяцев
CREATE OR REPLACE FUNCTION delete_old_accounting_row()
RETURNS trigger AS $$
DECLARE
    accounting_date date;
BEGIN
    accounting_date := get_date(NEW.acc_year, NEW.acc_month);
    IF current_date - accounting_date > '12 months'::interval THEN
        DELETE FROM accounting WHERE acc_year = NEW.acc_year AND acc_month = NEW.acc_month;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_old_accounting_row
    BEFORE INSERT OR UPDATE ON accounting
    FOR EACH ROW
    EXECUTE PROCEDURE delete_old_accounting_row();

/* Триггер для добавления имени пользователя в таблицу pupils при добавлении нового ученика
 * Плюс создание пользователя БД с именем, введённым при добавлении ученика
 * Если ник при добавлении ученика не введен, то он генерируется из ФИО ученика
 * Если ник уже занят, то к нему добавляется номер, начиная с 1                                     */
CREATE OR REPLACE FUNCTION add_pupil_to_database()
RETURNS trigger AS $$
    DECLARE counter int := 1;
BEGIN
    IF NEW.username IS NULL THEN
        NEW.username := transliterate(NEW.last_name || SUBSTR(NEW.first_name, 1, 3) || SUBSTR(NEW.second_name, 1, 3));
    END IF;
    WHILE EXISTS (SELECT * FROM pg_user WHERE usename = NEW.username) LOOP
        NEW.username := NEW.username || counter;
        counter := counter + 1;
    END LOOP;
    EXECUTE format('CREATE USER %I WITH PASSWORD %L IN ROLE pupil', NEW.username, 'SCRAM-SHA-256$4096:WhEvJT5jHZESufVLXmwp8g==$bZXK9Ckr9vvU1OUKKYS4eVK2ETgFjXvnqKrXdOOhTmw=:nbsEndgsQwzXq8LcBlvShX+5Kd97+ABIrmENHI+pHMs=');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_pupil_to_database
    BEFORE INSERT ON pupils
    FOR EACH ROW
    EXECUTE PROCEDURE add_pupil_to_database();

-- Триггер для ограничения по возрасту для танцев
CREATE OR REPLACE FUNCTION limit_the_age()
    RETURNS TRIGGER AS
    $$
    DECLARE
    pupil_age INTEGER;
    dance_type BOOLEAN;
    BEGIN
        pupil_age := (SELECT pupils.age FROM pupils WHERE pupils.id = NEW.pupil_id);
        dance_type := (SELECT dances.is_for_kids from dances WHERE dances.id = NEW.dance_id);
        IF (pupil_age < 10) AND (dance_type = FALSE) THEN
            RAISE unique_violation USING MESSAGE = 'Нельзя назначать детей на взрослые танцы.';
        END IF;
        IF (pupil_age > 14) AND (dance_type = TRUE) THEN
            RAISE unique_violation USING MESSAGE = 'Нельзя назначать взрослых на детские танцы.';
        END IF;
        RETURN NEW;
    END
    $$
    LANGUAGE PLPGSQL;

CREATE TRIGGER age_restriction
    BEFORE INSERT OR UPDATE
    ON public.concert_dance_lists
    FOR EACH ROW
    EXECUTE PROCEDURE limit_the_age();

