[//]: # (title: Power-assert 컴파일러 플러그인)

> Power-assert 컴파일러 플러그인은 [실험적(Experimental)](components-stability.md) 기능입니다.
> 언제든지 변경될 수 있습니다. 평가 목적으로만 사용하세요.
> [YouTrack](https://kotl.in/issue)에 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin Power-assert 컴파일러 플러그인은 컨텍스트 정보를 담은 상세한 실패 메시지를 제공하여 디버깅 경험을 개선합니다.
실패 메시지에 중간 값을 자동으로 생성하여 테스트 작성 과정을 간소화합니다.
복잡한 어설션 라이브러리가 필요 없이 테스트가 실패한 이유를 이해하는 데 도움이 됩니다.

다음은 플러그인이 제공하는 예시 메시지입니다:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

Power-assert 플러그인의 주요 기능은 다음과 같습니다:

*   **개선된 오류 메시지**: 플러그인은 어설션 내 변수와 하위 표현식의 값을 캡처하여 표시함으로써 실패 원인을 명확하게 식별할 수 있도록 합니다.
*   **간소화된 테스트**: 정보가 풍부한 실패 메시지를 자동으로 생성하여 복잡한 어설션 라이브러리의 필요성을 줄입니다.
*   **다양한 함수 지원**: 기본적으로 `assert()` 함수 호출을 변환하지만, `require()`, `check()`, `assertTrue()`와 같은 다른 함수도 변환할 수 있습니다.

## 플러그인 적용

Power-assert 플러그인을 활성화하려면 `build.gradle(.kts)` 파일을 다음과 같이 구성하세요:

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}
```

</tab>
<tab title="그루비" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}
```

</tab>
</tabs>

## 플러그인 구성

Power-assert 플러그인은 동작을 사용자 정의할 수 있는 몇 가지 옵션을 제공합니다:

*   **`functions`**: 완전한 자격이 부여된(fully-qualified) 함수 경로 목록입니다. Power-assert 플러그인은 이러한 함수 호출을 변환합니다. 지정하지 않으면 기본적으로 `kotlin.assert()` 호출만 변환됩니다.
*   **`includedSourceSets`**: Power-assert 플러그인이 변환할 Gradle 소스 세트 목록입니다. 지정하지 않으면 기본적으로 모든 _테스트 소스 세트_가 변환됩니다.

동작을 사용자 정의하려면 `build script` 파일에 `powerAssert {}` 블록을 추가하세요:

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

```kotlin
// build.gradle.kts
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</tab>
<tab title="그루비" group-key="groovy">

```groovy
// build.gradle
powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
```

</tab>
</tabs>

플러그인이 실험적이기 때문에 앱을 빌드할 때마다 경고가 표시됩니다.
이 경고를 제외하려면 `powerAssert {}` 블록을 선언하기 전에 `@OptIn` 어노테이션을 추가하세요:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 플러그인 사용

이 섹션에서는 Power-assert 컴파일러 플러그인 사용 예시를 제공합니다.

이 모든 예시의 `build.gradle.kts` 빌드 스크립트 파일의 전체 코드를 확인하세요:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
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

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertEquals", "kotlin.test.assertTrue", "kotlin.test.assertNull", "kotlin.require", "org.example.AssertScope.assert")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

### Assert 함수

`assert()` 함수를 사용한 다음 테스트를 고려해 보세요:

```kotlin
import kotlin.test.Test

class SampleTest {

    @Test
    fun testFunction() {
        val hello = "Hello"
        val world = "world!"
        assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
    }
}
```

Power-assert 플러그인을 활성화한 상태에서 `testFunction()` 테스트를 실행하면 명시적인 실패 메시지가 표시됩니다:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

더 완전한 오류 메시지를 얻으려면 항상 변수를 테스트 함수 파라미터로 인라인하세요.
다음 테스트 함수를 고려해 보세요:

```kotlin
class ComplexExampleTest {

    data class Person(val name: String, val age: Int)
 
    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        val isValidName = person.name.startsWith("A") && person.name.length > 3
        val isValidAge = person.age in 21..28
        assert(isValidName && isValidAge)
    }
}
```

실행된 코드의 출력은 문제의 원인을 찾는 데 충분한 정보를 제공하지 않습니다:

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

`assert()` 함수에 변수를 인라인하세요:

```kotlin
class ComplexExampleTest {

