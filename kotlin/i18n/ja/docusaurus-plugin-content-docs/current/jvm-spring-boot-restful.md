---
title: "Spring Boot を使用してデータベースと連携する RESTful な Web サービスを作成する - チュートリアル"
---
Spring Boot でシンプルなアプリケーションを作成し、情報を保存するためのデータベースを追加する手順を説明します。

このチュートリアルでは、次のことを行います。
* HTTP エンドポイントを持つアプリケーションを作成する
* JSON 形式でデータオブジェクトのリストを返す方法を学ぶ
* オブジェクトを格納するためのデータベースを作成する
* データベースオブジェクトを書き込みおよび取得するためのエンドポイントを使用する

[完成したプロジェクト](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)をダウンロードして調べたり、このチュートリアルのビデオを視聴したりできます。

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## 開始する前に

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールします。

## プロジェクトのブートストラップ

Spring Initializr を使用して新しいプロジェクトを作成します。

:::note
[Spring Boot プラグインを備えた IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html)を使用して、新しいプロジェクトを作成することもできます。

:::

1. [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2) を開きます。このリンクをクリックすると、このチュートリアルのプロジェクト設定が既に入力されたページが開きます。
このプロジェクトでは、**Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC**、および **H2 Database** を使用します。

   <img src="/img/spring-boot-create-project-with-initializr.png" alt="Create a new project with Spring Initializr" width="800" style={{verticalAlign: 'middle'}}/>

2. 画面下部の **GENERATE** をクリックします。Spring Initializr は、指定された設定でプロジェクトを生成します。ダウンロードが自動的に開始されます。

3. **.zip** ファイルを解凍し、IntelliJ IDEA で開きます。

   プロジェクトの構造は次のとおりです。
   <img src="/img/spring-boot-project-structure.png" alt="The Spring Boot project structure" width="350" style={{verticalAlign: 'middle'}}/>
 
   アプリケーションに属するパッケージとクラスが `main/kotlin` フォルダーの下にあります。アプリケーションのエントリポイントは、`DemoApplication.kt` ファイルの `main()` メソッドです。

## プロジェクトのビルドファイルを確認する

`build.gradle.kts` ファイルを開きます。

これは Gradle Kotlin ビルドスクリプトで、アプリケーションに必要な依存関係のリストが含まれています。

