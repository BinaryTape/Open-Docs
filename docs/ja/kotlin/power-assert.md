---
title: Power-assertコンパイラプラグイン
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
Power-assertコンパイラプラグインは[Experimental（試験的機能）](components-stability)です。
これはいつでも変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。

Kotlin Power-assertコンパイラプラグインは、コンテキスト情報を含む詳細なエラーメッセージを提供することで、デバッグエクスペリエンスを向上させます。
エラーメッセージで中間値を自動的に生成することで、テストの作成プロセスを簡素化します。
複雑なアサーションライブラリを必要とせずに、テストが失敗した理由を理解するのに役立ちます。

これは、プラグインによって提供されるメッセージの例です。

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

Power-assertプラグインの主な機能：

* **強化されたエラーメッセージ**: このプラグインは、アサーション内の変数とサブ式Valueを取得して表示し、失敗の原因を明確に特定します。
* **簡素化されたテスト**: 有益なエラーメッセージを自動的に生成し、複雑なアサーションライブラリの必要性を軽減します。
* **複数の関数のサポート**: デフォルトでは、`assert()`関数呼び出しを変換しますが、`require()`、`check()`、`assertTrue()`などの他の関数も変換できます。

## プラグインの適用

Power-assertプラグインを有効にするには、`build.gradle(.kts)`ファイルを次のように構成します。

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

## プラグインの設定

Power-assertプラグインには、その動作をカスタマイズするためのいくつかのオプションが用意されています。

* **`functions`**: 完全修飾関数パスのリスト。Power-assertプラグインは、これらの関数への呼び出しを変換します。指定しない場合、`kotlin.assert()`呼び出しのみがデフォルトで変換されます。
* **`includedSourceSets`**: Power-assertプラグインが変換するGradleソースセットのリスト。指定しない場合、すべての_テストソースセット_がデフォルトで変換されます。

動作をカスタマイズするには、`powerAssert {}`ブロックをビルドスクリプトファイルに追加します。

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

このプラグインはExperimentalであるため、アプリをビルドするたびに警告が表示されます。
これらの警告を除外するには、`powerAssert {}`ブロックを宣言する前に、この`@OptIn`アノテーションを追加します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## プラグインの使用

このセクションでは、Power-assertコンパイラプラグインの使用例を示します。

これらのすべての例について、ビルドスクリプトファイル`build.gradle.kts`の完全なコードを参照してください。

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

### Assert関数

`assert()`関数を使用した次のテストについて考えてみます。

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

Power-assertプラグインを有効にして`testFunction()`テストを実行すると、明示的なエラーメッセージが表示されます。

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

より完全なエラーメッセージを取得するには、常に変数をテスト関数のパラメータにインライン化します。
次のテスト関数について考えてみます。

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

実行されたコードの出力では、問題の原因を特定するのに十分な情報が得られません。

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

変数を`assert()`関数にインライン化します。

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

実行後、何がうまくいかなかったかについて、より明示的な情報を得ることができます。

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

### assert関数を超えて

Power-assertプラグインは、デフォルトで変換される`assert`以外にも、さまざまな関数を変換できます。
`require()`、`check()`、`assertTrue()`、`assertEqual()`などの関数も、
`String`または`() `->` String`Valueを最後のパラメータとして受け取ることができる形式である場合は、変換できます。

テストで新しい関数を使用する前に、ビルドスクリプトファイルの`powerAssert {}`ブロックに関数を指定します。
たとえば、`require()`関数：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

関数を追加したら、テストで使用できます。

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

この例の出力では、Power-assertプラグインを使用して、失敗したテストに関する詳細情報を提供します。

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

このメッセージは、失敗につながった中間Valueを示しており、デバッグが容易になります。

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

### ソフトアサーション

Power-assertプラグインは、テストをすぐに失敗させるのではなく、
アサーションの失敗を収集してテストの最後に報告するソフトアサーションをサポートしています。
これは、最初のエラーで停止せずに、1回の実行ですべてのアサーションの失敗を確認したい場合に役立ちます。

ソフトアサーションを有効にするには、エラーメッセージを収集する方法を実装します。

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

これらの関数を`powerAssert {}`ブロックに追加して、Power-assertプラグインで使用できるようにします。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

`AssertScope.assert()`関数を宣言するパッケージの完全な名前を指定する必要があります。

:::

その後、テストコードで使用できます。

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

出力では、すべての`assert()`関数のエラーメッセージが次々と出力されます。

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

## 次のステップ

* [プラグインが有効になっているシンプルなプロジェクト](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)と、より[複数のソースセットを持つ複雑なプロジェクト](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)をご覧ください。

  ```