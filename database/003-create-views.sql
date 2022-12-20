/* Создание представлений */
CREATE VIEW view_pupils AS
    SELECT concat_ws(' ', last_name, first_name, second_name)       AS full_name,
           age,
           CASE WHEN sex = 0::bit THEN 'Мужской' ELSE 'Женский' END as sex,
           (SELECT status.status FROM status WHERE status.id = pupils.status),
           (SELECT name FROM groups WHERE id = group_id)            AS group_name
    FROM pupils
    WHERE CASE
              WHEN pg_has_role(current_user, 'teacher', 'member') THEN true
              ELSE username = current_user
              END;
GRANT SELECT ON TABLE view_pupils TO teacher, pupil;

CREATE VIEW view_unpaid_visits AS
    SELECT concat_ws(' ', last_name, first_name, second_name) AS full_name,
           membership,
           (SELECT price - paid - discount) as debt
    FROM accounting
    JOIN pupils ON pupil_id = pupils.id
    JOIN membership_type ON active_membership_id = membership_type.id
    WHERE paid + discount < price AND
          CASE
              WHEN pg_has_role(current_user, 'teacher', 'member') THEN true
              ELSE username = current_user
              END;
GRANT SELECT ON TABLE view_unpaid_visits TO teacher, pupil;

CREATE VIEW groups_schedule(weekday, begin_time, duration, hall_name, name, address) as
SELECT schedule.weekday,
       schedule.begin_time,
       schedule.duration,
       schedule.hall_name,
       groups.name,
       groups.address
FROM schedule
         JOIN groups ON schedule.group_id = groups.id;
GRANT SELECT ON TABLE groups_schedule TO teacher, pupil;

CREATE VIEW accounting_current_membership
            (acc_month, acc_year, last_name, first_name, visits, discount, paid, membership, price, group_id) as
SELECT accounting.acc_month,
       accounting.acc_year,
       pupils.last_name,
       pupils.first_name,
       accounting.visits,
       accounting.discount,
       accounting.paid,
       membership_type.membership,
       membership_type.price,
       membership_type.group_id
FROM accounting
         JOIN membership_type ON accounting.active_membership_id = membership_type.id
         JOIN pupils ON accounting.pupil_id = pupils.id;
GRANT SELECT ON TABLE accounting_current_membership TO teacher, pupil;

CREATE VIEW view_concerts AS
    SELECT concerts.id,
           concerts.beginning_time,
           concerts.address,
           dances.name as dance_name,
           dances.duration as dance_duration,
           concat_ws(' ', pupils.last_name, pupils.first_name, pupils.second_name) as pupil_name,
           CASE WHEN dances.type = 0::bit THEN 'Мягкий' ELSE 'Жёсткий' END as dance_type
    FROM concerts
    JOIN concert_dance_lists cdl on concerts.id = cdl.concert_id
    JOIN dances on cdl.dance_id = dances.id
    JOIN pupils on cdl.pupil_id = pupils.id
    WHERE
        CASE
              WHEN pg_has_role(current_user, 'teacher', 'member') THEN true
              ELSE username = current_user
                END;
GRANT SELECT ON TABLE view_concerts TO teacher, pupil;

CREATE VIEW view_costume_ownership AS
    SELECT concat_ws(' ', last_name, first_name, second_name) as pupil_name,
           costumes.type as costume_type,
           costumes.color as costume_color,
           costumes.clothes_size as costume_size,
           costumes.cost as costume_cost,
            costume_ownership.is_owned as costume_own
    FROM costume_ownership
    JOIN costumes on costume_ownership.costume_id = costumes.id
    JOIN pupils on costume_ownership.pupil_id = pupils.id
    WHERE
        CASE
              WHEN pg_has_role(current_user, 'teacher', 'member') THEN true
              ELSE username = current_user
                END;
GRANT SELECT ON TABLE view_costume_ownership TO teacher, pupil;