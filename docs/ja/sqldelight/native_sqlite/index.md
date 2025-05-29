# Kotlin/Native での SQLDelight 入門

!!! info "Kotlin/Native メモリマネージャー"
    SQLDelight 2.0 以降、SQLDelight Native ドライバーは Kotlin/Native の [新しいメモリマネージャー] のみをサポートしています。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

生成されたデータベースをコードで使用するには、SQLDelight Native ドライバーの依存関係をプロジェクトに追加する必要があります。

=== "Kotlin"
    ```kotlin
    kotlin {
      // または iosMain、windowsMain など
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // または iosMain、windowsMain など
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

ドライバーのインスタンスは以下に示すように構築でき、生成された `Schema` オブジェクトへの参照が必要です。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## リーダー接続プール

ディスクデータベースは、（オプションで）複数のリーダー接続を持つことができます。リーダープールを設定するには、`maxReaderConnections` パラメーターを `NativeSqliteDriver` のさまざまなコンストラクターに渡します。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

リーダー接続は、トランザクション外でクエリを実行するためにのみ使用されます。あらゆる書き込み呼び出し、およびトランザクション内のすべてのものは、トランザクション専用の単一の接続を使用します。

[新しいメモリマネージャー]: https://kotlinlang.org/docs/native-memory-manager.html