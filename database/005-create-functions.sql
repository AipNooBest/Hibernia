/* Создание функций */
-- Функция для получения всех абонементов в группе
CREATE OR REPLACE FUNCTION get_group_memberships(necessary_id integer)
RETURNS SETOF public.membership_type AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.membership_type WHERE membership_type.group_id = necessary_id;
END
$$ LANGUAGE plpgsql;

-- Функция для получения своей группы
CREATE OR REPLACE FUNCTION get_group_name() RETURNS text AS $$
    SELECT name FROM groups WHERE id = (SELECT group_id FROM pupils WHERE username = current_user);
$$ LANGUAGE SQL;

-- Функция для получения списка танцев, которые пользователь танцует на концерте
CREATE OR REPLACE FUNCTION get_concert_dance_list(concert_id int)
RETURNS TABLE (dance_name text, difficulty text, type text, duration time)
AS $$
SELECT dances.name,
       CASE
           WHEN dances.difficulty = 0 THEN 'Легкий'
           WHEN dances.difficulty = 1 THEN 'Средний'
           WHEN dances.difficulty = 2 THEN 'Сложный'
           WHEN dances.difficulty = 3 THEN 'Невозможный'
           ELSE 'Неизвестно'
           END AS difficulty,
       CASE
           WHEN dances.type = 0::bit THEN 'Мягкий'
           WHEN dances.type = 1::bit THEN 'Жесткий'
           END AS type,
       dances.duration
FROM concert_dance_lists
         JOIN dances ON concert_dance_lists.dance_id = dances.id
WHERE pupil_id = (SELECT id FROM pupils WHERE username = current_user)
  AND concert_dance_lists.concert_id = $1;
$$ LANGUAGE SQL;

-- Функция для конвертирования номера месяца в название
CREATE OR REPLACE FUNCTION get_month_name(month_number int)
RETURNS text AS $$
    SELECT CASE
               WHEN month_number = 1 THEN 'Январь'
               WHEN month_number = 2 THEN 'Февраль'
               WHEN month_number = 3 THEN 'Март'
               WHEN month_number = 4 THEN 'Апрель'
               WHEN month_number = 5 THEN 'Май'
               WHEN month_number = 6 THEN 'Июнь'
               WHEN month_number = 7 THEN 'Июль'
               WHEN month_number = 8 THEN 'Август'
               WHEN month_number = 9 THEN 'Сентябрь'
               WHEN month_number = 10 THEN 'Октябрь'
               WHEN month_number = 11 THEN 'Ноябрь'
               WHEN month_number = 12 THEN 'Декабрь'
               ELSE 'Неизвестно'
               END;
$$ LANGUAGE SQL;

-- Функция для получения даты из года и месяца
CREATE OR REPLACE FUNCTION get_date(year int, month int)
RETURNS date
AS $$
    DECLARE data_str text;
BEGIN
    data_str := year || '-' || month || '-01';
    RETURN data_str::date;
END;
$$ LANGUAGE plpgsql;


-- Функция для выгрузки списка посещений из таблицы accounting за указанный период
CREATE OR REPLACE FUNCTION get_visits(start_year int, start_month int, end_year int, end_month int)
RETURNS TABLE (date text, pupil_name text, visits int, group_name text, paid money, discount money, membership text)
AS $$
SELECT concat_ws(' ', get_month_name(accounting.acc_month), accounting.acc_year)           AS date,
       concat_ws(' ', pupils.last_name, pupils.first_name, pupils.second_name)             AS pupil_name,
       visits,
       (SELECT name FROM groups WHERE id = group_id)                                       AS group_name,
       paid,
       discount,
       (SELECT membership FROM membership_type WHERE id = accounting.active_membership_id) AS membership
FROM accounting
    JOIN pupils ON accounting.pupil_id = pupils.id
    WHERE (SELECT get_date(accounting.acc_year, accounting.acc_month))
        BETWEEN get_date(start_year, start_month) AND get_date(end_year, end_month)
    ORDER BY accounting.acc_year, accounting.acc_month DESC;
