/* Создание индексов */
CREATE INDEX IF NOT EXISTS concert_list_dance_id
    ON public.concert_dance_lists USING btree
    (dance_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS pupil_acc
    ON public.accounting USING btree
    (pupil_id ASC NULLS LAST)
    TABLESPACE pg_default;