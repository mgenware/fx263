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
	Title    string
	UserAge  int
	MUserAge int
}

// SelectT ...
func (da *TableTypePost) SelectT(queryable mingru.Queryable) ([]*PostTableSelectTResult, error) {
	rows, err := queryable.Query("SELECT `db_post`.`title` AS `title`, `join_1`.`age` AS `userAge`, `join_2`.`age` AS `mUserAge` FROM `db_post` AS `db_post` INNER JOIN `user` AS `join_1` ON `join_1`.`id` = `db_post`.`user_id` INNER JOIN `user` AS `join_2` ON `join_2`.`id` = `db_post`.`my_user_id` ORDER BY `title`, `userAge`, `mUserAge`")
	if err != nil {
		return nil, err
	}
	result := make([]*PostTableSelectTResult, 0)
	defer rows.Close()
	for rows.Next() {
		item := &PostTableSelectTResult{}
		err = rows.Scan(&item.Title, &item.UserAge, &item.MUserAge)
		if err != nil {
			return nil, err
		}
		result = append(result, item)
	}
	err = rows.Err()
	if err != nil {
		return nil, err
	}
	return result, nil
}