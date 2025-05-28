# 2.0へのアップグレード

SQLDelight 2.0では、GradleプラグインとランタイムAPIにいくつかの破壊的変更が加えられています。

このページでは、それらの破壊的変更点と2.0での新しい同等物について説明します。新機能やその他の変更点の完全なリストについては、[変更履歴](../changelog)を参照してください。

## 新しいパッケージ名とアーティファクトグループ

`com.squareup.sqldelight`のすべてのインスタンスを`app.cash.sqldelight`に置き換える必要があります。

```diff title="Gradleの依存関係"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

純粋なAndroid SqlDelight 1.xプロジェクトの場合、android-driverとcoroutines-extensions-jvmを使用してください。
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

## Gradle設定の変更点

* SQLDelight 2.0のビルドにはJava 11が、ランタイムにはJava 8が必要です。
* SQLDelightの設定APIでは、データベースにマネージドプロパティと`DomainObjectCollection`を使用するようになりました。

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

        1. 新しい`DomainObjectCollection`ラッパーです。
        2. `Property<String>`になりました。
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

        1. 新しい`DomainObjectCollection`ラッパーです。

* `sourceFolders`設定が`srcDirs`に名称変更されました。

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

* データベースのSQL方言（ダイアレクト）は、Gradleの依存関係を使用して指定されるようになりました。

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // Version catalogs also work!
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

              // Version catalogs also work!
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    現在サポートされている方言は、`mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect`、および`sqlite-3-38-dialect`です。

## ランタイムの変更点

* プリミティブ型は、`.sq`および`.sqm`ファイルにインポートする必要があります。

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    以前サポートされていた一部の型では、アダプターが必要になりました。プリミティブ型用のアダプターは、`app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}`アーティファクトで利用できます。例：`INTEGER As kotlin.Int`変換を行うための`IntColumnAdapter`。

* `AfterVersionWithDriver`型は、常にドライバーを含むようになった[`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)に置き換えられ、`migrateWithCallbacks`拡張関数は、コールバックを受け入れるようになったメインの[`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107)メソッドに置き換えられました。

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

* `Schema`型は`SqlDriver`のネストされた型ではなくなり、[`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)と呼ばれるようになりました。

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

* [Paging3拡張API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/)は、カウントに`Int`型のみを許可するように変更されました。
* [コルーチン拡張API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/)では、ディスパッチャを明示的に渡す必要があります。
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
* `execute()`、`executeQuery()`、`newTransaction()`、`endTransaction()`などの一部のドライバーメソッドは、[`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result)オブジェクトを返すようになりました。返された値にアクセスするには、[`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value)を使用します。
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    この変更により、ドライバーの実装はノンブロッキングAPIに基づいて行われるようになり、返された値にはサスペンド関数である[`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await)メソッドを使用してアクセスできます。
  * `SqlCursor`インターフェースの[`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next)メソッドも、非同期ドライバーでのより良いカーソルサポートを可能にするために、`QueryResult`を返すように変更されました。
* [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)インターフェースには、ジェネリックな`QueryResult`型パラメータが追加されました。これは、非同期ドライバーで使用するために生成されたスキーマランタイムを区別するために使用され、これらは同期ドライバーと直接互換性がない場合があります。これは、JSターゲットを持つマルチプラットフォームプロジェクトのように、同期ドライバーと非同期ドライバーを同時に使用するプロジェクトにのみ関連します。詳細については、「[Web Workerドライバーを使用したマルチプラットフォームセットアップ](js_sqlite/multiplatform.md)」を参照してください。
* `SqlSchema.Version`の型がIntからLongに変更され、サーバー環境でタイムスタンプをバージョンとして活用できるようになりました。既存のセットアップではIntとLong間で安全にキャストでき、バージョンにInt範囲を必要とするドライバーは、範囲外のバージョンの場合、データベース作成前にクラッシュします。