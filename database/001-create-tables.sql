-- Если что, корректность и полное соответствие с продакшн БД не гарантировано
-- Ну, после случайного дропа базы данных из-за докера, уже гарантировано...

/* Drop Tables */

DROP TABLE IF EXISTS accounting;
DROP TABLE IF EXISTS concert_dance_lists;
DROP TABLE IF EXISTS concerts;
DROP TABLE IF EXISTS costume_ownership;
DROP TABLE IF EXISTS costumes;
DROP TABLE IF EXISTS dances;
DROP TABLE IF EXISTS group_management;
DROP TABLE IF EXISTS membership_type;
DROP TABLE IF EXISTS pupils;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS teachers;




/* Create Tables */

-- Учёт занятий
CREATE TABLE accounting
(
	-- Год
	acc_year int NOT NULL,
	-- Месяц
	acc_month smallint NOT NULL,
	-- Номер ученика
	pupil_id int NOT NULL,
	-- Посещения
	visits int NOT NULL,
	-- Скидка
	discount money NOT NULL,
	-- Заплачено
	paid money NOT NULL,
	-- Номер активного абонемента
	active_membership_id int NOT NULL,
	PRIMARY KEY (acc_year, acc_month, pupil_id),
	CONSTRAINT visits UNIQUE (acc_month, acc_year, pupil_id)
) WITHOUT OIDS;


