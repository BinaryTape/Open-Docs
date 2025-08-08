[//]: # (title: Spring Bootプロジェクトにデータクラスを追加する)

<web-summary>Spring BootプロジェクトにKotlinデータクラスを追加します。</web-summary>

<tldr>
    <p>これは「<strong>Spring BootとKotlinを始める</strong>」チュートリアルの第2部です。続行する前に、以前のステップが完了していることを確認してください:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2.svg" width="20" alt="2番目のステップ"/> <strong>Spring Bootプロジェクトにデータクラスを追加する</strong><br/><img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> Spring Bootプロジェクトにデータベースサポートを追加する<br/><img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> データベースアクセスにSpring Data CrudRepositoryを使用する</p>
</tldr>

このチュートリアルのこのパートでは、アプリケーションに機能を追加し、データクラスなどのKotlin言語のさらなる機能について学びます。
これには、`MessageController`クラスを変更して、シリアライズされたオブジェクトのコレクションを含むJSONドキュメントで応答させる必要があります。

## アプリケーションを更新する

1. 同じパッケージ内の`DemoApplication.kt`ファイルの隣に、`Message.kt`ファイルを作成します。
2. `Message.kt`ファイルに、`id`と`text`という2つのプロパティを持つデータクラスを作成します:

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message`クラスはデータ転送に使用されます。シリアライズされた`Message`オブジェクトのリストが、コントローラーがブラウザのリクエストに応答するJSONドキュメントを構成します。

   <deflist collapsible="true">
       <def title="データクラス – データクラス Message">
          <p>Kotlinの<a href="data-classes.md">データクラス</a>の主な目的はデータを保持することです。このようなクラスは<code>data</code>キーワードでマークされ、いくつかの標準的な機能やユーティリティ関数は、クラス構造から機械的に導出されることがよくあります。</p>
          <p>この例では、`Message`クラスの主な目的がデータを保存することであるため、データクラスとして宣言しました。</p>
       </def>
       <def title="valとvarプロパティ">
          <p>Kotlinクラスの<a href="properties.md">プロパティ</a>は、以下のいずれかの方法で宣言できます:</p>
          <list>
             <li><i>可変</i>（<code>var</code>キーワードを使用）</li>
             <li><i>読み取り専用</i>（<code>val</code>キーワードを使用）</li>
          </list>
          <p>`Message`クラスは、<code>val</code>キーワードを使用して、`id`と`text`の2つのプロパティを宣言しています。
          コンパイラはこれら両方のプロパティに対してゲッターを自動的に生成します。
          `Message`クラスのインスタンスが作成された後、これらのプロパティの値を再代入することはできません。
          </p>
       </def>
       <def title="Null許容型 – String?">
          <p>Kotlinは<a href="null-safety.md#nullable-types-and-non-nullable-types">null許容型の組み込みサポート</a>を提供します。Kotlinでは、型システムが<code>null</code>を保持できる参照（<i>null許容参照</i>）と、保持できない参照（<i>非null許容参照</i>）を区別します。<br/>
          例えば、通常の<code>String</code>型の変数は<code>null</code>を保持できません。nullを許可するには、<code>String?</code>と記述して変数をnull許容文字列として宣言できます。
          </p>
          <p>`Message`クラスの`id`プロパティは、今回はnull許容型として宣言されています。
          したがって、`id`の値として<code>null</code>を渡して`Message`クラスのインスタンスを作成することが可能です:
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. `MessageController.kt`ファイルで、`index()`関数の代わりに、`Message`オブジェクトのリストを返す`listMessages()`関数を作成します:

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
          <p>Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供します。<br/>
          各コレクション型は、<i>読み取り専用</i>または<i>可変</i>のいずれかです:</p>
          <list>
              <li><i>読み取り専用</i>コレクションは、コレクション要素にアクセスするための操作を備えています。</li>
              <li><i>可変</i>コレクションは、要素の追加、削除、更新のための書き込み操作も備えています。</li>
          </list>
          <p>対応するファクトリ関数も、Kotlin標準ライブラリによって提供され、そのようなコレクションのインスタンスを作成します。
          </p>
          <p>このチュートリアルでは、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a>関数を使用して、`Message`オブジェクトのリストを作成します。
          これはオブジェクトの<i>読み取り専用</i>リストを作成するためのファクトリ関数です。リストから要素を追加したり削除したりすることはできません。<br/>
          リストに対する書き込み操作を実行する必要がある場合は、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a>関数を呼び出して可変リストインスタンスを作成します。
          </p>
       </def>
       <def title="末尾のカンマ">
          <p><a href="coding-conventions.md#trailing-commas">末尾のカンマ</a>は、一連の要素の<b>最後の項目</b>の後ろに付くカンマ記号です:</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>これはKotlinの構文の便利な機能であり、完全にオプションです。これらがなくてもコードは動作します。
          </p>
          <p>上記の例では、`Message`オブジェクトのリストを作成する際に、最後の<code>listOf()</code>関数の引数の後に末尾のカンマが含まれています。</p>
       </def>
    </deflist>

`MessageController`からの応答は、`Message`オブジェクトのコレクションを含むJSONドキュメントになります。

> Springアプリケーション内の任意のコントローラーは、Jacksonライブラリがクラスパスにあれば、デフォルトでJSON応答をレンダリングします。
> [`build.gradle.kts`ファイルで`spring-boot-starter-web`の依存関係を指定した](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)ため、Jacksonは_推移的_依存関係として含まれています。
> したがって、エンドポイントがJSONにシリアライズ可能なデータ構造を返した場合、アプリケーションはJSONドキュメントで応答します。
>
{style="note"}

`DemoApplication.kt`、`MessageController.kt`、`Message.kt`ファイルの完全なコードを以下に示します:

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

Springアプリケーションを実行する準備ができました:

1. アプリケーションを再度実行します。

2. アプリケーションが起動したら、次のURLを開きます:

    ```text
    http://localhost:8080
    ```

    JSON形式のメッセージコレクションを含むページが表示されます:

    ![アプリケーションを実行する](messages-in-json-format.png){width=800}

## 次のステップ

チュートリアルの次のパートでは、プロジェクトにデータベースを追加して構成し、HTTPリクエストを行います。

**[次のチャプターに進む](jvm-spring-boot-add-db-support.md)**