$$ LANGUAGE SQL;

-- Функция для получения списка посещений за нынешний месяц
CREATE OR REPLACE FUNCTION get_visits()
RETURNS TABLE (date text, pupil_name text, visits int, group_name text, paid money, discount money, membership text)
AS $$
SELECT concat_ws(' ', get_month_name(accounting.acc_month), accounting.acc_year)           AS date,
       concat_ws(' ', pupils.last_name, pupils.first_name, pupils.second_name)             AS pupil_name,
       visits,
       (SELECT name FROM groups WHERE id = group_id)                                       AS group_name,
       paid,
       discount,
       (SELECT membership FROM membership_type WHERE id = accounting.active_membership_id) AS membership
FROM accounting
    JOIN pupils ON accounting.pupil_id = pupils.id
    WHERE (SELECT get_date(accounting.acc_year, accounting.acc_month))
        BETWEEN get_date(EXTRACT(YEAR FROM now())::int, EXTRACT(MONTH FROM now())::int) AND now();
$$ LANGUAGE SQL;

-- Функция для транслитерации из кириллицы в латиницу
CREATE OR REPLACE FUNCTION transliterate(text)
RETURNS text AS $$
    SELECT replace( replace( replace( replace(
    replace( replace( replace( replace( translate(lower($1),
    'абвгдеёзийклмнопрстуфхцэы', 'abvgdeezijklmnoprstufхcey'), 'ж', 'zh'),
    'ч', 'ch'), 'ш', 'sh'), 'щ', 'shh'), 'ъ', ''), 'ю', 'yu'), 'я', 'ya'), 'ь', '');
$$ LANGUAGE SQL;

-- Функция для получения всех учеников, которые посещают занятия
CREATE OR REPLACE FUNCTION get_all_active_pupils()
RETURNS TABLE (id int)
AS $$
    SELECT id FROM pupils WHERE status = 1 OR status = 2;
$$ LANGUAGE SQL;

-- Получение последнего месяца, в котором были посещения у ученика
CREATE OR REPLACE FUNCTION get_last_pupil_accounting(id int)
    RETURNS TABLE (acc_month int, acc_year int, pupil_id int, visits int, discount money, paid money, active_membership_id int)
AS $$
    SELECT * FROM accounting
    WHERE pupil_id = id
    ORDER BY acc_year DESC, acc_month DESC
    LIMIT 1;
$$ LANGUAGE SQL;

-- Существует ли уже такой пользователь
CREATE OR REPLACE FUNCTION user_exists(username text)
RETURNS boolean
AS $$
    SELECT EXISTS(SELECT 1 FROM pupils WHERE pupils.username = $1) OR
           EXISTS(SELECT 1 FROM teachers WHERE teachers.username = $1) OR
           EXISTS(SELECT 1 FROM pg_user WHERE usename = $1);
$$ LANGUAGE SQL;

-- Функция для получения ученика по нику
CREATE OR REPLACE FUNCTION get_pupil(username text)
    RETURNS TABLE (full_name text, age int, sex text, status text, group_name text, membership text) AS
$$
SELECT concat_ws(' ', pupils.last_name, pupils.first_name, pupils.second_name) AS full_name,
       pupils.age,
       CASE
           WHEN pupils.sex = 0::bit THEN 'Мужской'::text
           ELSE 'Женский'::text
           END AS sex,
       status.status,
       groups.name AS group_name,
       membership_type.membership
FROM pupils
         JOIN status ON status.id = pupils.status
         JOIN groups ON groups.id = pupils.group_id
         JOIN accounting ON accounting.pupil_id = pupils.id AND
                            (acc_year, acc_month) = (SELECT acc_year, acc_month FROM get_last_pupil_accounting(pupils.id))
         JOIN membership_type ON membership_type.id = accounting.active_membership_id
WHERE pupils.username = $1;
$$ LANGUAGE sql;
