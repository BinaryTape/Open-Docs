[//]: # (title: Exposed를 이용한 데이터베이스 영속성)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>사용된 라이브러리</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORM 프레임워크를 사용하여 웹사이트에 영속성을 추가하는 방법을 알아봅니다.</link-summary>

이 튜토리얼 시리즈에서는 Ktor에서 간단한 블로그 애플리케이션을 만드는 방법을 보여드립니다:
- 첫 번째 튜토리얼에서는 이미지 및 HTML 페이지와 같은 정적 콘텐츠를 호스팅하는 방법을 보여드렸습니다.
- 두 번째 튜토리얼에서는 FreeMarker 템플릿 엔진을 사용하여 애플리케이션에 상호 작용을 추가했습니다.
- **이 튜토리얼**에서는 Exposed 프레임워크를 사용하여 웹사이트에 영속성을 추가할 것입니다. H2 로컬 데이터베이스를 사용하여 게시물을 저장합니다.
- [다음 튜토리얼](db-connection-pooling-caching.md)에서는 HikariCP 및 Ehcache 라이브러리를 사용하여 각각 데이터베이스 연결 풀링 및 캐싱을 구현하는 방법을 살펴볼 것입니다.

## 종속성 추가 {id="add-dependencies"}

먼저, Exposed 및 H2 라이브러리에 대한 종속성을 추가해야 합니다. `gradle.properties` 파일을 열고 라이브러리 버전을 지정합니다:

```kotlin
```
{src="gradle.properties" include-lines="13-14"}

그런 다음, `build.gradle.kts`를 열고 다음 종속성을 추가합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/build.gradle.kts" include-lines="2-3,20-21,25-28,32"}

새로 추가된 종속성을 설치하려면 `build.gradle.kts` 파일의 오른쪽 상단 모서리에 있는 **Gradle 변경 로드** 아이콘을 클릭합니다.

## 모델 업데이트 {id="model"}

Exposed는 `org.jetbrains.exposed.sql.Table` 클래스를 데이터베이스 테이블로 사용합니다. `Article` 모델을 업데이트하려면 `models/Article.kt` 파일을 열고 기존 코드를 다음으로 바꿉니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/models/Article.kt"}

`id`, `title`, `body` 컬럼은 게시물에 대한 정보를 저장합니다. `id` 컬럼은 기본 키로 작동합니다.

> `Articles` 객체의 프로퍼티 [유형을 검사](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)하면 필요한 유형 인수를 가진 `Column` 유형임을 알 수 있습니다: `id`는 `Column<Int>` 유형을 가지며, `title`과 `body`는 모두 `Column<String>` 유형을 가집니다.
>
{type="tip"}

## 데이터베이스에 연결 {id="connect_db"}

[데이터 액세스 객체](https://en.wikipedia.org/wiki/Data_access_object)(DAO)는 특정 데이터베이스의 세부 정보를 노출하지 않고 데이터베이스에 대한 인터페이스를 제공하는 패턴입니다. 나중에 `DAOFacade` 인터페이스를 정의하여 데이터베이스에 대한 특정 요청을 추상화할 것입니다.

Exposed를 사용하는 모든 데이터베이스 액세스는 데이터베이스에 대한 연결을 얻음으로써 시작됩니다. 이를 위해 JDBC URL과 드라이버 클래스 이름을 `Database.connect` 함수에 전달합니다. `com.example` 안에 `dao` 패키지를 생성하고 새 `DatabaseSingleton.kt` 파일을 추가합니다. 그런 다음, 이 코드를 삽입합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="1-13,17,21"}

> `driverClassName`과 `jdbcURL`이 여기에 하드코딩되어 있습니다. Ktor는 이러한 설정을 [사용자 지정 구성 그룹](server-configuration-file.topic)으로 추출할 수 있게 합니다.

### 테이블 생성 {id="create_table"}

연결을 얻은 후, 모든 SQL 문은 트랜잭션 내에 배치되어야 합니다:

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

이 코드 샘플에서는 기본 데이터베이스가 `transaction` 함수에 명시적으로 전달됩니다. 데이터베이스가 하나만 있는 경우 생략할 수 있습니다. 이 경우 Exposed는 트랜잭션에 대해 마지막으로 연결된 데이터베이스를 자동으로 사용합니다.

> `Database.connect` 함수는 트랜잭션을 호출할 때까지 실제 데이터베이스 연결을 설정하지 않습니다. 이는 미래 연결에 대한 설명자만 생성합니다.

`Articles` 테이블이 이미 선언되어 있으므로, `init` 함수의 하단에서 `transaction` 호출로 래핑된 `SchemaUtils.create(Articles)`를 호출하여 데이터베이스에 이 테이블이 아직 존재하지 않는 경우 생성하도록 지시할 수 있습니다:

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

편의를 위해 `DatabaseSingleton` 객체 내부에 유틸리티 함수 `dbQuery`를 생성할 것입니다. 이 함수는 향후 데이터베이스에 대한 모든 요청에 사용될 것입니다. 트랜잭션을 사용하여 블로킹 방식으로 접근하는 대신, 코루틴을 활용하여 각 쿼리를 자체 코루틴에서 시작해봅시다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="19-20"}

