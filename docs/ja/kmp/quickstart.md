[//]: # (title: Kotlin Multiplatform クイックスタート)

<web-summary>JetBrains は IntelliJ IDEA と Android Studio の公式 Kotlin IDE サポートを提供します。</web-summary>

このチュートリアルでは、シンプルな Kotlin Multiplatform アプリケーションをすばやく立ち上げて実行できます。

## 環境をセットアップする

Kotlin Multiplatform (KMP) プロジェクトには特定の環境が必要ですが、その要件のほとんどは IDE でのプリフライトチェックによって明確にされます。

IDE と必要なプラグインから始めましょう:

1. IDE を選択してインストールします。
    Kotlin Multiplatform は IntelliJ IDEA と Android Studio でサポートされているため、お好みの IDE を使用できます。
    
    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) は、IDE をインストールするための推奨ツールです。これを使用すると、[早期アクセスプログラム](https://www.jetbrains.com/resources/eap/) (EAP) やナイトリーリリースを含む、複数の製品やバージョンを管理できます。

    スタンドアロンインストールの場合、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) または [Android Studio](https://developer.android.com/studio) のインストーラーをダウンロードしてください。

    Kotlin Multiplatform に必要なプラグインは、**IntelliJ IDEA 2025.1.1.1** または **Android Studio Narwhal 2025.1.1** を必要とします。

2. [Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)をインストールします (Kotlin Multiplatform Gradle プラグインと混同しないようにしてください)。
   
    > Kotlin Multiplatform プラグインは、Windows または Linux 上の IDE ではまだ利用できません。
    > しかし、これらのプラットフォームでは厳密には必要ありません。
    > 引き続きチュートリアルに従って KMP プロジェクトを生成し、実行できます。
    >
    {style="note"}
    
3. IntelliJ IDEA 用の Kotlin Multiplatform IDE プラグインをインストールすると、まだ持っていない場合は必要な依存関係もすべてインストールされます (Android Studio には必要なプラグインがすべてバンドルされています)。
    
    Windows または Linux 用の IntelliJ IDEA を使用している場合は、必要なプラグインをすべて手動でインストールしてください:
    * [Android](https://plugins.jetbrains.com/plugin/22989-android)
    * [Android Design Tools](https://plugins.jetbrains.com/plugin/22990-android-design-tools)
    * [Jetpack Compose](https://plugins.jetbrains.com/plugin/18409-jetpack-compose)
    * [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
    * [Compose Multiplatform for Desktop IDE Support](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-for-desktop-ide-support)
      (Kotlin Multiplatform プラグインがない場合にのみ必要)

4. `ANDROID_HOME` 環境変数が設定されていない場合は、システムがそれを認識するように設定します:

    <tabs>
    <tab title= "Bash または Zsh">
   
    次のコマンドを `.profile` または `.zprofile` に追加します:
        
    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```
   
    </tab>
    <tab title= "Windows PowerShell または CMD">

    PowerShell の場合、次のコマンドで永続的な環境変数を追加できます (詳細は [PowerShell ドキュメント](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)を参照してください):

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    CMD の場合、[`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) コマンドを使用します:
    
    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </tab>
    </tabs>

5. iOS アプリケーションを作成するには、[Xcode](https://apps.apple.com/us/app/xcode/id497799835) がインストールされた macOS ホストが必要です。IDE は内部で Xcode を実行し、iOS フレームワークをビルドします。

    KMP プロジェクトで作業を開始する前に、Xcode を少なくとも一度は起動して初期設定を完了させてください。

    > Xcode がアップデートされるたびに手動で起動し、更新されたツールをダウンロードする必要があります。
    > Kotlin Multiplatform IDE プラグインは、Xcode が動作に適した状態でない場合に警告するプリフライトチェックを実行します。
    >
    {style="note"}

## プロジェクトを作成する

### macOSの場合

macOS では、Kotlin Multiplatform プラグインが IDE 内でプロジェクト生成ウィザードを提供します:

<tabs>
<tab title= "IntelliJ IDEA">

IDE ウィザードを使用して新しい KMP プロジェクトを作成します:

1. メインメニューで **File** | **New** | **Project** を選択します。
2. 左側のリストで **Kotlin Multiplatform** を選択します。
3. プロジェクトの名前、場所、その他の基本属性を必要に応じて設定します。
4. プロジェクトの JDK として [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) のバージョンを選択することをお勧めします。これは、特にデスクトップ KMP アプリの互換性を向上させるための重要な修正を提供するためです。関連するバージョンの JBR はすべての IntelliJ IDEA ディストリビューションに含まれているため、追加のセットアップは必要ありません。
5. プロジェクトの一部として含めたいプラットフォームを選択します:
    * すべてのターゲットプラットフォームは、Compose Multiplatform を使用して最初から UI コードを共有するように設定できます (UI コードを持たないサーバーモジュールを除く)。
    * iOS の場合、2つの実装のいずれかを選択できます:
        * Compose Multiplatform を使用した共有 UI コード、
        * SwiftUI で作成され、共有ロジックを持つ Kotlin モジュールに接続された完全なネイティブ UI。
    * デスクトップターゲットには、対応するコードを変更するとすぐに UI の変更を確認できる [](compose-hot-reload.md) 機能のアルファ版が含まれています。デスクトップアプリを作成する予定がない場合でも、UI コードの記述を高速化するためにデスクトップバージョンを使用することをお勧めします。

プラットフォームの選択が終わったら、**Create** ボタンをクリックし、IDE がプロジェクトを生成してインポートするのを待ちます。

![Android、iOS、デスクトップ、および Web プラットフォームが選択されたデフォルト設定のIntelliJ IDEAウィザード](idea-wizard-1step.png){width=800}

</tab>
<tab title= "Android Studio">

Kotlin Multiplatform IDE プラグインは K2 機能に大きく依存しており、それがなければ記載されている通りに動作しません。したがって、開始する前に K2 モードが有効になっていることを確認してください: **Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**。

IDE ウィザードを使用して新しい KMP プロジェクトを作成します:

1. メインメニューで **File** | **New** | **New project** を選択します。
2. デフォルトの **Phone and Tablet** テンプレートカテゴリで **Kotlin Multiplatform** を選択します。

    ![Android Studio の新規プロジェクト作成の最初のステップ](as-wizard-1.png){width="400"}

3. プロジェクトの名前、場所、その他の基本属性を必要に応じて設定し、**Next** をクリックします。
4. プロジェクトの一部として含めたいプラットフォームを選択します:
    * すべてのターゲットプラットフォームは、Compose Multiplatform を使用して最初から UI コードを共有するように設定できます (UI コードを持たないサーバーモジュールを除く)。
    * iOS の場合、2つの実装のいずれかを選択できます: 
      * Compose Multiplatform を使用した共有 UI コード、
      * SwiftUI で作成され、共有ロジックを持つ Kotlin モジュールに接続された完全なネイティブ UI。  
    * デスクトップターゲットには、対応するコードを変更するとすぐに UI の変更を確認できるホットリロード機能のアルファ版が含まれています。デスクトップアプリを作成する予定がない場合でも、UI コードの記述を高速化するためにデスクトップバージョンを使用することをお勧めします。
5. プロジェクトが生成されたら、プロジェクトの JDK として [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) のバージョンを選択することをお勧めします。これは、特にデスクトップ KMP アプリの互換性を向上させるための重要な修正を提供するためです。関連するバージョンの JBR はすべての IntelliJ IDEA ディストリビューションに含まれているため、追加のセットアップは必要ありません。

プラットフォームの選択が終わったら、**Finish** ボタンをクリックし、IDE がプロジェクトを生成してインポートするのを待ちます。

![Android、iOS、デスクトップ、および Web プラットフォームが選択されたAndroid Studioウィザードの最終ステップ](as-wizard-3step.png){width=800}

</tab>
</tabs>

### Windows または Linuxの場合

Windows または Linux をお使いの場合:

1. [Web KMP ウィザード](https://kmp.jetbrains.com/)を使用してプロジェクトを生成します。
2. アーカイブを抽出し、結果のフォルダーを IDE で開きます。
3. インポートが完了するまで待ち、[](#run-the-sample-apps) セクションに進んでアプリのビルドと実行方法を確認してください。

## プリフライトチェックを確認する

プロジェクトのセットアップに環境上の問題がないことを確認するには、**Project Environment Preflight Checks** ツールウィンドウを開きます: 右サイドバーまたは下部バーにあるプリフライトチェックアイコン ![飛行機付きのプリフライトチェックアイコン](ide-preflight-checks.png){width="20"} をクリックします。

このツールウィンドウでは、これらのチェックに関連するメッセージを表示したり、再実行したり、設定を変更したりできます。

**Search Everywhere** ダイアログでもプリフライトチェックコマンドが利用できます。<shortcut>Shift</shortcut> を2回押して、「preflight」という単語を含むコマンドを検索してください:

![「preflight」という単語が入力された Search Everywhere メニュー](double-shift-preflight-checks.png)

## サンプルアプリを実行する

IDE ウィザードによって作成されたプロジェクトには、iOS、Android、デスクトップ、および Web アプリケーション用の生成された実行構成と、サーバーアプリを実行するための Gradle タスクが含まれています。Windows および Linux では、以下の各プラットフォームの Gradle コマンドを参照してください。

<tabs>
<tab title="Android">

Android アプリを実行するには、**composeApp** 実行構成を開始します:

![Android 実行構成がハイライト表示されたドロップダウン](run-android-configuration.png){width=250}

Windows または Linux で Android アプリを実行するには、**Android App** 実行構成を作成し、モジュール **[project name].composeApp** を選択します。

デフォルトでは、最初に利用可能な仮想デバイスで実行されます:

![仮想デバイスで実行された Android アプリ](run-android-app.png){width=350}

</tab>
<tab title="iOS">

> iOS アプリをビルドするには macOS ホストが必要です。
>
{style="note"}

プロジェクトで iOS ターゲットを選択し、Xcode がインストールされた macOS マシンをセットアップしている場合は、**iosApp** 実行構成を選択し、シミュレートされたデバイスを選択できます:

![iOS 実行構成がハイライト表示されたドロップダウン](run-ios-configuration.png){width=250}

iOS アプリを実行すると、内部で Xcode を使用してビルドされ、iOS シミュレーターで起動されます。最初のビルドでは、コンパイルのためにネイティブ依存関係が収集され、後続の実行のためにビルドがウォームアップされます:

![仮想デバイスで実行された iOS アプリ](run-ios-app.png){width=350}

</tab>
<tab title="デスクトップ">

デスクトップアプリのデフォルトの実行構成は、**composeApp [desktop]** として作成されます:

![デフォルトのデスクトップ実行構成がハイライト表示されたドロップダウン](run-desktop-configuration.png){width=250}

Windows または Linux でデスクトップアプリを実行するには、**[app name]:composeApp** Gradle プロジェクトを指す **Gradle** 実行構成を次のコマンドで作成します:

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

この構成で JVM デスクトップアプリを実行できます:

![仮想デバイスで実行された JVM アプリ](run-desktop-app.png){width=600}

</tab>
<tab title="Web">

Web アプリのデフォルトの実行構成は、**composeApp [wasmJs]** として作成されます:

![デフォルトのWasm実行構成がハイライト表示されたドロップダウン](run-wasm-configuration.png){width=250}

Windows または Linux で Web アプリを実行するには、**[app name]:composeApp** Gradle プロジェクトを指す **Gradle** 実行構成を次のコマンドで作成します:

```shell
wasmJsBrowserDevelopmentRun
```

この構成を実行すると、IDE は Kotlin/Wasm アプリをビルドし、デフォルトのブラウザで開きます:

![仮想デバイスで実行された Web アプリ](run-wasm-app.png){width=600}

</tab>
</tabs>

## トラブルシューティング

### Java と JDK

Java に関する一般的な問題点:

* 一部のツールが Java のバージョンを見つけられないか、間違ったバージョンを使用する場合があります。これを解決するには:
    * `JAVA_HOME` 環境変数を適切な JDK がインストールされているディレクトリに設定します。
  
      > クラス再定義をサポートする OpenJDK フォークである [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) の使用をお勧めします。
      >
      {style="note"}
  
    * `JAVA_HOME` 内の `bin` フォルダーへのパスを `PATH` 変数に追加し、JDK に含まれるツールがターミナルで利用できるようにします。
* Android Studio で Gradle JDK に関する問題が発生した場合は、それが正しく構成されていることを確認してください: **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle** を選択します。

### Android ツール

JDK と同様に、`adb` などの Android ツールの起動に問題がある場合は、`ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin`、および `ANDROID_HOME/platform-tools` へのパスが `PATH` 環境変数に追加されていることを確認してください。

### Xcode

iOS 実行構成で実行する仮想デバイスがないと報告された場合は、Xcode を起動し、iOS シミュレーターの更新があるかどうかを確認してください。

### ヘルプ

* **Kotlin Slack**。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受けて、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
* **Kotlin Multiplatform Tooling イシュートラッカー**。[新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KMT)してください。

## 次のステップ

KMP プロジェクトの構造と共有コードの記述について詳しく学びましょう:
* 共有 UI コードの操作に関するチュートリアルのシリーズ: [](compose-multiplatform-create-first-app.md)
* ネイティブ UI とともに共有コードを操作するチュートリアルのシリーズ: [](multiplatform-create-first-app.md)
* Kotlin Multiplatform ドキュメントを詳しく掘り下げてみましょう:
  * [プロジェクト構成](multiplatform-project-configuration.md)
  * [マルチプラットフォーム依存関係の操作](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
* Compose Multiplatform UI フレームワークの基本とプラットフォーム固有の機能について学びましょう: [](compose-multiplatform-and-jetpack-compose.md)。

KMP 向けにすでに記述されているコードを見つける:
* 公式の JetBrains サンプルと、KMP の機能を披露する厳選されたプロジェクトのリストを含む、[サンプル](multiplatform-samples.md) ページ。
* GitHub トピック:
  * [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform): Kotlin Multiplatform で実装されたプロジェクト。
  * [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample): KMP で記述されたサンプルプロジェクトのリスト。
* [klibs.io](https://klibs.io) – これまでに OkHttp、Ktor、Coil、Koin、SQLDelight など、2000 以上のライブラリがインデックス化されている KMP ライブラリの検索プラットフォーム。