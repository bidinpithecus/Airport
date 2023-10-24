-- Trigger to check last integrity test score of airplane before adding a flight
CREATE OR REPLACE FUNCTION check_integrity_test_score()
RETURNS TRIGGER AS $$
DECLARE
	last_test_id UUID;
BEGIN
	SELECT INTO last_test_id
	id
	FROM test_made
	WHERE airplane_id = NEW.airplane_id
	ORDER BY finish_date DESC
	LIMIT 1;

	IF last_test_id IS NULL THEN
		RAISE EXCEPTION 'Airplane has no integrity test records.';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM integrity_test
		WHERE id = last_test_id
		AND (NEW.score < minimum_score OR NEW.score > maximum_score)
	) THEN
		RAISE EXCEPTION 'Invalid test score for the airplane.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_integrity_test_score_trigger
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

CREATE TRIGGER check_occupied_seats_trigger
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

CREATE TRIGGER check_location_difference_trigger
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

CREATE TRIGGER check_test_made_dates_trigger
BEFORE INSERT ON test_made
FOR EACH ROW
EXECUTE FUNCTION check_test_made_dates();

--  Trigger to check if there is a running test to not allow a new one
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

CREATE TRIGGER block_concurrent_tests_trigger
BEFORE INSERT ON test_made
FOR EACH ROW
EXECUTE FUNCTION block_concurrent_tests();
