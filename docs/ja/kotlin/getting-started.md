[//]: # (title: Kotlin の使用を開始する)

<tldr>
<p>最新のKotlinリリース:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin は、開発者の生産性を高めるために設計された、モダンでありながら成熟したプログラミング言語です。
簡潔で安全、Java やその他の言語との相互運用性に優れ、複数のプラットフォーム間でコードを再利用する多くの方法を提供し、生産的なプログラミングを可能にします。

始めるにあたり、Kotlin ツアーに参加してみてはいかがでしょうか？このツアーでは Kotlin プログラミング言語の基本を学び、
すべてブラウザ内で完結できます。

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="Kotlin ツアーを開始する" style="block"/></a>

## Kotlin のインストール

Kotlin は、各 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) および [Android Studio](https://developer.android.com/studio) のリリースに含まれています。
これらの IDE のいずれかをダウンロードしてインストールし、Kotlin の使用を開始してください。

## Kotlin のユースケースを選択する
 
<tabs>

<tab id="console" title="コンソール">

ここでは、Kotlin を使用してコンソールアプリケーションを開発し、ユニットテストを作成する方法を学びます。

1. **[IntelliJ IDEA のプロジェクトウィザードで基本的な JVM アプリケーションを作成する](jvm-get-started.md)。**

2. **[最初のユニットテストを作成する](jvm-test-using-junit.md)。**

</tab>

<tab id="backend" title="バックエンド">

ここでは、Kotlin サーバーサイドを使用してバックエンドアプリケーションを開発する方法を学びます。

1. **最初のバックエンドアプリケーションを作成する:**

     * [Spring Boot を使用して RESTful ウェブサービスを作成する](jvm-get-started-spring-boot.md)
     * [Ktor を使用して HTTP API を作成する](https://ktor.io/docs/creating-http-apis.html)

2. **[アプリケーションで Kotlin と Java のコードを混在させる方法を学ぶ](mixing-java-kotlin-intellij.md)。**

</tab>

<tab id="cross-platform-mobile" title="クロスプラットフォーム">

ここでは、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) を使用してクロスプラットフォームアプリケーションを開発する方法を学びます。

1. **[クロスプラットフォーム開発のための環境をセットアップする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html)。**

2. **iOS および Android 用の最初のアプリケーションを作成する:**

   * クロスプラットフォームアプリケーションをゼロから作成し、以下を実行します。
     * [UI をネイティブに保ちながらビジネスロジックを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [ビジネスロジックと UI を共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [既存の Android アプリケーションを iOS で動作させる](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [Ktor と SQLdelight を使用してクロスプラットフォームアプリケーションを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **[サンプルプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) を探索する。**

</tab>

<tab id="android" title="Android">

Android 開発で Kotlin の使用を開始するには、[Android での Kotlin の使用開始に関する Google の推奨事項](https://developer.android.com/kotlin/get-started) をお読みください。

</tab>

<tab id="data-analysis" title="データ分析">

データパイプラインの構築から機械学習モデルの実運用化まで、Kotlin はデータを扱い、最大限に活用するための優れた選択肢です。

1. **IDE 内でシームレスにノートブックを作成および編集する:**

   * [Kotlin Notebook を始める](get-started-with-kotlin-notebooks.md)

2. **データを探索および実験する:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – データ分析および操作のためのライブラリ。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – データ可視化のためのプロットツール。

3. **Twitter で Kotlin for Data Analysis をフォローする:** [KotlinForData](http://twitter.com/KotlinForData)。

</tab>

</tabs>

## Kotlin コミュニティに参加する

Kotlin エコシステム全体の最新情報に常に触れ、あなたの経験を共有しましょう。

* 以下で私たちに参加してください:
  * ![Slack](slack.svg){width=25}{type="joined"} Slack: [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 「kotlin」タグを[購読する](https://stackoverflow.com/questions/tagged/kotlin)。
* Kotlin を以下でフォローしてください: ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)、![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)、![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org)、![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)。
* [Kotlin ニュース](https://info.jetbrains.com/kotlin-communication-center.html)を購読する。

何か困難や問題に遭遇した場合は、私たちの[課題トラッカー](https://youtrack.jetbrains.com/issues/KT)で問題を報告してください。

## 何か足りませんか？

このページに何か不足している点や分かりにくい点があれば、[フィードバックを共有](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)してください。