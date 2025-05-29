[//]: # (title: JVM에서 JUnit을 사용한 테스트 코드 – 튜토리얼)

이 튜토리얼에서는 Kotlin/JVM 프로젝트에서 간단한 단위 테스트를 작성하고 Gradle 빌드 도구로 실행하는 방법을 보여줍니다.

이 프로젝트에서는 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 라이브러리를 사용하고 JUnit을 사용하여 테스트를 실행합니다.
멀티플랫폼 앱으로 작업하는 경우 [Kotlin 멀티플랫폼 튜토리얼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)을 참조하세요.

시작하려면 먼저 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치하세요.

## 의존성 추가

1. IntelliJ IDEA에서 Kotlin 프로젝트를 엽니다. 프로젝트가 없는 경우 [하나 생성](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)하세요.

2. `build.gradle(.kts)` 파일을 열고 `testImplementation` 의존성이 있는지 확인합니다.
   이 의존성은 `kotlin.test` 및 `JUnit`과 함께 작업할 수 있도록 합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </tab>
   </tabs>

3. `build.gradle(.kts)` 파일에 `test` 태스크를 추가합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </tab>
   </tabs>

   > 빌드 스크립트에서 `useJUnitPlatform()` 함수를 사용하면 `kotlin-test` 라이브러리가 JUnit 5를 자동으로 의존성으로 포함합니다.
   > 이 설정은 JVM 전용 프로젝트와 Kotlin 멀티플랫폼(KMP) 프로젝트의 JVM 테스트에서 `kotlin-test` API와 함께 모든 JUnit 5 API에 대한 접근을 가능하게 합니다.
   >
   {style="note"}

다음은 `build.gradle.kts`의 전체 코드입니다.

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## 테스트할 코드 추가

1. `src/main/kotlin`에 있는 `Main.kt` 파일을 엽니다.

   `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다.
   `Main.kt` 파일에는 `Hello, World!`를 출력하는 샘플 코드가 있습니다.

2. 두 정수를 함께 더하는 `sum()` 함수가 포함된 `Sample` 클래스를 생성합니다.

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 테스트 생성

1. IntelliJ IDEA에서 `Sample` 클래스에 대해 **Code** | **Generate** | **Test...**를 선택합니다.

   ![Generate a test](generate-test.png)

2. 테스트 클래스의 이름을 지정합니다. 예를 들어, `SampleTest`입니다.

   ![Create a test](create-test.png)

   IntelliJ IDEA는 `test` 디렉터리에 `SampleTest.kt` 파일을 생성합니다.
   이 디렉터리에는 Kotlin 테스트 소스 파일과 리소스가 포함되어 있습니다.

   > `src/test/kotlin`에 테스트용 `*.kt` 파일을 수동으로 생성할 수도 있습니다.
   >
   {style="note"}

3. `SampleTest.kt` 파일의 `sum()` 함수에 대한 테스트 코드를 추가합니다.

   * [`@Test` 어노테이션](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html)을 사용하여 테스트 `testSum()` 함수를 정의합니다.
   * [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 함수를 사용하여 `sum()` 함수가 예상 값을 반환하는지 확인합니다.

   ```kotlin
   import org.example.Sample
   import org.junit.jupiter.api.Assertions.*
   import kotlin.test.Test

   class SampleTest {
       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## 테스트 실행

1. 거터 아이콘을 사용하여 테스트를 실행합니다.

   ![Run the test](run-test.png)

   > `./gradlew check` 명령을 사용하여 명령줄 인터페이스를 통해 모든 프로젝트 테스트를 실행할 수도 있습니다.
   >
   {style="note"}

2. **Run** 도구 창에서 결과를 확인합니다.

   ![Check the test result. The test passed successfully](test-successful.png)

   테스트 함수가 성공적으로 실행되었습니다.

3. `expected` 변수 값을 43으로 변경하여 테스트가 올바르게 작동하는지 확인합니다.

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 테스트를 다시 실행하고 결과를 확인합니다.

   ![Check the test result. The test has failed](test-failed.png)

   테스트 실행이 실패했습니다.

## 다음 단계

첫 번째 테스트를 마쳤다면 다음을 수행할 수 있습니다.

* 다른 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 함수를 사용하여 더 많은 테스트를 작성합니다.
   예를 들어, [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 함수를 사용합니다.
* [Kotlin Power-assert 컴파일러 플러그인](power-assert.md)으로 테스트 출력을 개선합니다.
   이 플러그인은 테스트 출력에 컨텍스트 정보를 추가하여 풍부하게 만듭니다.
* Kotlin 및 Spring Boot로 [첫 번째 서버 측 애플리케이션](jvm-get-started-spring-boot.md)을 생성합니다.