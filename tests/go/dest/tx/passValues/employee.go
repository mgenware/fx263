package da

import (
	"database/sql"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeEmployee ...
type TableTypeEmployee struct {
}

// Employee ...
var Employee = &TableTypeEmployee{}

// ------------ Actions ------------

// GetFirstName ...
func (da *TableTypeEmployee) GetFirstName(queryable dbx.Queryable, id int) (string, error) {
	var result string
	err := queryable.QueryRow("SELECT `first_name` FROM `employees` WHERE `emp_no` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// Insert ...
func (da *TableTypeEmployee) Insert(queryable dbx.Queryable, firstName string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `employees` (`first_name`) VALUES (?)", firstName)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

func (da *TableTypeEmployee) insert1Child2(queryable dbx.Queryable, firstName string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `employees` (`first_name`) VALUES (?)", firstName)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

// Insert1 ...
func (da *TableTypeEmployee) Insert1(db *sql.DB, id int) error {
	txErr := dbx.Transact(db, func(tx *sql.Tx) error {
		var err error
		firstName, err := da.GetFirstName(tx, id)
		if err != nil {
			return err
		}
		_, err = da.insert1Child2(tx, firstName)
		if err != nil {
			return err
		}
		return nil
	})
	return txErr
}
