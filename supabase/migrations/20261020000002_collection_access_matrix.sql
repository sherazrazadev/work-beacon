-- Permission matrix: one row per collection x role.
-- Scope letters: n = none, o = own, t = team (own + direct reports), a = all.
-- Each role cell is two letters: read then write. Order: employee, manager,
-- hr_admin, finance.
--
-- `own`/`team` reads also include unowned (company-wide) rows.
-- `owner_field` names the JSON field that identifies the owning worker; rows
-- without it are owned by the worker who wrote them.
-- `insert_any` lets every signed-in role append (cross-role workflow items such
-- as inbox tasks, approvals, notifications, event and agent logs); updates and
-- deletes still follow the write scope.

with matrix (collection, owner_field, insert_any, emp, mgr, hr, fin) as (
  values
    ('timeOff',               'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('profile',               null,             false, 'aa', 'aa', 'aa', 'aa'),
    ('notifications',         null,             true,  'aa', 'aa', 'aa', 'aa'),
    ('approvals',             null,             true,  'nn', 'aa', 'aa', 'aa'),
    ('inbox',                 null,             true,  'aa', 'aa', 'aa', 'aa'),
    ('documents',             'workerId',       false, 'oo', 'oo', 'aa', 'oo'),
    ('featureFlags',          null,             false, 'an', 'an', 'aa', 'an'),
    ('timesheets',            'workerId',       false, 'oo', 'tt', 'aa', 'an'),
    ('punches',               'workerId',       false, 'oo', 'tt', 'aa', 'an'),
    ('shifts',                'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('exceptions',            'workerId',       true,  'nn', 'tt', 'aa', 'nn'),
    ('jobs',                  null,             false, 'an', 'aa', 'aa', 'nn'),
    ('candidates',            null,             false, 'nn', 'aa', 'aa', 'nn'),
    ('onboarding',            'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('offboarding',           'workerId',       false, 'nn', 'tt', 'aa', 'nn'),
    ('skills',                'workerId',       false, 'oo', 'tn', 'aa', 'nn'),
    ('succession',            null,             false, 'nn', 'nn', 'aa', 'nn'),
    ('goalRatings',           'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('feedback',              'fromWorkerId',   false, 'oo', 'tt', 'aa', 'nn'),
    ('banks',                 null,             false, 'oo', 'nn', 'nn', 'nn'),
    ('expenses',              'workerId',       false, 'oo', 'tt', 'aa', 'aa'),
    ('purchases',             'requestedBy',    false, 'oo', 'tt', 'aa', 'aa'),
    ('journals',              null,             false, 'nn', 'nn', 'nn', 'aa'),
    ('closeTasks',            null,             false, 'nn', 'nn', 'nn', 'aa'),
    ('planningScenario',      null,             false, 'nn', 'nn', 'nn', 'aa'),
    ('pulseResponses',        'workerId',       false, 'oo', 'tn', 'aa', 'nn'),
    ('pulsePlans',            null,             false, 'nn', 'aa', 'aa', 'nn'),
    ('agentAudit',            null,             true,  'nn', 'nn', 'aa', 'nn'),
    ('workflows',             null,             false, 'nn', 'an', 'aa', 'nn'),
    ('processEvents',         null,             true,  'nn', 'nn', 'aa', 'an'),
    ('connectedIntegrations', null,             false, 'an', 'an', 'aa', 'an'),
    ('installedApps',         null,             false, 'aa', 'aa', 'aa', 'aa'),
    ('homePins',              null,             false, 'aa', 'aa', 'aa', 'aa'),
    ('demoApiKey',            null,             false, 'an', 'an', 'aa', 'an'),
    ('retentionDays',         null,             false, 'an', 'an', 'aa', 'an'),
    ('hrCases',               'workerId',       false, 'oo', 'nn', 'aa', 'nn'),
    ('delegations',           'fromWorkerId',   false, 'nn', 'aa', 'aa', 'nn'),
    ('compWorksheets',        'managerId',      false, 'nn', 'oo', 'aa', 'nn'),
    ('internalApps',          'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('elections',             'workerId',       false, 'oo', 'nn', 'aa', 'nn'),
    ('contingent',            null,             false, 'nn', 'aa', 'aa', 'an'),
    ('positions',             null,             false, 'nn', 'an', 'aa', 'an'),
    ('orgMoves',              'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('assets',                'workerId',       false, 'oo', 'nn', 'aa', 'nn'),
    ('accessRequests',        'workerId',       false, 'oo', 'nn', 'aa', 'nn'),
    ('eligibility',           'workerId',       false, 'oo', 'nn', 'aa', 'nn'),
    ('payrollRuns',           null,             false, 'nn', 'nn', 'an', 'aa'),
    ('garnishments',          'workerId',       false, 'nn', 'nn', 'nn', 'aa'),
    ('offCyclePays',          'workerId',       false, 'on', 'nn', 'aa', 'aa'),
    ('retroAdjustments',      'workerId',       false, 'on', 'nn', 'aa', 'aa'),
    ('extraPayStubs',         'workerId',       false, 'on', 'nn', 'aa', 'aa'),
    ('insightView',           null,             false, 'aa', 'aa', 'aa', 'aa'),
    ('learnAssignments',      'workerId',       false, 'oo', 'tt', 'aa', 'nn'),
    ('learnCertificates',     'workerId',       false, 'oo', 'tt', 'aa', 'nn')
),
roles (role, idx) as (
  values ('employee'::public.app_role, 1), ('manager', 2), ('hr_admin', 3), ('finance', 4)
),
letter (c, scope) as (
  values ('n', 'none'::public.access_scope), ('o', 'own'), ('t', 'team'), ('a', 'all')
)
insert into public.collection_access (collection, role, read_scope, write_scope, owner_field, insert_any)
select
  m.collection,
  r.role,
  (select l.scope from letter l where l.c = left(cell.v, 1)),
  (select l.scope from letter l where l.c = right(cell.v, 1)),
  m.owner_field,
  m.insert_any
from matrix m
join roles r on true
cross join lateral (
  select case r.idx when 1 then m.emp when 2 then m.mgr when 3 then m.hr else m.fin end as v
) cell;
