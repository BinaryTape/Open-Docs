[//]: # (title: テストページ)
[//]: # (description: このページはテスト目的のみです。)

<no-index/>

<tldr>
   <p>これは画像を含むブロックです（「<strong>Compose Multiplatform の開始</strong>」チュートリアルから引用）。</p>
   <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/>
      <img src="icon-2-done.svg" width="20" alt="2番目のステップ"/> <a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/>
      <img src="icon-3.svg" width="20" alt="3番目のステップ"/> <strong>Spring Bootプロジェクトにデータベースサポートを追加する</strong><br/>
      <img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> データベースアクセスにSpring Data CrudRepositoryを使用する<br/>
    </p>
</tldr>

## タブの同期

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</tab>
</tabs>

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</tab>
</tabs>

## セクション

### 折りたたみ可能なセクション {initial-collapse-state="collapsed" collapsible="true"}

ここにいくつかのテキストとコードブロックがあります:

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## コードブロック

コードブロックのみ:

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

### 展開可能なコードブロック

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
{initial-collapse-state="collapsed" collapsible="true"}

### 実行可能なコードブロック

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## テーブル

### Markdownテーブル

| プリミティブ型配列                                                                    | Javaでの等価 |
|:--------------------------------------------------------------------------------------|:-------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XMLテーブル

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2023年12月</strong></td>
    </tr>
    <tr>
        <td><strong>次回更新</strong></td>
        <td><strong>2024年6月</strong></td>
    </tr>
</table>

### コードブロックを含むXMLテーブル

シンプルなテーブル:

<table>
    <tr>
        <td>変更前</td>
        <td>変更後</td>
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

より複雑なテーブル:

<table>
    <tr>
        <td></td>
        <td>変更前</td>
        <td>変更後</td>
    </tr>
    <tr>
        <td rowspan="2">jvmMainコンパイルの依存関係</td>
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
        <td>jvmMainソースセットの依存関係</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td>jvmTestコンパイルの依存関係</td>
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
        <td>jvmTestソースセットの依存関係</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

## リスト

### 順序付きリスト

1. 1
2. 2
3. 3
    1. 3.1
    2. 3.2
    3. 3.3
        1. 3.1.1
4. コードブロック内:

   ```kotlin
   jvmTest<Scope>
   ```

### 順序なしリスト

* 最初の箇条書き
* 2番目の箇条書き
* 3番目の箇条書き
    * もう一つ
    * もう一つ
        * すごい、もう一つ
* コードブロック内:

   ```kotlin
   jvmTest<Scope>
   ```

### 定義リスト

<deflist collapsible="true">
   <def title="折りたたみ可能な項目 #1">
      <p><code>CrudRepository</code> インターフェースの <code>findById()</code> 関数の戻り値の型は <code>Optional</code> クラスのインスタンスです。しかし、一貫性のために単一のメッセージを持つ <code>List</code> を返すのが便利でしょう。そのためには、<code>Optional</code> の値が存在する場合にそれをアンラップし、その値を持つリストを返す必要があります。これは <code>Optional</code> 型への<a href="extensions.md#extension-functions">拡張関数</a>として実装できます。</p>
      <p>コード中の <code>Optional&lt;out T&gt;.toList()</code> では、<code>.toList()</code> は <code>Optional</code> の拡張関数です。拡張関数を使用すると、任意のクラスに追加の関数を記述でき、特にライブラリクラスの機能を拡張したい場合に非常に役立ちます。</p>
   </def>
   <def title="折りたたみ可能な項目 #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">この関数は、</a>新しいオブジェクトがデータベースにIDを持たないという仮定で動作します。したがって、挿入時にはIDは**nullであるべき**です。</p>
      <p>IDが <i>null</i> でない場合、<code>CrudRepository</code> は、そのオブジェクトがすでにデータベースに存在し、これは挿入操作ではなく <i>更新</i> 操作であると仮定します。挿入操作の後、<code>id</code> はデータストアによって生成され、<code>Message</code> インスタンスに再度割り当てられます。これが、<code>id</code> プロパティを <code>var</code> キーワードを使用して宣言する必要がある理由です。</p>
      <p></p>
   </def>
</deflist>

## テキスト要素

* **太字のテキスト**
* _斜体のテキスト_
* `inline code`
* [内部アンカー](#lists)
* [内部リンク](roadmap.md)
* [外部リンク](https://jetbrains.com)
* 絵文字 ❌✅🆕

## 変数
* 変数使用: 最新のKotlinバージョンは %kotlinVersion% です

## 埋め込み要素

### YouTube動画

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 の新機能"/>

### 画像

通常 (Markdown):

![テストを作成](create-test.png){width="700"}

通常 (XML):

<img src="multiplatform-web-wizard.png" alt="マルチプラットフォームWebウィザード" width="400"/>

インライン:

![YouTrack](youtrack-logo.png){width=30}{type="joined"}

ズーム可能:

![クラス図](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

ボタン形式:

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="プロジェクトを作成" style="block"/>
</a>

## 注記

警告:

> kaptコンパイラプラグインでのK2のサポートは[実験的](components-stability.md)です。
> オプトインが必要です（詳細は下記参照）。評価目的のみで使用してください。
>
{style="warning"}

注記:

> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）に関しては、一部のAPIのみが<code>@ExperimentalForeignApi</code>でのオプトインを必要とします。そのような場合、オプトイン要件に関する警告が表示されます。
>
{style="note"}

ヒント:

> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）に関しては、一部のAPIのみが<code>@ExperimentalForeignApi</code>でのオプトインを必要とします。そのような場合、オプトイン要件に関する警告が表示されます。
>
{style="tip"}