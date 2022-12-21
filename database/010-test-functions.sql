BEGIN;
DO language plpgsql $$
BEGIN
    IF NOT (SELECT usesuper from pg_user where usename = current_user) THEN
        RAISE EXCEPTION 'Недостаточно прав для проведения тестирования';
    END IF;
END;
$$;

SELECT set_config('test.passed', '0', true);
SELECT set_config('test.failed', '0', true);

-- Получение последнего ID, чтобы не занимать уже существующие и ибежать конфликтов
-- Переменные сохраняются только в рамках данной транзакции, за это отвечает true в конце
SELECT set_config('test.pupils.id', (COALESCE((SELECT max(id) FROM pupils), 1))::text, true);
SELECT set_config('test.concerts.id', (COALESCE((SELECT max(id) FROM concerts), 1))::text, true);
SELECT set_config('test.costumes.id', (COALESCE((SELECT max(id) FROM costumes), 1))::text, true);
SELECT set_config('test.dances.id', (COALESCE((SELECT max(id) FROM dances), 1))::text, true);
SELECT set_config('test.groups.id', (COALESCE((SELECT max(id) FROM groups), 1))::text, true);
SELECT set_config('test.teachers.id', (COALESCE((SELECT max(id) FROM teachers), 1))::text, true);
SELECT set_config('test.schedule.id', (COALESCE((SELECT max(id) FROM schedule), 1))::text, true);
SELECT set_config('test.membership_type.id', (COALESCE((SELECT max(id) FROM membership_type), 1))::text, true);
SELECT set_config('test.status.id', (COALESCE((SELECT max(id) FROM status), 1))::text, true);

-- Добавление тестовых данных
-- (да, это выглядит страшно и некрасиво, согласен)
INSERT INTO public.concerts (id, beginning_time, address)
VALUES (current_setting('test.concerts.id')::int, '2020-11-13 00:00:00', 'TestAddress');
INSERT INTO public.dances (id, name, type, duration, difficulty, music_name, is_for_kids)
VALUES (current_setting('test.dances.id')::int, 'TestDance', 1::bit, '00:00:15', 1, 'TestMusic', false);
INSERT INTO public.costumes (id, type, color, clothes_size, cost)
VALUES (current_setting('test.costumes.id')::int, 'TestType', 'TestColor', 23, '$2000.00');
INSERT INTO public.teachers (id, first_name, second_name, last_name, experience, username)
VALUES (current_setting('test.teachers.id')::int, 'TestName', 'TestFather', 'TestSurname', 1, 'test_teacher');
INSERT INTO public.groups (id, name, address)
VALUES (current_setting('test.groups.id')::int, 'TestGroup', 'TestAddress');
INSERT INTO public.status (id, status)
VALUES (current_setting('test.status.id')::int, 'TestStatus');
INSERT INTO public.pupils (id, last_name, first_name, second_name, age, sex, begin_date, status, group_id, username)
VALUES (current_setting('test.pupils.id')::int, 'TestSUR', 'RandomNAME', 'NullFATHER', 20, '0', '2020-11-13', current_setting('test.status.id')::int, current_setting('test.groups.id')::int, 'test_pupil');
INSERT INTO public.concert_dance_lists (concert_id, dance_id, pupil_id)
VALUES (current_setting('test.concerts.id')::int, current_setting('test.dances.id')::int, current_setting('test.pupils.id')::int);
INSERT INTO public.costume_ownership (pupil_id, costume_id, is_owned)
VALUES (current_setting('test.pupils.id')::int, current_setting('test.costumes.id')::int, true);
INSERT INTO public.group_management (group_id, teacher_id)
VALUES (current_setting('test.groups.id')::int, current_setting('test.teachers.id')::int);
INSERT INTO public.schedule (id, weekday, begin_time, duration, hall_name, group_id)
VALUES (current_setting('test.schedule.id')::int, 1, '12:00:00', '02:00:00', 'TestHall', current_setting('test.groups.id')::int);
INSERT INTO public.membership_type (id, membership, price, group_id)
VALUES (current_setting('test.membership_type.id')::int, 'TestMembership', '$2000.00', current_setting('test.groups.id')::int);
INSERT INTO public.accounting (active_membership_id, acc_month, acc_year, pupil_id, visits, discount, paid)
VALUES (current_setting('test.membership_type.id')::int, 1, 2000, current_setting('test.pupils.id')::int, 1, '$0.00', '$4,400.00');
CREATE USER test_pupil WITH PASSWORD 'pupil' IN ROLE pupil;

-- Делаем сейвпоинт для того, чтобы в случае ошибки можно было откатиться
-- В основном нужно во время отладки, но лишним точно не будет
SAVEPOINT after_insert;
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'Test data was successfully added';
    RAISE NOTICE '+--------------------------------+';
    RAISE NOTICE '|    FUNCTION TESTING STARTED    |';
    RAISE NOTICE '+--------------------------------+';