최종 `DatabaseSingleton.kt` 파일은 다음과 같아야 합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt"}

### 시작 시 데이터베이스 구성 로드 {id="startup"}

마지막으로, 애플리케이션 시작 시 생성된 구성을 로드해야 합니다. `Application.kt`를 열고 `Application.module` 본문에서 `DatabaseSingleton.init`를 호출합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/Application.kt" include-lines="3,8-13"}

## 영속성 로직 구현 {id="persistence_logic"}

이제 게시물 업데이트에 필요한 작업을 추상화하는 인터페이스를 생성해봅시다. `dao` 패키지 안에 `DAOFacade.kt` 파일을 생성하고 다음 코드로 채웁니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacade.kt"}

모든 게시물을 나열하고, ID로 게시물을 보고, 새 게시물을 추가하고, 편집하거나 삭제해야 합니다. 이 모든 함수는 내부적으로 데이터베이스 쿼리를 수행하므로, 지연 함수(suspending functions)로 정의됩니다.

`DAOFacade` 인터페이스를 구현하려면, 인터페이스 이름에 캐럿을 놓고 인터페이스 옆의 노란색 전구 아이콘을 클릭한 다음 **인터페이스 구현(Implement interface)**을 선택합니다. 호출된 대화 상자에서 기본 설정을 그대로 두고 **확인(OK)**을 클릭합니다.

**멤버 구현(Implement Members)** 대화 상자에서 모든 함수를 선택하고 **확인(OK)**을 클릭합니다.

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA는 `dao` 패키지 안에 `DAOFacadeImpl.kt` 파일을 생성합니다. Exposed DSL을 사용하여 모든 함수를 구현해 봅시다.

### 모든 게시물 가져오기 {id="get_all"}

모든 항목을 반환하는 함수부터 시작해봅시다. 요청은 `dbQuery` 호출로 래핑됩니다. `Table.selectAll` 확장 함수를 호출하여 데이터베이스에서 모든 데이터를 가져옵니다. `Articles` 객체는 `Table`의 하위 클래스이므로, Exposed DSL 메서드를 사용하여 작업합니다.

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="1-18,45"}

`Table.selectAll`은 `Query` 인스턴스를 반환하므로, `Article` 인스턴스 목록을 얻으려면 각 행의 데이터를 수동으로 추출하여 데이터 클래스로 변환해야 합니다. 이는 `ResultRow`에서 `Article`을 빌드하는 도우미 함수 `resultRowToArticle`을 사용하여 수행합니다.

`ResultRow`는 배열이나 맵과 유사한 간결한 `get` 연산자를 사용하여 지정된 `Column`에 저장된 데이터를 가져오는 방법을 제공합니다.

