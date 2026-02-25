# 升級至 2.0

SQLDelight 2.0 對 Gradle 外掛程式和執行時 API 進行了一些破壞性變更。

本頁面列出了這些破壞性變更及其在 2.0 中的新對應項。
若要查看新功能和其他變更的完整列表，請參閱 [changelog](../changelog)。

## 新的套件名稱與構件群組

所有 `com.squareup.sqldelight` 的執行個體都需要替換為 `app.cash.sqldelight`。

```diff title="Gradle 相依性"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

對於純 Android 的 SQLDelight 1.x 專案，請使用 android-driver 和 coroutines-extensions-jvm：
dependencies {
-  implementation("com.squareup.sqldelight:android-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
-  implementation("com.squareup.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:coroutines-extensions-jvm:{{ versions.sqldelight }}")
}
```

```diff title="程式碼中"
-import com.squareup.sqldelight.db.SqlDriver
+import app.cash.sqldelight.db.SqlDriver
```

## Gradle 配置變更

* SQLDelight 2.0 在組建時需要 Java 11，執行時則需要 Java 8。
* SQLDelight 配置 API 現在針對資料庫使用受控屬性和 `DomainObjectCollection`。

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

        1. 新的 `DomainObjectCollection` 包裝函式。
        2. 現在是一個 `Property<String>`。
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

        1. 新的 `DomainObjectCollection` 包裝函式。

* `sourceFolders` 設定已重新命名為 `srcDirs`

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

* 您資料庫的 SQL 方言現在使用 Gradle 相依性來指定。

    === "Kotlin"
        ```groovy
        sqldelight {
          databases {
            create("MyDatabase") {
              packageName.set("com.example")
              dialect("app.cash.sqldelight:mysql-dialect:{{ versions.sqldelight }}")

              // 版本目錄 (Version catalogs) 也同樣適用！
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

              // 版本目錄 (Version catalogs) 也同樣適用！
              dialect libs.sqldelight.dialects.mysql
            }
          }
        }
        ```

    目前支援的方言包括 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect` 以及 `sqlite-3-38-dialect`

## 執行時變更

* 原始型別現在必須匯入至 `.sq` 和 `.sqm` 檔案中。

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    一些先前支援的型別現在需要轉接器。原始型別的轉接器可在 `app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` 構件中取得。
    例如：用於執行 `INTEGER As kotlin.Int` 轉換的 `IntColumnAdapter`。

* `AfterVersionWithDriver` 型別已被移除，取而代之的是 [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)，它現在一律包含驅動程式；而 `migrateWithCallbacks` 擴充函式也被移除，取而代之的是現在可接收回呼 (callbacks) 的主 [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) 方法。

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

* `Schema` 型別不再是 `SqlDriver` 的巢狀型別，現在稱為 [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)。

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

* [paging3 擴充套件 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/) 已變更為僅允許 int 型別作為計數。
* [coroutines 擴充套件 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/) 現在要求必須明確傳入一個分派器 (dispatcher)。
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
* 一些驅動程式方法，如 [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute)、[`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query)、`newTransaction()` 和 `endTransaction()`，現在會傳回 [`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) 物件。請使用 [`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value) 來存取傳回的值。
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    這項變更讓驅動程式實作能夠基於非阻塞 API，並透過暫停方法 [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await) 來存取傳回的值。
  * `SqlCursor` 介面上的 [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) 方法也已變更為傳回 `QueryResult`，以便為非同步驅動程式提供更好的游標支援。
* [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) 介面現在具有泛型 `QueryResult` 型別參數。這用於區分專為非同步驅動程式產生的架構執行時，這些執行時可能無法直接與同步驅動程式相容。
  這僅與同時使用同步和非同步驅動程式的專案有關，例如具有 JS 目標的多平台專案。詳情請參閱「[搭配 Web Worker 驅動程式的多平台設置](js_sqlite/multiplatform.md)」。
* `SqlSchema.Version` 的型別從 Int 變更為 Long，以便讓伺服器環境能夠利用時間戳記作為版本。現有的配置可以安全地在 Int 與 Long 之間進行轉換，而對於版本需要 Int 範圍的驅動程式，若版本超出範圍，將會在資料庫建立前崩潰。