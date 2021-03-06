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
	A                  uint64
	CmtCount           uint
	Fc                 *string
	MUserFollowerCount *string
	MUserID            uint64
}

// SelectT ...
func (da *TableTypePost) SelectT(queryable mingru.Queryable) (PostTableSelectTResult, error) {
	var result PostTableSelectTResult
	err := queryable.QueryRow("SELECT `db_post`.`cmt_c` AS `cmt_count`, `db_post`.`my_user_id` AS `m_user_id`, `db_post`.`my_user_id` AS `a`, `join_1`.`follower_c` AS `m_user_follower_count`, `join_1`.`follower_c` AS `fc` FROM `db_post` AS `db_post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `db_post`.`my_user_id`").Scan(&result.CmtCount, &result.MUserID, &result.A, &result.MUserFollowerCount, &result.Fc)
	if err != nil {
		return result, err
	}
	return result, nil
}
