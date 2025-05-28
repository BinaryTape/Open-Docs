SQLDelightはデータベースのスキーマを把握する必要があります。データベースのスキーマを設定する方法は通常2つのアプローチがあります。「Fresh Schema」アプローチは、空のデータベースから開始し、目的の状態にするために必要なすべてのステートメントを一度に適用することを前提としています。一方、「Migration Schema」アプローチは、すでにデータベースとスキーマが設定されており（例：既存の本番データベース）、時間の経過とともにマイグレーションを段階的に適用してデータベースのスキーマを更新することを前提としています。

SQLDelightでは、これらのアプローチは「[Fresh Schema](#fresh-schema)」のためにテーブル定義を`.sq`ファイルに記述するか、「[Migration Schema](#migration-schema)」のためにマイグレーションステートメントを`.sqm`ファイルに記述することに相当します。どちらの場合も、SQLの*クエリ*は`.sq`ファイルに記述されます（[こちらに示すように](#typesafe-sql)）。

## Fresh Schema

{% include 'common/index_schema_sq.md' %}

同じ`.sq`ファイルに、[実行時](#typesafe-sql)に実行されるSQLステートメントを配置し始めることができます。

## Migration Schema

まず、Gradleがマイグレーションを使用してスキーマをアセンブルするように設定します。

=== "Kotlin"
    ```kotlin
    sqldelight {
      databases {
        create("Database") {
          ...
          srcDirs("sqldelight")
          deriveSchemaFromMigrations.set(true)
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    sqldelight {
      databases {
        Database {
          ...
          srcDirs "sqldelight"
          deriveSchemaFromMigrations = true
        }
      }
    }
    ```

マイグレーションファイルは`.sqm`という拡張子を持ち、ファイル名にはマイグレーションファイルが実行される順序を示す番号を含める必要があります。例えば、この階層の場合：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelightは、`v1__backend.sqm`を適用し、次に`v2__backend.sqm`を適用することでスキーマを作成します。これらのファイルには、通常のSQL `CREATE`/`ALTER`ステートメントを配置します。他のサービス（Flywayなど）がマイグレーションファイルを読み取る場合は、[マイグレーション](migrations)に関する情報と有効なSQLを出力する方法について確認してください。

## 型安全なSQL

実行時にSQLステートメントを実行できるようにするには、データベースに接続するための`SqlDriver`を作成する必要があります。最も簡単な方法は、Hikariや他の接続マネージャーから取得できる`DataSource`を使用することです。

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:jdbc-driver:{{ versions.sqldelight }}"
    }
    ```
```kotlin
val driver: SqlDriver = dataSource.asJdbcDriver()
```

スキーマを新規テーブル作成ステートメントとして指定するか、マイグレーションを介して指定するかに関わらず、実行時SQLは`.sq`ファイルに記述されます。

{% include 'common/index_queries.md' %}