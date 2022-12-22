/* Разграничение доступа */
CREATE POLICY only_self_info ON pupils FOR SELECT TO pupil
USING (username = current_user);

CREATE POLICY only_self_visits ON accounting FOR SELECT TO pupil
USING (pupil_id = (SELECT id FROM pupils WHERE username = current_user));

CREATE POLICY only_self_dances_in_concert ON concert_dance_lists FOR SELECT TO pupil
USING (pupil_id = (SELECT id FROM pupils WHERE username = current_user));

CREATE POLICY only_self_costumes_ownership ON costume_ownership FOR SELECT TO pupil
USING (pupil_id = (SELECT id FROM pupils WHERE username = current_user));

ALTER TABLE pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_dance_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE costume_ownership ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_teacher_on_pupils ON pupils FOR ALL TO teacher USING (true);
CREATE POLICY allow_teacher_on_accounting ON accounting FOR ALL TO teacher USING (true);
CREATE POLICY allow_teacher_on_concert_dance_lists ON concert_dance_lists FOR ALL TO teacher USING (true);
CREATE POLICY allow_teacher_on_costume_ownership ON costume_ownership FOR ALL TO teacher USING (true);

CREATE POLICY allow_admin_on_pupils ON pupils FOR ALL TO admin USING (true);
CREATE POLICY allow_admin_on_accounting ON accounting FOR ALL TO admin USING (true);
CREATE POLICY allow_admin_on_concert_dance_lists ON concert_dance_lists FOR ALL TO admin USING (true);
CREATE POLICY allow_admin_on_costume_ownership ON costume_ownership FOR ALL TO admin USING (true);