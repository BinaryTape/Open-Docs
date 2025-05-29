# Gradle

より詳細なカスタマイズのために、Gradle DSLを使用してデータベースを明示的に宣言できます。

## SQLDelight 設定

### `databases`

データベースを格納するコンテナです。SQLDelightは、指定された名前で各データベースを作成するように構成されます。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // ここにデータベース設定を記述します。
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // ここにデータベース設定を記述します。
        }
      }
    }
    ```

----

### `linkSqlite`

Type: `Property<Boolean>`

ネイティブターゲット向け。SQLiteを自動的にリンクするかどうかを決定します。
これは、プロジェクトがダイナミックフレームワークにコンパイルされる際に、SQLiteをリンクするために必要なメタデータを追加します（これはKMPの最近のバージョンでのデフォルトです）。

なお、スタティックフレームワークの場合、このフラグは効果がありません。
プロジェクトをインポートするXcodeビルドは、リンカフラグに`-lsqlite3`を追加する必要があります。
または、CocoaPodsプラグイン経由で[sqlite3](https://cocoapods.org/pods/sqlite3) podへの[プロジェクト依存関係を追加](https://kotlinlang.org/docs/native-cocoapods-libraries.html)します。
機能する可能性のあるもう一つのオプションは、CocoaPodsの[`spec.libraries`設定](https://guides.cocoapods.org/syntax/podspec.html#libraries)に`sqlite3`を追加することです。例：Gradle Kotlin DSLの場合: `extraSpecAttributes["libraries"] = "'c++', 'sqlite3'".`

デフォルトは`true`です。

=== "Kotlin"
    ```kotlin
    linkSqlite.set(true)
    ```
=== "Groovy"
    ```groovy
    linkSqlite = true
    ```

## データベース設定

### `packageName`

Type: `Property<String>`

データベースクラスに使用されるパッケージ名です。

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

Type: `ConfigurableFileCollection`

プラグインが`.sq`および`.sqm`ファイルを探すフォルダのコレクションです。

デフォルトは`src/[prefix]main/sqldelight`で、接頭辞は適用されるKotlinプラグイン（例：マルチプラットフォームの場合はcommon）によって異なります。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

プラグインが`.sq`および`.sqm`ファイルを探すオブジェクトのコレクションです。

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

Type: `DirectoryProperty`

`.db`スキーマファイルをプロジェクトルートからの相対パスで格納するディレクトリです。
これらのファイルは、マイグレーションが最新のスキーマを持つデータベースを生成することを検証するために使用されます。

デフォルトは`null`です。
もし`null`の場合、マイグレーション検証タスクは作成されません。

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

Type: `Project`

オプションで、他のGradleプロジェクトに対するスキーマ依存関係を（[下記参照](#schema-dependencies)）指定できます。

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

Type: `String` or `Provider<MinimalExternalModuleDependency>`

ターゲットとするSQL方言です。方言はGradle依存関係を使用して選択されます。
これらの依存関係は、`app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}`のように指定できます。
利用可能な方言は以下を参照してください。

Androidプロジェクトの場合、SQLiteバージョンは`minSdk`に基づいて自動的に選択されます。
それ以外の場合はデフォルトでSQLite 3.18が使用されます。

利用可能な方言:

* HSQL: `hsql-dialect`
* MySQL: `mysql-dialect`
* PostgreSQL: `postgresql-dialect`
* SQLite 3.18: `sqlite-3-18-dialect`
* SQLite 3.24: `sqlite-3-24-dialect`
* SQLite 3.25: `sqlite-3-25-dialect`
* SQLite 3.30: `sqlite-3-30-dialect`
* SQLite 3.33: `sqlite-3-33-dialect`
* SQLite 3.35: `sqlite-3-35-dialect`
* SQLite 3.38: `sqlite-3-38-dialect`

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

Type: `Property<Boolean>`

`true`に設定されている場合、マイグレーションファイルにエラーがあるとビルドプロセス中に失敗します。

デフォルトは`false`です。

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

Type: `Property<Boolean>`

`true`に設定されている場合、SQLDelightは`IS`を使用する際にnullableな型付き値との等価比較を置換しません。

デフォルトは`false`です。

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

Type: `Property<Boolean>`

`true`に設定されている場合、SQLDelightは非同期ドライバーで使用するためのサスペンディングクエリメソッドを生成します。

デフォルトは`false`です。

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

Type: `Property<Boolean>`

`true`に設定されている場合、データベースのスキーマは、各マイグレーションが適用されたかのように`.sqm`ファイルから導出されます。
`false`の場合、スキーマは`.sq`ファイルで定義されます。

デフォルトは`false`です。

=== "Kotlin"
    ```kotlin
    deriveSchemaFromMigrations.set(true)
    ```
=== "Groovy"
    ```groovy
    deriveSchemaFromMigrations = true
    ```

{% include 'common/gradle-dependencies.md' %}