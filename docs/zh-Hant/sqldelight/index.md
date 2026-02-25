!!! info "SQLDelight 2.0"

    如果您目前正在使用 SQLDelight 1.x，請[參閱文件](upgrading-2.0)以了解如何升級到 SQLDelight 2.0！

SQLDelight 會根據您的 SQL 陳述式產生型別安全的 Kotlin API。它會在編譯期驗證您的架構、陳述式和遷移，並提供自動補全和重構等 IDE 功能，讓編寫和維護 SQL 變得簡單。

SQLDelight 會採用您現有的 SQL 架構，

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

並產生型別安全的程式碼來執行您的 SQL 陳述式和查詢。

![intro.gif](images/intro.gif)

---

## 支援的方言與平台

SQLDelight 支援多種 SQL 方言和平台。

<div class="cash-grid" markdown="1">
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-sqlite:{ .lg .middle } __SQLite__</p>
<hr />
[:octicons-arrow-right-24: __Android__](android_sqlite)  
[:octicons-arrow-right-24: __Native__ (iOS, macOS, Linux, Windows)](native_sqlite)  
[:octicons-arrow-right-24: __JVM__](jvm_sqlite)  
[:octicons-arrow-right-24: __JavaScript__ (Browser)](js_sqlite)  
[:octicons-link-external-16: __JavaScript__ (Node)](https://github.com/wojta/sqldelight-node-sqlite3-driver)  
[:octicons-arrow-right-24: __Multiplatform__](multiplatform_sqlite)  
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
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>（實驗性）</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### 第三方方言

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

開發版本的快照（包括 IDE 外掛程式 zip 檔）可在 [Central Portal 快照儲存庫](https://central.sonatype.com/repository/maven-snapshots)中取得。請注意，2.0.0+ 的 SNAPSHOT 座標皆為 `app.cash.sqldelight`，而非 `com.squareup.sqldelight`。

最新快照版本的文件頁面可以[在處此找到](https://sqldelight.github.io/sqldelight/snapshot)。

=== "Kotlin"
    ```kotlin
    // settings.gradle.kts
    pluginManagement {
        repositories {
            gradlePluginPortal()
            maven(url = "https://central.sonatype.com/repository/maven-snapshots")
        }
    }
    
    // build.gradle.kts
    plugins {
        id("app.cash.sqldelight") version "SNAPSHOT-VERSION"
    }
    
    repositories {
        maven(url = "https://central.sonatype.com/repository/maven-snapshots")
    }
    ```
=== "Groovy"
    ```groovy
    // settings.gradle
    pluginManagement {
        repositories {
            gradlePluginPortal()
            maven { url "https://central.sonatype.com/repository/maven-snapshots" }
        }
    }
    
    // build.gradle
    plugins {
        id "app.cash.sqldelight" version "SNAPSHOT-VERSION"
    }
    
    repositories {
        maven { url "https://central.sonatype.com/repository/maven-snapshots" }
    }
    ```

也可以透過在 IntelliJ 中使用 alpha 頻道來獲取 [Alpha 版 IDE 外掛程式](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)：`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`。
快照也可在 [早期體驗計劃 (EAP)](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) 頻道中取得：`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight` 

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">