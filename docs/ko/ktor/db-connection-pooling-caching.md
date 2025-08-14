[//]: # (title: 연결 풀링 및 캐싱)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>사용된 라이브러리</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>데이터베이스 연결 풀링 및 캐싱을 구현하는 방법을 알아봅니다.</link-summary>

[이전 튜토리얼](db-persistence.md)에서는 Exposed 프레임워크를 사용하여 웹사이트에 지속성(persistence)을 추가했습니다.
이 튜토리얼에서는 HikariCP 및 Ehcache 라이브러리를 각각 사용하여 데이터베이스 연결 풀링 및 캐싱을 구현하는 방법을 살펴봅니다.

## 의존성 추가 {id="add-dependencies"}

먼저, HikariCP 및 Ehcache 라이브러리에 대한 의존성을 추가해야 합니다.
`gradle.properties` 파일을 열고 라이브러리 버전을 지정하세요:

[object Promise]

다음으로, `build.gradle.kts`를 열고 다음 의존성을 추가하세요:

[object Promise]

새로 추가된 의존성을 설치하려면 `build.gradle.kts` 파일의 오른쪽 상단 모서리에 있는 **Gradle 변경 사항 로드** 아이콘을 클릭하세요.

## 연결 풀링 {id="connection-pooling"}

Exposed는 `transaction` 범위 내에서 데이터베이스에 대한 첫 번째 조작을 수행할 때 각 `transaction` 호출 내에서 새로운 JDBC 연결을 시작합니다.
그러나 여러 JDBC 연결을 설정하는 것은 리소스 소모적입니다. 기존 연결을 재사용하는 것은 성능 향상에 도움이 될 수 있습니다.
_연결 풀링_ 메커니즘이 이 문제를 해결합니다.

이 섹션에서는 HikariCP 프레임워크를 사용하여 애플리케이션에서 JDBC 연결 풀링을 관리할 것입니다.

### 연결 설정을 구성 파일로 추출 {id="connection-settings-config"}

[이전 튜토리얼](db-persistence.md#connect_db)에서는 `com/example/dao/DatabaseSingleton.kt` 파일에 하드코딩된 `driverClassName`과 `jdbcURL`을 사용하여 데이터베이스 연결을 설정했습니다:

[object Promise]

데이터베이스 연결 설정을 [사용자 지정 구성 그룹](server-configuration-file.topic)으로 추출해 봅시다.

1. `src/main/resources/application.conf` 파일을 열고 `ktor` 그룹 외부에 `storage` 그룹을 다음과 같이 추가하세요:

   [object Promise]

2. `com/example/dao/DatabaseSingleton.kt`를 열고 `init` 함수를 업데이트하여 구성 파일에서 저장소 설정을 로드하도록 합니다:

   [object Promise]
   
   `init` 함수는 이제 `ApplicationConfig`를 허용하며 `config.property`를 사용하여 사용자 지정 설정을 로드합니다.

3. 마지막으로, `com/example/Application.kt`를 열고 `environment.config`를 `DatabaseSingleton.init`에 전달하여 애플리케이션 시작 시 연결 설정을 로드하도록 합니다:

   [object Promise]

### 연결 풀링 활성화 {id="enable-connection-pooling"}

Exposed에서 연결 풀링을 활성화하려면 `Database.connect` 함수의 파라미터로 [DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)를 제공해야 합니다.
HikariCP는 `DataSource` 인터페이스를 구현하는 `HikariDataSource` 클래스를 제공합니다.

1. `HikariDataSource`를 생성하려면 `com/example/dao/DatabaseSingleton.kt`를 열고 `DatabaseSingleton` 객체에 `createHikariDataSource` 함수를 추가하세요:

   [object Promise]

   다음은 데이터 소스 설정에 대한 몇 가지 참고 사항입니다:
     - `createHikariDataSource` 함수는 드라이버 클래스 이름과 데이터베이스 URL을 파라미터로 받습니다.
     - `maximumPoolSize` 속성은 연결 풀이 도달할 수 있는 최대 크기를 지정합니다.
     - `isAutoCommit` 및 `transactionIsolation`은 Exposed에서 사용되는 기본 설정과 동기화되도록 설정됩니다.

2. `HikariDataSource`를 사용하려면 `Database.connect` 함수에 전달하세요:

   [object Promise]

   이제 [애플리케이션을 실행하고](db-persistence.md#run_app) 모든 것이 이전처럼 작동하는지 확인할 수 있습니다.

## 캐싱 {id="caching"}

데이터베이스에 데이터베이스 캐시를 보충할 수 있습니다.
캐싱은 자주 사용되는 데이터를 임시 메모리에 저장할 수 있게 해주며, 데이터베이스의 작업 부하와 자주 필요한 데이터를 읽는 시간을 줄일 수 있는 기술입니다.

이 튜토리얼에서는 Ehcache 라이브러리를 사용하여 파일에 캐시를 구성할 것입니다.

### 구성 파일에 캐시 파일 경로 추가 {id="cache-file-path"}

`src/main/resources/application.conf` 파일을 열고 `storage` 그룹에 `ehcacheFilePath` 속성을 추가하세요:

[object Promise]

이 속성은 캐시 데이터를 저장하는 데 사용되는 파일 경로를 지정합니다.
나중에 캐시와 함께 작동하도록 `DAOFacade` 구현을 구성하는 데 사용할 것입니다.

### 캐싱 구현 {id="implement-caching"}

캐싱을 구현하려면 캐시에서 값을 반환하고, 캐시된 값이 없는 경우 데이터베이스 인터페이스에 위임하는 다른 `DAOFacade` 구현을 제공해야 합니다.

1. `com.example.dao` 패키지에 새 `DAOFacadeCacheImpl.kt` 파일을 생성하고 다음 구현을 추가하세요:

   [object Promise]

   이 코드 샘플에 대한 간략한 개요입니다:
     - 캐시를 초기화하고 구성하기 위해 Ehcache `CacheManager` 인스턴스를 정의합니다. `storagePath`를 디스크 저장에 사용될 루트 디렉토리로 제공합니다.
     - ID별로 아티클을 저장하는 항목에 대한 캐시를 생성합니다: `articlesCache`는 `Int` 키를 `Article` 값에 매핑합니다.
     - 다음으로 로컬 메모리 및 디스크 리소스에 대한 크기 제약 조건을 제공합니다. 이 파라미터에 대한 자세한 내용은 [Ehcache 문서](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)에서 확인할 수 있습니다.
     - 마지막으로, 제공된 이름, 키 및 값 타입을 사용하여 `cacheManager.getCache()`를 호출하여 생성된 캐시를 얻습니다.

2. 캐시에서 사용하려면 `Article` 클래스는 직렬화 가능해야 하며 `java.io.Serializable`을 구현해야 합니다.
   `com/example/models/Article.kt`를 열고 다음과 같이 코드를 업데이트하세요:

   [object Promise]

3. 이제 `DAOFacade`의 멤버를 구현할 준비가 되었습니다.
   `DAOFacadeCacheImpl.kt`로 돌아가서 다음 메서드를 추가하세요:

   [object Promise]

   - `allArticles`: 모든 아티클을 캐시하려고 시도하지 않습니다. 이를 주 데이터베이스에 위임합니다.
   - `article`: 아티클을 가져올 때 먼저 캐시에 존재하는지 확인하고, 그렇지 않은 경우에만 주 `DAOFacade`에 위임하고 이 아티클을 캐시에 추가합니다.
   - `addNewArticle`: 새로운 아티클을 추가할 때 주 `DAOFacade`에 위임하지만, 이 아티클을 캐시에도 추가합니다.
   - `editArticle`: 기존 아티클을 편집할 때 캐시와 데이터베이스를 모두 업데이트합니다.
   - `deleteArticle`: 삭제 시 캐시와 주 데이터베이스 모두에서 아티클을 삭제해야 합니다.

### DAOFacadeCacheImpl 초기화 {id="init-dao-facade"}

`DAOFacadeCacheImpl` 인스턴스를 생성하고 애플리케이션이 시작되기 전에 데이터베이스에 삽입될 샘플 아티클을 추가해 봅시다:

1. 먼저, `DAOFacadeImpl.kt` 파일을 열고 파일 하단에 있는 `dao` 변수 초기화를 제거하세요.

2. 다음으로, `com/example/plugins/Routing.kt`를 열고 `configureRouting` 블록 내에서 `dao` 변수를 초기화하세요:

   [object Promise]

   이것으로 끝입니다.
   이제 [애플리케이션을 실행하고](db-persistence.md#run_app) 모든 것이 이전처럼 작동하는지 확인할 수 있습니다.

> 연결 풀링 및 캐싱이 포함된 전체 예시는 여기에서 찾을 수 있습니다: [tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced).