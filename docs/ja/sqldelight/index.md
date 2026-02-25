!!! info "SQLDelight 2.0"

    現在 SQLDelight 1.x を使用している場合は、SQLDelight 2.0 へのアップグレードに関する[ドキュメントを確認](upgrading-2.0)してください。

SQLDelight は、SQL 文からタイプセーフな Kotlin API を生成します。コンパイル時にスキーマ、ステートメント、マイグレーションを検証し、オートコンプリートやリファクタリングなどの IDE 機能を提供することで、SQL の作成とメンテナンスを容易にします。

SQLDelight は、次のような既存の SQL スキーマから、

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

SQL 文やクエリを実行するためのタイプセーフなコードを生成します。

![intro.gif](images/intro.gif)

---

## サポートされているダイアレクトとプラットフォーム

SQLDelight は、さまざまな SQL ダイアレクト（方言）とプラットフォームをサポートしています。

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
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>(試験的)</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### サードパーティのダイアレクト

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

開発版のスナップショット（IDE プラグインの zip を含む）は、[Central Portal Snapshots リポジトリ](https://central.sonatype.com/repository/maven-snapshots)で入手可能です。2.0.0 以降のスナップショットでは、すべての座標（coordinates）が `com.squareup.sqldelight` ではなく `app.cash.sqldelight` になっていることに注意してください。

最新のスナップショットバージョンのドキュメントページは[こちら](https://sqldelight.github.io/sqldelight/snapshot)にあります。

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

IntelliJ でアルファチャンネル `https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight` を使用することで、[アルファ版の IDE プラグインも利用可能です](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)。
また、スナップショットは [EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) チャンネル `https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight` でも提供されています。

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">