Gradle ファイルは Spring Boot では標準ですが、[kotlin-spring](all-open-plugin#spring-support) Gradle プラグインを含む、必要な Kotlin 依存関係も含まれています。

## Spring Boot アプリケーションを確認する

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

Kotlin アプリケーションファイルは Java アプリケーションファイルとは異なります。
* Spring Boot はパブリック静的 `main()` メソッドを探しますが、Kotlin アプリケーションは `DemoApplication` クラスの外部で定義された[トップレベル関数](functions#function-scope)を使用します。
* [kotlin-spring](all-open-plugin#spring-support) プラグインが自動的に行うため、`DemoApplication` クラスは `open` として宣言されていません。

## データクラスとコントローラーを作成する

エンドポイントを作成するには、[データクラス](data-classes)とコントローラーをプロジェクトに追加します。

1. `DemoApplication.kt` ファイルで、2 つのプロパティ `id` と `text` を持つ `Message` データクラスを作成します。

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 同じファイルで、リクエストを処理し、`Message` オブジェクトのコレクションを含む JSON ドキュメントを返す `MessageResource` クラスを作成します。

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

`DemoApplication.kt` の完全なコード:

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

## アプリケーションを実行する

アプリケーションを実行する準備ができました。

1. `main()` メソッドの横にあるガターの緑色の **実行** アイコンをクリックするか、**Alt+Enter** ショートカットを使用して IntelliJ IDEA で起動メニューを呼び出します。

   <img src="/img/spring-boot-run-the-application.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

   > ターミナルで `./gradlew bootRun` コマンドを実行することもできます。
   >
   

2. アプリケーションが起動したら、次の URL を開きます: [http://localhost:8080](http://localhost:8080)。

   JSON 形式のメッセージのコレクションを含むページが表示されます。

   <img src="/img/spring-boot-output.png" alt="Application output" style={{verticalAlign: 'middle'}}/>

## データベースのサポートを追加する

アプリケーションでデータベースを使用するには、まず 2 つのエンドポイントを作成します。1 つはメッセージを保存するためのエンドポイント、もう 1 つはメッセージを取得するためのエンドポイントです。

1. `@Table` アノテーションを `Message` クラスに追加して、データベーステーブルへのマッピングを宣言します。`@Id` アノテーションを `id` フィールドの前に追加します。これらのアノテーションには、追加のインポートも必要です。

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) を使用してデータベースにアクセスします。

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

3. `MessageService` クラスを作成します。

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

   このクラスには、次の 2 つのメソッドが含まれています。
   * データベースに新しい `Message` オブジェクトを書き込むための `post()`
   * データベースからすべてのメッセージを取得するための `findMessages()`

4. `MessageResource` クラスを更新します。

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

## データベースを構成する

アプリケーションでデータベースを構成します。

1. `src/main/resources` に `sql` という名前の新しいフォルダーを作成し、その中に `schema.sql` ファイルを作成します。データベーススキーマが格納されます。

   <img src="/img/spring-boot-sql-scheme.png" alt="Create a new folder" width="300" style={{verticalAlign: 'middle'}}/>

2. `src/main/resources/sql/schema.sql` ファイルを次のコードで更新します。

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   `id` と `text` の 2 つのフィールドを持つ `messages` テーブルが作成されます。テーブル構造は、`Message` クラスの構造と一致します。

3. `src/main/resources` フォルダーにある `application.properties` ファイルを開き、次のアプリケーションプロパティを追加します。

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   これらの設定により、Spring Boot アプリケーションのデータベースが有効になります。
   一般的なアプリケーションプロパティの完全なリストについては、[Spring ドキュメント](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)を参照してください。

## HTTP リクエストを実行する

以前に作成したエンドポイントを操作するには、HTTP クライアントを使用する必要があります。IntelliJ IDEA では、埋め込み[HTTP クライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)を使用できます。

1. アプリケーションを実行します。アプリケーションが起動して実行されたら、POST リクエストを実行してメッセージをデータベースに保存できます。

2. `requests.http` ファイルを作成し、次の HTTP リクエストを追加します。

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

3. すべての POST リクエストを実行します。リクエスト宣言の横にあるガターの緑色の **実行** アイコンを使用します。
   これらのリクエストは、テキストメッセージをデータベースに書き込みます。

   <img src="/img/spring-boot-run-http-request.png" alt="Run HTTP POST requests" style={{verticalAlign: 'middle'}}/>

4. GET リクエストを実行し、**実行** ツールウィンドウに結果を表示します。

   <img src="/img/spring-boot-output-2.png" alt="Run HTTP GET request" style={{verticalAlign: 'middle'}}/>

### リクエストを実行する別の方法

他の HTTP クライアントまたは cURL コマンドラインツールを使用することもできます。たとえば、ターミナルで次のコマンドを実行すると、同じ結果が得られます。

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 次のステップ

Kotlin の機能をナビゲートし、言語の学習の進捗状況を追跡するのに役立つ、個人の言語マップを入手してください。
また、Spring で Kotlin を使用するための言語のヒントと役立つ資料もお送りします。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map"/>
</a>
:::note
資料を受け取るには、次のページでメールアドレスを共有する必要があります。

:::

### 参照

その他のチュートリアルについては、Spring の Web サイトを確認してください。

* [Spring Boot と Kotlin を使用した Web アプリケーションの構築](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [Kotlin コルーチンと RSocket を使用した Spring Boot](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)

  ```