---
title: "サーバーサイド Kotlin"
---
Kotlin は、サーバーサイドアプリケーションの開発に非常に適しています。簡潔で表現力豊かなコードを記述でき、既存の Java ベースのテクノロジースタックとの完全な互換性を維持しながら、スムーズな学習曲線を実現できます。

* **表現力**: Kotlin の革新的な言語機能 ([type-safe builders](type-safe-builders) や [delegated properties](delegated-properties) のサポートなど) は、強力で使いやすい抽象化の構築に役立ちます。
* **スケーラビリティ**: Kotlin の [coroutines](coroutines-overview) のサポートは、適度なハードウェア要件で膨大な数のクライアントにスケールするサーバーサイドアプリケーションの構築に役立ちます。
* **相互運用性**: Kotlin はすべての Java ベースのフレームワークと完全に互換性があるため、よりモダンな言語の利点を享受しながら、使い慣れたテクノロジースタックを使用できます。
* **移行**: Kotlin は、大規模なコードベースを Java から Kotlin への段階的な移行をサポートしています。システムの古い部分を Java で保持しながら、新しいコードを Kotlin で記述できます。
* **ツール**: 一般的な優れた IDE サポートに加えて、Kotlin は IntelliJ IDEA Ultimate のプラグインでフレームワーク固有のツール (たとえば、Spring および Ktor 用) を提供します。
* **学習曲線**: Java 開発者にとって、Kotlin の学習は非常に簡単です。Kotlin プラグインに含まれている自動 Java-to-Kotlin コンバーターは、最初のステップに役立ちます。[Kotlin Koans](koans) は、一連のインタラクティブな演習を通じて主要な言語機能をガイドします。[Ktor](https://ktor.io/) のような Kotlin 固有のフレームワークは、大規模なフレームワークの隠れた複雑さのない、シンプルでわかりやすいアプローチを提供します。

## Kotlin を使用したサーバーサイド開発のためのフレームワーク

Kotlin のサーバーサイドフレームワークの例を次に示します。

* [Spring](https://spring.io) は、Kotlin の言語機能を利用して、バージョン 5.0 以降、[より簡潔な API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0) を提供します。[オンラインプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin)を使用すると、Kotlin で新しいプロジェクトをすばやく生成できます。

* [Ktor](https://github.com/kotlin/ktor) は、JetBrains によって構築されたフレームワークであり、Kotlin で Web アプリケーションを作成し、高いスケーラビリティのためにコルーチンを利用し、使いやすく慣用的な API を提供します。

* [Quarkus](https://quarkus.io/guides/kotlin) は、Kotlin の使用をファーストクラスでサポートします。このフレームワークはオープンソースであり、Red Hat によって維持されています。Quarkus は Kubernetes 用にゼロから構築されており、数百もの最高のライブラリを活用して、まとまりのあるフルスタックフレームワークを提供します。

* JVM 上でリアクティブ Web アプリケーションを構築するためのフレームワークである [Vert.x](https://vertx.io) は、[専用のサポート](https://github.com/vert-x3/vertx-lang-kotlin) を提供します。Kotlin 用 ([完全なドキュメント](https://vertx.io/docs/vertx-core/kotlin/) を含む)。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) は、Web アプリケーションで HTML を構築するために使用できる DSL です。これは、JSP や FreeMarker などの従来のテンプレートシステムに代わるものとして機能します。

* [Micronaut](https://micronaut.io/) は、モジュール式でテストが容易なマイクロサービスおよびサーバーレスアプリケーションを構築するための最新の JVM ベースのフルスタックフレームワークです。多くの便利な組み込み機能が付属しています。

* [http4k](https://http4k.org/) は、純粋な Kotlin で記述された、Kotlin HTTP アプリケーション用のフットプリントの小さい機能的なツールキットです。このライブラリは、Twitter の「Your Server as a Function」という論文に基づいており、HTTP サーバーとクライアントの両方を、相互に構成できる単純な Kotlin 関数としてモデル化することを表しています。

* [Javalin](https://javalin.io) は、Kotlin および Java 用の非常に軽量な Web フレームワークであり、WebSockets、HTTP2、および非同期リクエストをサポートしています。

* 永続性の利用可能なオプションには、直接 JDBC アクセス、JPA、および Java ドライバーを介した NoSQL データベースの使用が含まれます。JPA の場合、[kotlin-jpa compiler plugin](no-arg-plugin#jpa-support) は、Kotlin でコンパイルされたクラスをフレームワークの要件に適合させます。

:::note
詳細については、[https://kotlin.link/](https://kotlin.link/resources) を参照してください。

:::

## Kotlin サーバーサイドアプリケーションのデプロイ

Kotlin アプリケーションは、Amazon Web Services、Google Cloud Platform など、Java Web アプリケーションをサポートする任意のホストにデプロイできます。

[Heroku](https://www.heroku.com) に Kotlin アプリケーションをデプロイするには、[公式 Heroku チュートリアル](https://devcenter.heroku.com/articles/getting-started-with-kotlin) に従ってください。

AWS Labs は、[AWS Lambda](https://aws.amazon.com/lambda/) 関数を作成するための Kotlin の使用を示す[サンプルプロジェクト](https://github.com/awslabs/serverless-photo-recognition)を提供しています。

Google Cloud Platform は、[Ktor および App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) と [Spring および App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8) の両方について、Kotlin アプリケーションを GCP にデプロイするための一連のチュートリアルを提供しています。さらに、Kotlin Spring アプリケーションをデプロイするための[インタラクティブなコードラボ](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) があります。

## サーバーサイドで Kotlin を使用する製品

[Corda](https://www.corda.net/) は、主要な銀行によってサポートされ、完全に Kotlin で構築されたオープンソースの分散台帳プラットフォームです。

[JetBrains Account](https://account.jetbrains.com/) は、JetBrains のライセンス販売および検証プロセス全体を担当するシステムであり、100% Kotlin で記述されており、2015 年から主要な問題なく本番環境で実行されています。

[Chess.com](https://www.chess.com/) は、チェスとゲームを愛する世界中の何百万人ものプレイヤーに特化した Web サイトです。Chess.com は、複数の HTTP クライアントのシームレスな構成に Ktor を使用しています。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) のエンジニアは、サーバーサイドアプリの開発に Kotlin を使用し、Adobe Experience Platform でのプロトタイピングに Ktor を使用しています。これにより、組織はデータサイエンスと機械学習を適用する前に、顧客データを一元化および標準化できます。

## 次のステップ

* 言語の詳細な紹介については、このサイトの Kotlin ドキュメントと [Kotlin Koans](koans) を参照してください。
* Kotlin コルーチンを使用するフレームワークである [Ktor で非同期サーバーアプリケーションを構築する方法](https://ktor.io/docs/server-create-a-new-project.html) を確認してください。
* ウェビナー「Micronaut for microservices with Kotlin」([Micronaut for microservices with Kotlin](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)) を視聴し、Micronaut フレームワークで [Kotlin 拡張関数](extensions#extension-functions) を使用する方法を示す詳細な[ガイド](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html) を調べてください。
* http4k は、完全に形成されたプロジェクトを生成するための [CLI](https://toolbox.http4k.org) と、単一の bash コマンドで GitHub、Travis、Heroku を使用して CD パイプライン全体を生成するための [スターター](https://start.http4k.org) リポジトリを提供します。
* Java から Kotlin に移行しますか？[Java および Kotlin で文字列を使用して一般的なタスクを実行する方法](java-to-kotlin-idioms-strings) を学びます。