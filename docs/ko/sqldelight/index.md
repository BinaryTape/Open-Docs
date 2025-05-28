!!! info "SQLDelight 2.0"

    현재 SQLDelight 1.x를 사용 중이라면, SQLDelight 2.0으로 업그레이드하는 방법에 대한 [문서](upgrading-2.0)를 확인하세요!

SQLDelight는 SQL 문(statement)으로부터 타입-세이프(typesafe)한 Kotlin API를 생성합니다. 컴파일 시점(compile-time)에 스키마, 문 및 마이그레이션을 검증하며, 자동 완성(autocomplete) 및 리팩토링(refactoring)과 같은 IDE 기능을 제공하여 SQL 작성 및 유지를 간단하게 만듭니다.

SQLDelight는 기존 SQL 스키마를 가져와서,

```sql
CREATE TABLE hockey_player (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  number INTEGER NOT NULL
);
```

SQL 문과 쿼리를 실행하기 위한 타입-세이프한 코드를 생성합니다.

![intro.gif](images/intro.gif)

---

## 지원되는 다이얼렉트 및 플랫폼

SQLDelight는 다양한 SQL 다이얼렉트와 플랫폼을 지원합니다.

<div class="cash-grid" markdown="1">
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-sqlite:{ .lg .middle } __SQLite__</p>
<hr />
[:octicons-arrow-right-24: __Android__](android_sqlite)  
[:octicons-arrow-right-24: __네이티브(Native)__ (iOS, macOS, Linux, Windows)](native_sqlite)  
[:octicons-arrow-right-24: __JVM__](jvm_sqlite)  
[:octicons-arrow-right-24: __JavaScript__ (브라우저)](js_sqlite)  
[:octicons-link-external-16: __JavaScript__ (Node)](https://github.com/wojta/sqldelight-node-sqlite3-driver)  
[:octicons-arrow-right-24: __멀티플랫폼(Multiplatform)__](multiplatform_sqlite)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-mysql:{ .lg .middle } __MySQL__</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_mysql)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">:simple-postgresql:{ .lg .middle } __PostgreSQL__</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_postgresql)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
[:octicons-link-external-16: __네이티브(Native)__ (macOS, Linux)](https://github.com/hfhbd/postgres-native-sqldelight)
</div>
<div class="cash-grid-item" markdown="1">
<p class="cash-grid-title" markdown="1">__HSQL / H2__<br/>(실험적 기능)</p>
<hr />
[:octicons-arrow-right-24: __JVM__ (JDBC)](jvm_h2)  
:octicons-arrow-right-24: __JVM__ (R2DBC)  
</div>
</div>

### 서드파티 다이얼렉트

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

## 스냅샷

개발 버전의 스냅샷(IDE 플러그인 ZIP 포함)은 [Sonatype의 `snapshots` 저장소](https://oss.sonatype.org/content/repositories/snapshots/app/cash/sqldelight/)에서 이용할 수 있습니다. 참고로, 2.0.0+ SNAPSHOTs의 경우 모든 코디네이트가 `com.squareup.sqldelight` 대신 `app.cash.sqldelight`입니다.

최신 스냅샷 버전에 대한 문서 페이지는 [여기](https://sqldelight.github.io/sqldelight/snapshot)에서 찾을 수 있습니다.

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

IntelliJ에서 알파 채널(`https://plugins.jetbrains.com/plugins/alpha/com.squareup.sqldelight`)을 사용하여 [알파(Alpha) IDE 플러그인](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)도 이용할 수 있습니다. 스냅샷은 [EAP](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/eap) 채널(`https://plugins.jetbrains.com/plugins/eap/com.squareup.sqldelight`)에서도 이용할 수 있습니다.

<img width="738" alt="IntelliJ_alpha_channel" src="https://user-images.githubusercontent.com/22521688/168236653-e32deb26-167f-46ce-9277-ea169cbb22d6.png">