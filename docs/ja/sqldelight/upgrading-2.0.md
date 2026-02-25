# 2.0 へのアップグレード

SQLDelight 2.0 では、Gradle プラグインとランタイム API にいくつかの破壊的変更（breaking changes）が導入されています。

このページでは、それらの破壊的変更と、2.0 における新しい代替手段をリストアップしています。
新機能やその他の変更の完全なリストについては、[changelog](../changelog) を参照してください。

## 新しいパッケージ名とアーティファクトグループ

`com.squareup.sqldelight` のすべての箇所を `app.cash.sqldelight` に置き換える必要があります。

```diff title="Gradle の依存関係"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

純粋な Android 用の SQLDelight 1.x プロジェクトでは、android-driver と coroutines-extensions-jvm を使用してください：
dependencies {
-  implementation("com.squareup.sqldelight:android-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
-  implementation("com.squareup.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:coroutines-extensions-jvm:{{ versions.sqldelight }}")
}
```

```diff title="コード内"
-import com.squareup.sqldelight.db.SqlDriver
+import app.cash.sqldelight.db.SqlDriver
```

## Gradle 設定の変更

* SQLDelight 2.0 は、ビルドに Java 11、ランタイムに Java 8 を必要とします。
* SQLDelight の設定 API は、データベースに対してマネージドプロパティと `DomainObjectCollection` を使用するようになりました。

    === "Kotlin"
        ```kotlin
        sqldelight {
          databases { // (1)!
            create("Database") {
              packageName.set("com.example") // (2)!
            }
          }
        }
        ```

        1. 新しい `DomainObjectCollection` ラッパー。
        2. `Property<String>` になりました。
    === "Groovy"
        ```kotlin
        sqldelight {
          databases { // (1)!
            Database {
              packageName = "com.example"
            }
          }
        }
        ```

        1. 新しい `DomainObjectCollection` ラッパー。

* `sourceFolders` 設定は `srcDirs` に名称変更されました。

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              srcDirs.setFrom("src/main/sqldelight")
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              srcDirs = ['src/main/sqldelight']
            }
          }
        }
        ```

* データベースの SQL ダイアレクトは、Gradle の依存関係を使用して指定するようになりました。

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // バージョンカタログも利用可能です！
              dialect(libs.sqldelight.dialects.mysql)
            }
          }
        }
        ```
    === "Groovy"
        ```groovy
        sqldelight {
          databases {
            MyDatabase {
              packageName = "com.example"
              dialect "app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}"

              // バージョンカタログも利用可能です！
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    現在サポートされているダイアレクトは、`mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect`、および `sqlite-3-38-dialect` です。

## ランタイムの変更

* プリミティブ型は、`.sq` および `.sqm` ファイルにインポートする必要があります。

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    以前にサポートされていた一部の型は、アダプターが必要になりました。プリミティブ型のアダプターは、`app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` アーティファクトで利用可能です。
    例：`INTEGER As kotlin.Int` の変換を行うための `IntColumnAdapter`。

* `AfterVersionWithDriver` 型は削除され、常にドライバーを含む [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version) に置き換えられました。また、`migrateWithCallbacks` 拡張関数は削除され、コールバックを受け取れるようになったメインの [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) メソッドに統合されました。

    ```diff
    Database.Schema.{++migrate++}{--WithCallbacks--}(
      driver = driver,
      oldVersion = 1,
      newVersion = Database.Schema.version,
    -  {--AfterVersionWithDriver(3) { driver ->--}
    -  {--  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)--}
    -  {--}--}
    +  {++AfterVersion(3) { driver ->++}
    +  {++  driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0)++}
    +  {++}++}
    )
    ```

* `Schema` 型は `SqlDriver` のネストされた型ではなくなり、[`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) という名称になりました。

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

* [paging3 拡張 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/) が変更され、count には int 型のみが許可されるようになりました。
* [coroutines 拡張 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/) では、ディスパッチャを明示的に渡す必要があります。
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
* [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute)、[`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query)、`newTransaction()`、`endTransaction()` などの一部のドライバーメソッドは、[`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) オブジェクトを返すようになりました。戻り値にアクセスするには、[`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value) を使用してください。
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    この変更により、サスペンド関数である [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await) メソッドを使用して戻り値にアクセスできるような、非ブロッキング API に基づくドライバー実装が可能になります。
  * `SqlCursor` インターフェースの [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) メソッドも、非同期ドライバーでのカーソルサポートを向上させるために `QueryResult` を返すように変更されました。
* [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) インターフェースにジェネリックの `QueryResult` 型パラメータが追加されました。これは、非同期ドライバーで使用するために生成されたスキーマランタイムを区別するために使用され、同期ドライバーと直接互換性がない場合があります。
  これは、JS ターゲットを持つマルチプラットフォームプロジェクトのように、同期ドライバーと非同期ドライバーを同時に使用しているプロジェクトにのみ関連します。詳細については、「[Web Worker ドライバーを使用したマルチプラットフォームのセットアップ](js_sqlite/multiplatform.md)」を参照してください。
* `SqlSchema.Version` の型が `Int` から `Long` に変更され、サーバー環境でタイムスタンプをバージョンとして利用できるようになりました。既存の設定では `Int` と `Long` の間で安全にキャストでき、バージョンに `Int` の範囲を必要とするドライバーは、範囲外のバージョンの場合、データベース作成前にクラッシュします。