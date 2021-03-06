package da

import "github.com/mgenware/mingru-go-lib"

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// ------------ Actions ------------

// PostTableSelectTResult ...
type PostTableSelectTResult struct {
	ID    uint64
	Title string
}

// SelectT ...
func (da *TableTypePost) SelectT(queryable mingru.Queryable, id uint64, name string) (PostTableSelectTResult, error) {
	var result PostTableSelectTResult
	err := queryable.QueryRow("SELECT `id`, `title` FROM `db_post` WHERE `id` = ? && raw_name = ?", id, name).Scan(&result.ID, &result.Title)
	if err != nil {
		return result, err
	}
	return result, nil
}
