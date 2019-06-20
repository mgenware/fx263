package da

import (
	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// ------------ Actions ------------

// DeleteT ...
func (da *TableTypePost) DeleteT(queryable dbx.Queryable, id uint64) (int, error) {
	result, err := queryable.Exec("DELETE FROM `post` WHERE `id` = ?", id)
	return dbx.GetRowsAffectedIntWithError(result, err)
}