-- Концерты : -Дата
-- -Время
-- -Адрес
CREATE TABLE concerts
(
	-- id
	id serial NOT NULL UNIQUE,
	-- Дата и время
	beginning_time timestamp NOT NULL,
	-- Адрес
	address varchar(100) NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Список танцев на концерты
CREATE TABLE concert_dance_lists
(
	-- Номер концерта
	concert_id int NOT NULL,
	-- Номер танца
	dance_id int NOT NULL,
	-- Номер ученика
	pupil_id int NOT NULL,
	PRIMARY KEY (concert_id, dance_id, pupil_id),
	CONSTRAINT concert_program UNIQUE (concert_id, dance_id, pupil_id)
) WITHOUT OIDS;


-- Костюмы
CREATE TABLE costumes
(
	-- id
	id serial NOT NULL UNIQUE,
	-- Тип одежды : Брюки, юбка, футболка и т.д.
	type varchar(25) NOT NULL,
	-- Цвет
	color varchar(20) NOT NULL,
	-- Размер : Российская сетка размеров
	clothes_size smallint NOT NULL,
	-- Стоимость
	cost money NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Владение костюмами
CREATE TABLE costume_ownership
(
	-- Номер ученика
	pupil_id int NOT NULL,
	-- Номер костюма
	costume_id int NOT NULL,
	-- Имеется ли
	is_owned boolean NOT NULL,
	PRIMARY KEY (pupil_id, costume_id)
) WITHOUT OIDS;


-- Танцы
CREATE TABLE dances
(
	-- id
	id serial NOT NULL UNIQUE,
	-- Название
	name varchar(50) NOT NULL UNIQUE,
	-- Тип танца
	type bit NOT NULL,
	-- Длительность
	duration time NOT NULL,
	-- Сложность : 0 - EASY
	-- 1 - MEDIUM
	-- 2 - HARD
	-- 3 - IMPOSSIBRU!1!11!
	difficulty int NOT NULL,
	-- Название трека : Музыкальное сопровождение, мб ссылка там ещё
	music_name varchar(40) NOT NULL,
	-- Для детей
	is_for_kids boolean NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Группы
CREATE TABLE groups
(
	-- id
	id serial NOT NULL,
	-- Название
	name varchar(25) NOT NULL UNIQUE,
	-- Адрес
	address varchar(100) NOT NULL UNIQUE,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Ведение групп
CREATE TABLE group_management
(
	-- Номер группы
	group_id int NOT NULL,
	-- Номер преподавателя
	teacher_id int NOT NULL,
	PRIMARY KEY (group_id, teacher_id)
) WITHOUT OIDS;


-- Тип абонемента
CREATE TABLE membership_type
(
	-- id
	id serial NOT NULL,
	-- Тип абонемента
	membership text NOT NULL,
	-- Стоимость
	price money NOT NULL,
	-- Номер группы
	group_id int NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Ученики
CREATE TABLE pupils
(
	-- id
	id serial NOT NULL UNIQUE,
	-- Имя
	first_name varchar(30) NOT NULL,
	-- Отчество
	second_name varchar(30),
	-- Фамилия
	last_name varchar(30) NOT NULL,
	-- Имя пользователя
	username varchar(50) UNIQUE,
	-- Возраст
	age int NOT NULL,
	-- Пол : У кого был или не был
	-- 0 - мужЫг
	-- 1 - девушко
	sex bit NOT NULL,
	-- Дата начала обучения
	begin_date date NOT NULL,
	-- Статус
	status int NOT NULL,
	-- Номер группы
	group_id int NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Расписание
CREATE TABLE schedule
(
	-- id
	id serial NOT NULL UNIQUE,
	-- День недели
	weekday varchar(11) NOT NULL,
	-- Время начала
	begin_time time NOT NULL,
	-- Длительность занятия
	duration time NOT NULL,
	-- Название зала
	hall_name varchar(30) NOT NULL,
	-- Номер группы
	group_id int NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Статус обучающегося : "Активный, но не заплатил"
-- "Неактивный, не заплатил"
-- и т.д.
CREATE TABLE status
(
	-- id
	id int NOT NULL UNIQUE,
	-- Статус
	status text,
	PRIMARY KEY (id)
) WITHOUT OIDS;


-- Преподаватели
CREATE TABLE teachers
(
	-- id
	id serial NOT NULL UNIQUE,
	-- Имя
	first_name varchar(30) NOT NULL,
	-- Отчество
	second_name varchar(30),
	-- Фамилия
	last_name varchar(30) NOT NULL,
	-- Имя пользователя
	username varchar(50) UNIQUE,
    -- Возраст
    age int NOT NULL,
    -- Пол : У кого был или не был
    -- 0 - мужЫг
    -- 1 - девушко
    sex bit NOT NULL,
	-- Стаж
	experience decimal(3,1) NOT NULL,
	PRIMARY KEY (id)
) WITHOUT OIDS;



/* Create Foreign Keys */

ALTER TABLE concert_dance_lists
	ADD FOREIGN KEY (concert_id)
	REFERENCES concerts (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE costume_ownership
	ADD FOREIGN KEY (costume_id)
	REFERENCES costumes (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE concert_dance_lists
	ADD FOREIGN KEY (dance_id)
	REFERENCES dances (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE group_management
	ADD FOREIGN KEY (group_id)
	REFERENCES groups (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE membership_type
	ADD FOREIGN KEY (group_id)
	REFERENCES groups (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE pupils
	ADD FOREIGN KEY (group_id)
	REFERENCES groups (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE schedule
	ADD FOREIGN KEY (group_id)
	REFERENCES groups (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE accounting
	ADD FOREIGN KEY (active_membership_id)
	REFERENCES membership_type (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE accounting
	ADD FOREIGN KEY (pupil_id)
	REFERENCES pupils (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE concert_dance_lists
	ADD FOREIGN KEY (pupil_id)
	REFERENCES pupils (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE costume_ownership
	ADD FOREIGN KEY (pupil_id)
	REFERENCES pupils (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE pupils
	ADD FOREIGN KEY (status)
	REFERENCES status (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE group_management
	ADD FOREIGN KEY (teacher_id)
	REFERENCES teachers (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



/* Comments */

COMMENT ON TABLE accounting IS 'Учёт занятий';
COMMENT ON COLUMN accounting.acc_year IS 'Год';
COMMENT ON COLUMN accounting.acc_month IS 'Месяц';
COMMENT ON COLUMN accounting.pupil_id IS 'Номер ученика';
COMMENT ON COLUMN accounting.visits IS 'Посещения';
COMMENT ON COLUMN accounting.discount IS 'Скидка';
COMMENT ON COLUMN accounting.paid IS 'Заплачено';
COMMENT ON COLUMN accounting.active_membership_id IS 'Номер активного абонемента';
COMMENT ON TABLE concerts IS 'Концерты : -Дата
-Время
-Адрес';
COMMENT ON COLUMN concerts.id IS 'id';
COMMENT ON COLUMN concerts.beginning_time IS 'Дата и время';
COMMENT ON COLUMN concerts.address IS 'Адрес';
COMMENT ON TABLE concert_dance_lists IS 'Список танцев на концерты';
COMMENT ON COLUMN concert_dance_lists.concert_id IS 'Номер концерта';
COMMENT ON COLUMN concert_dance_lists.dance_id IS 'Номер танца';
COMMENT ON COLUMN concert_dance_lists.pupil_id IS 'Номер ученика';
COMMENT ON TABLE costumes IS 'Костюмы';
COMMENT ON COLUMN costumes.id IS 'id';
COMMENT ON COLUMN costumes.type IS 'Тип одежды : Брюки, юбка, футболка и т.д.';
COMMENT ON COLUMN costumes.color IS 'Цвет';
COMMENT ON COLUMN costumes.clothes_size IS 'Размер : Российская сетка размеров';
COMMENT ON COLUMN costumes.cost IS 'Стоимость';
COMMENT ON TABLE costume_ownership IS 'Владение костюмами';
COMMENT ON COLUMN costume_ownership.pupil_id IS 'Номер ученика';
COMMENT ON COLUMN costume_ownership.costume_id IS 'Номер костюма';
COMMENT ON COLUMN costume_ownership.is_owned IS 'Имеется ли';
COMMENT ON TABLE dances IS 'Танцы';
COMMENT ON COLUMN dances.id IS 'id';
COMMENT ON COLUMN dances.name IS 'Название';
COMMENT ON COLUMN dances.type IS 'Тип танца';
COMMENT ON COLUMN dances.duration IS 'Длительность';
COMMENT ON COLUMN dances.difficulty IS 'Сложность : 0 - EASY
1 - MEDIUM
2 - HARD
3 - IMPOSSIBRU!1!11!';
COMMENT ON COLUMN dances.music_name IS 'Название трека : Музыкальное сопровождение, мб ссылка там ещё';
COMMENT ON COLUMN dances.is_for_kids IS 'Для детей';
COMMENT ON TABLE groups IS 'Группы';
COMMENT ON COLUMN groups.id IS 'id';
COMMENT ON COLUMN groups.name IS 'Название';
COMMENT ON COLUMN groups.address IS 'Адрес';
COMMENT ON TABLE group_management IS 'Ведение групп';
COMMENT ON COLUMN group_management.group_id IS 'Номер группы';
COMMENT ON COLUMN group_management.teacher_id IS 'Номер преподавателя';
COMMENT ON TABLE membership_type IS 'Тип абонемента';
COMMENT ON COLUMN membership_type.id IS 'id';
COMMENT ON COLUMN membership_type.membership IS 'Тип абонемента';
COMMENT ON COLUMN membership_type.price IS 'Стоимость';
COMMENT ON COLUMN membership_type.group_id IS 'Номер группы';
COMMENT ON TABLE pupils IS 'Ученики';
COMMENT ON COLUMN pupils.id IS 'id';
COMMENT ON COLUMN pupils.first_name IS 'Имя';
COMMENT ON COLUMN pupils.second_name IS 'Отчество';
COMMENT ON COLUMN pupils.last_name IS 'Фамилия';
COMMENT ON COLUMN pupils.username IS 'Имя пользователя';
COMMENT ON COLUMN pupils.age IS 'Возраст';
COMMENT ON COLUMN pupils.sex IS 'Пол : У кого был или не был
0 - мужЫг
1 - девушко';
COMMENT ON COLUMN pupils.begin_date IS 'Дата начала обучения';
COMMENT ON COLUMN pupils.status IS 'Статус';
COMMENT ON COLUMN pupils.group_id IS 'Номер группы';
COMMENT ON TABLE schedule IS 'Расписание';
COMMENT ON COLUMN schedule.id IS 'id';
COMMENT ON COLUMN schedule.weekday IS 'День недели';
COMMENT ON COLUMN schedule.begin_time IS 'Время начала';
COMMENT ON COLUMN schedule.duration IS 'Длительность занятия';
COMMENT ON COLUMN schedule.hall_name IS 'Название зала';
COMMENT ON COLUMN schedule.group_id IS 'Номер группы';
COMMENT ON TABLE status IS 'Статус обучающегося : "Активный, но не заплатил"
"Неактивный, не заплатил"
и т.д.';
COMMENT ON COLUMN status.id IS 'id';
COMMENT ON COLUMN status.status IS 'Статус';
COMMENT ON TABLE teachers IS 'Преподаватели';
COMMENT ON COLUMN teachers.id IS 'id';
COMMENT ON COLUMN teachers.first_name IS 'Имя';
COMMENT ON COLUMN teachers.second_name IS 'Отчество';
COMMENT ON COLUMN teachers.last_name IS 'Фамилия';
COMMENT ON COLUMN teachers.username IS 'Имя пользователя';
COMMENT ON COLUMN teachers.experience IS 'Стаж';



