---
title: "Power-assert 컴파일러 플러그인"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
Power-assert 컴파일러 플러그인은 [실험적](components-stability)입니다.
언제든지 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://kotl.in/issue)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin Power-assert 컴파일러 플러그인은 상황별 정보를 담은 자세한 실패 메시지를 제공하여 디버깅 경험을 개선합니다.
실패 메시지에서 중간값을 자동으로 생성하여 테스트 작성 프로세스를 간소화합니다.
복잡한 어설션 라이브러리가 없어도 테스트 실패 원인을 파악하는 데 도움이 됩니다.

다음은 플러그인에서 제공하는 예시 메시지입니다.

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

Power-assert 플러그인의 주요 기능:

* **향상된 오류 메시지**: 플러그인은 어설션 내에서 변수 및 하위 표현식의 값을 캡처하여 표시하므로 실패 원인을 명확하게 식별할 수 있습니다.
* **간소화된 테스트**: 유익한 실패 메시지를 자동으로 생성하므로 복잡한 어설션 라이브러리가 필요하지 않습니다.
* **다양한 함수 지원**: 기본적으로 `assert()` 함수 호출을 변환하지만 `require()`, `check()`, `assertTrue()`와 같은 다른 함수도 변환할 수 있습니다.

## 플러그인 적용

Power-assert 플러그인을 활성화하려면 다음과 같이 `build.gradle(.kts)` 파일을 구성합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}
```

</TabItem>
</Tabs>

## 플러그인 구성

Power-assert 플러그인은 동작을 사용자 지정할 수 있는 여러 옵션을 제공합니다.

* **`functions`**: 정규화된 함수 경로 목록입니다. Power-assert 플러그인은 이러한 함수에 대한 호출을 변환합니다. 지정하지 않으면 `kotlin.assert()` 호출만 기본적으로 변환됩니다.
* **`includedSourceSets`**: Power-assert 플러그인이 변환할 Gradle 소스 세트 목록입니다. 지정하지 않으면 모든 _테스트 소스 세트_가 기본적으로 변환됩니다.

동작을 사용자 지정하려면 `powerAssert {}` 블록을 빌드 스크립트 파일에 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle
powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
```

</TabItem>
</Tabs>

플러그인은 실험적이기 때문에 앱을 빌드할 때마다 경고가 표시됩니다.
이러한 경고를 제외하려면 `powerAssert {}` 블록을 선언하기 전에 이 `@OptIn` 어노테이션을 추가합니다.

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 플러그인 사용

이 섹션에서는 Power-assert 컴파일러 플러그인 사용 예를 제공합니다.

이러한 모든 예제에 대한 빌드 스크립트 파일 `build.gradle.kts`의 전체 코드를 참조하십시오.

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.1.20"
    kotlin("plugin.power-assert") version "2.1.20"
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

### Assert 함수

`assert()` 함수를 사용하는 다음 테스트를 고려해 보겠습니다.

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

Power-assert 플러그인을 활성화한 상태로 `testFunction()` 테스트를 실행하면 명시적인 실패 메시지가 표시됩니다.

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

더 완전한 오류 메시지를 얻으려면 항상 변수를 테스트 함수 매개변수에 인라인합니다.
다음 테스트 함수를 고려하십시오.

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

실행된 코드의 출력은 문제의 원인을 찾는 데 충분한 정보를 제공하지 않습니다.

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

변수를 `assert()` 함수에 인라인합니다.

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

실행 후 문제가 발생한 원인에 대한 더 명시적인 정보를 얻을 수 있습니다.

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

### Assert 함수 외

Power-assert 플러그인은 기본적으로 변환되는 `assert` 외에도 다양한 함수를 변환할 수 있습니다.
`require()`, `check()`, `assertTrue()`, `assertEqual()`과 같은 함수도 `String` 또는 `() `->` String` 값을 마지막 매개변수로 사용할 수 있는 형식이면 변환할 수 있습니다.

테스트에서 새 함수를 사용하기 전에 빌드 스크립트 파일의 `powerAssert {}` 블록에서 해당 함수를 지정합니다.
예를 들어 `require()` 함수는 다음과 같습니다.

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

함수를 추가한 후 테스트에서 사용할 수 있습니다.

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

이 예제의 출력은 Power-assert 플러그인을 사용하여 실패한 테스트에 대한 자세한 정보를 제공합니다.

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

메시지는 실패로 이어지는 중간값을 보여 주므로 디버깅이 더 쉬워집니다.

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

Power-assert 플러그인은 소프트 어설션을 지원합니다. 소프트 어설션은 테스트를 즉시 실패시키지 않고 어설션 실패를 수집하여 테스트 실행이 끝날 때 보고합니다.
이는 첫 번째 실패 시 중단하지 않고 단일 실행에서 모든 어설션 실패를 확인하려는 경우에 유용할 수 있습니다.

소프트 어설션을 활성화하려면 오류 메시지를 수집할 방법을 구현합니다.

```kotlin
fun <R> assertSoftly(block: AssertScope.() `->` R): R {
    val scope = AssertScopeImpl()
    val result = scope.block()
    if (scope.errors.isNotEmpty()) {
        throw AssertionError(scope.errors.joinToString("
"))
    }
    return result
}

interface AssertScope {
    fun assert(assertion: Boolean, message: (() `->` String)? = null)
}

class AssertScopeImpl : AssertScope {
    val errors = mutableListOf<String>()
    override fun assert(assertion: Boolean, message: (() `->` String)?) {
        if (!assertion) {
            errors.add(message?.invoke() ?: "Assertion failed")
        }
    }
}
```

이러한 함수를 `powerAssert {}` 블록에 추가하여 Power-assert 플러그인에서 사용할 수 있도록 합니다.

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

`AssertScope.assert()` 함수를 선언하는 패키지의 전체 이름을 지정해야 합니다.

:::

그런 다음 테스트 코드에서 사용할 수 있습니다.

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

출력에서 모든 `assert()` 함수 오류 메시지가 차례로 인쇄됩니다.

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

* [플러그인이 활성화된 간단한 프로젝트](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)와 [여러 소스 세트가 있는 더 복잡한 프로젝트](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)를 살펴보십시오.

  ```