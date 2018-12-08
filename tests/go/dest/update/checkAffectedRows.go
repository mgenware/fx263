import "github.com/mgenware/go-packagex/database/sqlx"

// UpdateT ...
func (da *TableTypePost) UpdateT(queryable sqlx.Queryable, postContent string) error {
	result, err := queryable.Exec("UPDATE `post` SET `title` = \"haha\", `content` = ?, `cmt_c` = `cmt_c` + 1", postContent)
	return sqlx.CheckOneRowAffectedWithError(result, err)
}
