---
title: Kotlinを始めよう
slug: /
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin は、開発者をより幸せにするように設計された、現代的でありながらすでに成熟したプログラミング言語です。
簡潔、安全で、Java や他の言語との相互運用が可能であり、生産的なプログラミングのために複数のプラットフォーム間でコードを再利用する多くの方法を提供します。

まず、Kotlin のツアーに参加してみませんか？このツアーでは、Kotlin プログラミング言語の基礎を学び、ブラウザ内で完全に完了することができます。

<a href="kotlin-tour-welcome"><img src="/img/start-kotlin-tour.svg" width="700" alt="Start the Kotlin tour" /></a>

## Kotlin をインストールする

Kotlin は、各[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) および [Android Studio](https://developer.android.com/studio) のリリースに含まれています。
これらの IDE のいずれかをダウンロードしてインストールし、Kotlin の使用を開始してください。

## Kotlin のユースケースを選択する
 
<Tabs>

<TabItem value="console" label="Console">

ここでは、コンソールアプリケーションを開発し、Kotlin でユニットテストを作成する方法を学びます。

1. **[IntelliJ IDEA](https://www.jetbrains.com/idea/) プロジェクトウィザードを使用して、基本的な JVM アプリケーションを作成します ([Create a basic JVM application with the IntelliJ IDEA project wizard](jvm-get-started))。**

2. **[最初のユニットテストを記述します](jvm-test-using-junit)。**

3. **Kotlin コミュニティに参加する:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) タグを購読する。

4. **Kotlin をフォローする**:
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

何か問題が発生した場合は、[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)に課題を報告してください。

</TabItem>

<TabItem value="backend" label="Backend">

ここでは、Kotlin サーバーサイドでバックエンドアプリケーションを開発する方法を学びます。

1. **最初のバックエンドアプリケーションを作成する:**

     * [Spring Boot で RESTful な Web サービスを作成する](jvm-get-started-spring-boot)
     * [Ktor で HTTP API を作成する](https://ktor.io/docs/creating-http-apis.html)

2. **[アプリケーションで Kotlin と Java のコードを混在させる方法を学ぶ](mixing-java-kotlin-intellij)。**

3. **Kotlin サーバーサイドコミュニティに参加する:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) タグを購読する。

4. **Kotlin をフォローする**:

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

何か問題が発生した場合は、[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)に課題を報告してください。

</TabItem>

<TabItem value="cross-platform-mobile" label="Cross-platform">

ここでは、[Kotlin Multiplatform](multiplatform-intro) を使用してクロスプラットフォームアプリケーションを開発する方法を学びます。

1. **[クロスプラットフォーム開発の環境をセットアップする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)。**

2. **iOS および Android 用の最初のアプリケーションを作成する:**

   * クロスプラットフォームアプリケーションを最初から作成し、以下を行います:
     * [UI をネイティブに保ちながらビジネスロジックを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [ビジネスロジックと UI を共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [既存の Android アプリケーションを iOS で動作させる](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [Ktor および SQLdelight を使用してクロスプラットフォームアプリケーションを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **[サンプルプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) を調べる。**

4. **Kotlin Multiplatform コミュニティに参加する:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) し、[#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) および [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加する。
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin-multiplatform" tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform) を購読する。

5. **Kotlin をフォローする**:

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

何か問題が発生した場合は、[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)に課題を報告してください。

</TabItem>

<TabItem value="android" label="Android">

Android 開発で Kotlin の使用を開始するには、[Android での Kotlin の使用開始に関する Google の推奨事項](https://developer.android.com/kotlin/get-started) を参照してください。

<img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack で Android コミュニティに参加する: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) し、[#android](https://kotlinlang.slack.com/archives/C0B8M7BUY) チャンネルに参加する。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin), <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org), および <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/) で Kotlin をフォローして、重要なエコシステムのアップデートを見逃さないようにしてください。

</TabItem>

<TabItem value="data-analysis" label="Data analysis">

データパイプラインの構築から、機械学習モデルのプロダクション化まで、Kotlin はデータを取り扱い、最大限に活用するための優れた選択肢です。

1. **IDE 内でノートブックをシームレスに作成および編集する:**

   * [Kotlin Notebook の使用を開始する](get-started-with-kotlin-notebooks)

2. **データを探索および実験する:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – データ分析および操作用のライブラリ。
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – データ視覚化用のプロットツール。

3. **Data Analysis 用の Kotlin に関する最新のアップデートを入手する:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) し、[#datascience](https://kotlinlang.slack.com/archives/C4W52CFEZ) チャンネルに参加する。
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> Twitter: [KotlinForData](http://twitter.com/KotlinForData) をフォローする。

4. **Kotlin をフォローする**:
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

</TabItem>

</Tabs>

## 何か不足していますか？

このページに不足しているものやわかりにくいものがある場合は、[フィードバックを共有してください](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df)。