    data class Person(val name: String, val age: Int)

    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
    }
}
```

실행 후, 무엇이 잘못되었는지에 대한 더 명시적인 정보를 얻을 수 있습니다:

```text
Assertion failed
assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
       |      |    |                  |      |    |      |      |      |   |
       |      |    |                  |      |    |      |      |      |   false
       |      |    |                  |      |    |      |      |      10
       |      |    |                  |      |    |      |      Person(name=Alice, age=10)
       |      |    |                  |      |    |      true
       |      |    |                  |      |    5
       |      |    |                  |      Alice
       |      |    |                  Person(name=Alice, age=10)
       |      |    true
       |      Alice
       Person(name=Alice, age=10)
```

### assert 함수 외

Power-assert 플러그인은 기본적으로 변환되는 `assert` 외에도 다양한 함수를 변환할 수 있습니다.
`require()`, `check()`, `assertTrue()`, `assertEqual()` 등과 같은 함수도 마지막 파라미터로 `String` 또는 `() -> String` 값을 받을 수 있는 형태라면 변환될 수 있습니다.

테스트에서 새 함수를 사용하기 전에 빌드 스크립트 파일의 `powerAssert {}` 블록에 해당 함수를 지정하세요.
예를 들어, `require()` 함수:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

함수를 추가한 후 테스트에서 사용할 수 있습니다:

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

이 예시의 출력은 Power-assert 플러그인을 사용하여 실패한 테스트에 대한 상세 정보를 제공합니다:

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

메시지는 실패로 이어진 중간 값을 보여주어 디버깅을 더 쉽게 만듭니다.

<!-- ### Function call tracing

The plugin supports function call tracing, which is similar to Rust's `dbg!` macro.
Use it to trace and print function calls and their results:

```kotlin
class FunctionTrailingExampleTest {

    fun exampleFunction(x: Int, y: Int): Int {
        return x + y
    }

    @Test
    fun testFunctionCallTracing() {
        assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
    }
}
```

The output shows the intermediate results of functions calls:

```text
Assertion failed
assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
       |                     | |                     |
       |                     | |                     false
       |                     | 3
       |                     | FunctionTrailingExampleTest@533bda92
       |                     8
       5
       FunctionTrailingExampleTest@533bda92
```
-->

### 소프트 어설션

Power-assert 플러그인은 소프트 어설션(soft assertion)을 지원합니다. 이는 테스트를 즉시 실패시키지 않고, 어설션 실패를 수집하여 테스트 실행이 끝날 때 보고합니다.
이는 첫 번째 실패에서 멈추지 않고 한 번의 실행으로 모든 어설션 실패를 보고 싶을 때 유용할 수 있습니다.

소프트 어설션을 활성화하려면 오류 메시지를 수집하는 방식을 구현하세요:

```kotlin
fun <R> assertSoftly(block: AssertScope.() -> R): R {
    val scope = AssertScopeImpl()
    val result = scope.block()
    if (scope.errors.isNotEmpty()) {
        throw AssertionError(scope.errors.joinToString("
"))
    }
    return result
}

interface AssertScope {
    fun assert(assertion: Boolean, message: (() -> String)? = null)
}

class AssertScopeImpl : AssertScope {
    val errors = mutableListOf<String>()
    override fun assert(assertion: Boolean, message: (() -> String)?) {
        if (!assertion) {
            errors.add(message?.invoke() ?: "Assertion failed")
        }
    }
}
```

이 함수들을 Power-assert 플러그인에서 사용할 수 있도록 `powerAssert {}` 블록에 추가하세요:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

> `AssertScope.assert()` 함수를 선언한 패키지의 전체 이름을 지정해야 합니다.
>
{style="tip"}

그 후, 테스트 코드에서 이를 사용할 수 있습니다:

```kotlin
// Import the assertSoftly() function
import org.example.assertSoftly
        
class SoftAssertExampleTest1 {

    data class Employee(val name: String, val age: Int, val salary: Int)

    @Test
    fun `test employees data`() {
        val employees = listOf(
            Employee("Alice", 30, 60000),
            Employee("Bob", 45, 80000),
            Employee("Charlie", 55, 40000),
            Employee("Dave", 150, 70000)
        )

        assertSoftly {
            for (employee in employees) {
                assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
                assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
            }
        }
    }
}
```

출력에서는 모든 `assert()` 함수 오류 메시지가 연속적으로 출력됩니다:

```text
Charlie has an invalid salary: 40000
assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
       |        |      |
       |        |      false
       |        40000
       Employee(name=Charlie, age=55, salary=40000)
Dave has an invalid age: 150
assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
       |        |   |
       |        |   false
       |        150
       Employee(name=Dave, age=150, salary=70000)
```

## 다음 단계

*   플러그인이 활성화된 [간단한 프로젝트](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)와 [여러 소스 세트가 있는 더 복잡한 프로젝트](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)를 살펴보세요.