# Kotlin/Native で SQLDelight を使い始める

!!! info "Kotlin/Native メモリマネージャー"
    SQLDelight 2.0 以降、SQLDelight Native ドライバは Kotlin/Native の [新しいメモリマネージャー] のみをサポートしています。

{% include 'common/index_gradle_database.md' %}

{% include 'common/index_schema.md' %}

生成されたデータベースをコード内で使用するには、プロジェクトに SQLDelight Native ドライバの依存関係を追加する必要があります。

=== "Kotlin"
    ```kotlin
    kotlin {
      // または iosMain, windowsMain など
      sourceSets.nativeMain.dependencies {
        implementation("app.cash.sqldelight:native-driver:{{ versions.sqldelight }}")
      }
    }
    ```
=== "Groovy"
    ```groovy
    kotlin {
      // または iosMain, windowsMain など
      sourceSets.nativeMain.dependencies {
        implementation "app.cash.sqldelight:native-driver:{{ versions.sqldelight }}"
      }
    }
    ```

ドライバのインスタンスは以下のように構築でき、生成された `Schema` オブジェクトへの参照が必要になります。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(Database.Schema, "test.db")
```

{% include 'common/index_queries.md' %}

## 読み取り接続プール (Reader Connection Pools)

ディスクデータベースでは、（オプションで）複数の読み取り接続を持つことができます。読み取りプールを構成するには、`NativeSqliteDriver` の各種コンストラクタに `maxReaderConnections` パラメータを渡します。

```kotlin
val driver: SqlDriver = NativeSqliteDriver(
    Database.Schema, 
    "test.db", 
    maxReaderConnections = 4
)
```

読み取り接続は、トランザクション外でクエリを実行する場合にのみ使用されます。すべての書き込み呼び出し、およびトランザクション内のすべての処理は、トランザクション専用の単一の接続を使用します。

[新しいメモリマネージャー]: https://kotlinlang.org/docs/native-memory-manager.html