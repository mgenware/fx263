import "github.com/mgenware/go-packagex/database/sqlx"

// SelectTResult ...
type SelectTResult struct {
	PostTitle        string
	PostTitle2       string
	A                string
	PostTitle3       string
	A2               string
	A3               uint64
	PostUserUrlName  string
	PostUserUrlName2 string
	A4               string
}

// SelectT ...
func (da *TableTypePost) SelectT(queryable sqlx.Queryable) (*SelectTResult, error) {
	result := &SelectTResult{}
	err := queryable.QueryRow("SELECT `_main`.`title` AS `postTitle`, `_main`.`title` AS `postTitle2`, `_main`.`title` AS `a`, `_main`.`title` AS `postTitle3`, `_main`.`title` AS `a2`, `_main`.`user_id` AS `a3`, `_join_1`.`url_name` AS `postUserUrlName`, `_join_1`.`url_name` AS `postUserUrlName2`, `_join_1`.`url_name` AS `a4` FROM `post` AS `_main` INNER JOIN `user` AS `_join_1` ON `_join_1`.`id` = `_main`.`user_id`").Scan(&result.PostTitle, &result.PostTitle2, &result.A, &result.PostTitle3, &result.A2, &result.A3, &result.PostUserUrlName, &result.PostUserUrlName2, &result.A4)
	if err != nil {
		return nil, err
	}
	return result, nil
}
