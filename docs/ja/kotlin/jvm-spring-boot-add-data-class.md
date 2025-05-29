[//]: # (title: Spring Bootプロジェクトにデータクラスを追加する)
[//]: # (description: KotlinデータクラスをSpring Bootプロジェクトに追加する。)

<tldr>
    <p>これは<strong>Spring BootとKotlin入門</strong>チュートリアルの2番目のパートです。続行する前に、以前のステップを完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2.svg" width="20" alt="2番目のステップ"/> <strong>Spring Bootプロジェクトにデータクラスを追加する</strong><br/><img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> Spring Bootプロジェクトにデータベースサポートを追加する<br/><img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> Spring Data CrudRepositoryを使用してデータベースにアクセスする</p>
</tldr>

このチュートリアルのこのパートでは、アプリケーションにいくつかの機能を追加し、データクラスなど、Kotlin言語のさらなる機能を発見します。
`MessageController`クラスを変更して、シリアライズされたオブジェクトのコレクションを含むJSONドキュメントで応答するようにする必要があります。

## アプリケーションを更新する

1. `DemoApplication.kt`ファイルと同じパッケージ内に、`Message.kt`ファイルを作成します。
2. `Message.kt`ファイルに、`id`と`text`という2つのプロパティを持つデータクラスを作成します。

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message`クラスはデータ転送に使用されます。シリアライズされた`Message`オブジェクトのリストが、コントローラーがブラウザリクエストに応答する際に使用するJSONドキュメントを構成します。

   <deflist collapsible="true">
       <def title="データクラス – data class Message">
          <p>Kotlinの<a href="data-classes.md">データクラス</a>の主な目的は、データを保持することです。このようなクラスは`data`キーワードでマークされ、クラス構造から、いくつかの標準機能やユーティリティ関数が機械的に導出されることがよくあります。</p>
          <p>この例では、`Message`をデータクラスとして宣言しました。その主な目的はデータを格納することだからです。</p>
       </def>
       <def title="valおよびvarプロパティ">
          <p>Kotlinクラスの<a href="properties.md">プロパティ</a>は、以下のいずれかの方法で宣言できます。</p>
          <list>
             <li>`var`キーワードを使用した<i>可変</i></li>
             <li>`val`キーワードを使用した<i>読み取り専用</i></li>
          </list>
          <p>`Message`クラスは、`val`キーワードを使用して`id`と`text`という2つのプロパティを宣言しています。
          コンパイラは、これら両方のプロパティに対して自動的にゲッターを生成します。
          `Message`クラスのインスタンスが作成された後、これらのプロパティの値を再代入することはできません。
          </p>
       </def>
       <def title="Null許容型 – String?">
          <p>Kotlinは<a href="null-safety.md#nullable-types-and-non-nullable-types">Null許容型に対する組み込みサポート</a>を提供しています。Kotlinでは、型システムが`null`を保持できる参照（<i>Null許容参照</i>）と、保持できない参照（<i>Null非許容参照</i>）を区別します。<br/>
          例えば、`String`型の通常の変数は`null`を保持できません。`null`を許可するには、`String?`と記述することで変数をNull許容文字列として宣言できます。
          </p>
          <p>`Message`クラスの`id`プロパティは、今回はNull許容型として宣言されています。
          したがって、`id`の値として`null`を渡して`Message`クラスのインスタンスを作成することが可能です。
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. `MessageController.kt`ファイルで、`index()`関数の代わりに、`Message`オブジェクトのリストを返す`listMessages()`関数を作成します。

    ```kotlin
    // MessageController.kt
    package com.example.demo
   
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController

    @RestController
    @RequestMapping("/")
    class MessageController {
        @GetMapping
        fun listMessages() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="コレクション – listOf()">
          <p>Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供しています。<br/>
          各コレクション型は、<i>読み取り専用</i>または<i>可変</i>のいずれかです。</p>
          <list>
              <li><i>読み取り専用</i>コレクションには、コレクション要素にアクセスするための操作が付属しています。</li>
              <li><i>可変</i>コレクションには、要素の追加、削除、更新のための書き込み操作も付属しています。</li>
          </list>
          <p>対応するファクトリ関数も、Kotlin標準ライブラリによって提供されており、そのようなコレクションのインスタンスを作成できます。
          </p>
          <p>このチュートリアルでは、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a>関数を使用して`Message`オブジェクトのリストを作成します。
          これはオブジェクトの<i>読み取り専用</i>リストを作成するためのファクトリ関数です。リストから要素を追加したり削除したりすることはできません。<br/>
          リストに対して書き込み操作を実行する必要がある場合は、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a>関数を呼び出して可変リストのインスタンスを作成します。
          </p>
       </def>
       <def title="末尾のカンマ">
          <p>末尾のカンマ（<a href="coding-conventions.md#trailing-commas">trailing comma</a>）とは、要素の並びの<b>最後の項目</b>の後ろにあるカンマ記号のことです。</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>これはKotlinの構文の便利な機能であり、完全にオプションです。これらがなくてもコードは動作します。
          </p>
          <p>上記の例では、`Message`オブジェクトのリストを作成する際に、最後の`listOf()`関数の引数の後に末尾のカンマが含まれています。</p>
       </def>
    </deflist>

`MessageController`からのレスポンスは、`Message`オブジェクトのコレクションを含むJSONドキュメントになります。

> Springアプリケーション内の任意のコントローラーは、Jacksonライブラリがクラスパスにある場合、デフォルトでJSONレスポンスをレンダリングします。
> [`build.gradle.kts`ファイルで`spring-boot-starter-web`依存関係を指定した](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)ため、Jacksonは_推移的_依存関係として含まれています。
> したがって、エンドポイントがJSONにシリアライズ可能なデータ構造を返す場合、アプリケーションはJSONドキュメントで応答します。
>
{style="note"}

`DemoApplication.kt`、`MessageController.kt`、および`Message.kt`ファイルの完全なコードを以下に示します。

```kotlin
// DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
    @GetMapping
    fun listMessages() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

## アプリケーションを実行する

Springアプリケーションの実行準備ができました。

1. アプリケーションを再度実行します。

2. アプリケーションが起動したら、以下のURLを開きます。

    ```text
    http://localhost:8080
    ```

    JSON形式のメッセージコレクションを含むページが表示されます。

    ![アプリケーションを実行する](messages-in-json-format.png){width=800}

## 次のステップ

チュートリアルの次のパートでは、プロジェクトにデータベースを追加して設定し、HTTPリクエストを行います。

**[次の章に進む](jvm-spring-boot-add-db-support.md)**