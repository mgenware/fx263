package da

import "github.com/mgenware/mingru-go-lib"

// TableTypeActivity ...
type TableTypeActivity struct {
}

// Activity ...
var Activity = &TableTypeActivity{}

// ------------ Actions ------------

// ActivityTablePrivateTResult ...
type ActivityTablePrivateTResult struct {
	ID          uint64
	GenericSig  *string
	GenericName string
}

// PrivateT ...
func (da *TableTypeActivity) PrivateT(queryable mingru.Queryable, id uint64) (*ActivityTablePrivateTResult, error) {
	result := &ActivityTablePrivateTResult{}
	err := queryable.QueryRow("SELECT `id`, `sig` AS `generic_sig`, `url_name` AS `generic_name` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.GenericSig, &result.GenericName)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// ActivityTableTResult ...
type ActivityTableTResult struct {
	ID          uint64
	GenericSig  *string
	GenericName string
}

// T ...
func (da *TableTypeActivity) T(queryable mingru.Queryable, id uint64, postID uint64) ([]*ActivityTableTResult, error) {
	rows, err := queryable.Query("(SELECT `id`, `sig` AS `generic_sig`, `url_name` AS `generic_name` FROM `user` WHERE `id` = ?) UNION (SELECT `id`, `title` FROM `db_post` WHERE `id` = ?) UNION ALL (SELECT `user_id`, `value` FROM `like`) ORDER BY `generic_sig`", id, postID)
	if err != nil {
		return nil, err
	}
	result := make([]*ActivityTableTResult, 0)
	defer rows.Close()
	for rows.Next() {
		item := &ActivityTableTResult{}
		err = rows.Scan(&item.ID, &item.GenericSig, &item.GenericName)
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