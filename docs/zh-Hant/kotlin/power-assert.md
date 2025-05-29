[//]: # (title: Power-assert 編譯器外掛程式)

> Power-assert 編譯器外掛程式為 [實驗性](components-stability.md) 功能。
> 它可能隨時變更。僅用於評估目的。
> 歡迎在 [YouTrack](https://kotl.in/issue) 提供意見回饋。
>
{style="warning"}

Kotlin Power-assert 編譯器外掛程式透過提供包含上下文資訊的詳細失敗訊息，改善了偵錯體驗。它透過在失敗訊息中自動生成中間值，簡化了測試撰寫過程。它幫助您理解測試失敗的原因，而無需複雜的斷言函式庫。

這是該外掛程式提供的一個範例訊息：

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

Power-assert 外掛程式的主要功能：

*   **增強的錯誤訊息**：此外掛程式會擷取並顯示斷言中變數和子表達式的值，以明確識別失敗原因。
*   **簡化測試**：自動生成資訊豐富的失敗訊息，減少對複雜斷言函式庫的需求。
*   **支援多個函式**：預設情況下，它會轉換 `assert()` 函式呼叫，但也可以轉換其他函式，例如 `require()`、`check()` 和 `assertTrue()`。

## 套用外掛程式

若要啟用 Power-assert 外掛程式，請依照以下方式設定您的 `build.gradle(.kts)` 檔案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}
```

</tab>
</tabs>

## 設定外掛程式

Power-assert 外掛程式提供了幾個選項來自訂其行為：

*   **`functions`**：一個包含完全限定函式路徑的列表。Power-assert 外掛程式將轉換對這些函式的呼叫。如果未指定，預設只會轉換 `kotlin.assert()` 的呼叫。
*   **`includedSourceSets`**：一個 Gradle 原始碼集列表，Power-assert 外掛程式將對其進行轉換。如果未指定，預設將轉換所有 _測試原始碼集_。

若要自訂行為，請將 `powerAssert {}` 區塊新增到您的建置指令碼檔案中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
}
```

</tab>
</tabs>

由於此外掛程式是實驗性的，您每次建置應用程式時都會看到警告。若要排除這些警告，請在宣告 `powerAssert {}` 區塊之前新增此 `@OptIn` 註解：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 使用外掛程式

本節提供使用 Power-assert 編譯器外掛程式的範例。

請參閱 `build.gradle.kts` 建置指令碼檔案的完整程式碼以了解所有這些範例：

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

### `assert` 函式

考慮以下使用 `assert()` 函式的測試：

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

如果您在啟用 Power-assert 外掛程式的情況下執行 `testFunction()` 測試，您將收到明確的失敗訊息：

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

若要獲得更完整的錯誤訊息，請始終將變數內聯到測試函式參數中。考慮以下測試函式：

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

執行程式碼的輸出沒有提供足夠的資訊來找出問題的原因：

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

將變數內聯到 `assert()` 函式中：

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

執行後，您會得到關於出錯的更明確資訊：

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

### 除了 `assert` 函式以外

Power-assert 外掛程式可以轉換除預設轉換的 `assert` 之外的各種函式。如果 `require()`、`check()`、`assertTrue()`、`assertEqual()` 等函式具有允許將 `String` 或 `() -> String` 值作為最後一個參數的形式，它們也可以被轉換。

在測試中使用新函式之前，請在建置指令碼檔案的 `powerAssert {}` 區塊中指定該函式。例如，`require()` 函式：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

新增函式後，您可以在測試中使用它：

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

此範例的輸出使用了 Power-assert 外掛程式，提供了關於失敗測試的詳細資訊：

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

該訊息顯示了導致失敗的中間值，使偵錯變得更容易。

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

### 軟斷言

Power-assert 外掛程式支援軟斷言，它不會立即使測試失敗，而是收集斷言失敗並在測試執行結束時報告它們。當您想在一次執行中看到所有斷言失敗而無需在第一次失敗時停止時，這會很有用。

若要啟用軟斷言，請實作收集錯誤訊息的方式：

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

將這些函式新增到 `powerAssert {}` 區塊中，以便 Power-assert 外掛程式可以使用它們：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

> 您應該指定宣告 `AssertScope.assert()` 函式的套件完整名稱。
>
{style="tip"}

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

在輸出中，所有 `assert()` 函式錯誤訊息將一個接一個地印出：

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

## 下一步

*   瀏覽一個[啟用外掛程式的簡單專案](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)和一個[包含多個原始碼集的更複雜專案](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)。