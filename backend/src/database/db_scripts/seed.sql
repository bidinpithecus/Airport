BEGIN;

INSERT INTO "syndicate" ("name") VALUES
	('Syndicate A'),
	('Syndicate B'),
	('Syndicate C')
;

INSERT INTO "location" ("country_abbreviation", "country", "state", "city", "street", "number", "is_airport") VALUES
	('US', 'United States', 'California', 'Los Angeles', '123 Main St', 1001, false),
	('US', 'United States', 'California', 'San Francisco', '456 Elm St', 2002, false),
	('UK', 'United Kingdom', 'England', 'London', '789 Oak St', 3003, false),
	('FR', 'France', 'Paris', 'Paris', '101 Pine St', 4004, false),
	('DE', 'Germany', 'Bavaria', 'Munich', '202 Oak St', 5005, false),
	('ES', 'Spain', 'Catalonia', 'Barcelona', '303 Elm St', 6006, false),
	('IT', 'Italy', 'Lazio', 'Rome', '404 Maple St', 7007, false),
	('JP', 'Japan', 'Tokyo', 'Tokyo', '505 Cedar St', 8008, false),
	('AU', 'Australia', 'New South Wales', 'Sydney', '606 Birch St', 9009, false),
	('CA', 'Canada', 'Ontario', 'Toronto', '707 Pine St', 10010, false),
	('US', 'United States', 'California', 'Los Angeles', '123 Airport Rd', 1001, true),
	('US', 'United States', 'California', 'San Francisco', '456 Airport Rd', 2002, true),
	('UK', 'United Kingdom', 'England', 'London', '789 Airport Rd', 3003, true),
	('FR', 'France', 'Paris', 'Charles de Gaulle', '101 Airport Rd', 4004, true),
	('DE', 'Germany', 'Bavaria', 'Munich', '202 Airport Rd', 5005, true),
	('ES', 'Spain', 'Catalonia', 'Barcelona', '303 Airport Rd', 6006, true),
	('IT', 'Italy', 'Lazio', 'Leonardo da Vinci-Fiumicino', '404 Airport Rd', 7007, true),
	('JP', 'Japan', 'Tokyo', 'Narita', '505 Airport Rd', 8008, true),
	('AU', 'Australia', 'New South Wales', 'Sydney', '606 Airport Rd', 9009, true),
	('CA', 'Canada', 'Ontario', 'Toronto Pearson', '707 Airport Rd', 10010, true);
;

