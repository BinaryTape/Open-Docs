[//]: # (title: Power-assert コンパイラープラグイン)

> Power-assert コンパイラープラグインは[実験的](components-stability.md)な機能です。
> これはいつでも変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin Power-assert コンパイラープラグインは、コンテキスト情報を含む詳細な失敗メッセージを提供することで、デバッグ体験を向上させます。
失敗メッセージに中間値を自動生成することで、テスト記述のプロセスを簡素化します。
これにより、複雑なアサーションライブラリを必要とせずに、テストがなぜ失敗したのかを理解するのに役立ちます。

以下は、プラグインによって提供されるメッセージの例です。

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

Power-assert プラグインの主な機能：

*   **強化されたエラーメッセージ**: プラグインは、アサーション内の変数やサブ式の値をキャプチャして表示し、失敗の原因を明確に特定します。
*   **テストの簡素化**: 有益な失敗メッセージを自動生成し、複雑なアサーションライブラリの必要性を減らします。
*   **複数の関数のサポート**: デフォルトでは `assert()` 関数呼び出しを変換しますが、`require()`、`check()`、`assertTrue()` などの他の関数も変換できます。

## プラグインの適用

Power-assert プラグインを有効にするには、`build.gradle(.kts)` ファイルを次のように設定します。

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

## プラグインの設定

Power-assert プラグインは、その動作をカスタマイズするためのいくつかのオプションを提供します。

*   **`functions`**: 完全修飾関数パスのリストです。Power-assert プラグインは、これらの関数への呼び出しを変換します。指定しない場合、デフォルトでは `kotlin.assert()` 呼び出しのみが変換されます。
*   **`includedSourceSets`**: Power-assert プラグインが変換する Gradle ソースセットのリストです。指定しない場合、デフォルトではすべての _テストソースセット_ が変換されます。

動作をカスタマイズするには、ビルドスクリプトファイルに `powerAssert {}` ブロックを追加します。

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
```

</tab>
</tabs>

このプラグインは実験的なため、アプリをビルドするたびに警告が表示されます。
これらの警告を除外するには、`powerAssert {}` ブロックを宣言する前にこの `@OptIn` アノテーションを追加します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## プラグインの使用

このセクションでは、Power-assert コンパイラープラグインの使用例をいくつか示します。

これらのすべての例について、ビルドスクリプトファイル `build.gradle.kts` の完全なコードを参照してください。

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

### assert 関数

`assert()` 関数を使用した次のテストを検討してください。

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

Power-assert プラグインを有効にして `testFunction()` テストを実行すると、明示的な失敗メッセージが表示されます。

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

より完全なエラーメッセージを取得するには、変数を常にテスト関数パラメーターにインライン化してください。
次のテスト関数を検討してください。

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

実行されたコードの出力は、問題の原因を見つけるのに十分な情報を提供しません。

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

変数を `assert()` 関数にインライン化します。

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

実行後、何がうまくいかなかったかについて、より明示的な情報が得られます。

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

### assert 関数以外

Power-assert プラグインは、デフォルトで変換される `assert` 以外にもさまざまな関数を変換できます。
`require()`、`check()`、`assertTrue()`、`assertEqual()` などの関数も、最後のパラメーターとして `String` または `() -> String` の値を受け取る形式であれば変換できます。

テストで新しい関数を使用する前に、ビルドスクリプトファイルの `powerAssert {}` ブロックで関数を指定します。
たとえば、`require()` 関数です。

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

関数を追加した後、テストで使用できます。

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

この例の出力は、Power-assert プラグインを使用して、失敗したテストに関する詳細情報を提供します。

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

このメッセージは、失敗につながる中間値を示しており、デバッグを容易にします。

<!-- ### 関数呼び出しのトレース

このプラグインは、Rust の `dbg!` マクロに似た関数呼び出しのトレースをサポートしています。
これを使用して、関数呼び出しとその結果をトレースして出力します。

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

出力は関数呼び出しの中間結果を示します。

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

### ソフトアサーション

Power-assert プラグインはソフトアサーションをサポートしています。これはテストをすぐに失敗させるのではなく、アサーションの失敗を収集し、テスト実行の最後に報告します。
これは、最初の失敗で停止することなく、1回の実行ですべてのアサーションの失敗を確認したい場合に役立ちます。

ソフトアサーションを有効にするには、エラーメッセージを収集する方法を実装します。

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

これらの関数を `powerAssert {}` ブロックに追加して、Power-assert プラグインで使用できるようにします。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

> `AssertScope.assert()` 関数を宣言するパッケージの完全名を指定する必要があります。
>
{style="tip"}

その後、テストコードでそれを使用できます。

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

出力では、すべての `assert()` 関数のエラーメッセージが次々に表示されます。

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

## 次にすること

*   プラグインが有効になっている[シンプルなプロジェクト](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)と、[複数のソースセットを持つより複雑なプロジェクト](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)を参照してください。