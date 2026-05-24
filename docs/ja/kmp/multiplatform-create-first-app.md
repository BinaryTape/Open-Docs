[//]: # (title: Kotlin Multiplatform アプリの作成)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルでは IntelliJ IDEA を使用しますが、Android Studio でも同様に進めることができます。両方の IDE は同じコア機能と Kotlin Multiplatform サポートを共有しています。</p>
    <br/>
    <p>これは、<strong>共通ロジックとネイティブ UI を備えた Kotlin Multiplatform アプリの作成</strong>チュートリアルの第1部です。</p>
    <p><img src="icon-1.svg" width="20" alt="ステップ1"/> <strong>Kotlin Multiplatform アプリの作成</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="ステップ2"/> ユーザーインターフェースの更新<br/>
       <img src="icon-3-todo.svg" width="20" alt="ステップ3"/> 依存関係の追加<br/>       
       <img src="icon-4-todo.svg" width="20" alt="ステップ4"/> より多くのロジックを共有する<br/>
       <img src="icon-5-todo.svg" width="20" alt="ステップ5"/> プロジェクトの仕上げ<br/>
    </p>
</tldr>

ここでは、IntelliJ IDEA を使用して最初の Kotlin Multiplatform アプリケーションを作成し、実行する方法を学びます。

Kotlin Multiplatform テクノロジーは、クロスプラットフォームプロジェクトの開発を簡素化します。
Kotlin Multiplatform アプリケーションは、iOS、Android、macOS、Windows、Linux、Web など、さまざまなプラットフォームで動作させることができます。

Kotlin Multiplatform の主なユースケースの1つは、モバイルプラットフォーム間でのコード共有です。
iOS アプリと Android アプリの間でアプリケーションロジックを共有し、ネイティブ UI の実装やプラットフォーム API の操作が必要な場合にのみ、プラットフォーム固有のコードを記述することができます。

## プロジェクトの作成

1. [クイックスタート](quickstart.md)の手順に従って、[Kotlin Multiplatform 開発のための環境構築](quickstart.md#set-up-the-environment)を完了させてください。
2. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
3. 左側のパネルで **Kotlin Multiplatform** を選択します。
4. **New Project** ウィンドウで以下のフィールドを指定します。
   * **Name**: GreetingKMP
   * **Project ID**: com.jetbrains.greetingkmp

5. **Android** と **iOS** のターゲットを選択します。
6. iOS については、UI をネイティブに保つために **Do not share UI** オプションを選択します。
7. すべてのフィールドとターゲットを指定したら、**Create** をクリックします。

![Create Kotlin Multiplatform project](create-first-multiplatform-app.png){width=700}

> IDE がプロジェクト内の Android Gradle プラグイン（AGP）を最新バージョンにアップグレードすることを自動的に提案する場合があります。
> Kotlin Multiplatform は最新の AGP バージョンと互換性がない場合があるため、アップグレードは推奨しません
> （[互換性テーブル](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)を参照してください）。
>
{style="note"}

## プロジェクト構造の確認

IntelliJ IDEA で `GreetingKMP` フォルダを展開します。

この Kotlin Multiplatform プロジェクトには、以下のモジュールが含まれています。

* `androidApp` は、Android アプリケーションとしてビルドされる Kotlin モジュールです。ビルドシステムとして Gradle を使用します。
  `androidApp` モジュールは shared モジュールに依存し、通常の Android ライブラリとして使用します。
* `iosApp` は、iOS アプリケーションとしてビルドされる Xcode プロジェクトです。
  `sharedLogic` モジュールに依存しており、これは iOS フレームワークとしてエクスポートされます。
  IDE ウィザードを使用して作成された Kotlin Multiplatform プロジェクトは、[直接統合（direct integration）](multiplatform-direct-integration.md)を通じて通常のフレームワーク依存関係を使用します。
* `sharedLogic` は、Android と iOS アプリケーションの両方に共通のロジックを含むマルチプラットフォームモジュールです。
* `sharedUI` は、Compose Multiplatform UI コードを含むモジュールです。このプロジェクトでは Android アプリでのみ使用されていますが、準備ができれば他のターゲットでも使用できるマルチプラットフォームモジュールです。

`iosApp` を除くすべてのモジュールは、ビルドシステムとして Gradle を使用します。

![Basic Multiplatform project structure](basic-project-structure.svg){width=700}

「ソースセット（Source set）」は Gradle の概念で、論理的にグループ化された多数のファイルであり、各グループが独自の依存関係を持ちます。Kotlin Multiplatform では、共有モジュール内の異なるソースセットが異なるプラットフォームをターゲットにできます。

`sharedLogic` モジュールには、`androidMain`、`commonMain`、`iosMain` の各ソースセットが含まれています。
`commonMain` ソースセットには共有される Kotlin コードが含まれ、プラットフォーム固有のソースセットには各プラットフォームに限定されたコードが含まれます。
`androidMain` には Kotlin/JVM が使用され、`iosMain` には Kotlin/Native が使用されます。

![Source sets and modules structure](basic-project-structure-2.png){width=350}

共有モジュールが Android ライブラリとしてビルドされる際、共通の Kotlin コードは Kotlin/JVM として扱われます。iOS フレームワークとしてビルドされる際は、共通の Kotlin コードは Kotlin/Native として扱われます。

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](modules-structure.png)

### 共通宣言の記述

共通ソースセットには、複数のターゲットプラットフォーム間で共有できるコードが含まれます。これはプラットフォームに依存しないコードを含むように設計されています。共通ソースセットでプラットフォーム固有の API を使用しようとすると、IDE は警告を表示します。

1. `sharedLogic/src/commonMain/.../Greeting.kt` ファイルを開きます。
    ここには、生成された `Greeting` クラスと `greet()` 関数があります。
2. 挨拶に少し変化を加えてみましょう。`GreetingUtil.kt` ファイル内の `sayHello()` 関数の定義に移動します。

3. 共有コードを更新して、ランダム化と Kotlin 標準ライブラリの `reversed()` 呼び出しを追加して、受け取った文字列を反転させます。

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord Guess what this is! > ${to.reversed()}!"
    }
    ```
4. IDE の提案に従って `kotlin.random.Random` クラスをインポートします。

共通の Kotlin だけでコードを記述することには、プラットフォーム固有の機能を使用できないという明らかな制限があります。共通インターフェースを使用し、[expect/actual](multiplatform-connect-to-apis.md) メカニズムを使用してプラットフォーム固有の実装を行うことで、この問題が解決されます。

### プラットフォーム固有の実装の確認

共通ソースセットは、期待される宣言（expect declarations。インターフェース、クラスなど）を定義できます。
各プラットフォームソースセット（この場合は `androidMain` と `iosMain`）で、期待される宣言に対して実際のプラットフォーム固有の実装（actual implementations）を提供する必要があります。

特定のプラットフォーム向けのコードを生成する際、Kotlin コンパイラは expect 宣言と actual 宣言をマージし、実際の特定の実装を持つ単一の宣言を生成します。

1. IntelliJ IDEA で Kotlin Multiplatform プロジェクトを作成すると、`sharedLogic/src/commonMain` モジュールに `Platform.kt` ファイルが作成されます。

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   これはプラットフォームに関する情報を持つ共通の `Platform` インターフェースです。

2. `androidMain` と `iosMain` の各ソースセットで、インターフェースを実装しているプラットフォーム固有のクラスを確認できます。
    
    ```kotlin
    // androidMain ソースセットの Platform.android.kt
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // iosMain ソースセットの Platform.ios.kt
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` クラスの `name` プロパティの実装は、Android 固有のコード、つまり `android.os.Build` クラスを使用しています。このコードは Kotlin/JVM として解釈されます。ここで `java.util.Random` のような JVM 固有のクラスにアクセスしようとしても、このコードはコンパイルされます。
    * `IOSPlatform` クラスの `name` プロパティの実装は、iOS 固有のコード、つまり `platform.UIKit.UIDevice` クラスを使用しています。これは Kotlin/Native として解釈され、Kotlin で iOS の宣言を参照できることを意味します。このコードは iOS フレームワークの一部となり、`iosApp` モジュールの Swift コードにインポートされます。

3. 各ソースセットには `getPlatform()` 関数が含まれています。
   その `expect` 宣言にはボディがなく、`actual` 実装はプラットフォームコードで提供されています。

    ```kotlin
    // commonMain ソースセットの Platform.kt
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // androidMain ソースセットの Platform.android.kt
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // iosMain ソースセットの Platform.ios.kt
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

