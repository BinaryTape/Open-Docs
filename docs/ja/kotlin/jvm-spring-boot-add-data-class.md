---
title: "Spring Boot プロジェクトへのデータクラスの追加"
description: "Kotlin データクラスを Spring Boot プロジェクトに追加します。"
---
:::info
<p>
   これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの第2部です。先に進む前に、必ず前の手順を完了してください。
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>Spring Bootプロジェクトにデータクラスを追加する</strong><br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Spring Bootプロジェクトにデータベースのサポートを追加する<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepositoryを使用してデータベースにアクセスする
</p>

:::

このチュートリアルのパートでは、アプリケーションにさらに機能を追加し、データクラスなどのKotlinの言語機能をさらに詳しく説明します。
`MessageController`クラスを変更して、シリアル化されたオブジェクトのコレクションを含むJSONドキュメントで応答する必要があります。

## アプリケーションを更新する

1. 同じパッケージに、2つのプロパティ`id`と`text`を持つデータクラスを含む`Message.kt`ファイルを作成します。

    ```kotlin
    // Message.kt
    package demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message`クラスはデータ転送に使用されます。シリアル化された`Message`オブジェクトのリストは、コントローラーがブラウザーリクエストに応答するJSONドキュメントを構成します。
<h3>データクラス – data class Message</h3>
<p>
   Kotlinの<a href="data-classes">データクラス</a>の主な目的は、データを保持することです。このようなクラスは`data`キーワードでマークされており、一部の標準機能と一部のユーティリティ関数は、多くの場合、クラス構造から機械的に導き出すことができます。
</p>
<p>
   この例では、`Message`の主な目的はデータを格納することであるため、`Message`をデータクラスとして宣言しました。
</p>
<h3>valとvarプロパティ</h3>
<p>
   <a href="properties">Kotlinのプロパティ</a>は、次のように宣言できます。
</p>
<list>
<li><i>mutable</i>（可変）、`var`キーワードを使用</li>
<li><i>read-only</i>（読み取り専用）、`val`キーワードを使用</li>
</list>
<p>
   `Message`クラスは、`val`キーワードを使用して、`id`と`text`の2つのプロパティを宣言します。
          コンパイラーは、これらのプロパティの両方のゲッターを自動的に生成します。
          `Message`クラスのインスタンスが作成された後、これらのプロパティの値を再割り当てすることはできません。
</p>
<h3>Nullable（nullable）型 – String?</h3>
<p>
   Kotlinは、<a href="null-safety#nullable-types-and-non-nullable-types">nullable（nullable）型の組み込みサポート</a>を提供します。Kotlinでは、型システムは、`null`を保持できる参照（<i>nullable参照</i>）と、そうでない参照（<i>non-nullable参照</i>）を区別します。<br/>
          たとえば、`String`型の通常の変数は`null`を保持できません。nullを許可するには、`String?`と記述して、変数をnullable文字列として宣言できます。
</p>
<p>
   `Message`クラスの`id`プロパティは、今回はnullable型として宣言されています。
          したがって、`id`の値として`null`を渡すことにより、`Message`クラスのインスタンスを作成できます。
</p>
          ```kotlin
Message(null, "Hello!")
```
       
   
2. `MessageController.kt`ファイルで、`index()`関数の代わりに、`Message`オブジェクトのリストを返す`listMessages()`関数を作成します。

    ```kotlin
    // MessageController.kt
    package demo
   
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
<h3>コレクション – listOf()</h3>
<p>
   Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供します。<br/>
          インターフェイスのペアは、各コレクション型を表します。
</p>
<list>
<li>コレクション要素へのアクセス操作を提供する<i>read-only</i>インターフェイス。</li>
<li>対応するread-onlyインターフェイスを、書き込み操作（要素の追加、削除、更新）で拡張する<i>mutable</i>インターフェイス。</li>
</list>
<p>
   対応するファクトリ関数もKotlin標準ライブラリによって提供され、このようなコレクションのインスタンスを作成します。
</p>
<p>
   このチュートリアルでは、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html">`listOf()`</a>関数を使用して、`Message`オブジェクトのリストを作成します。
          これは、オブジェクトの<i>read-only</i>リストを作成するファクトリ関数です。リストから要素を追加または削除することはできません。<br/>
          リストに対して書き込み操作を実行する必要がある場合は、<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html">`mutableListOf()`</a>関数を呼び出して、mutableリストインスタンスを作成します。
</p>
<h3>Trailing comma（末尾のカンマ）</h3>
<p>
   <a href="coding-conventions#trailing-commas">末尾のカンマ</a>は、要素のシリーズの<b>最後の項目</b>の後のカンマ記号です。
</p>
            ```kotlin
Message("3", "Privet!"),
```
<p>
   これはKotlin構文の便利な機能であり、完全にオプションです。コードはなくても機能します。
</p>
<p>
   上記の例では、`Message`オブジェクトのリストの作成には、最後の`listOf()`関数引数の後の末尾のカンマが含まれています。
</p>
       
    

`MessageController`からの応答は、`Message`オブジェクトのコレクションを含むJSONドキュメントになります。

:::note
Jacksonライブラリがクラスパスにある場合、SpringアプリケーションのコントローラーはデフォルトでJSON応答をレンダリングします。
[`build.gradle.kts`ファイルで`spring-boot-starter-web`依存関係を指定した](jvm-create-project-with-spring-boot#explore-the-project-gradle-build-file)ため、Jacksonを_推移的_な依存関係として受け取りました。
したがって、アプリケーションは、エンドポイントがJSONにシリアル化できるデータ構造を返す場合、JSONドキュメントで応答します。

:::

以下は、`DemoApplication.kt`、`MessageController.kt`、および`Message.kt`ファイルの完全なコードです。

```kotlin
// DemoApplication.kt
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

```kotlin
// MessageController.kt
package demo

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

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```

## アプリケーションを実行する

Springアプリケーションを実行する準備ができました。

1. アプリケーションを再度実行します。

2. アプリケーションが起動したら、次のURLを開きます。

    ```text
    http://localhost:8080
    ```

    JSON形式のメッセージのコレクションを含むページが表示されます。

    <img src="/img/messages-in-json-format.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

## 次のステップ

チュートリアルの次のパートでは、プロジェクトにデータベースを追加して構成し、HTTPリクエストを作成します。

**[次の章に進みます](jvm-spring-boot-add-db-support)**