[//]: # (title: サーバーサイドKotlin)

Kotlinは、サーバーサイドアプリケーションの開発に非常に適しています。既存のJavaベースのテクノロジースタックとの完全な互換性を維持しつつ、簡潔で表現豊かなコードを記述でき、学習曲線もスムーズです。

*   **表現力**: Kotlinの革新的な言語機能、例えば[型安全なビルダー](type-safe-builders.md)や[デリゲートプロパティ](delegated-properties.md)のサポートは、強力で使いやすい抽象化の構築に役立ちます。
*   **スケーラビリティ**: Kotlinの[コルーチン](coroutines-overview.md)のサポートは、少ないハードウェア要件で多数のクライアントにスケールするサーバーサイドアプリケーションの構築に役立ちます。
*   **相互運用性**: KotlinはすべてのJavaベースのフレームワークと完全に互換性があるため、慣れ親しんだテクノロジースタックを使用しながら、よりモダンな言語のメリットを享受できます。
*   **移行**: Kotlinは、大規模なコードベースをJavaからKotlinへ段階的に移行することをサポートします。システムの古い部分はJavaのままにして、新しいコードはKotlinで書き始めることができます。
*   **ツール**: 一般的な優れたIDEサポートに加え、KotlinはIntelliJ IDEA Ultimateのプラグインで、フレームワーク固有のツール（SpringやKtorなど）を提供します。
*   **学習曲線**: Java開発者にとって、Kotlinを始めるのは非常に簡単です。Kotlinプラグインに付属する自動Java-Kotlin変換ツールが、最初のステップをサポートします。[Kotlin Koans](koans.md)は、一連のインタラクティブな演習を通して主要な言語機能をガイドします。[Ktor](https://ktor.io/)のようなKotlinに特化したフレームワークは、大規模なフレームワークに見られる隠れた複雑さを伴わない、シンプルで分かりやすいアプローチを提供します。

## Kotlinでのサーバーサイド開発向けフレームワーク

Kotlin向けのサーバーサイドフレームワークの例をいくつか示します。

*   [Spring](https://spring.io)は、バージョン5.0以降、Kotlinの言語機能を活用して[より簡潔なAPI](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)を提供しています。[オンラインプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin)を使用すると、Kotlinで新しいプロジェクトを素早く生成できます。

*   [Ktor](https://github.com/kotlin/ktor)は、JetBrainsが開発した、KotlinでWebアプリケーションを作成するためのフレームワークで、高いスケーラビリティのためにコルーチンを利用し、使いやすくイディオマティックなAPIを提供します。

*   [Quarkus](https://quarkus.io/guides/kotlin)は、Kotlinの使用に対するファーストクラスのサポートを提供します。このフレームワークはオープンソースであり、Red Hatによってメンテナンスされています。QuarkusはKubernetes向けにゼロから構築されており、増加し続ける何百もの最高品質のライブラリを活用することで、一貫性のあるフルスタックフレームワークを提供します。

*   JVM上でリアクティブなWebアプリケーションを構築するためのフレームワークである[Vert.x](https://vertx.io)は、[完全なドキュメント](https://vertx.io/docs/vertx-core/kotlin/)を含むKotlin用の[専用サポート](https://github.com/vert-x3/vertx-lang-kotlin)を提供しています。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html)は、WebアプリケーションでHTMLを構築するために使用できるDSLです。JSPやFreeMarkerのような従来のテンプレートシステムに代わるものとして機能します。

*   [Micronaut](https://micronaut.io/)は、モジュール式でテストしやすいマイクロサービスやサーバーレスアプリケーションを構築するための、最新のJVMベースのフルスタックフレームワークです。多くの便利な組み込み機能が付属しています。

*   [http4k](https://http4k.org/)は、純粋なKotlinで書かれた、Kotlin HTTPアプリケーション向けの小さなフットプリントを持つ関数型ツールキットです。このライブラリはTwitterの「Your Server as a Function」論文に基づいており、HTTPサーバーとクライアントの両方を、組み合わせ可能なシンプルなKotlin関数としてモデル化することを表しています。

*   [Javalin](https://javalin.io)は、WebSockets、HTTP/2、非同期リクエストをサポートする、KotlinおよびJava向けの非常に軽量なWebフレームワークです。

*   永続化の選択肢には、直接JDBCアクセス、JPA、そしてJavaドライバーを介したNoSQLデータベースの使用があります。JPAの場合、[kotlin-jpaコンパイラプラグイン](no-arg-plugin.md#jpa-support)が、Kotlinでコンパイルされたクラスをフレームワークの要件に適合させます。
  
> その他のフレームワークは[https://kotlin.link/](https://kotlin.link/resources)で見つけることができます。
>
{style="note"}

## Kotlinサーバーサイドアプリケーションのデプロイ

Kotlinアプリケーションは、Amazon Web Services、Google Cloud Platformなど、Java Webアプリケーションをサポートするあらゆるホストにデプロイできます。

[Heroku](https://www.heroku.com)にKotlinアプリケーションをデプロイするには、[Heroku公式チュートリアル](https://devcenter.heroku.com/articles/getting-started-with-kotlin)を参照してください。

AWS Labsは、[AWS Lambda](https://aws.amazon.com/lambda/)関数を記述するためにKotlinを使用する方法を示す[サンプルプロジェクト](https://github.com/awslabs/serverless-photo-recognition)を提供しています。

Google Cloud Platformは、[KtorとApp Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8)および[SpringとApp Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)の両方で、GCPにKotlinアプリケーションをデプロイするための一連のチュートリアルを提供しています。さらに、Kotlin Springアプリケーションをデプロイするための[インタラクティブなコードラボ](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)もあります。

## サーバーサイドでKotlinを使用している製品

[Corda](https://www.corda.net/)は、主要銀行によってサポートされ、完全にKotlinで構築されているオープンソースの分散型台帳プラットフォームです。

JetBrainsでのライセンス販売および検証プロセス全体を担当するシステムである[JetBrains Account](https://account.jetbrains.com/)は、100% Kotlinで記述されており、2015年からプロダクション稼働中で、重大な問題は発生していません。

[Chess.com](https://www.chess.com/)は、チェスと、世界中のこのゲームを愛する何百万ものプレイヤーに特化したウェブサイトです。Chess.comは、複数のHTTPクライアントのシームレスな構成のためにKtorを使用しています。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a)のエンジニアは、サーバーサイドアプリ開発にKotlinを、Adobe Experience Platformでのプロトタイプ作成にKtorを使用しています。これにより、組織はデータサイエンスと機械学習を適用する前に、顧客データを一元化および標準化できます。

## 次のステップ

*   言語についてより深く掘り下げるには、このサイトのKotlinドキュメントと[Kotlin Koans](koans.md)をご覧ください。
*   Kotlinコルーチンを使用するフレームワークである[Ktorで非同期サーバーアプリケーションを構築する](https://ktor.io/docs/server-create-a-new-project.html)方法を探ってみましょう。
*   ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)のウェビナーを視聴し、Micronautフレームワークで[Kotlin拡張関数](extensions.md#extension-functions)を使用する方法を示す詳細な[ガイド](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)をご覧ください。
*   http4kは、完全な形式のプロジェクトを生成するための[CLI](https://toolbox.http4k.org)と、GitHub、Travis、Herokuを使用して単一のbashコマンドで完全なCDパイプラインを生成するための[スターターリポジトリ](https://start.http4k.org)を提供します。
*   JavaからKotlinに移行したいですか？[JavaとKotlinで文字列の一般的なタスクを実行する](java-to-kotlin-idioms-strings.md)方法を学びましょう。