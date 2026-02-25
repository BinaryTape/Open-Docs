[//]: # (title: Spring Bootプロジェクトへのデータクラスの追加)

<web-summary>Spring BootプロジェクトにKotlinのデータクラスを追加します。</web-summary>

<tldr>
    <p>これは <strong>Spring BootとKotlinを使い始める</strong> チュートリアルの第2部です。先に進む前に、前のステップを完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Spring Bootプロジェクトにデータクラスを追加する</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Spring Bootプロジェクトにデータベースのサポートを追加する<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> データベースアクセスにSpring Data CrudRepositoryを使用する</p>
</tldr>

このチュートリアルでは、アプリケーションに機能を追加し、データクラスなどのKotlin言語のさらなる機能について学びます。
これには、シリアル化されたオブジェクトのコレクションを含むJSONドキュメントを応答するように `MessageController` クラスを変更する必要があります。

## アプリケーションの更新

1. 同じパッケージ内の `DemoApplication.kt` ファイルの隣に、 `Message.kt` ファイルを作成します。
2. `Message.kt` ファイルに、 `id` と `text` の2つのプロパティを持つデータクラスを作成します。

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` クラスはデータ転送に使用されます。シリアル化された `Message` オブジェクトのリストは、コントローラーがブラウザのリクエストに対して応答するJSONドキュメントを構成します。

   <deflist collapsible="true">
       <def title="データクラス – data class Message">
          <p>Kotlinにおける<a href="data-classes.md">データクラス</a> (data class) の主な目的は、データを保持することです。このようなクラスには <code>data</code> キーワードが付与され、標準的な機能やいくつかのユーティリティ関数がクラスの構造から自動的に導き出されます。</p>
          <p>この例では、データを保存することが主な目的であるため、 <code>Message</code> をデータクラスとして宣言しました。</p>
       </def>
       <def title="valプロパティとvarプロパティ">
          <p><a href="properties.md">Kotlinのプロパティ</a>は、以下のいずれかとして宣言できます：</p>
          <list>
             <li><i>ミュータブル (変更可能)</i>： <code>var</code> キーワードを使用</li>
             <li><i>読み取り専用</i>： <code>val</code> キーワードを使用</li>
          </list>
          <p><code>Message</code> クラスは、 <code>val</code> キーワードを使用して <code>id</code> と <code>text</code> の2つのプロパティを宣言しています。
          コンパイラは、これら両方のプロパティに対して自動的にゲッター (getter) を生成します。
          <code>Message</code> クラスのインスタンスが作成された後、これらのプロパティの値を再代入することはできません。
          </p>
       </def>
       <def title="Null許容型 – String?">
          <p>Kotlinは<a href="null-safety.md#nullable-types-and-non-nullable-types">Null許容型 (nullable types) をビルトインでサポート</a>しています。Kotlinの型システムは、 <code>null</code> を保持できる参照 (<i>Null許容参照</i>) と、保持できない参照 (<i>Null非許容参照</i>) を区別します。<br/>
          例えば、 <code>String</code> 型の通常の変数は <code>null</code> を保持できません。nullを許可するには、 <code>String?</code> と書くことで、その変数をNull許容文字列として宣言できます。
          </p>
          <p>今回の <code>Message</code> クラスの <code>id</code> プロパティはNull許容型として宣言されています。
          したがって、 <code>id</code> の値として <code>null</code> を渡して <code>Message</code> クラスのインスタンスを作成することが可能です。
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. `MessageController.kt` ファイルで、 `index()` 関数の代わりに、 `Message` オブジェクトのリストを返す `listMessages()` 関数を作成します。

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
          <p>Kotlin標準ライブラリは、セット、リスト、マップなどの基本的なコレクション型の実装を提供しています。<br/>
          各コレクション型には、<i>読み取り専用</i>または<i>ミュータブル</i>のものがあります：</p>
          <list>
              <li><i>読み取り専用</i>コレクションには、コレクションの要素にアクセスするための操作が含まれます。</li>
              <li><i>ミュータブル</i>コレクションには、要素の追加、削除、更新を行うための書き込み操作も含まれます。</li>
          </list>
          <p>これらのコレクションのインスタンスを作成するために、対応するファクトリ関数もKotlin標準ライブラリによって提供されています。
          </p>
          <p>このチュートリアルでは、 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> 関数を使用して <code>Message</code> オブジェクトのリストを作成します。
          これはオブジェクトの<i>読み取り専用</i>リストを作成するファクトリ関数です。リストから要素を追加したり削除したりすることはできません。<br/>
          リストに対して書き込み操作を行う必要がある場合は、 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> 関数を呼び出してミュータブルなリストのインスタンスを作成します。
          </p>
       </def>
       <def title="末尾のコンマ (Trailing comma)">
          <p><a href="coding-conventions.md#trailing-commas">末尾のコンマ</a>は、一連の要素の<b>最後の項目</b>の後にあるコンマ記号です：</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>これはKotlin構文の便利な機能であり、完全にオプションです。これらがなくてもコードは動作します。
          </p>
          <p>上記の例では、 <code>Message</code> オブジェクトのリストを作成する際、最後の <code>listOf()</code> 関数の引数の後に末尾のコンマを含めています。</p>
       </def>
    </deflist>

`MessageController` からの応答は、 `Message` オブジェクトのコレクションを含むJSONドキュメントになります。

> Jacksonライブラリがクラスパスにある場合、SpringアプリケーションのコントローラーはデフォルトでJSONレスポンスをレンダリングします。
> [`build.gradle.kts` ファイルで `spring-boot-starter-webmvc` 依存関係を指定した](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)ため、_推移的 (transitive)_ 依存関係としてJacksonが含まれています。
> そのため、エンドポイントがJSONにシリアル化可能なデータ構造を返す場合、アプリケーションはJSONドキュメントを応答します。
>
{style="note"}

以下は、 `DemoApplication.kt` 、 `MessageController.kt` 、および `Message.kt` ファイルの完全なコードです。

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

## アプリケーションの実行

Springアプリケーションを実行する準備が整いました。

1. アプリケーションを再度実行します。

2. アプリケーションが起動したら、次のURLを開きます：

    ```text
    http://localhost:8080
    ```

    JSON形式のメッセージのコレクションが表示されたページが表示されます。

    ![アプリケーションの実行](messages-in-json-format.png){width=700}

## 次のステップ

チュートリアルの次のパートでは、プロジェクトにデータベースを追加して設定し、HTTPリクエストを実行します。

**[次の章に進む](jvm-spring-boot-add-db-support.md)**