ここでは、共通ソースセットが期待される `getPlatform()` 関数を定義し、プラットフォームソースセットに Android アプリ用の `AndroidPlatform()` と iOS アプリ用の `IOSPlatform()` という実際の実装を持っています。

特定のプラットフォーム向けのコードを生成する際、Kotlin コンパイラは `expect` 宣言と `actual` 宣言をマージし、正しい実装を持つ単一の `getPlatform()` 関数にします。

そのため、`expect` 宣言と `actual` 宣言は同じパッケージで定義する必要があります。これらは結果として得られるプラットフォームコード内で1つの宣言にマージされるためです。生成されたプラットフォームコード内で期待される `getPlatform()` 関数を呼び出すと、正しい実際の（actual）実装が参照されます。

それでは、アプリを実行してこれらすべての動作を確認してみましょう。

#### expect/actual 変数の作成 (任意) {initial-collapse-state="collapsed" collapsible="true"}

テンプレートプロジェクトでは関数の expect/actual メカニズムを使用していますが、これはプロパティやクラスなど、ほとんどの Kotlin 宣言でも機能します。期待されるプロパティを実装してみましょう。

1. `commonMain` モジュールの `Platform.kt` を開き、ファイルの最後に以下を追加します。

   ```kotlin
   expect val num: Int
   ```

   Kotlin コンパイラは、このプロパティに対応する実際の（actual）宣言がプラットフォームモジュールにないというエラーを表示します。