> `Articles.id`의 유형은 `Column<Int>`이며, 이는 `Expression` 인터페이스를 구현합니다. 따라서 어떤 컬럼이든 표현식으로 전달할 수 있습니다.

### 게시물 가져오기 {id="get_article"}

이제 하나의 게시물을 반환하는 함수를 구현해봅시다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="20-25"}

`select` 함수는 확장 람다를 인수로 받습니다. 이 람다 내부의 암시적 수신자는 `SqlExpressionBuilder` 유형입니다. 이 유형을 명시적으로 사용하지는 않지만, 쿼리를 빌드하는 데 유용한 많은 컬럼 연산(`eq`, `less`, `greater`와 같은 비교, `plus`, `times`와 같은 산술 연산, 제공된 값 목록에 값이 속하거나 속하지 않는지 확인(`inList`, `notInList`), 값이 null 또는 null이 아닌지 확인 등)을 정의합니다.

`select`는 `Query` 값 목록을 반환합니다. 이전과 마찬가지로 이를 게시물로 변환합니다. 우리의 경우, 하나의 게시물이어야 하므로 결과를 반환합니다.

### 새 게시물 추가 {id="add_article"}

테이블에 새 게시물을 삽입하려면 람다 인수를 받는 `Table.insert` 함수를 사용합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="27-33"}

이 람다 내부에서, 어떤 컬럼에 어떤 값을 설정할지 지정합니다. `it` 인수는 `InsertStatement` 유형을 가지며, 컬럼과 값을 인수로 받는 `set` 연산자를 호출할 수 있습니다.

### 게시물 편집 {id="edit_article"}

기존 게시물을 업데이트하려면 `Table.update`를 사용합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="35-40"}

### 게시물 삭제 {id="delete_article"}

마지막으로, 데이터베이스에서 게시물을 제거하려면 `Table.deleteWhere`를 사용합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="42-44"}

### DAOFacade 초기화 {id="init-dao-facade"}

`DAOFacade` 인스턴스를 생성하고 애플리케이션 시작 전에 데이터베이스에 삽입될 샘플 게시물을 추가해 봅시다.
`DAOFacadeImpl.kt` 하단에 다음 코드를 추가합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="47-53"}

## 라우트 업데이트 {id="update_routes"}

이제 라우트 핸들러 내에서 구현된 데이터베이스 작업을 사용할 준비가 되었습니다.
`plugins/Routing.kt` 파일을 엽니다.
모든 게시물을 표시하려면 `get` 핸들러 내에서 `dao.allArticles`를 호출합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="22-24"}

새 게시물을 게시하려면 `post` 내에서 `dao.addNewArticle` 함수를 호출합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="28-34"}

표시 및 편집을 위한 게시물을 얻으려면 `get("{id}")` 및 `get("{id}/edit")` 내에서 각각 `dao.article`을 사용합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="35-42"}

마지막으로, `post("{id}")` 핸들러로 이동하여 `dao.editArticle`을 사용하여 게시물을 업데이트하고 `dao.deleteArticle`을 사용하여 삭제합니다:

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="43-58"}

> 이 튜토리얼의 최종 프로젝트는 여기에서 찾을 수 있습니다: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence).

## 애플리케이션 실행 {id="run_app"}

블로그 애플리케이션이 예상대로 작동하는지 확인해 봅시다. `Application.kt` 파일의 `fun main(...)` 옆에 있는 **실행(Run)** 버튼을 눌러 애플리케이션을 실행할 수 있습니다:

![Run Server](run-app.png){width="706"}

IntelliJ IDEA가 애플리케이션을 시작하고 몇 초 후에 앱이 실행 중이라는 확인 메시지가 표시됩니다:

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

브라우저에서 [`http://localhost:8080/`](http://localhost:8080/)를 열고 게시물을 생성, 편집, 삭제해 보세요. 게시물은 `build/db.mv.db` 파일에 저장됩니다. IntelliJ IDEA에서 이 파일의 내용을 [데이터베이스 도구 창](https://www.jetbrains.com/help/idea/database-tool-window.html)에서 볼 수 있습니다.

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}