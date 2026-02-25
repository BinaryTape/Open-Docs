!!! info "SQLDelight 2.0"

    如果你目前正在使用 SQLDelight 1.x，请[查阅文档](upgrading-2.0)了解如何升级到 SQLDelight 2.0！

SQLDelight 根据你的 SQL 语句生成类型安全的 Kotlin API。它在编译时验证你的架构、语句和迁移，并提供自动补全和重构等 IDE 功能，让 SQL 的编写与维护变得简单。

SQLDelight 获取你现有的 SQL 架构，

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

并生成类型安全的代码来运行你的 SQL 语句和查询。

![intro.gif](images/intro.gif)

---

## 支持的方言与平台

SQLDelight 支持多种 SQL 方言和平台。

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

开发版本的快照（包括 IDE 插件 zip 文件）可在 [Central Portal Snapshots 仓库](https://central.sonatype.com/repository/maven-snapshots)中获取。请注意，对于 2.0.0+ 的快照，所有坐标均为 `app.cash.sqldelight` 而非 `com.squareup.sqldelight`。

最新快照版本的文档页面可以[在此处找到](https://sqldelight.github.io/sqldelight/snapshot)。

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

通过在 IntelliJ 中使用 alpha 频道，也可以获取 [Alpha IDE 插件](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)：`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`。
快照在 [EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) 频道中也可用：`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight` 

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">