!!! info "SQLDelight 2.0"

    如果您目前正在使用 SQLDelight 1.x，請[查閱說明文件](upgrading-2.0)以升級到 SQLDelight 2.0！

SQLDelight 會根據您的 SQL 語句產生型別安全 (typesafe) 的 Kotlin API。它會在編譯時驗證您的結構描述、語句和遷移，並提供自動完成和重構等 IDE 功能，使編寫和維護 SQL 變得簡單。

SQLDelight 會採用您現有的 SQL 結構描述：

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

並產生型別安全程式碼，以執行您的 SQL 語句和查詢。

![intro.gif](images/intro.gif)

---

## 支援的 SQL 變體與平台

SQLDelight 支援多種 SQL 變體與平台。

<div class="cash-grid" markdown="1">
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-sqlite:{ .lg .middle } __SQLite__</p>
<hr />
[:octicons-arrow-right-24: __Android__](android_sqlite)  
[:octicons-arrow-right-24: __Native__ (iOS, macOS, Linux, Windows)](native_sqlite)  
[:octicons-arrow-right-24: __JVM__](jvm_sqlite)  
[:octicons-arrow-right-24: __JavaScript__ (瀏覽器)](js_sqlite)  
[:octicons-link-external-16: __JavaScript__ (Node)](https://github.com/wojta/sqldelight-node-sqlite3-driver)  
[:octicons-arrow-right-24: __多平台__](multiplatform_sqlite)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-mysql:{ .lg .middle } __MySQL__</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_mysql)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-postgresql:{ .lg .middle } __PostgresSQL__</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_postgresql)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
[:octicons-link-external-16: __Native__ (macOS, Linux)](https://github.com/hfhbd/postgres-native-sqldelight)
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>(實驗性)</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### 第三方變體

<div class="cash-grid" markdown="1">
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-cockroachlabs:{ .lg .middle } __CockroachDB__</p>
<hr />
[:octicons-arrow-right-24: __JVM__](https://github.com/Faire/sqldelight-cockroachdb-dialect/)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-ibm:{ .lg .middle } __DB2__</p>
<hr />
[:octicons-arrow-right-24: __JVM__](https://github.com/hfhbd/sqldelight-db2-dialect)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-oracle:{ .lg .middle } __Oracle DB__</p>
<hr />
[:octicons-arrow-right-24: __JVM__](https://github.com/hfhbd/sqldelight-oracle-dialect)  
</div>
</div>

## 快照

開發版本的快照 (包含 IDE 外掛壓縮檔) 可在 [Sonatype 的 `snapshots` 儲存庫](https://oss.sonatype.org/content/repositories/snapshots/app/cash/sqldelight/)中取得。請注意，對於 2.0.0+ SNAPSHOT，所有座標都是 `app.cash.sqldelight` 而不是 `com.squareup.sqldelight`。

最新快照版本的說明文件頁面可[在此處找到](https://sqldelight.github.io/sqldelight/snapshot)。

=== "Kotlin"
    ```kotlin
    // settings.gradle.kts
    pluginManagement {
        repositories {
            gradlePluginPortal()
            maven(url = "https://oss.sonatype.org/content/repositories/snapshots")
        }
    }
    
    // build.gradle.kts
    plugins {
        id("app.cash.sqldelight") version "SNAPSHOT-VERSION"
    }
    
    repositories {
        maven(url = "https://oss.sonatype.org/content/repositories/snapshots")
    }
    ```
=== "Groovy"
    ```groovy
    // settings.gradle
    pluginManagement {
        repositories {
            gradlePluginPortal()
            maven { url "https://oss.sonatype.org/content/repositories/snapshots" }
        }
    }
    
    // build.gradle
    plugins {
        id "app.cash.sqldelight" version "SNAPSHOT-VERSION"
    }
    
    repositories {
        maven { url "https://oss.sonatype.org/content/repositories/snapshots" }
    }
    ```

[Alpha 版 IDE 外掛程式也可透過使用 IntelliJ 中的 alpha 通道取得](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)：`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`。
快照也可在 [EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) 通道中取得：`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight` 

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">