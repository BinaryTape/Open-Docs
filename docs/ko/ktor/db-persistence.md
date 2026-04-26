[//]: # (title: Exposed를 이용한 데이터베이스 영속성)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>사용된 라이브러리</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORM 프레임워크를 사용하여 웹사이트에 영속성을 추가하는 방법을 알아봅니다.</link-summary>

이 튜토리얼 시리즈에서는 Ktor로 간단한 블로그 애플리케이션을 만드는 방법을 보여줍니다:
- 첫 번째 튜토리얼에서는 이미지 및 HTML 페이지와 같은 정적 콘텐츠를 호스팅하는 방법을 설명했습니다.
- 두 번째 튜토리얼에서는 FreeMarker 템플릿 엔진을 사용하여 애플리케이션에 상호작용성을 추가했습니다.
- **이 튜토리얼**에서는 Exposed 프레임워크를 사용하여 웹사이트에 영속성(persistence)을 추가합니다. H2 로컬 데이터베이스를 사용하여 게시글을 저장할 것입니다.
- [다음 튜토리얼](db-connection-pooling-caching.md)에서는 HikariCP와 Ehcache 라이브러리를 각각 사용하여 데이터베이스 커넥션 풀링과 캐싱을 구현하는 방법을 살펴봅니다.

## 의존성 추가 {id="add-dependencies"}

먼저 Exposed 및 H2 라이브러리에 대한 의존성을 추가해야 합니다. `gradle.properties` 파일을 열고 라이브러리 버전을 지정하세요:

```kotlin
kotlinx_serialization_version = 1.8.0
kotlin_css_version = 1.0.0-pre.721
```

그런 다음 `build.gradle.kts`를 열고 다음 의존성을 추가합니다:

```kotlin

```

`build.gradle.kts` 파일 오른쪽 상단에 있는 **Load Gradle Changes** 아이콘을 클릭하여 새로 추가된 의존성을 설치합니다.

## 모델 업데이트 {id="model"}

Exposed는 `org.jetbrains.exposed.sql.Table` 클래스를 데이터베이스 테이블로 사용합니다. `Article` 모델을 업데이트하려면 `models/Article.kt` 파일을 열고 기존 코드를 다음으로 교체하세요:

```kotlin

```

`id`, `title`, `body` 컬럼은 게시글에 대한 정보를 저장합니다. `id` 컬럼은 기본 키(primary key) 역할을 합니다. 

> `Articles` 객체에 있는 프로퍼티의 [타입을 조사](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)해 보면, 필요한 타입 인자가 포함된 `Column` 타입임을 알 수 있습니다: `id`는 `Column<Int>` 타입이고, `title`과 `body`는 모두 `Column<String>` 타입입니다.
> 
{type="tip"}

## 데이터베이스 연결 {id="connect_db"}

[데이터 액세스 객체](https://en.wikipedia.org/wiki/Data_access_object)(Data Access Object, DAO)는 특정 데이터베이스의 세부 사항을 노출하지 않고 데이터베이스에 대한 인터페이스를 제공하는 패턴입니다. 나중에 데이터베이스에 대한 특정 요청을 추상화하기 위해 `DAOFacade` 인터페이스를 정의할 것입니다.

Exposed를 사용한 모든 데이터베이스 액세스는 데이터베이스 연결을 얻는 것부터 시작됩니다. 이를 위해 JDBC URL과 드라이버 클래스 이름을 `Database.connect` 함수에 전달합니다. `com.example` 내부에 `dao` 패키지를 생성하고 새로운 `DatabaseSingleton.kt` 파일을 추가하세요. 그런 다음 이 코드를 삽입하세요:

```kotlin

```

> 여기서 `driverClassName`과 `jdbcURL`은 하드코딩되어 있습니다. Ktor를 사용하면 이러한 설정을 [사용자 정의 구성 그룹](server-configuration-file.topic)으로 추출할 수 있습니다.

### 테이블 생성 {id="create_table"}

연결을 얻은 후에는 모든 SQL 문을 트랜잭션 내에 배치해야 합니다: 

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // 여기에 구문 작성
    }
}
```

이 코드 샘플에서는 기본 데이터베이스가 `transaction` 함수에 명시적으로 전달됩니다. 데이터베이스가 하나만 있는 경우 생략할 수 있습니다. 이 경우 Exposed는 마지막으로 연결된 데이터베이스를 트랜잭션에 자동으로 사용합니다.

> `Database.connect` 함수는 트랜잭션을 호출하기 전까지는 실제 데이터베이스 연결을 설정하지 않으며, 향후 연결을 위한 설명자(descriptor)만 생성합니다.

`Articles` 테이블이 이미 선언되어 있으므로, `init` 함수 하단에서 `transaction` 호출로 감싸진 `SchemaUtils.create(Articles)`를 호출하여 데이터베이스에 이 테이블이 아직 존재하지 않는 경우 생성하도록 지시할 수 있습니다:

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

편의를 위해 `DatabaseSingleton` 객체 내부에 유틸리티 함수 `dbQuery`를 만들어 봅시다. 이 함수는 향후 모든 데이터베이스 요청에 사용될 것입니다. 차단(blocking) 방식으로 데이터베이스에 액세스하기 위해 트랜잭션을 사용하는 대신, 코루틴을 활용하여 각 쿼리를 자체 코루틴에서 시작하도록 하겠습니다:

```kotlin

