[//]: # (title: Exposed를 사용한 데이터베이스 영속성)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>사용된 라이브러리</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORM 프레임워크를 사용하여 웹사이트에 영속성을 추가하는 방법을 알아봅니다.</link-summary>

이 튜토리얼 시리즈에서는 Ktor에서 간단한 블로그 애플리케이션을 만드는 방법을 보여드립니다:
- 첫 번째 튜토리얼에서는 이미지와 HTML 페이지 같은 정적 콘텐츠를 호스팅하는 방법을 보여드렸습니다.
- 두 번째 튜토리얼에서는 FreeMarker 템플릿 엔진을 사용하여 애플리케이션에 상호 작용성(interactivity)을 추가했습니다.
- **이 튜토리얼**에서는 Exposed 프레임워크를 사용하여 웹사이트에 영속성(persistence)을 추가할 것입니다. 아티클을 저장하기 위해 H2 로컬 데이터베이스를 사용할 것입니다.
- [다음 튜토리얼](db-connection-pooling-caching.md)에서는 각각 HikariCP 및 Ehcache 라이브러리를 사용하여 데이터베이스 연결 풀링(connection pooling)과 캐싱(caching)을 구현하는 방법을 살펴보겠습니다.

## 종속성 추가 {id="add-dependencies"}

먼저 Exposed 및 H2 라이브러리에 대한 종속성을 추가해야 합니다. `gradle.properties` 파일을 열고 라이브러리 버전을 지정하십시오:

[object Promise]

그런 다음, `build.gradle.kts`를 열고 다음 종속성을 추가하십시오:

[object Promise]

`build.gradle.kts` 파일의 오른쪽 상단에 있는 **Gradle 변경 사항 로드(Load Gradle Changes)** 아이콘을 클릭하여 새로 추가된 종속성을 설치하십시오.

## 모델 업데이트 {id="model"}

Exposed는 `org.jetbrains.exposed.sql.Table` 클래스를 데이터베이스 테이블로 사용합니다. `Article` 모델을 업데이트하려면 `models/Article.kt` 파일을 열고 기존 코드를 다음 코드로 바꿉니다:

[object Promise]

`id`, `title`, 및 `body` 열에는 아티클에 대한 정보가 저장됩니다. `id` 열은 기본 키(primary key) 역할을 합니다. 

> `Articles` 객체의 속성 [유형을 검사하면](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info) 필요한 유형 인수를 가진 `Column` 유형임을 알 수 있습니다: `id`는 `Column<Int>` 유형을 가지며, `title`과 `body` 모두 `Column<String>` 유형을 가집니다.
> 
{type="tip"}

## 데이터베이스 연결 {id="connect_db"}

[데이터 접근 객체](https://en.wikipedia.org/wiki/Data_access_object)(DAO)는 특정 데이터베이스의 세부 사항을 노출하지 않고 데이터베이스에 대한 인터페이스를 제공하는 패턴입니다. 나중에 데이터베이스에 대한 특정 요청을 추상화하기 위해 `DAOFacade` 인터페이스를 정의할 것입니다.

Exposed를 사용하는 모든 데이터베이스 접근은 데이터베이스에 대한 연결을 얻는 것으로 시작됩니다. 이를 위해 `Database.connect` 함수에 JDBC URL과 드라이버 클래스 이름을 전달합니다. `com.example` 안에 `dao` 패키지를 생성하고 새로운 `DatabaseSingleton.kt` 파일을 추가하십시오. 그런 다음, 이 코드를 삽입하십시오:

[object Promise]

> `driverClassName`과 `jdbcURL`이 여기에 하드코딩되어 있다는 점에 유의하십시오. Ktor는 이러한 설정을 [사용자 정의 구성 그룹](server-configuration-file.topic)으로 추출할 수 있도록 합니다.

### 테이블 생성 {id="create_table"}

연결을 얻은 후에는 모든 SQL 문(statement)이 트랜잭션(transaction) 내부에 배치되어야 합니다: 

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

이 코드 샘플에서는 기본 데이터베이스가 `transaction` 함수에 명시적으로 전달됩니다. 데이터베이스가 하나만 있다면 생략할 수 있습니다. 이 경우 Exposed는 트랜잭션에 마지막으로 연결된 데이터베이스를 자동으로 사용합니다.

> `Database.connect` 함수는 트랜잭션을 호출하기 전까지는 실제 데이터베이스 연결을 설정하지 않는다는 점에 유의하십시오. 이 함수는 향후 연결을 위한 설명자(descriptor)만 생성합니다.

`Articles` 테이블이 이미 선언되어 있으므로, `init` 함수의 하단에서 `transaction` 호출 내에 `SchemaUtils.create(Articles)`를 호출하여 데이터베이스에 이 테이블이 아직 존재하지 않는 경우 생성하도록 지시할 수 있습니다:

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        SchemaUtils.create(Articles)
    }
}
```

### 쿼리 실행 {id="queries"}

편의를 위해 `DatabaseSingleton` 객체 내부에 유틸리티 함수 `dbQuery`를 생성할 것입니다. 이 함수는 데이터베이스에 대한 향후 모든 요청에 사용될 것입니다. 트랜잭션을 사용하여 블로킹(blocking) 방식으로 접근하는 대신, 코루틴(coroutine)을 활용하여 각 쿼리를 자체 코루틴에서 시작합시다:

[object Promise]

결과적으로 `DatabaseSingleton.kt` 파일은 다음과 같아야 합니다:

[object Promise]

### 시작 시 데이터베이스 설정 로드 {id="startup"}

마지막으로, 애플리케이션 시작 시 생성된 구성을 로드해야 합니다. `Application.kt`를 열고 `Application.module` 본문에서 `DatabaseSingleton.init`을 호출하십시오:

[object Promise]

## 영속성 로직 구현 {id="persistence_logic"}

이제 아티클 업데이트에 필요한 작업을 추상화할 인터페이스를 생성합시다. `dao` 패키지 안에 `DAOFacade.kt` 파일을 생성하고 다음 코드를 채워 넣으십시오:

[object Promise]

모든 아티클을 나열하고, ID로 아티클을 보고, 새 아티클을 추가, 편집 또는 삭제해야 합니다. 이 모든 함수는 내부적으로 데이터베이스 쿼리를 수행하므로, 지연 함수(suspending functions)로 정의됩니다.

`DAOFacade` 인터페이스를 구현하려면, 인터페이스 이름에 커서(caret)를 놓고, 이 인터페이스 옆에 있는 노란색 전구 아이콘을 클릭한 다음 **인터페이스 구현(Implement interface)**을 선택하십시오. 호출된 대화 상자에서 기본 설정을 유지하고 **확인(OK)**을 클릭하십시오. 

**멤버 구현(Implement Members)** 대화 상자에서 모든 함수를 선택하고 **확인(OK)**을 클릭하십시오. 

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA는 `dao` 패키지 안에 `DAOFacadeImpl.kt` 파일을 생성합니다. Exposed DSL을 사용하여 모든 함수를 구현해 봅시다.

### 모든 아티클 가져오기 {id="get_all"}

모든 항목을 반환하는 함수부터 시작합시다. 우리의 요청은 `dbQuery` 호출로 래핑(wrap)됩니다. 데이터베이스에서 모든 데이터를 가져오기 위해 `Table.selectAll` 확장 함수를 호출합니다. `Articles` 객체는 `Table`의 서브클래스이므로, Exposed DSL 메서드를 사용하여 작업합니다.

[object Promise]

`Table.selectAll`은 `Query`의 인스턴스를 반환하므로, `Article` 인스턴스 목록을 얻으려면 각 행의 데이터를 수동으로 추출하여 우리의 데이터 클래스로 변환해야 합니다. 이를 위해 `ResultRow`에서 `Article`을 구성하는 헬퍼 함수 `resultRowToArticle`을 사용합니다.

`ResultRow`는 간결한 `get` 연산자를 사용하여 지정된 `Column`에 저장된 데이터를 가져오는 방법을 제공하며, 배열이나 맵과 유사하게 대괄호 구문(bracket syntax)을 사용할 수 있도록 합니다.

> `Articles.id`의 타입은 `Expression` 인터페이스를 구현하는 `Column<Int>`입니다. 이것이 우리가 어떤 컬럼이든 표현식(expression)으로 전달할 수 있는 이유입니다.

### 아티클 가져오기 {id="get_article"}

이제 하나의 아티클을 반환하는 함수를 구현해 봅시다:

[object Promise]

`select` 함수는 확장 람다(extension lambda)를 인수로 받습니다. 이 람다 내부의 암묵적 리시버(implicit receiver)는 `SqlExpressionBuilder` 유형입니다. 이 유형을 명시적으로 사용하지는 않지만, 쿼리를 빌드하는 데 사용하는 컬럼에 대한 유용한 연산들을 많이 정의합니다. 비교(`eq`, `less`, `greater`), 산술 연산(`plus`, `times`), 값이 제공된 값 목록에 속하는지 여부(`inList`, `notInList`), 값이 null인지 아닌지 확인하는 등의 다양한 작업을 사용할 수 있습니다.

`select`는 `Query` 값 목록을 반환합니다. 이전과 마찬가지로, 우리는 그것들을 아티클로 변환합니다. 우리의 경우, 하나의 아티클이어야 하므로, 결과로 반환합니다.

### 새 아티클 추가 {id="add_article"}

테이블에 새 아티클을 삽입하려면 람다 인수를 받는 `Table.insert` 함수를 사용하십시오:

[object Promise]

이 람다 안에서, 우리는 어떤 컬럼에 어떤 값을 설정해야 하는지 지정합니다. `it` 인수는 `InsertStatement` 유형을 가지며, 이 유형에 대해 컬럼과 값을 인수로 받는 `set` 연산자를 호출할 수 있습니다.

### 아티클 편집 {id="edit_article"}

기존 아티클을 업데이트하려면 `Table.update`를 사용합니다:

[object Promise]

### 아티클 삭제 {id="delete_article"}

마지막으로, `Table.deleteWhere`를 사용하여 데이터베이스에서 아티클을 제거하십시오:

[object Promise]

### DAOFacade 초기화 {id="init-dao-facade"}

`DAOFacade` 인스턴스를 생성하고 애플리케이션 시작 전에 데이터베이스에 삽입될 샘플 아티클을 추가합시다.
`DAOFacadeImpl.kt` 파일 하단에 다음 코드를 추가하십시오:

[object Promise]

## 라우트 업데이트 {id="update_routes"}

이제 라우트 핸들러 내에서 구현된 데이터베이스 작업을 사용할 준비가 되었습니다.
`plugins/Routing.kt` 파일을 여십시오.
모든 아티클을 표시하려면 `get` 핸들러 내에서 `dao.allArticles`를 호출하십시오:

[object Promise]

새 아티클을 게시하려면 `post` 내에서 `dao.addNewArticle` 함수를 호출하십시오:

[object Promise]

아티클을 표시하고 편집하기 위해, 각각 `get("{id}")` 및 `get("{id}/edit")` 내에서 `dao.article`을 사용하십시오:

[object Promise]

마지막으로, `post("{id}")` 핸들러로 이동하여 `dao.editArticle`을 사용하여 아티클을 업데이트하고 `dao.deleteArticle`을 사용하여 아티클을 삭제하십시오:

[object Promise]

> 이 튜토리얼의 최종 프로젝트는 다음에서 찾을 수 있습니다: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence).

## 애플리케이션 실행 {id="run_app"}

우리 저널 애플리케이션이 예상대로 작동하는지 확인해 봅시다. `Application.kt` 파일의 `fun main(...)` 옆에 있는 **실행(Run)** 버튼을 눌러 애플리케이션을 실행할 수 있습니다:

![Run Server](run-app.png){width="706"}

IntelliJ IDEA는 애플리케이션을 시작하며, 몇 초 후에 앱이 실행 중이라는 확인 메시지를 볼 수 있습니다:

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

브라우저에서 [`http://localhost:8080/`](http://localhost:8080/)를 열고 아티클을 생성, 편집 및 삭제해 보십시오. 아티클은 `build/db.mv.db` 파일에 저장됩니다. IntelliJ IDEA에서 이 파일의 내용은 [데이터베이스 도구 창(Database tool window)](https://www.jetbrains.com/help/idea/database-tool-window.html)에서 확인할 수 있습니다.

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}