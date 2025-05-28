# Gradle

為了提供更大的客製化能力，你可以使用 Gradle DSL 明確宣告資料庫。

## SQLDelight 配置

### `databases`

資料庫容器。設定 SQLDelight 以給定的名稱建立每個資料庫。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // Database configuration here.
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // Database configuration here.
        }
      }
    }
    ```

----

### `linkSqlite`

類型：`Property<Boolean>`

針對原生目標。是否應自動連結 (link) sqlite。
這會新增必要的元資料，以便在專案編譯為動態框架（KMP 近期版本的預設行為）時連結 sqlite。

請注意，對於靜態框架，此旗標無效。
匯入專案的 XCode 建置應將 `-lsqlite3` 加入到連結器旗標中。
或者，透過 cocoapods 外掛程式，在 [sqlite3](https://cocoapods.org/pods/sqlite3) pod 上[新增專案依賴](https://kotlinlang.org/docs/native-cocoapods-libraries.html)。
另一種可能有效的方法是將 `sqlite3` 加入到 cocoapods 的 [`spec.libraries` 設定](https://guides.cocoapods.org/syntax/podspec.html#libraries)中，例如在 Gradle Kotlin DSL 中：`extraSpecAttributes["libraries"] = "'c++', 'sqlite3'".`

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

外掛程式將尋找 `.sq` 和 `.sqm` 檔案的資料夾集合。

預設為 `src/[prefix]main/sqldelight`，其中前綴取決於所套用的 Kotlin 外掛程式，例如多平台專案使用 common。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

外掛程式將尋找 `.sq` 和 `.sqm` 檔案的物件集合。

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

應儲存 `.db` 結構描述檔案的目錄，相對於專案根目錄。
這些檔案用於驗證遷移 (migrations) 能產生具有最新結構描述的資料庫。

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

可選地指定對其他 Gradle 專案的結構描述依賴（[請見下方](#schema-dependencies)）。

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

你希望針對的 SQL 變體。變體是透過 Gradle 依賴來選擇的。
這些依賴可以指定為 `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`。
可用變體請見下方。

對於 Android 專案，SQLite 版本會根據你的 `minSdk` 自動選擇。
否則預設為 SQLite 3.18。

可用變體：

*   HSQL：`hsql-dialect`
*   MySQL：`mysql-dialect`
*   PostgreSQL：`postgresql-dialect`
*   SQLite 3.18：`sqlite-3-18-dialect`
*   SQLite 3.24：`sqlite-3-24-dialect`
*   SQLite 3.25：`sqlite-3-25-dialect`
*   SQLite 3.30：`sqlite-3-30-dialect`
*   SQLite 3.33：`sqlite-3-33-dialect`
*   SQLite 3.35：`sqlite-3-35-dialect`
*   SQLite 3.38：`sqlite-3-38-dialect`

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

如果設定為 `true`，若遷移檔案中有任何錯誤，則在建置過程中將會失敗。

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

如果設定為 `true`，當使用 `IS` 時，SQLDelight 將不會用可空類型值替換相等比較。

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

如果設定為 `true`，SQLDelight 將生成 `suspend` 查詢方法以用於非同步驅動程式。

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

如果設定為 `true`，你的資料庫結構描述將從 `.sqm` 檔案中派生，彷彿每個遷移都已應用。
如果為 `false`，你的結構描述則定義在 `.sq` 檔案中。

預設為 `false`。

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

{% include 'common/gradle-dependencies.md' %}