2. 次のように、すぐに実装を提供しようとしてみてください。

   ```kotlin
   expect val num: Int = 42
   ```

   `expect` 宣言はボディを持ってはならないため、「Expected property cannot have an initializer（期待されるプロパティは初期化子を持てません）」というエラーが表示されます。実装は実際のプラットフォームモジュールで提供される必要があります。
3. 初期化子を削除してください。
4. `androidMain/.../Platform.android.kt` に次のように Android の実装を追加します。

    ```kotlin
    actual val num: Int = 1
    ```

5. 次に `iosMain` モジュールで `num` の実際の実装を提供します。`iosMain/.../Platform.ios.kt` ファイルに以下を追加します。

    ```kotlin
    actual val num: Int = 2
    ```

6. `commonMain/.../GreetingUtil.kt` ファイルで、`sayHello()` 関数によって形成される文字列内で `num` プロパティを使用します。

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord [$num] Guess what this is! > ${to.reversed()}!"
    }
    ```

## アプリケーションの実行

IntelliJ IDEA から、Android と iOS の両方でマルチプラットフォームアプリケーションを実行できます。

先ほど任意の expect/actual プロパティを作成した場合、Android では挨拶に "[1]" が、iOS では "[2]" が追加されているのを確認できます。

### Android でアプリケーションを実行する

1. 実行構成（run configurations）のリストで、**androidApp** を選択します。
2. 構成リストの隣にある Android 仮想デバイスを選択し、**Run** をクリックします。

   リストにデバイスがない場合は、[新しい Android 仮想デバイスを作成](https://developer.android.com/studio/run/managing-avds#createavd)してください。

   ![Run multiplatform app on Android](compose-run-android.png){width=350}

   ![First mobile multiplatform app on Android](first-multiplatform-project-on-android-1.png){width=300}

#### 別の Android シミュレートデバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[Android エミュレーターを構成し、別のシミュレートデバイスでアプリケーションを実行する](https://developer.android.com/studio/run/emulator#runningapp)方法についてはこちらをご覧ください。

#### 実機の Android デバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

[ハードウェアデバイスを構成して接続し、その上でアプリケーションを実行する](https://developer.android.com/studio/run/device)方法についてはこちらをご覧ください。

### iOS でアプリケーションを実行する

初期設定の一環として Xcode を起動していない場合は、iOS アプリを実行する前に起動してください。

IntelliJ IDEA で、実行構成リストから **iosApp** を選択し、その隣にあるシミュレートデバイスを選択して、**Run** をクリックします。

リストに利用可能な iOS 構成がない場合は、Xcode を起動して利用可能なシミュレータを表示させた後、IntelliJ IDEA を再起動してください。

![Run multiplatform app on iOS](compose-run-ios.png){width=350}

![First mobile multiplatform app on iOS](first-multiplatform-project-on-ios-1.png){width=350}

#### 実機の iOS デバイスで実行する {initial-collapse-state="collapsed" collapsible="true"}

実機の iOS デバイスでマルチプラットフォームアプリケーションを実行できます。開始する前に、[Apple ID](https://support.apple.com/en-us/HT204316) に関連付けられたチーム ID（Team ID）を設定する必要があります。

##### チーム ID の設定

プロジェクトで初めてチーム ID を設定するには、Xcode でプロジェクトを開きます（**File | Open Project in Xcode**）。

1. 左側のプロジェクトナビゲーターで **iosApp** を選択します。
2. **Targets** の下の **iosApp** を選択し、**Signing & Capabilities** タブに切り替えます。
3. **Team** リストで自分のチームを選択します。

   まだチームを設定していない場合は、**Team** リストの **Add an Account** オプションを使用して Xcode の指示に従ってください。

4. Bundle Identifier が一意であり、Signing Certificate が正常に割り当てられていることを確認してください。

Xcode でチームを設定したら、IntelliJ IDEA でチームを設定または変更できます。

1. **iosApp** の実行構成を編集します。

   ![Edit iOS run configuration](ios-edit-configurations.png){width=450}

2. **Options** タブに切り替え、**Development team** ドロップダウンで必要な変更を行い、**OK** をクリックします。

##### アプリの実行

iPhone をケーブルで接続します。Xcode ですでにデバイスを登録している場合、IntelliJ IDEA の実行構成リストにそのデバイスが表示されるはずです。対応する `iosApp` 構成を実行します。

Xcode でまだ iPhone を登録していない場合は、[Apple の推奨事項](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)に従ってください。簡単に言うと、以下の手順が必要です。

1. iPhone をケーブルで接続します。
2. iPhone の **Settings** | **Privacy & Security** でデベロッパーモードを有効にします。
3. Xcode でトップメニューの **Window** | **Devices and Simulators** を選択します。
4. iPhone が接続済みとして表示されない場合は、左下のプラス記号をクリックして選択します。
5. 画面の指示に従ってペアリングプロセスを完了します。

Xcode で iPhone を登録すると、IntelliJ IDEA で **iosApp** 実行構成を選択したときに、利用可能なデバイスのリストに表示されるようになります。

## 次のステップ

チュートリアルの次のパートでは、プラットフォーム固有のライブラリを使用して UI 要素を更新する方法を学びます。

**[次のパートに進む](multiplatform-update-ui.md)**

### 関連項目

* コードが正しく動作することを確認するために、[マルチプラットフォームテストの作成と実行](multiplatform-run-tests.md)方法を確認してください。
* [プロジェクト構造](multiplatform-discover-project.md)について詳しく学びましょう。
* 既存の Android プロジェクトをクロスプラットフォームアプリに変換したい場合は、[Android アプリをクロスプラットフォームにするこのチュートリアル](multiplatform-integrate-in-existing-app.md)を完了してください。

## ヘルプを得る

* **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取って、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
* **Kotlin イシュートラッカー**: [新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。