```

최종적인 `DatabaseSingleton.kt` 파일은 다음과 같습니다:

```kotlin

```

### 시작 시 데이터베이스 설정 로드 {id="startup"}

마지막으로, 애플리케이션 시작 시 생성된 구성을 로드해야 합니다. `Application.kt`를 열고 `Application.module` 본문에서 `DatabaseSingleton.init`을 호출하세요:

```kotlin

```

## 영속성 로직 구현 {id="persistence_logic"}

이제 게시글 업데이트에 필요한 작업을 추상화할 인터페이스를 만들어 봅시다. `dao` 패키지 내에 `DAOFacade.kt` 파일을 생성하고 다음 코드를 채워 넣으세요:

```kotlin

```

모든 게시글 목록 가져오기, ID로 게시글 보기, 새 게시글 추가, 수정 또는 삭제 기능이 필요합니다. 이러한 모든 함수는 내부적으로 데이터베이스 쿼리를 수행하므로 중단 함수(suspending functions)로 정의됩니다.

`DAOFacade` 인터페이스를 구현하려면, 인터페이스 이름에 커서를 두고 인터페이스 옆의 노란색 전구 아이콘을 클릭한 다음 **Implement interface**를 선택하세요. 호출된 대화 상자에서 기본 설정을 그대로 두고 **OK**를 클릭합니다. 

**Implement Members** 대화 상자에서 모든 함수를 선택하고 **OK**를 클릭합니다. 

![멤버 구현](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA가 `dao` 패키지 내에 `DAOFacadeImpl.kt` 파일을 생성합니다. Exposed DSL을 사용하여 모든 함수를 구현해 봅시다.

### 모든 게시글 가져오기 {id="get_all"}

먼저 모든 항목을 반환하는 함수부터 시작해 보겠습니다. 요청은 `dbQuery` 호출로 감싸집니다. `Table.selectAll` 확장 함수를 호출하여 데이터베이스에서 모든 데이터를 가져옵니다. `Articles` 객체는 `Table`의 서브클래스이므로 Exposed DSL 메서드를 사용하여 작업합니다.

```kotlin

```

`Table.selectAll`은 `Query` 인스턴스를 반환하므로, `Article` 인스턴스 리스트를 얻으려면 각 행(row)의 데이터를 수동으로 추출하여 데이터 클래스로 변환해야 합니다. 이는 `ResultRow`에서 `Article`을 빌드하는 헬퍼 함수 `resultRowToArticle`을 사용하여 수행합니다.

`ResultRow`는 간결한 `get` 연산자를 사용하여 지정된 `Column`에 저장된 데이터를 가져오는 방법을 제공하며, 배열이나 맵과 유사한 대괄호 구문을 사용할 수 있게 해줍니다.

> `Articles.id`의 타입은 `Expression` 인터페이스를 구현하는 `Column<Int>`입니다. 그렇기 때문에 모든 컬럼을 표현식으로 전달할 수 있습니다.

### 게시글 가져오기 {id="get_article"}

이제 게시글 하나를 반환하는 함수를 구현해 보겠습니다:

```kotlin

