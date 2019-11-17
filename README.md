# mingru (WIP)

[![MEAN Module](https://img.shields.io/badge/MEAN%20Module-TypeScript-blue.svg?style=flat-square)](https://github.com/mgenware/MEAN-Module)
[![Build Status](https://img.shields.io/travis/mgenware/mingru.svg?style=flat-square&label=Build+Status)](https://travis-ci.org/mgenware/mingru)
[![npm version](https://img.shields.io/npm/v/mingru.svg?style=flat-square)](https://npmjs.com/package/mingru)
[![Node.js Version](http://img.shields.io/node/v/mingru.svg?style=flat-square)](https://nodejs.org/en/)

Convert [mingru-models](https://github.com/mgenware/mingru-models) to Go code.

**All APIs are subject to change before 1.0.0**

Goals:

- **No performance penalty at runtime**, SQL builder, not an ORM
- **Strongly typed models**, models are defined in TypeScript not Go
- Currently focuses on Go and MySQL/MariaDB

## Example

### Step 1: Define models

For example, let's define a simple user table with 3 columns using [mingru-models](https://github.com/mgenware/mingru-models):

```ts
// ----------- User table model (user.ts) -----------
import * as mm from 'mingru-models';

class User extends mm.Table {
  id = mm.pk();
  name = mm.varChar(100);
  sig = mm.text().nullable;
  age = mm.int();
}

export default mm.table(User);
```

### Step 2: Define actions

Create a new file (`userTA.ts`) for table actions and import the user table (`user.ts`) above:

```ts
// ----------- User table actions (userTA.ts) -----------
import * as mm from 'mingru-models';
import user from './user';

export class UserTA extends mm.TableActions {
  // Select a user profile by ID.
  selectUserProfile = mm.select(user.id, user.name, user.sig).byID();
  // Select all user profiles.
  selectAllUserProfiles = mm.selectRows(user.id, user.name, user.sig);
  // Select a single user signature field by ID.
  selectSig = mm.selectField(user.sig).byID();

  // Update an user profile by ID.
  updateUserProfile = dd
    .updateOne()
    .setInputs(user.name, user.sig)
    .byID();

  // Update all user signatures to an empty string.
  updateAllSigToEmpty = mm.unsafeUpdateAll().set(user.sig, mm.sql`''`);

  // Delete a user by ID.
  deleteByID = mm.deleteOne().byID();

  // Delete all users by a specified name.
  deleteByName = mm.deleteSome().where(user.name.isEqualToInput());

  // Delete all users.
  deleteAll = mm.unsafeDeleteAll();

  // Insert a new user.
  insertUser = dd
    .insertOne()
    .set(user.sig, mm.sql`''`)
    .setInputs(user.name, user.age);
}

export default mm.tableActions(user, UserTA);
```

### Step 3: Generate Go Code

Below is the code generated by mingru:

<details><summary>`user_ta.go` (click to expand/collapse)</summary>
<p>

```go
 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"github.com/mgenware/go-packagex/v5/dbx"
)

// TableTypeUser ...
type TableTypeUser struct {
}

// User ...
var User = &TableTypeUser{}

// ------------ Actions ------------

// DeleteAll ...
func (da *TableTypeUser) DeleteAll(queryable dbx.Queryable) (int, error) {
	result, err := queryable.Exec("DELETE FROM `user`")
	return dbx.GetRowsAffectedIntWithError(result, err)
}

// DeleteByID ...
func (da *TableTypeUser) DeleteByID(queryable dbx.Queryable, id uint64) error {
	result, err := queryable.Exec("DELETE FROM `user` WHERE `id` = ?", id)
	return dbx.CheckOneRowAffectedWithError(result, err)
}

// DeleteByName ...
func (da *TableTypeUser) DeleteByName(queryable dbx.Queryable, name string) (int, error) {
	result, err := queryable.Exec("DELETE FROM `user` WHERE `name` = ?", name)
	return dbx.GetRowsAffectedIntWithError(result, err)
}

// InsertUser ...
func (da *TableTypeUser) InsertUser(queryable dbx.Queryable, name string, age int) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `user` (`sig`, `name`, `age`) VALUES ('', ?, ?)", name, age)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}

// UserTableSelectAllUserProfilesResult ...
type UserTableSelectAllUserProfilesResult struct {
	ID   uint64
	Name string
	Sig  *string
}

// SelectAllUserProfiles ...
func (da *TableTypeUser) SelectAllUserProfiles(queryable dbx.Queryable) ([]*UserTableSelectAllUserProfilesResult, error) {
	rows, err := queryable.Query("SELECT `id`, `name`, `sig` FROM `user`")
	if err != nil {
		return nil, err
	}
	result := make([]*UserTableSelectAllUserProfilesResult, 0)
	defer rows.Close()
	for rows.Next() {
		item := &UserTableSelectAllUserProfilesResult{}
		err = rows.Scan(&item.ID, &item.Name, &item.Sig)
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

// SelectSig ...
func (da *TableTypeUser) SelectSig(queryable dbx.Queryable, id uint64) (*string, error) {
	var result *string
	err := queryable.QueryRow("SELECT `sig` FROM `user` WHERE `id` = ?", id).Scan(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// UserTableSelectUserProfileResult ...
type UserTableSelectUserProfileResult struct {
	ID   uint64
	Name string
	Sig  *string
}

// SelectUserProfile ...
func (da *TableTypeUser) SelectUserProfile(queryable dbx.Queryable, id uint64) (*UserTableSelectUserProfileResult, error) {
	result := &UserTableSelectUserProfileResult{}
	err := queryable.QueryRow("SELECT `id`, `name`, `sig` FROM `user` WHERE `id` = ?", id).Scan(&result.ID, &result.Name, &result.Sig)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateAllSigToEmpty ...
func (da *TableTypeUser) UpdateAllSigToEmpty(queryable dbx.Queryable) (int, error) {
	result, err := queryable.Exec("UPDATE `user` SET `sig` = ''")
	return dbx.GetRowsAffectedIntWithError(result, err)
}

// UpdateUserProfile ...
func (da *TableTypeUser) UpdateUserProfile(queryable dbx.Queryable, id uint64, name string, sig *string) error {
	result, err := queryable.Exec("UPDATE `user` SET `name` = ?, `sig` = ? WHERE `id` = ?", name, sig, id)
	return dbx.CheckOneRowAffectedWithError(result, err)
}
```

</p>
</details>

<details><summary>`user.sql` for creating table (click to expand/collapse)</summary>
<p>

```sql
CREATE TABLE `user` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`sig` TEXT NULL DEFAULT NULL,
	`age` INT NOT NULL,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
```

</p>
</details>

### Step 4: Use the generated code in your Go project

```go
func main() {
	// Open a DB connection on localhost
	db, err := sql.Open("mysql", "root:123456@/test")
	if err != nil {
		panic(err)
	}

	// Select all user profiles
	users, err := da.User.SelectAllUserProfiles(db)
	if err != nil {
		panic(err)
	}

	// Loop through the result
	for _, user := range users {
		fmt.Printf("ID: %v, Name: %v, Sig: %v\n", user.ID, user.Name, user.Sig)
	}
}
```

## Usage

### Defining Models and Actions

mingru converts [mingru-models](https://github.com/mgenware/mingru-models) to Go code, to learn how to define models and actions, refer to [mingru-models docs](https://github.com/mgenware/mingru-models).

### Generating Go Code

Once you are familiar with [mingru-models](https://github.com/mgenware/mingru-models), you can import your actions, and use `mingru.build` along with a dialect(e.g. MySQL) to generate Go code:

Example:

```ts
import * as mr from 'mingru';
// Import table actions.
import userTA from './models/userTA';
// Import tables (if you need to generate create table SQL files).
import user from './models/user';

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory.
  const builder = new mr.Builder(dialect, '../da/', {
    cleanBuild: true, // Cleans build directory on each build.
  });

  const actions = [userTA];
  const tables = [user];
  // Start the build process by calling the `build` method.
  await builder.buildAsync(async () => {
    // Build table actions to Go source files.
    await builder.buildActionsAsync(actions);
    // Build SQL files for creating tables.
    await builder.buildCreateTableSQLFilesAsync(tables);
  });
})();
```

It's also recommended to use `ts-node` and add a build command to `package.json` scripts section:

```json
{
  "scripts": {
    "build": "ts-node mingru.ts"
  }
}
```

Now you can build your project using `yarn build`.

### More examples

For a more detailed and runnable example, visit [mingru-go-example](https://github.com/mgenware/mingru-go-example)

## Advanced Topics

### Default Values

MySQL doesn't allow you to use a non-constant value as a default value for a column because the `CREATE TABLE` doesn't allow it, while mingru supports arbitrary default values for both `CREATE` and `UPDATE` actions because it simply passes default values into generated SQL.

### Pagination

#### `limit`

Pagination can be achieved by calling `limit` following a call to `selectRows`:

```ts
selectUsersWithLimit = mm.selectRows(user.id, user.name).limit();
```

Implementations should expose arguments to set the underlying SQL `LIMIT` and `OFFSET` values, here is the Go method signature generated by [mingru](https://github.com/mgenware/mingru) from the action above:

```go
func (da *TableTypeUser) SelectUsersWithLimit(queryable dbx.Queryable, limit int, offset int, max int) ([]*SelectUsersWithLimitResult, int, error)
```

#### `selectPage`

Pagination can also be done via `selectPage` method, `selectPage` usually generates a method built upon the SQL `LIMIT` and `OFFSET` clauses but exposes higher level arguments thus provides more convenience:

```ts
selectPagedUsers = mm.selectPage(user.id, user.name);
```

[mingru](https://github.com/mgenware/mingru) converts the action above to the following Go func:

```go
func (da *TableTypeUser) SelectPagedUsers(queryable dbx.Queryable, page int, pageSize int) ([]*SelectPagedUsersResult, bool, error)
```

Notice the `limit` and `offset` arguments are gone, `page` and `pageSize` are exposed instead. Also the second return value changed from `rowsFetched`(`int`) to `hasNextPage`(`bool`).