INSERT INTO "employee" ("name", "house_location_id", "phone_number", "salary", "syndicate_id") VALUES
	('Piper', (SELECT "id" FROM "location" WHERE "street" = '123 Main St'), '111-111-1111', 60000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate A')),
	('Justice', (SELECT "id" FROM "location" WHERE "street" = '456 Elm St'), '222-222-2222', 55000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate B')),
	('Modesto', (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), '333-333-3333', 58000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate C')),
	('Edgardo', (SELECT "id" FROM "location" WHERE "street" = '101 Pine St'), '444-444-4444', 62000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate A')),
	('Brant', (SELECT "id" FROM "location" WHERE "street" = '202 Oak St'), '555-555-5555', 57000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate B')),
	('Felicity', (SELECT "id" FROM "location" WHERE "street" = '303 Elm St'), '666-666-6666', 61000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate C')),
	('Lucious', (SELECT "id" FROM "location" WHERE "street" = '404 Maple St'), '777-777-7777', 59000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate A')),
	('Jayne', (SELECT "id" FROM "location" WHERE "street" = '505 Cedar St'), '888-888-8888', 63000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate B')),
	('Theresa', (SELECT "id" FROM "location" WHERE "street" = '606 Birch St'), '999-999-9999', 54000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate C')),
	('Hilbert', (SELECT "id" FROM "location" WHERE "street" = '707 Pine St'), '123-456-7890', 59000, (SELECT "id" FROM "syndicate" WHERE "name" = 'Syndicate A'))
;

INSERT INTO "technician" ("employee_id") VALUES
	((SELECT "id" FROM "employee" WHERE "name" = 'Piper')),
	((SELECT "id" FROM "employee" WHERE "name" = 'Justice')),
	((SELECT "id" FROM "employee" WHERE "name" = 'Modesto')),
	((SELECT "id" FROM "employee" WHERE "name" = 'Edgardo'))
;

INSERT INTO "integrity_test" ("name", "minimum_score", "maximum_score") VALUES
	('Test A', 0.0, 100.0),
	('Test B', 0.0, 100.0),
	('Test C', 0.0, 100.0),
	('Test D', 0.0, 100.0)
;

INSERT INTO "airplane_model" ("capacity", "weight", "code") VALUES
	(100, 37875, 'Boeing-377'),
	(134, 45720, 'Boeing-727'),
	(467, 220100, 'Boeing-747'),
	(160, 37080, 'Airbus-A220'),
	(185, 48500, 'Airbus-A320'),
	(575, 285000, 'Airbus-A380'),
	(151, 63278, 'Vickers-VC10')
;

INSERT INTO "airplane" ("model_id") VALUES
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-377')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-727')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-747')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A220')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A320')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A380')),
	((SELECT "id" FROM "airplane_model" WHERE "code" = 'Vickers-VC10'))
;

INSERT INTO "air_traffic_controller" ("employee_id", "last_exam_date") VALUES
  ((SELECT "id" FROM "employee" WHERE "name" = 'Felicity'), NOW() - INTERVAL '60 days' + (RANDOM() * INTERVAL '120 days')),
  ((SELECT "id" FROM "employee" WHERE "name" = 'Lucious'), NOW() - INTERVAL '60 days' + (RANDOM() * INTERVAL '120 days')),
  ((SELECT "id" FROM "employee" WHERE "name" = 'Jayne'), NOW() - INTERVAL '60 days' + (RANDOM() * INTERVAL '120 days'))
;

INSERT INTO "technician_pro_at_model" ("technician_id", "airplane_model_id") VALUES
	((SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Piper')), (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-377')),
	((SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Justice')), (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A220')),
	((SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Edgardo')), (SELECT "id" FROM "airplane_model" WHERE "code" = 'Vickers-VC10'))
;

INSERT INTO "pilot" ("employee_id", "last_exam_date") VALUES
  ((SELECT "id" FROM "employee" WHERE "name" = 'Theresa'), NOW() - INTERVAL '60 days' + (RANDOM() * INTERVAL '120 days')),
  ((SELECT "id" FROM "employee" WHERE "name" = 'Hilbert'), NOW() - INTERVAL '60 days' + (RANDOM() * INTERVAL '120 days'))
;

INSERT INTO "flight" ("airplane_id", "pilot_id", "start_location_id", "destination_location_id", "occupied_seats") VALUES
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-377')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Theresa')), (SELECT "id" FROM "location" WHERE "street" = '123 Main St'), (SELECT "id" FROM "location" WHERE "street" = '456 Elm St'), 75),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-727')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Hilbert')), (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), (SELECT "id" FROM "location" WHERE "street" = '101 Pine St'), 110),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A220')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Theresa')), (SELECT "id" FROM "location" WHERE "street" = '202 Oak St'), (SELECT "id" FROM "location" WHERE "street" = '303 Elm St'), 90),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A320')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Theresa')), (SELECT "id" FROM "location" WHERE "street" = '101 Pine St'), (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), 120),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-747')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Hilbert')), (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), (SELECT "id" FROM "location" WHERE "street" = '456 Elm St'), 160),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A380')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Hilbert')), (SELECT "id" FROM "location" WHERE "street" = '303 Elm St'), (SELECT "id" FROM "location" WHERE "street" = '101 Pine St'), 200),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Vickers-VC10')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Hilbert')), (SELECT "id" FROM "location" WHERE "street" = '202 Oak St'), (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), 50),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A220')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Theresa')), (SELECT "id" FROM "location" WHERE "street" = '303 Elm St'), (SELECT "id" FROM "location" WHERE "street" = '789 Oak St'), 80),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-727')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Hilbert')), (SELECT "id" FROM "location" WHERE "street" = '123 Main St'), (SELECT "id" FROM "location" WHERE "street" = '456 Elm St'), 105),
	((SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-747')), (SELECT "id" FROM "pilot" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Theresa')), (SELECT "id" FROM "location" WHERE "street" = '456 Elm St'), (SELECT "id" FROM "location" WHERE "street" = '303 Elm St'), 175)
;

INSERT INTO "test_made" ("score", "start_date", "finish_date", "airplane_id", "integrity_test_id", "technician_id") VALUES
	(95.0, '2023-09-15 10:00:00', '2023-09-15 12:00:00', (SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-377')), (SELECT "id" FROM "integrity_test" WHERE "name" = 'Test A'), (SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Piper'))),
	(88.5, '2023-09-16 09:30:00', '2023-09-16 11:30:00', (SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-727')), (SELECT "id" FROM "integrity_test" WHERE "name" = 'Test B'), (SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Justice'))),
	(92.0, '2023-09-17 08:45:00', '2023-09-17 10:45:00', (SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Boeing-747')), (SELECT "id" FROM "integrity_test" WHERE "name" = 'Test C'), (SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Modesto'))),
	(98.5, '2023-09-18 10:30:00', '2023-09-18 12:30:00', (SELECT "id" FROM "airplane" WHERE "model_id" = (SELECT "id" FROM "airplane_model" WHERE "code" = 'Airbus-A220')), (SELECT "id" FROM "integrity_test" WHERE "name" = 'Test D'), (SELECT "id" FROM "technician" WHERE "employee_id" = (SELECT "id" FROM "employee" WHERE "name" = 'Edgardo')))
;

END;
