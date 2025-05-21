---
title: テストページ
description: このページはテスト目的でのみ使用されます。
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::info
<p>
   これは画像付きのブロックです (<strong>Getting started with Compose Multiplatform</strong>チュートリアルから引用)。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">KotlinでSpring Bootプロジェクトを作成する</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Bootプロジェクトにデータクラスを追加する</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Spring Bootプロジェクトのデータベースサポートを追加する</strong><br/>
      <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository を使用してデータベースにアクセスする><br/>
</p>

:::

## Synchronized tabs

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</TabItem>
</Tabs>

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</TabItem>
</Tabs>

## Sections

### Collapsed section

ここにテキストとコードブロックがあります:

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## Codeblocks

単なるコードブロック:

```kotlin
    import java.util.*

@Service
class MessageService(val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): List<Message> = db.findById(id).toList()

    fun save(message: Message) {
        db.save(message)
    }

    fun <T : Any> Optional<out T>.toList(): List<T> =
        if (isPresent) listOf(get()) else emptyList()
}
```

### Expandable codeblock

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

### Runnable codeblock

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)

    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)

}
```

## Tables

### Markdown table

| Primitive-type array                                                                  | Equivalent in Java |
|---------------------------------------------------------------------------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XML table
<table>
<tr>
<td>
<strong>Last modified on</strong>
</td>
<td>
<strong>December 2023</strong>
</td>
</tr>
<tr>
<td>
<strong>Next update</strong>
</td>
<td>
<strong>June 2024</strong>
</td>
</tr>
</table>

### XML table with codeblocks inside

Simple table:
<table>
<tr>
<td>
Before
</td>
<td>
Now
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```
</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```
</td>
</tr>
</table>

More complex table:
<table>
<tr>
<td>
</td>
<td>
Before
</td>
<td>
Now
</td>
</tr>
<tr>
<td rowspan="2">
Dependencies of the `jvmMain` compilation
</td>
<td>

```kotlin
jvm<Scope>
```
</td>
<td>

```kotlin
jvmCompilation<Scope>
```
</td>
</tr>
<tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```
</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```
</td>
</tr>
<tr>
<td>
Dependencies of the `jvmMain` source set
</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```
</td>
</tr>
<tr>
<td>
Dependencies of the `jvmTest` compilation
</td>
<td>

```kotlin
jvmTest<Scope>
```
</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```
</td>
</tr>
<tr>
<td>
Dependencies of the `jvmTest` source set
</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```
</td>
</tr>
</table>

## Lists

### Ordered list

1. 1つ
2. 2つ
3. 3つ
    1. 3.1
    2. 3.2
    3. 3.3
        1. 3.1と1
4. 内部にコードブロックがある場合:

   ```kotlin
   jvmTest<Scope>
   ```

### Non-ordered list

* 1番目の箇条書き
* 2番目の箇条書き
* 3番目の箇条書き
    * もう1つ
    * もう1つ
        * おっと、もう1つ
* 内部にコードブロックがある場合:

   ```kotlin
   jvmTest<Scope>
   ```

### Definition list
<h3>Collapsible item #1</h3>
<p>
   `CrudRepository`インターフェイスの`findById()`関数の戻り値の型は、`Optional`クラスのインスタンスです。ただし、一貫性を保つために、単一のメッセージを持つ`List`を返す方が便利な場合があります。そのためには、`Optional`の値が存在する場合はラップを解除し、その値を持つリストを返す必要があります。これは、`Optional`型への<a href="extensions#extension-functions">拡張関数</a>として実装できます。
</p>
<p>
   コード`Optional&lt;out T&gt;.toList()`では、`.toList()`は`Optional`の拡張関数です。拡張関数を使用すると、任意のクラスに追加の関数を記述できます。これは、一部のライブラリクラスの機能を拡張する場合に特に役立ちます。
</p>
<h3>Collapsible item #2</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">この関数は</a>、新しいオブジェクトがデータベースにidを持っていないことを前提として動作します。したがって、挿入の場合、idは<b>nullである必要があります</b>。
</p>
<p>
   idが<i>null</i>でない場合、`CrudRepository`は、オブジェクトがすでにデータベースに存在し、これが<i>挿入</i>操作ではなく<i>更新</i>操作であると見なします。挿入操作後、`id`はデータストアによって生成され、`Message`インスタンスに割り当てられます。これが、`id`プロパティを`var`キーワードを使用して宣言する必要がある理由です。
</p>
<p>
</p>
   

## Text elements

* **Bold text**
* _italic text_
* `inline code`
* [internal anchor](#lists)
* [internal link](roadmap)
* [external link](https://jetbrains.com)
* emojis ❌✅🆕

## Variables
* variable using: 最新のKotlinバージョンは2.1.20です

## Embedded elements

### Video from YouTube

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

### Pictures

Regular (Markdown):

<img src="/img/create-test.png" alt="Create a test" width="700" style={{verticalAlign: 'middle'}}/>

Regular (XML):

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

Inline:

<img src="/img/youtrack-logo.png" alt="YouTrack" width="30" style={{verticalAlign: 'middle'}}/>

Zoomable:

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="700" style={{verticalAlign: 'middle'}}/>

Button-style:

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="Create a project" />
</a>

## Notes

Warning:

:::note
kaptコンパイラープラグインでのK2のサポートは[Experimental](components-stability)です。
オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。

Note:

Kotlin/Nativeに付属するネイティブプラットフォームライブラリ (Foundation、UIKit、POSIXなど) については、そのAPIの一部のみが`@ExperimentalForeignApi`によるオプトインを必要とします。そのような場合、オプトイン要件とともに警告が表示されます。

:::

Tip:

:::tip
Kotlin/Nativeに付属するネイティブプラットフォームライブラリ (Foundation、UIKit、POSIXなど) については、そのAPIの一部のみが`@ExperimentalForeignApi`によるオプトインを必要とします。そのような場合、オプトイン要件とともに警告が表示されます。

:::