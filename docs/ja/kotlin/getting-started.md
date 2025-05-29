[//]: # (title: Kotlin入門)

<tldr>
<p>最新のKotlinリリース:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlinは、開発者をより幸せにするように設計された、モダンでありながら既に成熟したプログラミング言語です。
それは簡潔で、安全で、Javaや他の言語との相互運用性があり、生産的なプログラミングのために複数のプラットフォーム間でコードを再利用する多くの方法を提供します。

始めるにあたって、Kotlinツアーに参加してみませんか？このツアーでは、Kotlinプログラミング言語の基礎を網羅しており、完全にブラウザ内で完了できます。

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="Kotlinツアーを開始" style="block"/></a>

## Kotlinのインストール

Kotlinは、各[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)および[Android Studio](https://developer.android.com/studio)のリリースに含まれています。
これらのIDEのいずれかをダウンロードしてインストールし、Kotlinの利用を開始してください。

## Kotlinのユースケースを選択
 
<tabs>

<tab id="console" title="コンソール">

ここでは、Kotlinでコンソールアプリケーションを開発し、単体テストを作成する方法を学びます。

1. **[IntelliJ IDEAのプロジェクトウィザードで基本的なJVMアプリケーションを作成する](jvm-get-started.md)。**

2. **[最初の単体テストを作成する](jvm-test-using-junit.md)。**

</tab>

<tab id="backend" title="バックエンド">

ここでは、Kotlinサーバーサイドでバックエンドアプリケーションを開発する方法を学びます。

1. **最初のバックエンドアプリケーションを作成する:**

     * [Spring BootでRESTfulウェブサービスを作成する](jvm-get-started-spring-boot.md)
     * [KtorでHTTP APIを作成する](https://ktor.io/docs/creating-http-apis.html)

2. **[アプリケーションでKotlinとJavaのコードを混在させる方法を学ぶ](mixing-java-kotlin-intellij.md)。**

</tab>

<tab id="cross-platform-mobile" title="クロスプラットフォーム">

ここでは、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を使用してクロスプラットフォームアプリケーションを開発する方法を学びます。

1. **[クロスプラットフォーム開発のための環境をセットアップする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html)。**

2. **iOSとAndroid向けの最初のアプリケーションを作成する:**

   * ゼロからクロスプラットフォームアプリケーションを作成し、以下を行う:
     * [UIをネイティブに保ちながらビジネスロジックを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [ビジネスロジックとUIを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [既存のAndroidアプリケーションをiOSで動作させる](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [KtorとSQLDelightを使用してクロスプラットフォームアプリケーションを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **[サンプルプロジェクトを探索する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html)**。

</tab>

<tab id="android" title="Android">

Android開発でKotlinの利用を開始するには、[AndroidでKotlinを始めるためのGoogleの推奨事項](https://developer.android.com/kotlin/get-started)をお読みください。

</tab>

<tab id="data-analysis" title="データ分析">

データパイプラインの構築から機械学習モデルの実運用化まで、Kotlinはデータを扱い、最大限に活用するための優れた選択肢です。

1. **IDE内でシームレスにノートブックを作成および編集する:**

   * [Kotlin Notebookの利用を開始する](get-started-with-kotlin-notebooks.md)

2. **データを探索および実験する:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – データ分析および操作のためのライブラリです。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – データ可視化のためのプロットツールです。

3. **TwitterでKotlin for Data Analysisをフォローする:** [KotlinForData](http://twitter.com/KotlinForData)。

</tab>

</tabs>

## Kotlinコミュニティに参加する

Kotlinエコシステム全体の最新情報を常に把握し、あなたの経験を共有しましょう。

* 参加してください:
  * ![Slack](slack.svg){width=25}{type="joined"} Slack: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 「kotlin」タグを購読する([https://stackoverflow.com/questions/tagged/kotlin](https://stackoverflow.com/questions/tagged/kotlin))。
* Kotlinをフォローする: ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)、 ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)、 ![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org)、および ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)。
* [Kotlinニュースを購読する](https://info.jetbrains.com/kotlin-communication-center.html)。

何か困難や問題に遭遇した場合は、私たちの[課題トラッカー](https://youtrack.jetbrains.com/issues/KT)で問題を報告してください。

## 不足しているものはありますか？

このページに何か不足している点や分かりにくい点があれば、[フィードバックをお寄せください](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。