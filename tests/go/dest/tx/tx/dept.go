package da

import (
	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeDept ...
type TableTypeDept struct {
}

// Dept ...
var Dept = &TableTypeDept{}

// ------------ Actions ------------

// Insert ...
func (da *TableTypeDept) Insert(queryable dbx.Queryable, no string, name string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `departments` (`dept_no`, `dept_name`) VALUES (?, ?)", no, name)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}
