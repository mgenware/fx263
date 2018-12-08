package haha

import (
	"github.com/mgenware/go-packagex/database/sqlx"
)

// TableTypePost ...
type TableTypePost struct {
}

// Post ...
var Post = &TableTypePost{}

// ------------ Actions ------------

// SelectPostTitleResult ...
type SelectPostTitleResult struct {
	PostID    uint64
	PostTitle string
}

// SelectPostTitle ...
func (da *TableTypePost) SelectPostTitle(queryable sqlx.Queryable) (*SelectPostTitleResult, error) {
	result := &SelectPostTitleResult{}
	err := queryable.QueryRow("SELECT `id`, `title` FROM `post`").Scan(&result.PostID, &result.PostTitle)
	if err != nil {
		return nil, err
	}
	return result, nil
}