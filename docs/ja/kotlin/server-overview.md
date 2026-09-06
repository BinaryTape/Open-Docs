[//]: # (title: Kotlin によるバックエンド開発)

<web-summary>Spring、Ktor、その他のバックエンドフレームワークを使用して、Kotlin でサーバーアプリケーションを構築する</web-summary>

Kotlinは、サーバーサイドアプリケーションの開発に非常に適しています。Kotlinを使用すると、既存のJavaベースのテクノロジースタックとの完全な互換性を維持しながら、簡潔で表現力豊かなコードを書くことができます。

## はじめに

Kotlinは、JavaからKotlinへの大規模なコードベースの段階的な移行をサポートしています。プロジェクトの他の部分はJavaのままにして、テストや新しいプロダクションコードをKotlinで書き始めることができます。

JavaプロジェクトをKotlinで動作するように構成し、IntelliJ IDEAに含まれる自動Java-to-Kotlinコンバーターを活用しましょう。

<a href="mixing-java-kotlin-intellij.md" as="button" mode="rock" icon="arrow-right" icon-position="right">Java プロジェクトに Kotlin を導入する</a>

## フレームワークを探索する

KotlinはすべてのJavaベースのフレームワークと完全に互換性があるため、使い慣れたテクノロジースタックをそのまま使用しながら、Kotlinの構文のメリットを享受できます。優れたIDEサポートに加え、Kotlinは、IntelliJ IDEA UltimateにおけるSpringやKtorのサポートなど、特定のフレームワーク向けのツールも提供しています。

### Spring

[Spring](https://spring.io)は、Kotlinの言語機能を活用して、より簡潔なAPIを提供しています。[オンラインプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin)を使用すると、Kotlinの新しいプロジェクトを素早く生成できます。

<a href="jvm-get-started-spring-boot.md" as="button" mode="rock" icon="arrow-right" icon-position="right">Spring Boot と Kotlin を使ってみる</a>

### Ktor

[Ktor](https://github.com/kotlin/ktor)は、KotlinでWebアプリケーションを作成するためのJetBrains製フレームワークです。高いスケーラビリティのためにコルーチンを利用し、使いやすく慣用的な（idiomatic）APIを提供します。

<a href="https://ktor.io/docs/server-create-a-new-project.html" as="button" mode="rock" icon="arrow-right" icon-position="right">Ktor プロジェクトを新しく作成する</a>

### その他のフレームワーク

Kotlin向けのバックエンドフレームワークの例をいくつか紹介します。

| フレームワーク | 説明 |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin) | Kotlinの使用をファーストクラスでサポートするオープンソースフレームワークです。QuarkusはKubernetesのためにゼロから構築されており、数百もの最高クラスのライブラリを活用して、まとまりのあるフルスタックフレームワークを提供します。 |
| [Vert.x](https://vertx.io) | JVM上でリアクティブなWebアプリケーションを構築するためのフレームワークです。Vert.xは、[Kotlinコルーチンの統合](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/)を含む、Kotlin向けの[専用サポート](https://github.com/vert-x3/vertx-lang-kotlin)を提供しています。 |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | WebアプリケーションでHTMLを構築するために使用できるDSLです。JSPやFreeMarkerなどの従来のテンプレートシステムの代替として機能します。 |
| [Micronaut](https://micronaut.io/) | モジュール式でテストが容易なマイクロサービスやサーバーレスアプリケーションを構築するための、モダンなJVMベースのフルスタックフレームワークです。ウェビナー[「Micronaut for microservices with Kotlin」](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)を視聴し、Micronautフレームワークで[Kotlin拡張関数](extensions.md#extension-functions)を使用する方法を示す詳細な[ガイド](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)を探索してください。 |
| [http4k](https://http4k.org/) | 純粋なKotlinで書かれた、Kotlin HTTPアプリケーション用のフットプリントが小さい関数型ツールキットです。http4kは、完全に形成されたプロジェクトテンプレートを生成するための[CLI対応ツールボックス](https://toolbox.http4k.org)と、選択したバックエンド、モジュール、ビルドツールを使用して動作するhttp4kアプリケーションをブートストラップするためのWebベースの[プロジェクトウィザード](https://toolbox.http4k.org/project)を提供しています。 |
| [Javalin](https://javalin.io) | KotlinおよびJava向けの非常に軽量なWebフレームワークで、WebSocket、HTTP2、および非同期リクエストをサポートしています。 |

## アプリケーションのデプロイ

Kotlinアプリケーションは、Amazon Web Services（AWS）、Google Cloud Platform（GCP）などを含む、Java Webアプリケーションをサポートする任意のホストにデプロイできます。

* **AWS** は、サービスとやり取りするための専用の [Kotlin用SDK](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html) を提供しています。サーバーレスデプロイについては、[AWS Lambda の Kotlin コード例](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html)を参照してください。
* **Ktor** を使用すると、Kotlinアプリケーションをさまざまなクラウドプロバイダーに公開できます。たとえば、Ktorのチュートリアルに従って、[Google App Engine](https://ktor.io/docs/google-app-engine.html) やその他のサービスへのデプロイについて詳しく学ぶことができます。
* **Spring** アプリケーションも、ほとんどの主要なクラウドプロバイダーと互換性があります。Spring Bootアプリケーションをクラウドにデプロイする方法については、[Spring公式ドキュメント](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html)を参照してください。

## コミュニティに参加する

* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) か、[#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4) や [#server](https://kotlinlang.slack.com/archives/C0B8RC352) チャンネルに参加してください。
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: [「kotlin」](https://stackoverflow.com/questions/tagged/kotlin)、[「spring-kotlin」](https://stackoverflow.com/questions/tagged/spring-kotlin)、[「ktor」](https://stackoverflow.com/questions/tagged/ktor) タグを購読してください。
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube チャンネル**: チャンネル登録して [Kotlin と Spring に関する動画](https://www.youtube.com/playlist?list=PLlFc5cFwUnmxOJL0GSSZ1Vot4KL2Vwe7x) を視聴しましょう。

## 次のステップ

* [KotlinとJUnitを使用してJava Mavenプロジェクトをテストする方法を学ぶ](jvm-test-using-junit.md)
* [Ktorで非同期サーバーアプリケーションを構築する方法を探索する](https://ktor.io/docs/server-create-a-new-project.html)