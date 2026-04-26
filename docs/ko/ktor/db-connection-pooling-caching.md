[//]: # (title: 커넥션 풀링 및 캐싱)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>사용된 라이브러리</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>데이터베이스 커넥션 풀링 및 캐싱을 구현하는 방법을 알아봅니다.</link-summary>

[이전 튜토리얼](db-persistence.md)에서는 Exposed 프레임워크를 사용하여 웹사이트에 영속성(persistence)을 추가했습니다.
이 튜토리얼에서는 HikariCP 및 Ehcache 라이브러리를 각각 사용하여 데이터베이스 커넥션 풀링과 캐싱을 구현하는 방법을 살펴보겠습니다.

## 의존성 추가 {id="add-dependencies"}

먼저, HikariCP 및 Ehcache 라이브러리에 대한 의존성을 추가해야 합니다. 
`gradle.properties` 파일을 열고 라이브러리 버전을 지정합니다:

```kotlin
h2_version = 2.3.232
hikaricp_version = 5.1.0
```

그런 다음, `build.gradle.kts`를 열고 다음 의존성들을 추가합니다:

```kotlin

```

`build.gradle.kts` 파일의 오른쪽 상단에 있는 **Load Gradle Changes** 아이콘을 클릭하여 새로 추가된 의존성들을 설치합니다.

## 커넥션 풀링 {id="connection-pooling"}

Exposed는 `transaction` 범위 내에서 데이터베이스에 대한 첫 번째 조작을 수행할 때 각 `transaction` 호출 내부에서 새로운 JDBC 커넥션을 시작합니다.
하지만 여러 JDBC 커넥션을 생성하는 것은 리소스 비용이 많이 듭니다. 기존 커넥션을 재사용하면 성능을 개선하는 데 도움이 될 수 있습니다.
커넥션 풀링(connection pooling) 메커니즘이 이 문제를 해결합니다.

이 섹션에서는 애플리케이션에서 JDBC 커넥션 풀링을 관리하기 위해 HikariCP 프레임워크를 사용합니다.

### 설정 파일로 연결 설정 추출하기 {id="connection-settings-config"}

[이전 튜토리얼](db-persistence.md#connect_db)에서는 데이터베이스 연결을 설정하기 위해 `com/example/dao/DatabaseSingleton.kt` 파일에 `driverClassName`과 `jdbcURL`을 하드코딩했습니다:

```kotlin

```

데이터베이스 연결 설정을 [사용자 정의 구성 그룹](server-configuration-file.topic)으로 추출해 보겠습니다.

1. `src/main/resources/application.conf` 파일을 열고 `ktor` 그룹 외부에 다음과 같이 `storage` 그룹을 추가합니다:

   ```kotlin
   
   ```

2. `com/example/dao/DatabaseSingleton.kt`를 열고 구성 파일에서 스토리지 설정을 로드하도록 `init` 함수를 업데이트합니다:

   ```kotlin
   
   ```
   
   이제 `init` 함수는 `ApplicationConfig`를 받아들이고 `config.property`를 사용하여 사용자 정의 설정을 로드합니다.

3. 마지막으로, `com/example/Application.kt`를 열고 애플리케이션 시작 시 연결 설정을 로드하도록 `environment.config`를 `DatabaseSingleton.init`에 전달합니다:

   ```kotlin
   
   ```

### 커넥션 풀링 활성화하기 {id="enable-connection-pooling"}

Exposed에서 커넥션 풀링을 활성화하려면 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)를 `Database.connect` 함수의 파라미터로 제공해야 합니다.
HikariCP는 `DataSource` 인터페이스를 구현하는 `HikariDataSource` 클래스를 제공합니다.

1. `HikariDataSource`를 생성하기 위해 `com/example/dao/DatabaseSingleton.kt`를 열고 `DatabaseSingleton` 객체에 `createHikariDataSource` 함수를 추가합니다:

   ```kotlin
   
   ```

   데이터 소스 설정에 대한 몇 가지 참고 사항은 다음과 같습니다:
     - `createHikariDataSource` 함수는 드라이버 클래스 이름과 데이터베이스 URL을 파라미터로 받습니다.
     - `maximumPoolSize` 속성은 커넥션 풀이 도달할 수 있는 최대 크기를 지정합니다.
     - `isAutoCommit` 및 `transactionIsolation`은 Exposed에서 사용하는 기본 설정과 동기화되도록 설정됩니다.

2. `HikariDataSource`를 사용하려면 이를 `Database.connect` 함수에 전달합니다:

   ```kotlin
   
   ```

   이제 [애플리케이션을 실행](db-persistence.md#run_app)하여 모든 것이 이전과 같이 작동하는지 확인할 수 있습니다.

## 캐싱 {id="caching"}

데이터베이스에 데이터베이스 캐시를 보충할 수 있습니다. 
캐싱은 자주 사용되는 데이터를 임시 메모리에 저장하는 기술로, 데이터베이스의 부하를 줄이고 자주 필요한 데이터를 읽는 시간을 단축할 수 있습니다.

이 튜토리얼에서는 Ehcache 라이브러리를 사용하여 파일에 캐시를 구성합니다.

### 설정에 캐시 파일 경로 추가하기 {id="cache-file-path"}

`src/main/resources/application.conf` 파일을 열고 `storage` 그룹에 `ehcacheFilePath` 속성을 추가합니다:

```kotlin

```

이 속성은 캐시 데이터를 저장하는 데 사용되는 파일의 경로를 지정합니다.
나중에 캐시 작업을 위한 `DAOFacade` 구현을 구성할 때 이 속성을 사용합니다.

### 캐싱 구현하기 {id="implement-caching"}

캐싱을 구현하려면 캐시에서 값을 반환하고, 캐시된 값이 없는 경우 데이터베이스 인터페이스로 위임하는 또 다른 `DAOFacade` 구현을 제공해야 합니다.

1. `com.example.dao` 패키지에 새로운 `DAOFacadeCacheImpl.kt` 파일을 생성하고 다음 구현을 추가합니다:

   ```kotlin
   
   ```

   이 코드 샘플의 간략한 개요는 다음과 같습니다:
     - 캐시를 초기화하고 구성하기 위해 Ehcache `CacheManager` 인스턴스를 정의합니다. 디스크 저장소로 사용할 루트 디렉토리로 `storagePath`를 제공합니다.
     - ID별로 기사(article)를 저장하는 항목에 대한 캐시를 생성합니다. `articlesCache`는 `Int` 키를 `Article` 값에 매핑합니다. 
     - 그런 다음 로컬 메모리 및 디스크 리소스에 대한 크기 제한을 제공합니다. 이러한 파라미터에 대한 자세한 내용은 [Ehcache 문서](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)에서 확인할 수 있습니다.
     - 마지막으로, 제공된 이름, 키 및 값 타입을 사용하여 `cacheManager.getCache()`를 호출함으로써 생성된 캐시를 가져옵니다.

2. 캐시에서 사용되려면 `Article` 클래스는 직렬화 가능해야 하며 `java.io.Serializable`을 구현해야 합니다.
   `com/example/models/Article.kt`를 열고 코드를 다음과 같이 업데이트합니다:

   ```kotlin
   
   ```

3. 이제 `DAOFacade`의 멤버들을 구현할 준비가 되었습니다. 
   `DAOFacadeCacheImpl.kt`로 돌아가서 다음 메서드들을 추가합니다:

   ```kotlin
   
   ```

   - `allArticles`: 모든 기사를 캐싱하려고 시도하지 않고, 메인 데이터베이스에 위임합니다.
   - `article`: 기사를 가져올 때 먼저 캐시에 있는지 확인하고, 없는 경우에만 메인 `DAOFacade`에 위임하고 해당 기사를 캐시에 추가합니다.
   - `addNewArticle`: 새 기사를 추가할 때 메인 `DAOFacade`에 위임하지만, 해당 기사를 캐시에도 추가합니다.
   - `editArticle`: 기존 기사를 수정할 때 캐시와 데이터베이스를 모두 업데이트합니다.
   - `deleteArticle`: 삭제 시 캐시와 메인 데이터베이스 모두에서 기사를 삭제해야 합니다.

### DAOFacadeCacheImpl 초기화하기 {id="init-dao-facade"}

`DAOFacadeCacheImpl` 인스턴스를 생성하고, 애플리케이션이 시작되기 전에 데이터베이스에 삽입될 샘플 기사를 추가해 보겠습니다:

1. 먼저, `DAOFacadeImpl.kt` 파일을 열고 파일 하단의 `dao` 변수 초기화 코드를 제거합니다.

2. 그런 다음, `com/example/plugins/Routing.kt`를 열고 `configureRouting` 블록 내부에서 `dao` 변수를 초기화합니다:

   ```kotlin
   
   ```

   이제 끝났습니다. 
   이제 [애플리케이션을 실행](db-persistence.md#run_app)하여 모든 것이 이전과 같이 작동하는지 확인할 수 있습니다.

> 커넥션 풀링 및 캐싱이 포함된 전체 예제는 여기에서 찾을 수 있습니다: [tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced).