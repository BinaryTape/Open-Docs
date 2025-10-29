[//]: # (title: Kotlin Multiplatformアプリを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に実行できます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
    <br/>
    <p>これは、**共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する**チュートリアルの最初のパートです。</p>
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
2.  IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
3.  左側のパネルで、**Kotlin Multiplatform** を選択します。
4.  **New Project** ウィンドウで、以下のフィールドを指定します。
    *   **Name**: `GreetingKMP`
    *   **Group**: `com.jetbrains.greeting`
    *   **Artifact**: `greetingkmp`
    
    ![Compose Multiplatformプロジェクトを作成する](create-first-multiplatform-app.png){width=800}

5.  **Android** および **iOS** ターゲットを選択します。
6.  iOSの場合、UIをネイティブに保つために、**Do not share UI** オプションを選択します。
7.  すべてのフィールドとターゲットを指定したら、**Create** をクリックします。

> IntelliJ IDEAは、プロジェクトのAndroid Gradleプラグインを最新バージョンにアップグレードすることを自動的に提案する場合があります。
> Kotlin Multiplatformは最新のAGPバージョンと互換性がないため、アップグレードはお勧めしません
> （[互換性テーブル](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)を参照）。
>
{style="note"}

## プロジェクト構造を確認する

IntelliJ IDEAで、`GreetingKMP` フォルダーを展開します。

このKotlin Multiplatformプロジェクトには、3つのモジュールが含まれています。

*   `_shared_` は、AndroidおよびiOSアプリケーションの両方に共通するロジック（プラットフォーム間で共有するコード）を含むKotlinモジュールです。ビルドプロセスを自動化するために、ビルドシステムとして[Gradle](https://kotlinlang.org/docs/gradle.html)を使用します。
*   `_composeApp_` は、AndroidアプリケーションとしてビルドされるKotlinモジュールです。ビルドシステムとしてGradleを使用します。`composeApp` モジュールは、通常のAndroidライブラリとして `shared` モジュールに依存し、それを使用します。
*   `_iosApp_` は、iOSアプリケーションとしてビルドされるXcodeプロジェクトです。これは、iOSフレームワークとして `shared` モジュールに依存し、それを使用します。`shared` モジュールは、通常のフレームワークとして、または[CocoaPodsの依存関係](multiplatform-cocoapods-overview.md)として使用できます。デフォルトでは、IntelliJ IDEAで作成されたKotlin Multiplatformプロジェクトは、通常のフレームワーク依存関係を使用します。

![基本的なマルチプラットフォームプロジェクト構造](basic-project-structure.svg){width=700}

`shared` モジュールは、`androidMain`、`commonMain`、`iosMain` の3つのソースセットで構成されています。_ソースセット_ とは、Gradleの概念で、論理的にグループ化された複数のファイル群であり、各グループが独自の依存関係を持ちます。
Kotlin Multiplatformでは、`shared` モジュール内の異なるソースセットが異なるプラットフォームをターゲットにすることができます。

共通ソースセットには共有Kotlinコードが含まれ、プラットフォームソースセットは各ターゲット固有のKotlinコードを使用します。
`androidMain` にはKotlin/JVMが使用され、`iosMain` にはKotlin/Nativeが使用されます。

![ソースセットとモジュールの構造](basic-project-structure-2.png){width=350}

`shared` モジュールがAndroidライブラリとしてビルドされると、共通KotlinコードはKotlin/JVMとして扱われます。
iOSフレームワークとしてビルドされると、共通KotlinはKotlin/Nativeとして扱われます。

![共通Kotlin、Kotlin/JVM、Kotlin/Native](modules-structure.png)

### 共通宣言を記述する

共通ソースセットには、複数のターゲットプラットフォームで利用できる共有コードが含まれます。
これはプラットフォームに依存しないコードを含むように設計されています。共通ソースセットでプラットフォーム固有のAPIを使用しようとすると、IDEが警告を表示します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt` ファイルを開くと、`greet()` 関数を持つ自動生成された `Greeting` クラスを見つけることができます。

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2.  挨拶に少しバリエーションを加えます。
    Kotlin標準ライブラリの `reversed()` 呼び出しで共有コードを更新し、テキストを反転させます。

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            //
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```
3.  IDEの提案に従って、`kotlin.random.Random` クラスをインポートします。これは、すべてのプラットフォームで動作し、依存関係として自動的に含まれるマルチプラットフォームライブラリです。

コードを共通Kotlinのみで記述することには、プラットフォーム固有の機能を使用できないという明白な制限があります。
インターフェースと[expect/actual](multiplatform-connect-to-apis.md)メカニズムを使用することで、これを解決します。

### プラットフォーム固有の実装を確認する

共通ソースセットは `expect` 宣言（インターフェース、クラスなど）を定義できます。
その後、各プラットフォームソースセット（この場合は `androidMain` と `iosMain`）は、`expect` 宣言に対応する `actual` プラットフォーム固有の実装を提供する必要があります。

特定のプラットフォームのコードを生成する際、Kotlinコンパイラは `expect` 宣言と `actual` 宣言をマージし、`actual` 実装を持つ単一の宣言を生成します。

1.  IntelliJ IDEAでKotlin Multiplatformプロジェクトを作成すると、`commonMain` モジュールに `Platform.kt` ファイルを含むテンプレートが生成されます。

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

    これは、プラットフォームに関する情報を持つ共通の `Platform` インターフェースです。

2.  `androidMain` モジュールと `iosMain` モジュールを切り替えます。
    AndroidおよびiOSソースセットで、同じ機能の異なる実装があることがわかります。
    
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

    *   `AndroidPlatform` の `name` プロパティの実装は、Android固有のコード、具体的には `android.os.Build` 依存関係を使用します。このコードはKotlin/JVMで記述されています。ここで `java.util.Random` のようなJVM固有のクラスにアクセスしようとすると、このコードはコンパイルされます。
    *   `IOSPlatform` の `name` プロパティの実装は、iOS固有のコード、具体的には `platform.UIKit.UIDevice` 依存関係を使用します。これはKotlin/Nativeで記述されており、KotlinでiOSコードを記述できることを意味します。このコードはiOSフレームワークの一部となり、後でiOSアプリケーションのSwiftから呼び出します。

3.  異なるソースセットの `getPlatform()` 関数を確認します。その `expect` 宣言には本体がなく、プラットフォームコードで `actual` 実装が提供されています。

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

ここでは、共通ソースセットが `expect` な `getPlatform()` 関数を定義し、プラットフォームソースセットには、Androidアプリ用の `AndroidPlatform()` とiOSアプリ用の `IOSPlatform()` という `actual` な実装があります。

特定のプラットフォームのコードを生成する際、Kotlinコンパイラは `expect` 宣言と `actual` 宣言をマージし、`actual` 実装を持つ単一の `getPlatform()` 関数を生成します。

そのため、`expect` 宣言と `actual` 宣言は同じパッケージで定義する必要があります。これにより、結果として生成されるプラットフォームコードで1つの宣言にマージされます。生成されたプラットフォームコードで `expect` な `getPlatform()` 関数を呼び出すと、正しい `actual` な実装が呼び出されます。

これで、アプリを実行してこれらすべてを実際に確認できます。

#### expect/actualメカニズムを探る (オプション) {initial-collapse-state="collapsed" collapsible="true"}

テンプレートプロジェクトでは関数にexpect/actualメカニズムを使用していますが、プロパティやクラスなど、ほとんどのKotlin宣言にも機能します。expectなプロパティを実装してみましょう。

1.  `commonMain` モジュールの `Platform.kt` を開き、ファイルの最後に以下を追加します。

    ```kotlin
    expect val num: Int
    ```

    Kotlinコンパイラは、このプロパティに対応するactual宣言がプラットフォームモジュールにないと警告します。

2.  以下の方法で直ちに実装を提供してみてください。

    ```kotlin
    expect val num: Int = 42
    ```

    expect宣言には本体（この場合は初期化子）があってはならないというエラーが表示されます。実装はactualプラットフォームモジュールで提供する必要があります。初期化子を削除してください。
3.  `num` プロパティにマウスオーバーし、**Create missed actuals...** をクリックします。
    `androidMain` ソースセットを選択します。その後、`androidMain/Platform.android.kt` で実装を完了できます。

    ```kotlin
    actual val num: Int = 1
    ```

4.  次に、`iosMain` モジュールの実装を提供します。`iosMain/Platform.ios.kt` に以下を追加します。

    ```kotlin
    actual val num: Int = 2
    ```

5.  `commonMain/Greeting.kt` ファイルで、`num` プロパティを `greet()` 関数に追加して違いを確認します。

    ```kotlin
    fun greet(): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
   
        return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
    }
    ```

## アプリケーションを実行する

IntelliJ IDEAから、[Android](#run-your-application-on-android)と[iOS](#run-your-application-on-ios)の両方でマルチプラットフォームアプリケーションを実行できます。

以前にexpect/actualメカニズムを試したことがある場合、Androidの挨拶には「[1]」が、iOSの挨拶には「[2]」が追加されていることがわかります。

### Androidでアプリケーションを実行する

1.  実行構成のリストで、**composeApp** を選択します。
2.  構成リストの横にあるAndroid仮想デバイスを選択し、**Run** をクリックします。

    リストにデバイスがない場合は、[新しいAndroid仮想デバイス](https://developer.android.com/studio/run/managing-avds#createavd)を作成してください。

    ![Androidでマルチプラットフォームアプリを実行](compose-run-android.png){width=350}

    ![Android上の最初のモバイルマルチプラットフォームアプリ](first-multiplatform-project-on-android-1.png){width=300}

#### 別のAndroidシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[Androidエミュレーターを構成し、別のシミュレートデバイスでアプリケーションを実行する方法](https://developer.android.com/studio/run/emulator#runningapp)を学びます。

#### 実機Androidデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[ハードウェアデバイスを構成して接続し、その上でアプリケーションを実行する方法](https://developer.android.com/studio/run/device)を学びます。

### iOSでアプリケーションを実行する

初期設定の一部としてXcodeを起動していない場合は、iOSアプリを実行する前に起動してください。

IntelliJ IDEAで、実行構成のリストから **iosApp** を選択し、実行構成の横にあるシミュレートデバイスを選択して、**Run** をクリックします。

リストに利用可能なiOS構成がない場合は、[新しい実行構成](#run-on-a-new-ios-simulated-device)を追加してください。

![iOSでマルチプラットフォームアプリを実行](compose-run-ios.png){width=350}

![iOS上の最初のモバイルマルチプラットフォームアプリ](first-multiplatform-project-on-ios-1.png){width=300}

#### 新しいiOSシミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

シミュレートデバイスでアプリケーションを実行したい場合は、新しい実行構成を追加できます。

1.  実行構成のリストで、**Edit Configurations** をクリックします。

    ![実行構成を編集](ios-edit-configurations.png){width=450}

2.  構成リストの上にある **+** ボタンをクリックし、**Xcode Application** を選択します。

    ![iOSアプリケーションの新しい実行構成](ios-new-configuration.png)

3.  構成に名前を付けます。
4.  **Working directory** を選択します。そのためには、例えば **KotlinMultiplatformSandbox** のようなプロジェクトの `iosApp` フォルダーに移動します。

5.  **Run** をクリックして、新しいシミュレートデバイスでアプリケーションを実行します。

#### 実機iOSデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

実機のiOSデバイスでマルチプラットフォームアプリケーションを実行できます。開始する前に、[Apple ID](https://support.apple.com/en-us/HT204316)に関連付けられたチームIDを設定する必要があります。

##### チームIDを設定する

プロジェクトでチームIDを設定するには、IntelliJ IDEAのKDoctorツールを使用するか、Xcodeでチームを選択できます。

KDoctorの場合：

1.  IntelliJ IDEAで、ターミナルで以下のコマンドを実行します。

    ```none
    kdoctor --team-ids 
    ```

    KDoctorは、現在システムに構成されているすべてのチームIDをリスト表示します。例えば：

    ```text
    3ABC246XYZ (Max Sample)
    ZABCW6SXYZ (SampleTech Inc.)
    ```

2.  IntelliJ IDEAで `iosApp/Configuration/Config.xcconfig` を開き、チームIDを指定します。

別の方法として、Xcodeでチームを選択します。

1.  Xcodeに移動し、**Open a project or file** を選択します。
2.  プロジェクトの `iosApp/iosApp.xcworkspace` ファイルに移動します。
3.  左側のメニューで `iosApp` を選択します。
4.  **Signing & Capabilities** に移動します。
5.  **Team** リストでチームを選択します。

    まだチームを設定していない場合は、**Team** リストの **Add an Account** オプションを使用し、Xcodeの指示に従ってください。

6.  バンドル識別子が一意であり、署名証明書が正常に割り当てられていることを確認してください。

##### アプリを実行する

iPhoneをケーブルで接続します。すでにデバイスがXcodeに登録されている場合、IntelliJ IDEAは実行構成のリストにそれを表示するはずです。対応する `iosApp` 構成を実行します。

まだiPhoneをXcodeに登録していない場合は、[Appleの推奨事項](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)に従ってください。
要するに、次のことを行う必要があります。

1.  iPhoneをケーブルで接続します。
2.  iPhoneで、**設定** | **プライバシーとセキュリティ** で開発者モードを有効にします。
3.  Xcodeで、上部メニューに移動し、**Window** | **Devices and Simulators** を選択します。
4.  プラス記号をクリックします。接続されているiPhoneを選択し、**Add** をクリックします。
5.  Apple IDでサインインして、デバイスでの開発機能を有効にします。
6.  画面の指示に従ってペアリングプロセスを完了します。

XcodeでiPhoneを登録したら、IntelliJ IDEAで[新しい実行構成](#run-on-a-new-ios-simulated-device)を作成し、**Execution target** リストでデバイスを選択します。対応する `iosApp` 構成を実行します。

## 次のステップ

チュートリアルの次のパートでは、プラットフォーム固有のライブラリを使用してUI要素を更新する方法を学びます。

**[次のパートに進む](multiplatform-update-ui.md)**

### 関連項目

*   コードが正しく動作することを確認するために、[マルチプラットフォームテストを作成して実行する方法](multiplatform-run-tests.md)を参照してください。
*   [プロジェクト構造](multiplatform-discover-project.md)について詳しく学びます。
*   既存のAndroidプロジェクトをクロスプラットフォームアプリに変換したい場合は、[このチュートリアルを完了してAndroidアプリをクロスプラットフォーム化](multiplatform-integrate-in-existing-app.md)してください。

## ヘルプ

*   **Kotlin Slack**。[招待状](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を取得し、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。