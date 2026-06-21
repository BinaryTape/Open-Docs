# Gradle

より高度なカスタマイズを行うには、Gradle DSLを使用してデータベースを明示的に宣言できます。

## SQLDelightの設定

### `databases`

データベースのコンテナです。指定された名前で各データベースを作成するようにSQLDelightを設定します。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("MyDatabase") {
          // データベースの設定をここに記述します。
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        MyDatabase {
          // データベースの設定をここに記述します。
        }
      }
    }
    ```

----

### `linkSqlite`

型: `Property<Boolean>`

Nativeターゲット用。sqliteを自動的にリンクするかどうかを指定します。
これは、プロジェクトがダイナミックフレームワーク（最近のKMPバージョンでのデフォルト）にコンパイルされる際に、sqliteをリンクするために必要なメタデータを追加します。

スタティックフレームワークの場合、このフラグは効果がないことに注意してください。
プロジェクトをインポートするXcodeビルドで、リンカーフラグに `-lsqlite3` を追加する必要があります。
あるいは、cocoapodsプラグインを介して [sqlite3](https://cocoapods.org/pods/sqlite3) podへの[プロジェクト依存関係を追加](https://kotlinlang.org/docs/native-cocoapods-libraries.html)してください。
他に有効な可能性のあるオプションとして、cocoapodsの [`spec.libraries` 設定](https://guides.cocoapods.org/syntax/podspec.html#libraries) に `sqlite3` を追加する方法があります。例（Gradle Kotlin DSLの場合）: `extraSpecAttributes["libraries"] = "'c++', 'sqlite3'"`。

デフォルトは `true` です。

=== "Kotlin"
    ```kotlin
    linkSqlite.set(true)
    ```
=== "Groovy"
    ```groovy
    linkSqlite = true
    ```

## データベースの設定

### `packageName`

型: `Property<String>`

データベースクラスに使用されるパッケージ名。

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

型: `ConfigurableFileCollection`

プラグインが `.sq` および `.sqm` ファイルを検索するフォルダのコレクション。

デフォルトは `src/[prefix]main/sqldelight` です。prefixは適用されているKotlinプラグインによって異なり、例えばマルチプラットフォームの場合は `common` になります。

=== "Kotlin"
    ```kotlin
    srcDirs.setFrom("src/main/sqldelight")
    ```
=== "Groovy"
    ```groovy
    srcDirs = ['src/main/sqldelight']
    ```

#### `srcDirs(vararg objects: Any)`

プラグインが `.sq` および `.sqm` ファイルを検索するオブジェクトのコレクション。

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

型: `DirectoryProperty`

プロジェクトルートからの相対パスで、`.db` スキーマファイルを保存するディレクトリ。
これらのファイルは、マイグレーションの結果が最新のスキーマを持つデータベースになることを検証するために使用されます。

デフォルトは `null` です。  
`null` の場合、マイグレーション検証タスクは作成されません。

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

型: `Project`

オプションで、他のGradleプロジェクトへのスキーマ依存関係を指定します[（以下を参照）](#schema-dependencies)。

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

型: `String` または `Provider<MinimalExternalModuleDependency>`

ターゲットとするSQL方言（ダイアレクト）。ダイアレクトはGradleの依存関係を使用して選択します。
これらの依存関係は `app.cash.sqldelight:{dialect module}:{{ versions.sqldelight }}` のように指定できます。 
利用可能なダイアレクトについては以下を参照してください。

Androidプロジェクトの場合、SQLiteのバージョンは `minSdk` に基づいて自動的に選択されます。 
それ以外の場合、デフォルトは SQLite 3.18 です。

利用可能なダイアレクト:

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

型: `Property<Boolean>`

trueに設定すると、マイグレーションファイルにエラーがある場合にビルドプロセス中に失敗します。

デフォルトは `false` です。

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

型: `Property<Boolean>`

trueに設定すると、SQLDelightは `IS` を使用した際のNULL許容型の値との等価比較を置き換えません。

デフォルトは `false` です。

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

型: `Property<Boolean>`

trueに設定すると、SQLDelightは非同期ドライバで使用するためのサスペンドクエリメソッド（suspending query methods）を生成します。

デフォルトは `false` です。

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

型: `Property<Boolean>`

trueに設定すると、各マイグレーションが適用されたかのように、`.sqm` ファイルからデータベースのスキーマが派生されます。
falseの場合、スキーマは `.sq` ファイルで定義されます。

デフォルトは `false` です。

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

型: `Property<Boolean>`

trueに設定すると、SQLDelightは `SELECT *` ステートメントを、結果として得られる実際の各カラムを明示的に参照するように書き換えます。

例えば、以下の `getAll` クエリは
```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);

getAll:
SELECT * FROM hockey_player;
```
`SELECT hockey_player.id, hockey_player.name, hockey_player.number FROM hockey_player;` のように書き換えられます。

デフォルトは `true` です。

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

型: `SetProperty<String>`

生成されたモデルおよび展開された `SELECT *` プロジェクションから除外する `table.column` 値のセット。
テーブル名とカラム名は、SQLDelightのスキーマソースと同じ大文字小文字を使用する必要があります。
これはコード生成にのみ影響し、SQLスキーマや生成されるマイグレーション出力は変更しません。

これは、後続のスキーママイグレーションでカラムを削除する前に、生成されたKotlin APIを更新するために使用できます。
設定されたテーブルやカラムが存在しない場合、またはモデルにバインドされたインサート、`SELECT` 結果カラム、または `RETURNING` 句がコード生成から除外されたカラムを明示的にリストしている場合、SQLDelightはコンパイルに失敗します。
これはコード生成のみの設定であるため、削除されるまでの間、既存の除外されたカラムを書き込みから省略できるようにする責任はアプリケーション側にあります（例：NULL許容カラムにする、またはデフォルト値を設定するなど）。

もし `.sq` ファイルに `CREATE TABLE` スキーマ定義が含まれている場合は、物理的なスキーママイグレーションで削除されるまで、スキーマ定義内に除外対象のカラムを保持しておいてください。カラムへの明示的なクエリ参照は削除しますが、スキーマソースは現在のデータベースの形状を反映したままにしておきます。

デフォルトは空です。

=== "Kotlin"
    ```kotlin
    codegenExcludedColumns.set(setOf("hockey_player.number"))
    ```
=== "Groovy"
    ```groovy
    codegenExcludedColumns = ["hockey_player.number"]
    ```

{% include 'common/gradle-dependencies.md' %}