[//]: # (title: Kotlin 및 JUnit을 사용하여 Java 코드 테스트하기 – 튜토리얼)

Kotlin은 Java와 완전히 상호 운용 가능하므로, Kotlin을 사용하여 Java 코드용 테스트를 작성하고 기존 Java 테스트와 함께 동일한 프로젝트에서 실행할 수 있습니다.

이 튜토리얼에서는 다음 방법을 배웁니다:

*   [JUnit 5](https://junit.org/junit5/)를 사용하여 테스트를 실행하도록 Java-Kotlin 혼합 프로젝트를 구성합니다.
*   Java 코드를 검증하는 Kotlin 테스트를 추가합니다.
*   Maven 또는 Gradle을 사용하여 테스트를 실행합니다.

> 시작하기 전에 다음을 확인하세요:
>
> *   Kotlin 플러그인이 번들로 포함된 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Community 또는 Ultimate 에디션)
> 또는 [Kotlin 확장](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start)이 설치된 [VS Code](https://code.visualstudio.com/Download).
> *   Java 17 이상
>
{style="note"}

## 프로젝트 구성

1.  IDE에서 버전 제어 시스템에서 샘플 프로젝트를 클론합니다:

    ```text
    https://github.com/kotlin-hands-on/kotlin-junit-sample.git
    ```

2.  `initial` 모듈로 이동하여 프로젝트 구조를 검토합니다:

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java 소스 코드
    │   │   └── test/java/    # Java로 작성된 JUnit 테스트
    │   ├── pom.xml           # Maven 구성
    │   └── build.gradle.kts  # Gradle 구성
    ```

    `initial` 모듈은 단일 테스트가 포함된 간단한 Java Todo 애플리케이션을 포함합니다.

3.  동일한 디렉터리에서 Maven의 경우 `pom.xml` 또는 Gradle의 경우 `build.gradle.kts` 빌드 파일을 열고 Kotlin을 지원하도록 내용을 업데이트합니다:

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml 파일"}

    *   `<properties>` 섹션에서 Kotlin 버전을 설정합니다.
    *   `<dependencies>` 섹션에서 JUnit Jupiter 의존성과 `kotlin-stdlib`(테스트 스코프)를 추가하여 Kotlin 테스트를 컴파일하고 실행합니다.
    *   `<build><plugins>` 섹션에서 `extensions`를 활성화한 `kotlin-maven-plugin`을 적용하고 Kotlin과 Java 모두에 대해 `sourceDirs`를 사용하여 `compile` 및 `test-compile` 실행을 구성합니다.
    *   확장 기능을 사용하는 Kotlin Maven 플러그인을 사용할 때는 `<build><pluginManagement>` 섹션에 `maven-compiler-plugin`을 추가할 필요가 없습니다.

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
    group = "org.jetbrains.kotlin"
    version = "1.0-SNAPSHOT"
    description = "kotlin-junit-complete"
    java.sourceCompatibility = JavaVersion.VERSION_17
    
    plugins {
        application
        kotlin("jvm") version "%kotlinVersion%"
    }

    kotlin {
        jvmToolchain(17)
    }

    application {
        mainClass.set("org.jetbrains.kotlin.junit.App")
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("com.gitlab.klamonte:jexer:1.6.0")

        testImplementation(kotlin("test"))
        testImplementation(libs.org.junit.jupiter.junit.jupiter.api)
        testImplementation(libs.org.junit.jupiter.junit.jupiter.params)
        testRuntimeOnly(libs.org.junit.jupiter.junit.jupiter.engine)
        testRuntimeOnly(libs.org.junit.platform.junit.platform.launcher)
    }

    tasks.test {
        useJUnitPlatform()
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts 파일"}

    *   `plugins {}` 블록에 `kotlin("jvm")` 플러그인을 추가합니다.
    *   JVM 툴체인 버전을 Java 버전과 일치시키세요.
    *   `dependencies {}` 블록에 Kotlin의 테스트 유틸리티를 제공하고 JUnit과 통합되는 `kotlin.test` 라이브러리를 추가합니다.

    </tab>
    </tabs>

4.  IDE에서 빌드 파일을 다시 로드합니다.

빌드 파일 설정에 대한 자세한 내용은 [프로젝트 구성](mixing-java-kotlin-intellij.md#project-configuration)을 참조하세요.

## 첫 번째 Kotlin 테스트 추가

`initial/src/test/java`의 `TodoItemTest.java` 테스트는 이미 앱의 기본 사항(항목 생성, 기본값, 고유 ID 및 상태 변경)을 검증합니다.

리포지토리 수준 동작을 검증하는 Kotlin 테스트를 추가하여 테스트 커버리지를 확장할 수 있습니다.

1.  동일한 테스트 소스 디렉터리인 `initial/src/test/java`로 이동합니다.
2.  Java 테스트와 동일한 패키지에 `TodoRepositoryTest.kt` 파일을 생성합니다.
3.  필드 선언 및 설정 함수를 사용하여 테스트 클래스를 생성합니다:

    ```kotlin
    package org.jetbrains.kotlin.junit

    import org.junit.jupiter.api.BeforeEach
    import org.junit.jupiter.api.Assertions
    import org.junit.jupiter.api.Test
    import org.junit.jupiter.api.DisplayName

    internal class TodoRepositoryTest {
        lateinit var repository: TodoRepository
        lateinit var testItem1: TodoItem
        lateinit var testItem2: TodoItem

        @BeforeEach
        fun setUp() {
            repository = TodoRepository()
            testItem1 = TodoItem("Task 1", "Description 1")
            testItem2 = TodoItem("Task 2", "Description 2")
        }
    }
    ```

    *   JUnit 5 어노테이션은 Kotlin에서도 Java와 동일하게 작동합니다.
    *   Kotlin에서 [`lateinit` 키워드](properties.md#late-initialized-properties-and-variables)는 나중에 초기화되는 non-null 프로퍼티를 선언할 수 있도록 합니다.
        이는 테스트에서 nullable 타입(`TodoRepository?`)을 사용할 필요가 없도록 도와줍니다.

4.  `TodoRepositoryTest` 클래스 내부에 초기 리포지토리 상태와 크기를 확인하는 테스트를 추가합니다:

    ```kotlin
    @Test
    @DisplayName("Should start with empty repository")
    fun shouldStartEmpty() {
        Assertions.assertEquals(0, repository.size())
        Assertions.assertTrue(repository.all.isEmpty())
    }
    ```

    *   Java의 정적 임포트와 달리, Jupiter의 `Assertions`는 클래스로 임포트되고 어설션 함수의 한정자로 사용됩니다.
    *   `.getAll()` 호출 대신, `repository.all`과 같이 Kotlin에서 Java getter를 프로퍼티로 접근할 수 있습니다.

5.  모든 항목에 대한 복사 동작을 검증하는 또 다른 테스트를 작성합니다:

    ```kotlin
    @Test
    @DisplayName("Should return defensive copy of items")
    fun shouldReturnDefensiveCopy() {
        repository.add(testItem1)

        val items1 = repository.all
        val items2 = repository.all

        Assertions.assertNotSame(items1, items2)
        Assertions.assertThrows(
            UnsupportedOperationException::class.java
        ) { items1.clear() }
        Assertions.assertEquals(1, repository.size())
    }
    ```

    *   Kotlin 클래스에서 Java 클래스 객체를 얻으려면 `::class.java`를 사용합니다.
    *   특별한 줄 연속 문자 없이 여러 줄에 걸쳐 복잡한 어설션을 나눌 수 있습니다.

6.  ID로 항목을 찾는 것을 검증하는 테스트를 추가합니다:

    ```kotlin
    @Test
    @DisplayName("Should find item by ID")
    fun shouldFindItemById() {
        repository.add(testItem1)
        repository.add(testItem2)

         val found = repository.getById(testItem1.id())

         Assertions.assertTrue(found.isPresent)
         Assertions.assertEquals(testItem1, found.get())
    }
    ```

    Kotlin은 Java [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html)와 원활하게 작동합니다.
    getter 메서드를 프로퍼티로 자동 변환하므로, 여기서는 `isPresent()` 메서드를 프로퍼티로 접근합니다.

7.  항목 제거 메커니즘을 검증하는 테스트를 작성합니다:

    ```kotlin
     @Test
     @DisplayName("Should remove item by ID")
     fun shouldRemoveItemById() {
         repository.add(testItem1)
         repository.add(testItem2)

         val removed = repository.remove(testItem1.id())

         Assertions.assertTrue(removed)
         Assertions.assertEquals(1, repository.size())
         Assertions.assertTrue(repository.getById(testItem1.id()).isEmpty)
         Assertions.assertTrue(repository.getById(testItem2.id()).isPresent)
     }
    
     @Test
     @DisplayName("Should return false when removing non-existent item")
     fun shouldReturnFalseForNonExistentRemoval() {
         repository.add(testItem1)

         val removed = repository.remove("non-existent-id")

         Assertions.assertFalse(removed)
         Assertions.assertEquals(1, repository.size())
     }
    ```

    Kotlin에서는 `repository.getById(id).isEmpty`와 같이 메서드 호출과 프로퍼티 접근을 연결할 수 있습니다.

> `TodoRepositoryTest` 테스트 클래스에 더 많은 테스트를 추가하여 추가 기능을 다룰 수 있습니다.
> 샘플 프로젝트의 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) 모듈에서 전체 소스 코드를 확인하세요.
>
{style="tip"}

## 테스트 실행

Java 및 Kotlin 테스트를 모두 실행하여 프로젝트가 예상대로 작동하는지 확인합니다:

1.  거터 아이콘을 사용하여 테스트를 실행합니다:

    ![Run the test](run-test.png)

    `initial` 디렉터리에서 명령줄을 사용하여 모든 프로젝트 테스트를 실행할 수도 있습니다:

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```bash
    mvn test
    ```

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```bash
    ./gradlew test
    ```

    </tab>
    </tabs>

2.  변수 값 중 하나를 변경하여 테스트가 올바르게 작동하는지 확인합니다.
    예를 들어, `shouldAddItem` 테스트를 수정하여 잘못된 리포지토리 크기를 예상하도록 합니다:

    ```kotlin
    @Test
    @DisplayName("Should add item to repository")
    fun shouldAddItem() {
        repository.add(testItem1)

        Assertions.assertEquals(2, repository.size())  // 1에서 2로 변경됨
        Assertions.assertTrue(repository.all.contains(testItem1))
    }
    ```

3.  테스트를 다시 실행하고 실패하는지 확인합니다:

    ![Check the test result. The test has failed](test-failed.png)

> 테스트가 완전히 구성된 프로젝트는 샘플 프로젝트의
> [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) 모듈에서 찾을 수 있습니다.
>
{style="tip"}

## 다른 테스트 라이브러리 탐색

JUnit 외에도 Kotlin과 Java를 모두 지원하는 다른 라이브러리를 사용할 수 있습니다:

| Library                                                     | Description                                                                                                        |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------
| [AssertJ](https://github.com/assertj/assertj)               | 체이닝 가능한 어설션을 제공하는 유창한 어설션 라이브러리.                                                                |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito의 Kotlin 래퍼로, 헬퍼 함수와 Kotlin 타입 시스템과의 더 나은 통합을 제공합니다.          |
| [MockK](https://github.com/mockk/mockk)                     | 코루틴 및 확장 함수를 포함한 Kotlin 특정 기능을 지원하는 네이티브 Kotlin 목킹 라이브러리. |
| [Kotest](https://github.com/kotest/kotest)                  | 다양한 어설션 스타일과 광범위한 매처 지원을 제공하는 Kotlin용 어설션 라이브러리.                     |
| [Strikt](https://github.com/robfletcher/strikt)             | 타입 안전 어설션과 데이터 클래스 지원을 제공하는 Kotlin용 어설션 라이브러리.                               |

## 다음 단계

*   [Kotlin의 Power-assert 컴파일러 플러그인](power-assert.md)으로 테스트 출력을 개선합니다.
*   Kotlin과 Spring Boot를 사용하여 첫 번째 [서버 측 애플리케이션을 생성합니다](jvm-get-started-spring-boot.md).
*   [`kotlin.test` 라이브러리](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)의 기능을 탐색합니다.