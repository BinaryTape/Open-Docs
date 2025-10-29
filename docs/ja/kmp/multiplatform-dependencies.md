[//]: # (title: プロジェクトに依存関係を追加する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートを共有しています。</p>
    <br/>   
    <p>これは「<strong>共有ロジックとネイティブUIを備えたKotlin Multiplatformアプリを作成する</strong>」チュートリアルの第3部です。進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">Kotlin Multiplatformアプリを作成する</Links><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/multiplatform-update-ui" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">ユーザーインターフェースを更新する</Links><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>依存関係を追加する</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> より多くのロジックを共有する<br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトを完了する<br/>
    </p>
</tldr>

最初のクロスプラットフォームKotlin Multiplatformプロジェクトはすでに作成しましたね！ここでは、成功するクロスプラットフォームアプリケーションを構築するために不可欠な、サードパーティライブラリへの依存関係の追加方法を学びましょう。

## 依存関係の種類

Kotlin Multiplatformプロジェクトで利用できる依存関係には、次の2種類があります。

* _Multiplatform依存関係_。これらは、複数のターゲットをサポートし、共通ソースセット `commonMain` で使用できるマルチプラットフォームライブラリです。

  多くの最新のAndroidライブラリは、すでに[Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/)、[Okio](https://square.github.io/okio/)のようにマルチプラットフォームをサポートしています。JetBrainsが提供するKotlin Multiplatformライブラリ発見のための実験的な検索サービスである[klibs.io](https://klibs.io/)で、さらに多くのマルチプラットフォームライブラリを見つけることができます。

* _ネイティブ依存関係_。これらは関連するエコシステムの通常のライブラリです。ネイティブプロジェクトでは、AndroidではGradleを、iOSではCocoaPodsまたは別の依存関係マネージャーを使用して作業するのが一般的です。
  
  共有モジュールで作業する場合、通常、セキュリティストレージなどのプラットフォームAPIを使用したい場合は、依然としてネイティブ依存関係が必要です。ネイティブ依存関係は、ネイティブソースセット `androidMain` および `iosMain` に追加できます。

どちらのタイプの依存関係でも、ローカルおよび外部リポジトリを使用できます。

## マルチプラットフォーム依存関係を追加する

> Androidアプリ開発の経験がある場合、マルチプラットフォーム依存関係の追加は、通常のAndroidプロジェクトでGradle依存関係を追加するのと似ています。唯一の違いは、ソースセットを指定する必要があることです。
>
{style="tip"}

アプリに戻って、挨拶を少しお祝いムードにしてみましょう。デバイス情報に加えて、新年までの残り日数を表示する関数を追加します。`kotlinx-datetime`ライブラリは、完全にマルチプラットフォームをサポートしており、共有コードで日付を扱う最も便利な方法です。

1. `shared`ディレクトリにある`build.gradle.kts`ファイルを開きます。
2. 次の依存関係とKotlin time opt-inを`commonMain`ソースセットの依存関係に追加します。

    ```kotlin
    kotlin {
        //... 
        sourceSets {
            all { languageSettings.optIn("kotlin.time.ExperimentalTime") }
   
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            } 
        }
    }
    ```

3. 「**Build | Sync Project with Gradle Files**」メニュー項目を選択するか、ビルドスクリプトエディターで**Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します: ![Synchronize Gradle files](gradle-sync.png){width=50}
4. `shared/src/commonMain/.../greetingkmp` ディレクトリを右クリックし、「**New | Kotlin Class/File**」を選択して、新しいファイル `NewYear.kt` を作成します。
5. `datetime`の日付計算を使用して、今日から新年までの日数を計算する短い関数でファイルを更新します。
   
   ```kotlin
   @OptIn(ExperimentalTime::class)
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   
   fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   ```
6. IDEが提案するように、必要なすべてのインポートを追加します。
7. `Greeting.kt`ファイルで、結果を確認するために`Greeting`クラスを更新します。
    
    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
   
        fun greet(): List<String> = buildList {
            add(if (Random.nextBoolean()) "Hi!" else "Hello!")
            add("Guess what this is! > ${platform.name.reversed()}!")
            add(daysPhrase())
        }
    }
    ```

8. 結果を確認するには、IntelliJ IDEAから**composeApp**と**iosApp**の構成を再実行します。

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## 次のステップ

チュートリアルの次のパートでは、さらに多くの依存関係とより複雑なロジックをプロジェクトに追加します。

**[次のパートに進む](multiplatform-upgrade-app.md)**

### 関連項目

* あらゆる種類のマルチプラットフォーム依存関係の操作方法について説明します：[Kotlinライブラリ、Kotlin Multiplatformライブラリ、その他のマルチプラットフォームプロジェクト](multiplatform-add-dependencies.md)。
* プラットフォーム固有のソースセットで使用するための[Android依存関係の追加方法](multiplatform-android-dependencies.md)と、[CocoaPodsを使用するかどうかにかかわらずiOS依存関係の追加方法](multiplatform-ios-dependencies.md)を学びます。
* サンプルプロジェクトで[AndroidおよびiOSライブラリを使用する方法](multiplatform-samples.md)の例を確認します。

## ヘルプ

* **Kotlin Slack**。[招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
* **Kotlinイシュートラッカー**。[新しいイシューを報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。