END
$$;

-- Логинимся под новосозданным пользователем, т.к. на таблицах висят политики с проверкой на роль
-- Предварительно, естественно, стоит проверить, что он вообще создался
-- Создание пользака сейчас идёт через триггер, поэтому его проверка будет раньше теста функций
SET SESSION AUTHORIZATION test_pupil;

-- Проверка функции get_concert_dance_list
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'get_concert_dance_list test';
    RAISE NOTICE '--------------------------------';
    RAISE NOTICE 'Result:';

    CREATE TEMP TABLE test_table(dance_name text, difficulty text, type text, duration time);
    INSERT INTO test_table SELECT * FROM get_concert_dance_list(current_setting('test.concerts.id')::int);

    IF (SELECT dance_name FROM test_table) = 'TestDance'
        AND (SELECT difficulty FROM test_table) = 'Средний'
        AND (SELECT type FROM test_table) = 'Жесткий'
        AND (SELECT duration FROM test_table) = '00:00:15'
    THEN
        RAISE NOTICE 'Test passed';
        PERFORM set_config('test.passed', (current_setting('test.passed')::int + 1)::text, true);
    ELSE
        RAISE NOTICE 'Test failed';
        PERFORM set_config('test.failed', (current_setting('test.failed')::int + 1)::text, true);
    END IF;
    DROP TABLE test_table;
    RAISE NOTICE '--------------------------------';
END
$$;

-- Проверка функции get_group_memberships
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'get_group_memberships test';
    RAISE NOTICE '--------------------------------';
    RAISE NOTICE 'Result:';

    CREATE TEMP TABLE test_table(id int, membership text, price money, group_id int);
    INSERT INTO test_table SELECT * FROM get_group_memberships(current_setting('test.groups.id')::int);

    IF (SELECT membership FROM test_table) = 'TestMembership'
        AND (SELECT price FROM test_table) = '$2000.00'
    THEN
        RAISE NOTICE 'Test passed';
        PERFORM set_config('test.passed', (current_setting('test.passed')::int + 1)::text, true);
    ELSE
        RAISE NOTICE 'Test failed';
        PERFORM set_config('test.failed', (current_setting('test.failed')::int + 1)::text, true);
    END IF;
    DROP TABLE test_table;
    RAISE NOTICE '--------------------------------';
END
$$;

-- Проверка функции get_group_name
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'get_group_name test';
    RAISE NOTICE '--------------------------------';
    RAISE NOTICE 'Result:';

    IF get_group_name() = 'TestGroup'
    THEN
        RAISE NOTICE 'Test passed';
        PERFORM set_config('test.passed', (current_setting('test.passed')::int + 1)::text, true);
    ELSE
        RAISE NOTICE 'Test failed';
        PERFORM set_config('test.failed', (current_setting('test.failed')::int + 1)::text, true);
    END IF;
    RAISE NOTICE '--------------------------------';
END
$$;

-- Проверка функции get_visits
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'get_visits test';
    RAISE NOTICE '--------------------------------';
    RAISE NOTICE 'Result:';

    CREATE TEMP TABLE test_table(date text, pupil_name text, visits int, group_name text, paid money, discount money, membership text);
    INSERT INTO test_table SELECT * FROM get_visits(2000, 1, 2000, 12);

    IF (SELECT date FROM test_table) = 'Январь 2000'
        AND (SELECT pupil_name FROM test_table) = 'TestSUR RandomNAME NullFATHER'
        AND (SELECT visits FROM test_table) = 1
        AND (SELECT group_name FROM test_table) = 'TestGroup'
        AND (SELECT paid FROM test_table) = '$4,400.00'
        AND (SELECT discount FROM test_table) = '$0.00'
        AND (SELECT membership FROM test_table) = 'TestMembership'
    THEN
        RAISE NOTICE 'Test passed';
        PERFORM set_config('test.passed', (current_setting('test.passed')::int + 1)::text, true);
    ELSE
        RAISE NOTICE 'Test failed';
        PERFORM set_config('test.failed', (current_setting('test.failed')::int + 1)::text, true);
    END IF;
    RAISE NOTICE '--------------------------------';
END
$$;

SAVEPOINT after_functions;

-- Сбрасываем сессию обратно на админа
RESET SESSION AUTHORIZATION;

-- Подсчёт результатов тестирования
DO language plpgsql $$
BEGIN
    RAISE NOTICE 'Test results:';
    RAISE NOTICE '--------------------------------';
    RAISE NOTICE 'Passed: %', current_setting('test.passed');
    RAISE NOTICE 'Failed: %', current_setting('test.failed');
    RAISE NOTICE '--------------------------------';
END
$$;

-- Возвращаем всё как было, нам тестовые данные в таблицах не нужны
ROLLBACK;
