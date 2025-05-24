---
title: "Power-assert 編譯器外掛程式 (Compiler Plugin)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
Power-assert 編譯器外掛程式為 [實驗性功能](components-stability)。
它可能隨時變更。僅用於評估目的。
我們將感謝您在 [YouTrack](https://kotl.in/issue) 中提供的回饋。

Kotlin Power-assert 編譯器外掛程式透過提供具有上下文資訊的詳細失敗訊息來改善偵錯體驗。
它透過自動產生失敗訊息中的中間值，簡化了編寫測試的過程。
它可以幫助您了解測試失敗的原因，而無需複雜的斷言函式庫（assertion libraries）。

以下是外掛程式提供的範例訊息：

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

Power-assert 外掛程式的主要特性：

* **增強的錯誤訊息**：此外掛程式會擷取並顯示斷言中變數和子表達式的值，以清楚地識別失敗的原因。
* **簡化的測試**：自動產生資訊豐富的失敗訊息，減少對複雜斷言函式庫的需求。
* **支援多個函數**：預設情況下，它會轉換 `assert()` 函數呼叫，但也可以轉換其他函數，例如 `require()`、`check()` 和 `assertTrue()`。

## 應用此外掛程式

若要啟用 Power-assert 外掛程式，請如下配置您的 `build.gradle(.kts)` 檔案：

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

## 配置此外掛程式

Power-assert 外掛程式提供多個選項來自定義其行為：

* **`functions`**: 完整限定函數路徑的列表。Power-assert 外掛程式將轉換對這些函數的呼叫。如果未指定，則預設情況下只會轉換 `kotlin.assert()` 呼叫。
* **`includedSourceSets`**: Power-assert 外掛程式將轉換的 Gradle 原始碼集合（source sets）的列表。如果未指定，則預設情況下將轉換所有*測試原始碼集合*。

若要自定義行為，請將 `powerAssert {}` 程式碼區塊添加到您的建置腳本檔案：

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

由於此外掛程式是實驗性的，因此每次建置應用程式時都會看到警告。
若要排除這些警告，請在宣告 `powerAssert {}` 程式碼區塊之前新增此 `@OptIn` 註解：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 使用此外掛程式

本節提供使用 Power-assert 編譯器外掛程式的範例。

請參閱建置腳本檔案 `build.gradle.kts` 的完整程式碼，以了解所有這些範例：

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

### Assert 函數

考慮以下具有 `assert()` 函數的測試：

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

如果啟用了 Power-assert 外掛程式執行 `testFunction()` 測試，您將獲得明確的失敗訊息：

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

為了獲得更完整的錯誤訊息，請始終將變數內聯到測試函數參數中。
考慮以下測試函數：

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

所執行程式碼的輸出未提供足夠的資訊來找到問題的原因：

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

將變數內聯到 `assert()` 函數中：

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

執行後，您將獲得有關哪裡出錯的更明確的資訊：

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

### 超越 assert 函數

Power-assert 外掛程式可以轉換除預設轉換的 `assert` 之外的各種函數。
如果 `require()`、`check()`、`assertTrue()`、`assertEqual()` 等函數具有允許採用 `String` 或 `() `->` String` 值作為最後一個參數的形式，也可以轉換這些函數。

在測試中使用新函數之前，請在建置腳本檔案的 `powerAssert {}` 程式碼區塊中指定該函數。
例如，`require()` 函數：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

新增函數後，您可以在測試中使用它：

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

此範例的輸出使用 Power-assert 外掛程式來提供有關失敗測試的詳細資訊：

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

訊息顯示導致失敗的中間值，從而更容易偵錯。

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

### 軟斷言（Soft assertions）

Power-assert 外掛程式支援軟斷言，它不會立即導致測試失敗，而是收集斷言失敗並在測試執行結束時報告它們。
當您想要在單次執行中查看所有斷言失敗，而無需在第一次失敗時停止時，這非常有用。

若要啟用軟斷言，請實作您將收集錯誤訊息的方式：

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

將這些函數添加到 `powerAssert {}` 程式碼區塊，使其可用於 Power-assert 外掛程式：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

您應該指定宣告 `AssertScope.assert()` 函數的套件完整名稱。

:::

之後，您可以在測試程式碼中使用它：

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

在輸出中，所有 `assert()` 函數錯誤訊息將一個接一個地列印：

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

## 接下來

* 瀏覽一個[已啟用此外掛程式的簡單專案](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)和一個更[具有多個原始碼集合的複雜專案](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)。

  ```