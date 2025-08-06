[//]: # (title: プロジェクトに依存関係を追加する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
    <br/>   
    <p>これは「<strong>共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する</strong>」チュートリアルの第3部です。進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin Multiplatformアプリを作成する</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">ユーザーインターフェースを更新する</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>依存関係を追加する</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> さらにロジックを共有する<br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトをまとめる<br/>
    </p>
</tldr>

最初のクロスプラットフォームKotlin Multiplatformプロジェクトはすでに作成しましたね！次に、サードパーティライブラリに依存関係を追加する方法を学びましょう。これは、成功するクロスプラットフォームアプリケーションを構築するために必要です。

## 依存関係の種類

Kotlin Multiplatformプロジェクトで使用できる依存関係には、次の2種類があります。

*   _マルチプラットフォーム依存関係_。これらは複数のターゲットをサポートするマルチプラットフォームライブラリであり、共通ソースセットである`commonMain`で使用できます。

    多くの最新のAndroidライブラリは、[Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/)、[Okio](https://square.github.io/okio/)のようにすでにマルチプラットフォーム対応しています。Kotlin Multiplatformライブラリを見つけるためのJetBrainsによる実験的な検索サービスである[klibs.io](https://klibs.io/)で、さらに多くのマルチプラットフォームライブラリを見つけることができます。

*   _ネイティブ依存関係_。これらは関連するエコシステムの通常のライブラリです。ネイティブプロジェクトでは、AndroidにはGradle、iOSにはCocoaPodsまたは他の依存関係マネージャーを使用して、これらを扱います。
    
    共有モジュールを扱う場合、通常、セキュリティストレージなどのプラットフォームAPIを使用したい場合には、ネイティブ依存関係が必要になります。ネイティブ依存関係は、ネイティブソースセットである`androidMain`および`iosMain`に追加できます。

どちらの種類の依存関係に対しても、ローカルリポジトリと外部リポジトリを使用できます。

## マルチプラットフォーム依存関係を追加する

> Androidアプリ開発の経験がある場合、マルチプラットフォーム依存関係の追加は、通常のAndroidプロジェクトでGradle依存関係を追加するのと似ています。唯一の違いは、ソースセットを指定する必要があることです。
>
{style="tip"}

アプリに戻り、挨拶をもう少し祝祭的なものにしましょう。デバイス情報に加えて、元日まで残りの日数を表示する機能を追加します。完全なマルチプラットフォームサポートを持つ`kotlinx-datetime`ライブラリは、共有コードで日付を扱う最も便利な方法です。

1.  `shared`ディレクトリにある`build.gradle.kts`ファイルを開きます。
2.  次の依存関係とKotlin timeオプトインを`commonMain`ソースセットの依存関係に追加します。

    ```kotlin
    kotlin {
        //... 
        sourceSets
            languageSettings.optIn("kotlin.time.ExperimentalTime")
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            } 
        }
    }
    ```

3.  **Gradleの変更を同期**ボタンをクリックして、Gradleファイルを同期します。 ![Synchronize Gradle files](gradle-sync.png){width=50}
4.  `shared/src/commonMain/kotlin`にある、`Greeting.kt`ファイルと同じプロジェクトディレクトリに、新しいファイル`NewYear.kt`を作成します。
5.  `date-time`日付演算を使用して、今日から新年までの日数を計算する短い関数でファイルを更新します。
   
   ```kotlin
   import kotlinx.datetime.*
   import kotlin.time.Clock
   
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   
   fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   ```

6.  `Greeting.kt`で、結果を確認するために`Greeting`クラスを更新します。
    
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

7.  結果を確認するには、IntelliJ IDEAから**composeApp**および**iosApp**の構成を再実行します。

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## 次のステップ

チュートリアルの次のパートでは、さらに多くの依存関係とより複雑なロジックをプロジェクトに追加します。

**[次のパートに進む](multiplatform-upgrade-app.md)**

### 参照

*   あらゆる種類のマルチプラットフォーム依存関係（[Kotlinライブラリ、Kotlin Multiplatformライブラリ、その他のマルチプラットフォームプロジェクト](multiplatform-add-dependencies.md)）を扱う方法について学ぶ。
*   プラットフォーム固有のソースセットで使用する[Android依存関係](multiplatform-android-dependencies.md)および[CocoaPodsを使用するか否かに関わらずiOS依存関係](multiplatform-ios-dependencies.md)を追加する方法について学ぶ。
*   サンプルプロジェクトで[AndroidおよびiOSライブラリを使用する方法](multiplatform-samples.md)の例を確認する。

## ヘルプ

*   **Kotlin Slack**。[招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい問題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。