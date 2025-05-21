---
title: "JVM에서 JUnit을 사용하여 테스트 코드 작성 - 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

이 튜토리얼에서는 Kotlin/JVM 프로젝트에서 간단한 단위 테스트를 작성하고 Gradle 빌드 도구로 실행하는 방법을 보여줍니다.

이 프로젝트에서는 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 라이브러리를 사용하고 JUnit을 사용하여 테스트를 실행합니다.
멀티플랫폼 앱에서 작업하는 경우 [Kotlin Multiplatform 튜토리얼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)을 참조하세요.

시작하려면 먼저 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치합니다.

## 종속성 추가

1. IntelliJ IDEA에서 Kotlin 프로젝트를 엽니다. 프로젝트가 없는 경우
   [프로젝트를 생성합니다](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project).

2. `build.gradle(.kts)` 파일을 열고 `testImplementation` 종속성이 있는지 확인합니다.
   이 종속성을 사용하면 `kotlin.test` 및 `JUnit`을 사용할 수 있습니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </TabItem>
   </Tabs>

3. `build.gradle(.kts)` 파일에 `test` 작업을 추가합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </TabItem>
   </Tabs>

   > 빌드 스크립트에서 `useJUnitPlatform()` 함수를 사용하는 경우
   > `kotlin-test` 라이브러리는 JUnit 5를 종속성으로 자동 포함합니다.
   > 이 설정을 통해 Kotlin Multiplatform (KMP) 프로젝트의 JVM 전용 프로젝트 및 JVM 테스트에서
   > `kotlin-test` API와 함께 모든 JUnit 5 API에 액세스할 수 있습니다.
   >
   

다음은 `build.gradle.kts`에 대한 전체 코드입니다.

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
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

## 테스트할 코드 추가

1. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.

   `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다.
   `Main.kt` 파일에는 `Hello, World!`를 출력하는 샘플 코드가 포함되어 있습니다.

2. 두 정수를 더하는 `sum()` 함수가 있는 `Sample` 클래스를 만듭니다.

   ```kotlin
   class Sample() {

       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 테스트 생성

1. IntelliJ IDEA에서 `Sample` 클래스에 대해 **Code** | **Generate** | **Test...**를 선택합니다.

   <img src="/img/generate-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

2. 테스트 클래스의 이름을 지정합니다. 예를 들어 `SampleTest`입니다.

   <img src="/img/create-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

   IntelliJ IDEA는 `test` 디렉터리에 `SampleTest.kt` 파일을 만듭니다.
   이 디렉터리에는 Kotlin 테스트 소스 파일과 리소스가 포함되어 있습니다.

   > `src/test/kotlin`에서 테스트를 위한 `*.kt` 파일을 수동으로 만들 수도 있습니다.
   >
   

3. `SampleTest.kt`에서 `sum()` 함수에 대한 테스트 코드를 추가합니다.

   * [`@Test` annotation](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html)을 사용하여 테스트 `testSum()` 함수를 정의합니다.
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

   <img src="/img/run-test.png" alt="Run the test" style={{verticalAlign: 'middle'}}/>

   > `./gradlew check` 명령을 사용하여 명령줄 인터페이스를 통해 모든 프로젝트 테스트를 실행할 수도 있습니다.
   >
   

2. **Run** 도구 창에서 결과를 확인합니다.

   <img src="/img/test-successful.png" alt="Check the test result. The test passed successfully" style={{verticalAlign: 'middle'}}/>

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

   <img src="/img/test-failed.png" alt="Check the test result. The test has failed" style={{verticalAlign: 'middle'}}/>

   테스트 실행에 실패했습니다.

## 다음 단계

첫 번째 테스트를 완료했으면 다음을 수행할 수 있습니다.

* 다른 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 함수를 사용하여 더 많은 테스트를 작성합니다.
   예를 들어 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 함수를 사용합니다.
* [Kotlin Power-assert 컴파일러 플러그인](power-assert)으로 테스트 출력을 개선합니다.
   이 플러그인은 컨텍스트 정보로 테스트 출력을 풍부하게 합니다.
* Kotlin 및 Spring Boot를 사용하여 [첫 번째 서버 측 애플리케이션 만들기](jvm-get-started-spring-boot).
  ```