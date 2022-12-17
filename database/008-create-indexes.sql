/* Создание индексов */
CREATE INDEX IF NOT EXISTS concert_list_conc_id
    ON public.concert_dance_lists USING btree
    (concert_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS month_acc
    ON public.accounting USING btree
    (acc_month ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS pupil_acc
    ON public.accounting USING btree
    (pupil_id ASC NULLS LAST)
    TABLESPACE pg_default;