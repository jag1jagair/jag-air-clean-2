-- Seed owners
insert into owners (name,email,phone_e164,sms_opt_in,notify_enabled) values
('Albuerne',NULL,NULL,true,true),
('Elizondo',NULL,NULL,true,true),
('Hector Villarreal',NULL,NULL,true,true),
('Chui Gracia and Federico Treviño',NULL,NULL,true,true),
('Gustavo Guerra',NULL,NULL,true,true),
('Rodolfo Camarillo',NULL,NULL,true,true),
('Alejandro Gil',NULL,NULL,true,true),
('Pablo Mena','jarturoge@jagair.mx','+528117174757',true,true),
('Rafael Almanza','Jaginc@jagair.mx','+528117124599',true,true),
('Caravan Regio LLC',NULL,NULL,true,true),
('Operadora N402FB SA de CV',NULL,NULL,true,true),
('Nextant Regio LLC',NULL,NULL,true,true),
('N651CC LLC',NULL,NULL,true,true),
('Gulfstream Regio LLC',NULL,NULL,true,true);

-- Seed aircraft
insert into aircraft (tail,seats,seat_sharing_enabled,base_airport,owner_pool) values
('N208CR',9,true,'MMAN','Caravan Regio LLC'),
('N727EX',8,true,'MMAN','Caravan Regio LLC'),
('N402FB',8,false,'MMAN','Operadora N402FB SA de CV'),
('N217EC',8,false,'MMAN','Nextant Regio LLC'),
('N651CC',9,false,'MMAN','N651CC LLC'),
('N132JC',10,false,'MMAN','Gulfstream Regio LLC');

-- Seed ownerships
insert into ownerships (aircraft_id, owner_id, percentage) values
((select id from aircraft where tail='N402FB'), (select id from owners where name='Albuerne'), 25),
((select id from aircraft where tail='N402FB'), (select id from owners where name='Elizondo'), 25),
((select id from aircraft where tail='N402FB'), (select id from owners where name='Hector Villarreal'), 25),
((select id from aircraft where tail='N402FB'), (select id from owners where name='Chui Gracia and Federico Treviño'), 25),
((select id from aircraft where tail='N217EC'), (select id from owners where name='Gustavo Guerra'), 25),
((select id from aircraft where tail='N217EC'), (select id from owners where name='Rodolfo Camarillo'), 25),
((select id from aircraft where tail='N217EC'), (select id from owners where name='Alejandro Gil'), 25),
((select id from aircraft where tail='N217EC'), (select id from owners where name='Pablo Mena and Rafael Almanza'), 25),
((select id from aircraft where tail='N651CC'), (select id from owners where name='Pablo Mena'), 50),
((select id from aircraft where tail='N651CC'), (select id from owners where name='Rafael Almanza'), 50),
((select id from aircraft where tail='N132JC'), (select id from owners where name='Pablo Mena'), 50),
((select id from aircraft where tail='N132JC'), (select id from owners where name='Rafael Almanza'), 50),
((select id from aircraft where tail='N208CR'), (select id from owners where name='Caravan Regio LLC'), 100),
((select id from aircraft where tail='N727EX'), (select id from owners where name='Caravan Regio LLC'), 100);

-- Seed app users
insert into app_users (email, role, owner_id) values
('jag1@jagair.mx','Manager', null),
('jarturoge@jagair.mx','Owner', (select id from owners where name='Pablo Mena' limit 1)),
('Jaginc@jagair.mx','Owner', (select id from owners where name='Rafael Almanza' limit 1));
