[//]: # (title: Kotlin Multiplatformアプリの作成)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に実行できます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
    <br/>
    <p>これは、<strong>共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する</strong>チュートリアルの最初のパートです。</p>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ"/> <strong>Kotlin Multiplatformアプリを作成する</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="2番目のステップ"/> ユーザーインターフェースを更新する<br/>
       <img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> 依存関係を追加する<br/>       
       <img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> さらにロジックを共有する<br/>
       <img src="icon-5-todo.svg" width="20" alt="5番目のステップ"/> プロジェクトを完了する<br/>
    </p>
</tldr>

ここでは、IntelliJ IDEAを使用して初めてのKotlin Multiplatformアプリケーションを作成し、実行する方法を学びます。

Kotlin Multiplatformテクノロジーは、クロスプラットフォームプロジェクトの開発を簡素化します。
Kotlin Multiplatformアプリケーションは、iOS、Android、macOS、Windows、Linux、Webなど、さまざまなプラットフォームで動作します。

Kotlin Multiplatformの主要なユースケースの1つは、モバイルプラットフォーム間でコードを共有することです。
iOSアプリとAndroidアプリ間でアプリケーションロジックを共有し、ネイティブUIを実装したりプラットフォームAPIを操作したりする必要がある場合にのみ、プラットフォーム固有のコードを記述できます。

## プロジェクトを作成する

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発の環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。
4.  **New Project**ウィンドウで、以下のフィールドを指定します。
    *   **Name**: `GreetingKMP`
    *   **Group**: `com.jetbrains.greeting`
    *   **Artifact**: `greetingkmp`
    
    ![Compose Multiplatformプロジェクトの作成](create-first-multiplatform-app.png){width=800}

5.  **Android**と**iOS**のターゲットを選択します。
6.  iOSの場合、UIをネイティブに保つために**Do not share UI**オプションを選択します。
7.  すべてのフィールドとターゲットを指定したら、**Create**をクリックします。

> IntelliJ IDEAは、プロジェクトのAndroid Gradleプラグインを最新バージョンにアップグレードすることを自動的に提案する場合があります。
> Kotlin Multiplatformは最新のAGPバージョンと互換性がないため、アップグレードは推奨されません
> ([互換性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)を参照)。
>
{style="note"}

## プロジェクトの構造を調べる

IntelliJ IDEAで、`GreetingKMP`フォルダーを展開します。

このKotlin Multiplatformプロジェクトには、3つのモジュールが含まれています。

*   `_shared_`は、AndroidとiOSアプリケーションの両方に共通のロジック、つまりプラットフォーム間で共有するコードを含むKotlinモジュールです。ビルドプロセスを自動化するために、ビルドシステムとして[Gradle](https://kotlinlang.org/docs/gradle.html)を使用します。
*   `_composeApp_`は、AndroidアプリケーションにビルドされるKotlinモジュールです。ビルドシステムとしてGradleを使用します。`composeApp`モジュールは、通常のAndroidライブラリとして`shared`モジュールに依存し、それを使用します。
*   `_iosApp_`は、iOSアプリケーションにビルドされるXcodeプロジェクトです。iOSフレームワークとして`shared`モジュールに依存し、それを使用します。`shared`モジュールは、通常のフレームワークとして、または[CocoaPods依存関係](multiplatform-cocoapods-overview.md)として使用できます。デフォルトでは、IntelliJ IDEAで作成されたKotlin Multiplatformプロジェクトは、通常のフレームワーク依存関係を使用します。

![基本的なMultiplatformプロジェクトの構造](basic-project-structure.svg){width=700}

`shared`モジュールは、`androidMain`、`commonMain`、`iosMain`の3つのソースセットで構成されています。_ソースセット_は、論理的にグループ化された複数のファイルのGradleの概念で、各グループは独自の依存関係を持ちます。
Kotlin Multiplatformでは、`shared`モジュール内の異なるソースセットが異なるプラットフォームをターゲットにできます。

共通ソースセットには共有Kotlinコードが含まれ、プラットフォームソースセットは各ターゲットに固有のKotlinコードを使用します。
`androidMain`にはKotlin/JVMが、`iosMain`にはKotlin/Nativeが使用されます。

![ソースセットとモジュールの構造](basic-project-structure-2.png){width=350}

`shared`モジュールがAndroidライブラリにビルドされるとき、共通KotlinコードはKotlin/JVMとして扱われます。
iOSフレームワークにビルドされるとき、共通KotlinはKotlin/Nativeとして扱われます。

![共通Kotlin、Kotlin/JVM、およびKotlin/Native](modules-structure.png)

### 共通宣言を記述する

共通ソースセットには、複数のターゲットプラットフォーム間で再利用できる共有コードが含まれています。
これはプラットフォームに依存しないコードを含めるように設計されています。共通ソースセットでプラットフォーム固有のAPIを使用しようとすると、IDEが警告を表示します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt`ファイルを開きます。
    そこには、`greet()`関数を持つ自動生成された`Greeting`クラスがあります。

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2.  挨拶に少し多様性を加えます。Kotlin標準ライブラリから`kotlin.random.Random`をインポートします。
    これはすべてのプラットフォームで動作し、自動的に依存関係として含まれるマルチプラットフォームライブラリです。
3.  Kotlin標準ライブラリの`reversed()`呼び出しで共有コードを更新し、テキストを反転させます。

    ```kotlin
    import kotlin.random.Random
    
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```

コードを共通Kotlinのみで記述することには、プラットフォーム固有の機能を使用できないという明らかな制限があります。
インターフェースと[expect/actual](multiplatform-connect-to-apis.md)メカニズムを使用することで、これを解決します。

### プラットフォーム固有の実装を確認する

共通ソースセットは、expect宣言（インターフェース、クラスなど）を定義できます。
そして、各プラットフォームソースセット（この場合は`androidMain`と`iosMain`）は、expect宣言に対応するactualなプラットフォーム固有の実装を提供する必要があります。

特定のプラットフォームのコードを生成する際、Kotlinコンパイラはexpect宣言とactual宣言をマージし、actual実装を持つ単一の宣言を生成します。

1.  IntelliJ IDEAでKotlin Multiplatformプロジェクトを作成すると、`commonMain`モジュールに`Platform.kt`ファイルを含むテンプレートが提供されます。

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

    これはプラットフォームに関する情報を持つ共通の`Platform`インターフェースです。

2.  `androidMain`モジュールと`iosMain`モジュールを切り替えます。
    AndroidとiOSのソースセットで、同じ機能の異なる実装があることがわかります。
    
    ```kotlin
    // Platform.android.kt in the androidMain module:
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain module:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    *   `AndroidPlatform`の`name`プロパティの実装は、Android固有のコード、具体的には`android.os.Build`依存関係を使用しています。このコードはKotlin/JVMで記述されています。ここで`java.util.Random`のようなJVM固有のクラスにアクセスしようとしても、このコードはコンパイルされます。
    *   `IOSPlatform`の`name`プロパティの実装は、iOS固有のコード、具体的には`platform.UIKit.UIDevice`依存関係を使用しています。これはKotlin/Nativeで記述されており、KotlinでiOSコードを記述できることを意味します。このコードはiOSフレームワークの一部となり、後でiOSアプリケーション内でSwiftから呼び出します。

3.  異なるソースセットにある`getPlatform()`関数を確認します。そのexpect宣言には本体がありませんが、actual実装はプラットフォームコードで提供されています。

    ```kotlin
    // Platform.kt in the commonMain source set
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.android.kt in the androidMain source set
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain source set
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

ここでは、共通ソースセットがexpectな`getPlatform()`関数を定義し、プラットフォームソースセットにAndroidアプリ用の`AndroidPlatform()`とiOSアプリ用の`IOSPlatform()`というactualな実装を持っています。

特定のプラットフォームのコードを生成する際、Kotlinコンパイラはexpect宣言とactual宣言を、実際の機能を持つ単一の`getPlatform()`関数にマージします。

そのため、expect宣言とactual宣言は同じパッケージで定義されるべきです。それらは結果のプラットフォームコードで1つの宣言にマージされます。生成されたプラットフォームコード内のexpectな`getPlatform()`関数の呼び出しは、正しいactual実装を呼び出します。

これで、アプリを実行して、これらすべてが動作する様子を確認できます。

#### expect/actualメカニズムを探索する（任意） {initial-collapse-state="collapsed" collapsible="true"}

テンプレートプロジェクトでは、関数にexpect/actualメカニズムを使用していますが、プロパティやクラスなど、ほとんどのKotlin宣言でも機能します。expectなプロパティを実装してみましょう。

1.  `commonMain`モジュールの`Platform.kt`を開き、ファイルの末尾に以下を追加します。

    ```kotlin
    expect val num: Int
    ```

    Kotlinコンパイラは、このプロパティに対応するactual宣言がプラットフォームモジュールにないことを警告します。

2.  すぐに次のように実装を提供しようとします。

    ```kotlin
    expect val num: Int = 42
    ```

    expect宣言には本体、この場合は初期化子があってはならないというエラーが表示されます。
    実装は実際のプラットフォームモジュールで提供されなければなりません。初期化子を削除します。
3.  `num`プロパティにカーソルを合わせ、**Create missed actuals...**をクリックします。
    `androidMain`ソースセットを選択します。その後、`androidMain/Platform.android.kt`で実装を完了できます。

    ```kotlin
    actual val num: Int = 1
    ```

4.  次に、`iosMain`モジュールの実装を提供します。`iosMain/Platform.ios.kt`に以下を追加します。

    ```kotlin
    actual val num: Int = 2
    ```

5.  `commonMain/Greeting.kt`ファイルで、`greet()`関数に`num`プロパティを追加して違いを確認します。

    ```kotlin
    fun greet(): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
   
        return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
    }
    ```

## アプリケーションを実行する

IntelliJ IDEAから、[Android](#run-your-application-on-android)または[iOS](#run-your-application-on-ios)の両方でマルチプラットフォームアプリケーションを実行できます。

もし以前にexpect/actualメカニズムを試したことがある場合、Androidでは挨拶に`[1]`が、iOSでは`[2]`が追加されていることが確認できます。

### Androidでアプリケーションを実行する

1.  実行構成のリストで、`composeApp`を選択します。
2.  構成リストの横にあるAndroid仮想デバイスを選択し、**Run**をクリックします。

    リストにデバイスがない場合は、[新しいAndroid仮想デバイス](https://developer.android.com/studio/run/managing-avds#createavd)を作成してください。

    ![AndroidでMultiplatformアプリを実行](compose-run-android.png){width=350}

    ![Android上の最初のモバイルMultiplatformアプリ](first-multiplatform-project-on-android-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_android_other_devices"/>

### iOSでアプリケーションを実行する

最初のセットアップの一部としてXcodeを起動していない場合は、iOSアプリを実行する前にXcodeを起動してください。

IntelliJ IDEAで、実行構成のリストから**iosApp**を選択し、実行構成の横にあるシミュレーターデバイスを選択して、**Run**をクリックします。

リストに利用可能なiOS構成がない場合は、[新しい実行構成](#run-on-a-new-ios-simulated-device)を追加してください。

![iOSでMultiplatformアプリを実行](compose-run-ios.png){width=350}

![iOS上の最初のモバイルMultiplatformアプリ](first-multiplatform-project-on-ios-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_ios_other_devices"/>

## 次のステップ

チュートリアルの次のパートでは、プラットフォーム固有のライブラリを使用してUI要素を更新する方法を学びます。

**[次のパートへ進む](multiplatform-update-ui.md)**

### 関連項目

*   コードが正しく動作することを確認するために、[マルチプラットフォームテストの作成と実行](multiplatform-run-tests.md)方法を参照してください。
*   [プロジェクト構造](multiplatform-discover-project.md)について詳しく学びます。
*   既存のAndroidプロジェクトをクロスプラットフォームアプリに変換したい場合は、[Androidアプリをクロスプラットフォームにするこのチュートリアル](multiplatform-integrate-in-existing-app.md)を完了してください。

## ヘルプ

*   **Kotlin Slack**。招待状を[入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、`#multiplatform`チャンネルに[参加](https://kotlinlang.slack.com/archives/C3PQML5NU)してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。