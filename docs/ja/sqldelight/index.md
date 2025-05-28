!!! info "SQLDelight 2.0"

現在SQLDelight 1.xをご利用の場合は、SQLDelight 2.0へのアップグレードに関する[ドキュメント](upgrading-2.0)をご確認ください！

SQLDelightは、SQLステートメントから型安全なKotlin APIを生成します。コンパイル時にスキーマ、ステートメント、マイグレーションを検証し、オートコンプリートやリファクタリングといったIDE機能を提供することで、SQLの記述と保守を容易にします。

SQLDelightは既存のSQLスキーマを受け取り、

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

SQLステートメントとクエリを実行するための型安全なコードを生成します。

![intro.gif](images/intro.gif)

---

## サポートされているダイアレクトとプラットフォーム

SQLDelightは、さまざまなSQLダイアレクトとプラットフォームをサポートしています。

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
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>(実験的機能)</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### サードパーティ製ダイアレクト

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

## スナップショット

開発バージョンのスナップショット（IDEプラグインのzipを含む）は、[Sonatypeの`snapshots`リポジトリ](https://oss.sonatype.org/content/repositories/snapshots/app/cash/sqldelight/)で利用可能です。2.0.0以上のSNAPSHOTでは、すべての座標が`com.squareup.sqldelight`ではなく`app.cash.sqldelight`になることに注意してください。

最新のスナップショットバージョンのドキュメントページは[こちら](https://sqldelight.github.io/sqldelight/snapshot)で確認できます。

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

[アルファ版IDEプラグイン](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)も、IntelliJのアルファチャネル:`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`を使用して利用できます。
スナップショットは[EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap)チャネル:`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight`でも利用可能です。

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">