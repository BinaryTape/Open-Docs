# Gradle

為了進行更多自訂，您可以使用 Gradle DSL 明確宣告資料庫。

## SQLDelight 配置

### `databases`

資料庫的容器。設定 SQLDelight 以指定的名稱建立每個資料庫。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // 在此處配置資料庫。
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // 在此處配置資料庫。
        }
      }
    }
    ```

----

### `linkSqlite`

類型：`Property<Boolean>`

用於原生目標。是否應自動連結 sqlite。
當專案編譯為動態架構（這是近期 KMP 版本的預設設定）時，這會為連結 sqlite 新增必要的元資料。

請注意，對於靜態架構，此旗標沒有任何效果。
匯入專案的 XCode 組建應將 `-lsqlite3` 新增至連結器旗標。
或者透過 cocoapods 外掛程式在 [sqlite3](https://cocoapods.org/pods/sqlite3) pod 上[新增專案相依性](https://kotlinlang.org/docs/native-cocoapods-libraries.html)。
另一個可能可行的方法是在 cocoapods [`spec.libraries` 設定](https://guides.cocoapods.org/syntax/podspec.html#libraries)中新增 `sqlite3`，例如在 Gradle Kotlin DSL 中：`extraSpecAttributes["libraries"] = "'c++', 'sqlite3'".`

預設為 `true`。

=== "Kotlin"
    ```kotlin
    linkSqlite.set(true)
    ```
=== "Groovy"
    ```groovy
    linkSqlite = true
    ```

## 資料庫配置

### `packageName`

類型：`Property<String>`

用於資料庫類別的套件名稱。

=== "Kotlin"
    ```kotlin
    packageName.set("com.example.db")
    ```
=== "Groovy"
    ```groovy
    packageName = "com.example.db"
    ```

----

### `srcDirs`

類型：`ConfigurableFileCollection`

外掛程式將在其中尋找您的 `.sq` 和 `.sqm` 檔案的資料夾集合。

預設為 `src/[prefix]main/sqldelight`，前綴取決於套用的 Kotlin 外掛程式，例如多平台通常為 `common`。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

外掛程式將在其中尋找您的 `.sq` 和 `.sqm` 檔案的物件集合。

=== "Kotlin"
    ```kotlin
    srcDirs("src/main/sqldelight", "main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs('src/main/sqldelight', 'main/sqldelight')
    ```

----

### `schemaOutputDirectory`

類型：`DirectoryProperty`

應該存儲 `.db` 架構檔案的目錄，相對於專案根目錄。
這些檔案用於驗證遷移是否產生具有最新架構的資料庫。

預設為 `null`。  
如果為 `null`，則不會建立遷移驗證任務。

=== "Kotlin"
    ```kotlin
    schemaOutputDirectory.set(file("src/main/sqldelight/databases"))
    ```
=== "Groovy"
    ```groovy
    schemaOutputDirectory = file("src/main/sqldelight/databases")
    ```

----

### `dependency`

類型：`Project`

可選擇指定對其他 Gradle 專案的架構相依性 [（見下文）](#schema-dependencies)。

=== "Kotlin"
    ```kotlin
    dependency(project(":other-project"))
    ```
=== "Groovy"
    ```groovy
    dependency project(":other-project")
    ```

----

### `dialect`

類型：`String` 或 `Provider<MinimalExternalModuleDependency>`

您想要針對的 SQL 方言。方言是使用 Gradle 相依性來選擇的。
這些相依性可以指定為 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`。 
有關可用的方言，請參見下文。

對於 Android 專案，SQLite 版本會根據您的 `minSdk` 自動選擇。
否則預設為 SQLite 3.18。

可用的方言：

* HSQL: `hsql-dialect`
* MySQL: `mysql-dialect`
* PostgreSQL: `postgresql-dialect`
* SQLite 3.18: `sqlite-3-18-dialect`
* SQLite 3.24: `sqlite-3-24-dialect`
* SQLite 3.25: `sqlite-3-25-dialect`
* SQLite 3.30: `sqlite-3-30-dialect`
* SQLite 3.33: `sqlite-3-33-dialect`
* SQLite 3.35: `sqlite-3-35-dialect`
* SQLite 3.37: `sqlite-3-37-dialect`
* SQLite 3.38: `sqlite-3-38-dialect`
* SQLite 3.39: `sqlite-3-39-dialect`
* SQLite 3.44: `sqlite-3-44-dialect`

=== "Kotlin"
    ```kotlin
    dialect("app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}")
    ```
=== "Groovy"
    ```groovy
    dialect 'app.cash.sqldelight:sqlite-3-24-dialect:{{ versions.sqldelight }}'
    ```

----

### `verifyMigrations`

類型：`Property<Boolean>`

如果設定為 true，遷移檔案如果在建置流程中存在任何錯誤，則會失敗。

預設為 `false`。

=== "Kotlin"
    ```kotlin
    verifyMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    verifyMigrations = true
    ```

----

### `treatNullAsUnknownForEquality`

類型：`Property<Boolean>`

如果設定為 true，SQLDelight 在使用 `IS` 時，不會將與可 null 類型值的相等比較進行取代。

預設為 `false`。

=== "Kotlin"
    ```kotlin
    treatNullAsUnknownForEquality.set(true)
    ```
=== "Groovy"
    ```groovy
    treatNullAsUnknownForEquality = true
    ```

----

### `generateAsync`

類型：`Property<Boolean>`

如果設定為 true，SQLDelight 將產生與非同步驅動程式搭配使用的 suspend 查詢方法。

預設為 `false`。

=== "Kotlin"
    ```kotlin
    generateAsync.set(true)
    ```
=== "Groovy"
    ```groovy
    generateAsync = true
    ```

----

### `deriveSchemaFromMigrations`

類型：`Property<Boolean>`

如果設定為 true，您的資料庫架構將衍生自您的 `.sqm` 檔案，就像已套用每個遷移一樣。
如果為 false，您的架構則定義在 `.sq` 檔案中。

預設為 `false`。

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

----

### `expandSelectStar`

類型：`Property<Boolean>`

如果設定為 true，SQLDelight 會將 `SELECT *` 陳述式改寫為明確參照每個實際產生的欄位。

例如，下方的 `getAll` 查詢
```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);

getAll:
SELECT * FROM hockey_player;
```
將會被改寫為 `SELECT hockey_player.id, hockey_player.name, hockey_player.number FROM hockey_player;`。

預設為 `true`。

=== "Kotlin"
    ```kotlin
    expandSelectStar.set(true)
    ```
=== "Groovy"
    ```groovy
    expandSelectStar = true
    ```

----

### `codegenExcludedColumns`

類型：`SetProperty<String>`

一組要從產生的模型和展開的 `SELECT *` 投影中省略的 `table.column` 值。
資料表和欄位名稱必須使用與 SQLDelight 架構原始碼相同的大小寫。
這僅影響程式碼產生；不會更改 SQL 架構或產生的遷移輸出。

這可用於在後續架構遷移刪除欄位之前更新產生的 Kotlin API。
如果設定的資料表或欄位不存在，或者模型繫結的 insert、`SELECT` 結果欄位或 `RETURNING` 子句明確列出 codegen-excluded 欄位，SQLDelight 會編譯失敗。
由於這僅限於程式碼產生，應用程式有責任確保任何仍存在的排除欄位在被刪除之前可以從寫入操作中省略，例如使用可 null 欄位或預設值。

如果您的 `.sq` 檔案包含 `CREATE TABLE` 架構定義，請在實體架構遷移刪除該欄位之前，將排除的欄位保留在架構定義中。
移除對該欄位的明確查詢參考，但保留架構原始碼以反映當前的資料庫形態。

預設為空。

=== "Kotlin"
    ```kotlin
    codegenExcludedColumns.set(setOf("hockey_player.number"))
    ```
=== "Groovy"
    ```groovy
    codegenExcludedColumns = ["hockey_player.number"]
    ```

{% include 'common/gradle-dependencies.md' %}