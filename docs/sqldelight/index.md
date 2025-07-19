!!! info "SQLDelight 2.0"

如果您目前正在使用 SQLDelight 1.x，请[查阅文档](upgrading-2.0)了解如何升级到 SQLDelight 2.0！

SQLDelight 从您的 SQL 语句生成类型安全的 Kotlin API。它在编译时验证您的模式、语句和迁移，并提供自动补全和重构等 IDE 功能，使编写和维护 SQL 变得简单。

SQLDelight 获取您现有的 SQL 模式，

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

并生成类型安全代码来运行您的 SQL 语句和查询。

![intro.gif](images/intro.gif)

---

## 支持的变体和平台

SQLDelight 支持多种 SQL 变体和平台。

<div class="cash-grid" markdown="1">
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-sqlite:{ .lg .middle } __SQLite__</p>
<hr />
[:octicons-arrow-right-24: __Android__](android_sqlite)  
[:octicons-arrow-right-24: __Native__ (iOS, macOS, Linux, Windows)](native_sqlite)  
[:octicons-arrow-right-24: __JVM__](jvm_sqlite)  
[:octicons-arrow-right-24: __JavaScript__ (浏览器)](js_sqlite)  
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
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>(实验性)</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### 第三方变体

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

开发版本（包括 IDE 插件压缩包）的快照可在 [Sonatype 的 `snapshots` 仓库](https://oss.sonatype.org/content/repositories/snapshots/app/cash/sqldelight/)中获取。请注意，对于 2.0.0+ SNAPSHOT，所有坐标均为 `app.cash.sqldelight` 而非 `com.squareup.sqldelight`。

最新快照版本的文档页面可[在此处](https://sqldelight.github.io/sqldelight/snapshot)找到。

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

[Alpha 版 IDE 插件也可通过](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)使用 IntelliJ 中的 Alpha 通道获取：`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`。
快照也可用 [EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) 通道获取：`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight`

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">