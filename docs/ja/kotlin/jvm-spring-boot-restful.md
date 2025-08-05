[//]: # (title: Spring Boot を使用したデータベース付き RESTful Web サービス作成チュートリアル)

このチュートリアルでは、Spring Boot を使用してシンプルなアプリケーションを作成し、情報を保存するためのデータベースを追加するプロセスを説明します。

このチュートリアルでは、以下の内容を学習します。
* HTTP エンドポイントを持つアプリケーションの作成
* JSON 形式でデータオブジェクトのリストを返す方法
* オブジェクトを保存するためのデータベースの作成
* エンドポイントを使用してデータベースオブジェクトの書き込みと取得

[完成したプロジェクト](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)をダウンロードして探索するか、このチュートリアルのビデオを視聴できます。

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## 開始する前に

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールします。

## プロジェクトのブートストラップ

Spring Initializr を使用して新しいプロジェクトを作成します。

> [IntelliJ IDEA の Spring Boot プラグイン](https://www.jetbrains.com/help/idea/spring-boot.html)を使用しても、新しいプロジェクトを作成できます。
>
{style="note"}

1.  [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)を開きます。このリンクを開くと、このチュートリアル用にプロジェクト設定がすでに事前に入力されたページが表示されます。
    このプロジェクトでは、**Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC**、および **H2 Database**を使用します。

    ![Spring Initializr で新しいプロジェクトを作成する](spring-boot-create-project-with-initializr.png){width=800}

2.  画面下部の **GENERATE** をクリックします。Spring Initializr は、指定された設定でプロジェクトを生成します。ダウンロードは自動的に開始されます。

3.  **.zip** ファイルを解凍し、IntelliJ IDEA で開きます。

    プロジェクトは以下の構造になっています。
    ![Spring Boot プロジェクトの構造](spring-boot-project-structure.png){width=350}

    `main/kotlin` フォルダーの下には、アプリケーションに属するパッケージとクラスがあります。アプリケーションのエントリポイントは、`DemoApplication.kt` ファイルの `main()` メソッドです。

## プロジェクトのビルドファイルを探索する

`build.gradle.kts` ファイルを開きます。

これは Gradle Kotlin ビルドスクリプトであり、アプリケーションに必要な依存関係のリストが含まれています。

この Gradle ファイルは Spring Boot の標準的なものですが、[kotlin-spring](all-open-plugin.md#spring-support) Gradle プラグインを含む必要な Kotlin 依存関係も含まれています。

## Spring Boot アプリケーションを探索する

`DemoApplication.kt` ファイルを開きます。

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

Kotlin アプリケーションファイルが Java アプリケーションファイルと異なる点に注意してください。
*   Spring Boot は public static `main()` メソッドを探しますが、Kotlin アプリケーションは `DemoApplication` クラスの外部で定義された[トップレベル関数](functions.md#function-scope)を使用します。
*   `DemoApplication` クラスは `open` として宣言されていません。これは[kotlin-spring](all-open-plugin.md#spring-support) プラグインが自動的に行うためです。

## データクラスとコントローラーの作成

エンドポイントを作成するには、[データクラス](data-classes.md)とコントローラーをプロジェクトに追加します。

1.  `DemoApplication.kt` ファイルに、`id` と `text` の 2 つのプロパティを持つ `Message` データクラスを作成します。

    ```kotlin
    data class Message(val id: String?, val text: String)
    ```

2.  同じファイルに、リクエストを処理し、`Message` オブジェクトのコレクションを含む JSON ドキュメントを返す `MessageResource` クラスを作成します。

    ```kotlin
    @RestController
    class MessageResource {
        @GetMapping("/")
        fun index(): List<Message> = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

`DemoApplication.kt` の完全なコードは以下のとおりです。

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageResource {
    @GetMapping("/")
    fun index(): List<Message> = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## アプリケーションの実行

これでアプリケーションを実行する準備ができました。

1.  `main()` メソッドの横にあるガターの緑色の **Run** アイコンをクリックするか、**Alt+Enter** ショートカットを使用して IntelliJ IDEA の起動メニューを呼び出します。

    ![アプリケーションの実行](spring-boot-run-the-application.png){width=800}

    > ターミナルで `./gradlew bootRun` コマンドを実行することもできます。
    >
    {style="note"}

2.  アプリケーションが起動したら、次の URL を開きます: [http://localhost:8080](http://localhost:8080)。

    JSON 形式のメッセージコレクションが表示されます。

    ![アプリケーションの出力](spring-boot-output.png)

## データベースサポートの追加

アプリケーションでデータベースを使用するには、まず 2 つのエンドポイントを作成します。1 つはメッセージを保存するため、もう 1 つはメッセージを取得するためです。

1.  `Message` クラスに `@Table` アノテーションを追加して、データベーステーブルへのマッピングを宣言します。`id` フィールドの前に `@Id` アノテーションを追加します。これらのアノテーションには、追加のインポートも必要です。

    ```kotlin
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table

    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

2.  [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)を使用してデータベースにアクセスします。

    ```kotlin
    import org.springframework.data.jdbc.repository.query.Query
    import org.springframework.data.repository.CrudRepository

    interface MessageRepository : CrudRepository<Message, String>{

        @Query("select * from messages")
        fun findMessages(): List<Message>
    }
    ```

    `MessageRepository` のインスタンスで `findMessages()` メソッドを呼び出すと、対応するデータベースクエリが実行されます。

    ```sql
    select * from messages
    ```

    このクエリは、データベーステーブル内のすべての `Message` オブジェクトのリストを取得します。

3.  `MessageService` クラスを作成します。

    ```kotlin
    import org.springframework.stereotype.Service

    @Service
    class MessageService(val db: MessageRepository) {

        fun findMessages(): List<Message> = db.findMessages()

        fun post(message: Message){
            db.save(message)
        }
    }
    ```

    このクラスには 2 つのメソッドが含まれています。
    *   `post()`: 新しい `Message` オブジェクトをデータベースに書き込むため
    *   `findMessages()`: データベースからすべてのメッセージを取得するため

4.  `MessageResource` クラスを更新します。

    ```kotlin
    import org.springframework.web.bind.annotation.RequestBody
    import org.springframework.web.bind.annotation.PostMapping

    @RestController
    class MessageResource(val service: MessageService) {
        @GetMapping("/")
        fun index(): List<Message> = service.findMessages()

        @PostMapping("/")
        fun post(@RequestBody message: Message) {
            service.post(message)
        }
    }
    ```

    これで、`MessageService` を使用してデータベースを操作します。

## データベースの構成

アプリケーションでデータベースを構成します。

1.  `src/main/resources` に `sql` という新しいフォルダーを作成し、その中に `schema.sql` ファイルを作成します。これにはデータベーススキーマが格納されます。

    ![新しいフォルダーを作成](spring-boot-sql-scheme.png){width=300}

2.  `src/main/resources/sql/schema.sql` ファイルを次のコードで更新します。

    ```sql
    CREATE TABLE IF NOT EXISTS messages (
      id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
      text                   VARCHAR      NOT NULL
    );
    ```

    これは、`id` と `text` の 2 つのフィールドを持つ `messages` テーブルを作成します。テーブル構造は `Message` クラスの構造と一致します。

3.  `src/main/resources` フォルダーにある `application.properties` ファイルを開き、次のアプリケーションプロパティを追加します。

    ```none
    spring.datasource.driver-class-name=org.h2.Driver
    spring.datasource.url=jdbc:h2:file:./data/testdb
    spring.datasource.username=sa
    spring.datasource.password=password
    spring.sql.init.schema-locations=classpath:sql/schema.sql
    spring.sql.init.mode=always
    ```

    これらの設定により、Spring Boot アプリケーションでデータベースが有効になります。
    一般的なアプリケーションプロパティの完全なリストは、[Spring ドキュメント](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)を参照してください。

## HTTP リクエストの実行

以前に作成したエンドポイントを操作するには、HTTP クライアントを使用する必要があります。IntelliJ IDEA では、組み込みの[HTTP クライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)を使用できます。

1.  アプリケーションを実行します。アプリケーションが起動して実行されたら、POST リクエストを実行してメッセージをデータベースに保存できます。

2.  `requests.http` ファイルを作成し、次の HTTP リクエストを追加します。

    ```http request
    ### Post 'Hello!"
    POST http://localhost:8080/
    Content-Type: application/json

    {
      "text": "Hello!"
    }

    ### Post "Bonjour!"

    POST http://localhost:8080/
    Content-Type: application/json

    {
      "text": "Bonjour!"
    }

    ### Post "Privet!"

    POST http://localhost:8080/
    Content-Type: application/json

    {
      "text": "Privet!"
    }

    ### Get all the messages
    GET http://localhost:8080/
    ```

3.  すべての POST リクエストを実行します。リクエスト宣言の横にあるガターの緑色の **Run** アイコンを使用します。
    これらのリクエストは、テキストメッセージをデータベースに書き込みます。

    ![HTTP POST リクエストを実行](spring-boot-run-http-request.png)

4.  GET リクエストを実行し、**Run** ツールウィンドウで結果を確認します。

    ![HTTP GET リクエストを実行](spring-boot-output-2.png)

### リクエストを実行する別の方法

他の HTTP クライアントや cURL コマンドラインツールを使用することもできます。たとえば、ターミナルで次のコマンドを実行すると、同じ結果が得られます。

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 次のステップ

Kotlin の機能をナビゲートし、言語学習の進捗を追跡するのに役立つ、あなた個人の言語マップを入手してください。
また、Kotlin を Spring で使用するための言語のヒントや役立つ資料も送信します。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="get-kotlin-language-map.png" width="700" alt="Kotlin 言語マップを入手する"/>
</a>

> 資料を受け取るには、次のページでメールアドレスを共有する必要があります。
>
{style="note"}

### 参照

その他のチュートリアルについては、Spring の Web サイトをご確認ください。

*   [Spring Boot と Kotlin を使用した Web アプリケーションの構築](https://spring.io/guides/tutorials/spring-boot-kotlin/)
*   [Kotlin Coroutines と RSocket を使用した Spring Boot](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)