---
title: "Power-assert 编译器插件"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
Power-assert 编译器插件是[实验性的](components-stability)。
它可能随时更改。仅用于评估目的。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中提供反馈。

Kotlin Power-assert 编译器插件通过提供带有上下文信息的详细失败消息来改善调试体验。
它通过自动生成失败消息中的中间值来简化编写测试的过程。
它可以帮助您了解测试失败的原因，而无需复杂的断言库。

以下是插件提供的示例消息：

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

Power-assert 插件的主要功能：

* **增强的错误消息**：该插件捕获并显示断言中变量和子表达式的值，以清楚地识别失败的原因。
* **简化的测试**：自动生成信息丰富的失败消息，从而减少了对复杂断言库的需求。
* **支持多个函数**：默认情况下，它转换 `assert()` 函数调用，但也可以转换其他函数，例如 `require()`、`check()` 和 `assertTrue()`。

## 应用插件

要启用 Power-assert 插件，请按如下方式配置您的 `build.gradle(.kts)` 文件：

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

## 配置插件

Power-assert 插件提供了几个选项来自定义其行为：

* **`functions`**: 完全限定函数路径的列表。Power-assert 插件将转换对这些函数的调用。如果未指定，则默认情况下仅转换 `kotlin.assert()` 调用。
* **`includedSourceSets`**: Power-assert 插件将转换的 Gradle 源集（source set）的列表。如果未指定，则默认情况下将转换所有*测试源集（test source set）*。

要自定义行为，请将 `powerAssert {}` 块添加到您的构建脚本文件：

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

由于该插件是实验性的，因此每次构建应用程序时都会看到警告。
要排除这些警告，请在声明 `powerAssert {}` 块之前添加此 `@OptIn` 注解：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 使用插件

本节提供了使用 Power-assert 编译器插件的示例。

请参阅构建脚本文件 `build.gradle.kts` 的完整代码，以获取所有这些示例：

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

### Assert 函数

考虑以下带有 `assert()` 函数的测试：

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

如果启用了 Power-assert 插件运行 `testFunction()` 测试，您将获得显式的失败消息：

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

为了获得更完整的错误消息，请始终将变量内联到测试函数参数中。
考虑以下测试函数：

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

执行的代码的输出没有提供足够的信息来查找问题的原因：

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

将变量内联到 `assert()` 函数中：

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

执行后，您将获得关于哪里出错的更明确的信息：

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

### Beyond assert 函数

Power-assert 插件可以转换除默认转换的 `assert` 之外的各种函数。
如果函数具有允许将 `String` 或 `() `->` String` 值作为最后一个参数的形式，则还可以转换诸如 `require()`，`check()`，`assertTrue()`，`assertEqual()` 之类的函数。

在测试中使用新函数之前，请在构建脚本文件的 `powerAssert {}` 块中指定该函数。
例如，`require()` 函数：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

添加函数后，您可以在测试中使用它：

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

此示例的输出使用 Power-assert 插件来提供有关失败测试的详细信息：

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

该消息显示了导致失败的中间值，从而使调试更加容易。

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

### 软断言

Power-assert 插件支持软断言（soft assertion），该断言不会立即导致测试失败，而是收集断言失败并在测试运行结束时报告它们。
当您想在一次运行中查看所有断言失败，而无需在第一次失败时停止时，这很有用。

要启用软断言（soft assertion），请实现您将收集错误消息的方式：

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

将这些函数添加到 `powerAssert {}` 块，以使其可用于 Power-assert 插件：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

您应该指定声明 `AssertScope.assert()` 函数的包的完整名称。

:::

之后，您可以在测试代码中使用它：

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

在输出中，所有 `assert()` 函数错误消息将一个接一个地打印：

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

## 接下来做什么

* 查看 [启用了该插件的简单项目](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets) 和一个更[具有多个源集（source set）的复杂项目](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)。

  ```