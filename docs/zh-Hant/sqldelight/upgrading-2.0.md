# 升級到 2.0

SQLDelight 2.0 對 Gradle 外掛程式和執行時 API 進行了一些破壞性變更。

此頁面列出了這些破壞性變更及其新的 2.0 對應項。有關新功能和其他變更的完整列表，請參閱[變更日誌](../changelog)。

## 新的套件名稱和構件組

所有 `com.squareup.sqldelight` 的實例都需要替換為 `app.cash.sqldelight`。

```diff title="Gradle 依賴項"
plugins {
-  id("com.squareup.sqldelight") version "{{ versions.sqldelight }}"
+  id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
}

dependencies {
-  implementation("com.squareup.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:sqlite-driver:{{ versions.sqldelight }}")
}

For pure-Android SqlDelight 1.x projects, use android-driver and coroutine-extensions-jvm:
dependencies {
-  implementation("com.squareup.sqldelight:android-driver:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:android-driver:{{ versions.sqldelight }}")
-  implementation("com.squareup.sqldelight:coroutines-extensions:{{ versions.sqldelight }}")
+  implementation("app.cash.sqldelight:coroutines-extensions-jvm:{{ versions.sqldelight }}")
}
```

```diff title="在程式碼中"
-import com.squareup.sqldelight.db.SqlDriver
+import app.cash.sqldelight.db.SqlDriver
```

## Gradle 配置變更

*   SQLDelight 2.0 要求 Java 11 用於建構，Java 8 用於執行時。
*   SQLDelight 配置 API 現在使用託管屬性 (managed properties) 和 `DomainObjectCollection` 來管理資料庫。

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

        1.  新的 `DomainObjectCollection` 包裝器。
        2.  現在是一個 `Property<String>`。
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

        1.  新的 `DomainObjectCollection` 包裝器。

*   sourceFolders 設定已更名為 srcDirs

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

*   你的資料庫的 SQL 變體現在透過 Gradle 依賴項指定。

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

    目前支援的變體有 `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect` 和 `sqlite-3-38-dialect`。

## 執行時變更

*   基本類型現在必須匯入到 `.sq` 和 `.sqm` 檔案中。

    ```diff
    +{++import kotlin.Boolean;++}

    CREATE TABLE HockeyPlayer (
      name TEXT NOT NULL,
      good INTEGER {==AS Boolean==}
    );
    ```

    一些以前支援的類型現在需要配接器 (adapter)。基本類型的配接器可在 `app.cash.sqldelight:primitive-adapters:{{ versions.sqldelight }}` 構件中找到。例如，用於執行 `INTEGER As kotlin.Int` 轉換的 `IntColumnAdapter`。

*   `AfterVersionWithDriver` 類型已被移除，取而代之的是現在始終包含驅動程式的 [`AfterVersion`](../2.x/runtime/app.cash.sqldelight.db/-after-version)。`migrateWithCallbacks` 擴展函式已被移除，取而代之的是現在接受回呼的主要 [`migrate`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema/#-775472427%2FFunctions%2F-2112917107) 方法。

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

*   `Schema` 類型不再是 `SqlDriver` 的巢狀類型，現在被稱為 [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema)。

    ```diff
    -val schema: {--SqlDriver.Schema--}
    +val schema: {++SqlSchema++}
    ```

*   [Paging3 擴展 API](../2.x/extensions/androidx-paging3/app.cash.sqldelight.paging3/) 已更改為僅允許整數類型 (int types) 作為計數。
*   [協程擴展 API](../2.x/extensions/coroutines-extensions/app.cash.sqldelight.coroutines/) 現在要求明確傳入一個調度器 (dispatcher)。
    ```diff
    val players: Flow<List<HockeyPlayer>> =
      playerQueries.selectAll()
        .asFlow()
    +   .mapToList({++Dispatchers.IO++})
    ```
*   一些驅動程式方法，例如 [`execute()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute)、[`executeQuery()`](../2.x/runtime/app.cash.sqldelight.db/-sql-driver/execute-query)、`newTransaction()` 和 `endTransaction()`，現在會返回一個 [`QueryResult`](../2.x/runtime/app.cash.sqldelight.db/-query-result) 物件。請使用 [`QueryResult.value`](../2.x/runtime/app.cash.sqldelight.db/-query-result/value) 來存取返回值。
    ```diff
    -driver.executeQuery(null, "PRAGMA user_version", { /*...*/ })
    +driver.executeQuery(null, "PRAGMA user_version", { /*...*/ }){++.value++}
    ```
    此變更使得驅動程式實作可以基於非阻塞 API，其中返回值可以使用掛起方法 (suspending method) [`QueryResult.await()`](../2.x/runtime/app.cash.sqldelight.db/-query-result/await) 進行存取。
*   `SqlCursor` 介面上的 [`next()`](../2.x/runtime/app.cash.sqldelight.db/-sql-cursor/next) 方法也已更改為返回 `QueryResult`，以便為非同步驅動程式提供更好的游標支援。
*   [`SqlSchema`](../2.x/runtime/app.cash.sqldelight.db/-sql-schema) 介面現在具有一個泛型 `QueryResult` 類型參數。這用於區分那些為非同步驅動程式生成的 schema 執行時，這些執行時可能與同步驅動程式不直接相容。
    這僅與同時使用同步和非同步驅動程式的專案相關，例如具有 JS 目標的多平台專案。有關更多詳細資訊，請參閱“[使用 Web Worker 驅動程式進行多平台設定](js_sqlite/multiplatform.md)”。
*   `SqlSchema.Version` 的類型從 Int 變更為 Long，以允許伺服器環境利用時間戳作為版本。現有設定可以安全地在 Int 和 Long 之間進行轉換，而要求版本在 Int 範圍內的驅動程式，若版本超出範圍，則會在資料庫建立前崩潰。