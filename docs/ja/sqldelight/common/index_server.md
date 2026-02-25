SQLDelightはデータベースのスキーマを把握する必要があります。データベースのスキーマを設定するには、通常2つのアプローチがあります。「Fresh Schema（フレッシュスキーマ）」アプローチは、空のデータベースから開始し、目的の状態にするために必要なすべてのステートメントを一度に適用することを前提としています。一方、「Migration Schema（マイグレーションスキーマ）」アプローチは、すでにデータベースとスキーマが設定されていること（例：既存の本番データベース）を前提とし、時間の経過とともにマイグレーションを段階的に適用してデータベースのスキーマを更新していきます。

SQLDelightでは、これらのアプローチは、「[Fresh Schema](#fresh-schema)」として`.sq`ファイルにテーブル定義を記述するか、「[Migration Schema](#migration-schema)」として`.sqm`ファイルにマイグレーション文を記述するかのいずれかに対応します。いずれの場合も、SQLクエリは（[こちらに示されている通り](#typesafe-sql)）`.sq`ファイルに記述されます。

## Fresh Schema

{% include 'common/index_schema_sq.md' %}

同じ`.sq`ファイル内に、[実行時](#typesafe-sql)に実行されるSQL文の記述を開始できます。

## Migration Schema

まず、スキーマを組み立てるためにマイグレーションを使用するようGradleを設定します：

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

マイグレーションファイルの拡張子は`.sqm`であり、ファイル名にはマイグレーションファイルが実行される順序を示す番号を含める必要があります。例えば、以下のような階層の場合：

```
src
`-- main
    `-- sqldelight
        |-- v1__backend.sqm
        `-- v2__backend.sqm
```

SQLDelightは、まず`v1__backend.sqm`を適用し、次に`v2__backend.sqm`を適用することでスキーマを作成します。これらのファイルには、通常のSQL `CREATE`/`ALTER` 文を記述してください。もし他のサービス（Flywayなど）がマイグレーションファイルを読み取る場合は、[マイグレーション](migrations)に関する情報と、有効なSQLを出力する方法について必ず確認してください。

## Typesafe SQL

実行時にSQL文を実行できるようにするには、まずデータベースに接続するための `SqlDriver` を作成する必要があります。最も簡単な方法は、Hikariやその他の接続マネージャーから取得した `DataSource` から作成することです。

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

スキーマを新規のテーブル作成文（Fresh Schema）として指定するか、マイグレーションを通じて指定するかにかかわらず、実行時のSQLは `.sq` ファイルに記述します。

{% include 'common/index_queries.md' %}