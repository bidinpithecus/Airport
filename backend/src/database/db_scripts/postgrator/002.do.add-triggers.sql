BEGIN;

-- Trigger to add the image_path if it was not specified at airplane_model insert
CREATE OR REPLACE FUNCTION set_default_image_path()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.image_path IS NULL THEN
		NEW.image_path = NEW.code || '.png';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_image_path_default
BEFORE INSERT ON airplane_model
FOR EACH ROW
EXECUTE FUNCTION set_default_image_path();

-- Trigger to check last integrity test score of airplane before adding a flight
CREATE OR REPLACE FUNCTION check_integrity_test_score()
RETURNS TRIGGER AS $$
DECLARE
    integrity_test_row RECORD;
BEGIN
    FOR integrity_test_row IN
        SELECT *
        FROM integrity_test
    LOOP
        IF NOT EXISTS (
            SELECT 1
            FROM test_made
            WHERE test_made.airplane_id = NEW.airplane_id
              AND test_made.integrity_test_id = integrity_test_row.id
              AND (test_made.score >= integrity_test_row.minimum_score)
        ) THEN
            RAISE EXCEPTION 'Invalid test score for test % of airplane %.', integrity_test_row.name, NEW.airplane_id;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_integrity_test_score_trigger
BEFORE INSERT ON flight
FOR EACH ROW
EXECUTE FUNCTION check_integrity_test_score();

-- Trigger to check if occupied seats is less than max capacity
CREATE OR REPLACE FUNCTION check_occupied_seats()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.occupied_seats > (
		SELECT capacity
		FROM airplane_model
		WHERE id = NEW.airplane_id
	) THEN
		RAISE EXCEPTION 'Occupied seats cannot exceed maximum capacity.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_occupied_seats_trigger
BEFORE INSERT ON flight
FOR EACH ROW
EXECUTE FUNCTION check_occupied_seats();

-- Trigger to check if destination_location of flight is different than start_location
CREATE OR REPLACE FUNCTION check_location_difference()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.start_location_id = NEW.destination_location_id THEN
		RAISE EXCEPTION 'Destination location must be different from the start location.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_location_difference_trigger
BEFORE INSERT ON flight
FOR EACH ROW
EXECUTE FUNCTION check_location_difference();

-- Trigger to check if finish_date is after start_date of test_made table
CREATE OR REPLACE FUNCTION check_test_made_dates()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.finish_date <= NEW.start_date THEN
		RAISE EXCEPTION 'Finish date must be after the start date of the test.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_test_made_dates_trigger
BEFORE INSERT ON test_made
FOR EACH ROW
EXECUTE FUNCTION check_test_made_dates();

--  Trigger to check if there is a running test to not allow a new one in the meanwhile
CREATE OR REPLACE FUNCTION block_concurrent_tests()
RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM test_made
		WHERE airplane_id = NEW.airplane_id
		AND finish_date >= NEW.start_date
	) THEN
		RAISE EXCEPTION 'Another test is already running for the same airplane.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER block_concurrent_tests_trigger
BEFORE INSERT ON test_made
FOR EACH ROW
EXECUTE FUNCTION block_concurrent_tests();

END;
