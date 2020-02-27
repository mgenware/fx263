package da

import (
	"time"

	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeEmployee ...
type TableTypeEmployee struct {
}

// Employee ...
var Employee = &TableTypeEmployee{}

// ------------ Actions ------------

// InsertEmp ...
func (da *TableTypeEmployee) InsertEmp(queryable dbx.Queryable, firstName string, lastName string, gender string, birthDate time.Time, hireDate time.Time) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `employees` (`first_name`, `last_name`, `gender`, `birth_date`, `hire_date`) VALUES (?, ?, ?, ?, ?)", firstName, lastName, gender, birthDate, hireDate)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}