```

`select` 함수는 확장 람다를 인자로 받습니다. 이 람다 내부의 암시적 수신 객체는 `SqlExpressionBuilder` 타입입니다. 이 타입을 명시적으로 사용하지는 않지만, 쿼리를 빌드하는 데 사용하는 컬럼에 대한 여러 유용한 연산들을 정의합니다. 비교(`eq`, `less`, `greater`), 산술 연산(`plus`, `times`), 값이 제공된 리스트에 포함되는지 여부 확인(`inList`, `notInList`), 값이 null인지 여부 확인 등을 사용할 수 있습니다.

`select`는 `Query` 값의 리스트를 반환합니다. 이전과 마찬가지로 이를 게시글로 변환합니다. 우리의 경우 하나의 게시글이어야 하므로 이를 결과로 반환합니다.

### 새 게시글 추가 {id="add_article"}

테이블에 새 게시글을 삽입하려면 람다 인자를 받는 `Table.insert` 함수를 사용합니다:

```kotlin

```

이 람다 내부에서 어떤 컬럼에 어떤 값을 설정할지 지정합니다. `it` 인자는 `InsertStatement` 타입을 가지며, 여기서 컬럼과 값을 인자로 받는 `set` 연산자를 호출할 수 있습니다.

### 게시글 수정 {id="edit_article"}

기존 게시글을 업데이트하려면 `Table.update`를 사용합니다:

```kotlin

```

### 게시글 삭제 {id="delete_article"}

마지막으로, 데이터베이스에서 게시글을 제거하려면 `Table.deleteWhere`를 사용합니다:

```kotlin

```

### DAOFacade 초기화 {id="init-dao-facade"}

`DAOFacade` 인스턴스를 생성하고 애플리케이션이 시작되기 전에 데이터베이스에 삽입될 샘플 게시글을 추가해 보겠습니다.
`DAOFacadeImpl.kt` 하단에 다음 코드를 추가하세요:

```kotlin

```

## 라우트 업데이트 {id="update_routes"}

이제 라우트 핸들러 내부에서 구현된 데이터베이스 작업을 사용할 준비가 되었습니다.
`plugins/Routing.kt` 파일을 엽니다.
모든 게시글을 표시하려면 `get` 핸들러 내부에서 `dao.allArticles`를 호출합니다:

```kotlin

```

새 게시글을 게시하려면 `post` 내부에서 `dao.addNewArticle` 함수를 호출합니다:

```kotlin

```

표시 및 편집을 위한 게시글을 가져오려면 `get("{id}")` 및 `get("{id}/edit")` 내부에서 각각 `dao.article`을 사용합니다:

```kotlin

```

마지막으로 `post("{id}")` 핸들러로 이동하여 `dao.editArticle`을 사용하여 게시글을 업데이트하고 `dao.deleteArticle`을 사용하여 삭제합니다:

```kotlin

```

> 이 튜토리얼의 결과 프로젝트는 여기에서 확인할 수 있습니다: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-website-interactive-persistence).

## 애플리케이션 실행 {id="run_app"}

저널 애플리케이션이 예상대로 작동하는지 확인해 봅시다. `Application.kt`의 `fun main(...)` 옆에 있는 **Run** 버튼을 눌러 애플리케이션을 실행할 수 있습니다:

![서버 실행](run-app.png){width="706"}

IntelliJ IDEA가 애플리케이션을 시작하고 몇 초 후에 앱이 실행 중이라는 확인 메시지가 표시됩니다:

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

브라우저에서 [`http://localhost:8080/`](http://localhost:8080/)를 열고 게시글을 생성, 수정, 삭제해 보세요. 게시글은 `build/db.mv.db` 파일에 저장됩니다. IntelliJ IDEA에서는 [Database 도구 창](https://www.jetbrains.com/help/idea/database-tool-window.html)에서 이 파일의 내용을 볼 수 있습니다.

![Database 도구 창](tutorial_persistence_database_tool_window.png){width="706"}