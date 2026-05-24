[//]: # (title: CocoaPods の概要とセットアップ)

<tldr>
   これはローカル統合の手法です。以下の場合に適しています：<br/>

   * CocoaPods を使用する iOS プロジェクトを含むモノリポジトリ構成である。
   * Kotlin マルチプラットフォームプロジェクトに CocoaPods の依存関係がある。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native は [CocoaPods 依存関係マネージャー](https://cocoapods.org/)との統合を提供しています。Pod ライブラリへの依存関係を追加できるほか、Kotlin プロジェクトを CocoaPods の依存関係として使用することもできます。

> CocoaPods 統合のアプローチは、[直接統合](multiplatform-direct-integration.md)で使用される `embedAndSignAppleFrameworkForXcode` メカニズムと一緒に使用することはできません。
>
{style="warning"}

Pod の依存関係は IntelliJ IDEA または Android Studio で直接管理でき、コードハイライトや補完などの追加機能をすべて利用できます。Xcode に切り替えることなく、Gradle で Kotlin プロジェクト全体をビルドできます。

Xcode が必要になるのは、Swift/Objective-C コードを変更する場合や、Apple のシミュレーターまたは実機でアプリケーションを実行する場合のみです。Xcode で作業するには、まず [Podfile を更新](#update-podfile-for-xcode)してください。

## CocoaPods を使用するための環境構築

お好みのインストールツールを使用して、[CocoaPods 依存関係マネージャー](https://cocoapods.org/)をインストールします：

<Tabs>
<TabItem title="RVM">

1. [RVM](https://rvm.io/rvm/install) をまだインストールしていない場合は、インストールします。
2. Ruby をインストールします。特定のバージョンを選択できます：

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. CocoaPods をインストールします：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Rbenv">

1. [GitHub から rbenv](https://github.com/rbenv/rbenv#installation) をまだインストールしていない場合は、インストールします。
2. Ruby をインストールします。特定のバージョンを選択できます：

    ```bash
    rbenv install %rubyVersion%
    ```

3. Ruby のバージョンを特定のディレクトリに対してローカルに設定するか、マシン全体に対してグローバルに設定します：

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. CocoaPods をインストールします：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="デフォルトの Ruby">

> このインストール方法は Apple M チップを搭載したデバイスでは動作しません。CocoaPods を使用するための環境構築には他のツールを使用してください。
>
{style="note"}

macOS で利用可能なデフォルトの Ruby を使用して、CocoaPods 依存関係マネージャーをインストールできます：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> Homebrew による CocoaPods のインストールは、互換性の問題を引き起こす可能性があります。
>
> CocoaPods をインストールする際、Homebrew は Xcode での作業に必要な [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem もインストールします。
> しかし、これは Homebrew では更新できず、インストールされた Xcodeproj が最新の Xcode バージョンをまだサポートしていない場合、Pod のインストール時にエラーが発生します。その場合は、他のツールを使用して CocoaPods をインストールしてみてください。
>
{style="warning"}

1. [Homebrew](https://brew.sh/) をまだインストールしていない場合は、インストールします。
2. CocoaPods をインストールします：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

インストール中に問題が発生した場合は、[考えられる問題と解決策](#possible-issues-and-solutions)セクションを確認してください。

## プロジェクトの作成

CocoaPods 環境が整ったら、Kotlin マルチプラットフォームプロジェクトを Pod と連携するように構成できます。以下の手順は、新しく生成されたプロジェクトでの構成方法を示しています：

1. [Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)または [Kotlin Multiplatform Web ウィザード](https://kmp.jetbrains.com)を使用して、Android および iOS 用の新しいプロジェクトを生成します。
   Web ウィザードを使用する場合は、アーカイブを解凍し、IDE でプロジェクトをインポートします。
2. バージョンカタログ（`gradle/libs.versions.toml` ファイル）の `[plugins]` ブロックに、Kotlin CocoaPods Gradle プラグインを追加します：

   ```toml
   [plugins]
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. プロジェクトのルートにある `build.gradle.kts` ファイルに移動し、`plugins {}` ブロックに以下のエイリアスを追加します：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. CocoaPods を統合したいモジュール（例：`sharedLogic` モジュール）を開き、その `build.gradle.kts` ファイルの `plugins {}` ブロックに以下のエイリアスを追加します：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

これで、[Kotlin マルチプラットフォームプロジェクトで CocoaPods を構成する](#configure-the-project)準備が整いました。

## プロジェクトの構成

マルチプラットフォームプロジェクトで Kotlin CocoaPods Gradle プラグインを構成するには：

1. プロジェクトの共有モジュールの `build.gradle(.kts)` で、Kotlin マルチプラットフォームプラグインとともに CocoaPods プラグインを適用します。

   > IDE プラグインまたは Web ウィザードで[プロジェクトを作成](#create-a-project)した場合は、この手順をスキップしてください。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. `cocoapods` ブロック内で、Podspec ファイルの `version`、`summary`、`homepage`、および `baseName` を構成します：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 必須プロパティ
            // ここで必要な Pod のバージョンを指定します
            // 指定しない場合は Gradle プロジェクトのバージョンが使用されます
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // 任意プロパティ
            // Gradle プロジェクト名を変更する代わりに、ここで Pod 名を構成します
            name = "MyCocoaPod"

            framework {
                // 必須プロパティ              
                // フレームワーク名の構成。非推奨の 'frameworkName' の代わりにこのプロパティを使用してください
                baseName = "MyFramework"
                
                // 任意プロパティ
                // フレームワークのリンクタイプを指定します。デフォルトは dynamic です。
                isStatic = false
                // 依存関係のエクスポート
                // 他のプロジェクトモジュールがある場合は、コメントを解除して指定してください：
                // export(project(":<your other KMP module>"))
                transitiveExport = false // これがデフォルトです。
            }

            // カスタム Xcode 構成を NativeBuildType にマッピングします
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL の完全な構文については、[Kotlin Gradle プラグインのリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)を参照してください。
    >
    {style="note"}
    
3. IntelliJ IDEA で **Build** | **Reload All Gradle Projects** を実行する（または Android Studio で **File** | **Sync Project with Gradle Files** を実行する）と、プロジェクトが再インポートされます。
4. Xcode ビルド中の互換性の問題を避けるために、[Gradle ラッパー](https://docs.gradle.org/current/userguide/gradle_wrapper.html)を生成します。

適用されると、CocoaPods プラグインは以下の処理を行います：

* すべての macOS、iOS、tvOS、および watchOS ターゲットの出力バイナリとして、`debug` と `release` の両方のフレームワークを追加します。
* プロジェクトの [Podspec](https://guides.cocoapods.org/syntax/podspec.html) ファイルを生成する `podspec` タスクを作成します。

`Podspec` ファイルには、出力フレームワークへのパスと、Xcode プロジェクトのビルドプロセス中におけるこのフレームワークのビルドを自動化するスクリプトフェーズが含まれます。

## Xcode 用に Podfile を更新する

Kotlin プロジェクトを Xcode プロジェクトにインポートする場合：

1. Kotlin プロジェクトの iOS 部分で、Podfile を変更します：

   * プロジェクトに Git、HTTP、またはカスタム Podspec リポジトリの依存関係がある場合は、Podfile で Podspec へのパスを指定します。

     例えば、`podspecWithFilesExample` への依存関係を追加する場合、Podfile で Podspec へのパスを宣言します：

     ```ruby
     target 'ios-app' do
        # ... 他の依存関係 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` には Pod へのファイルパスを含める必要があります。

   * カスタム Podspec リポジトリからライブラリを追加する場合は、Podfile の冒頭で spec の[場所](https://guides.cocoapods.org/syntax/podfile.html#source)を指定します：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... 他の依存関係 ...
         pod 'example'
     end
     ```

2. プロジェクトディレクトリで `pod install` を実行します。

   初めて `pod install` を実行すると、`.xcworkspace` ファイルが作成されます。このファイルには、元の `.xcodeproj` と CocoaPods プロジェクトが含まれています。
3. `.xcodeproj` を閉じ、代わりに新しい `.xcworkspace` ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
4. IntelliJ IDEA で **Build** | **Reload All Gradle Projects** を実行する（または Android Studio で **File** | **Sync Project with Gradle Files** を実行する）と、プロジェクトが再インポートされます。

Podfile でこれらの変更を行わないと、`podInstall` タスクが失敗し、CocoaPods プラグインがログにエラーメッセージを表示します。

## 考えられる問題と解決策

### CocoaPods のインストール {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby のインストール

CocoaPods は Ruby で構築されており、macOS で利用可能なデフォルトの Ruby を使用してインストールできます。Ruby 1.9 以降には、[CocoaPods 依存関係マネージャー](https://guides.cocoapods.org/using/getting-started.html#installation)のインストールを支援する RubyGems パッケージ管理フレームワークが組み込まれています。

CocoaPods のインストールや動作に問題が発生した場合は、[このガイド](https://www.ruby-lang.org/en/documentation/installation/)に従って Ruby をインストールするか、[RubyGems の Web サイト](https://rubygems.org/pages/download/)を参照してフレームワークをインストールしてください。

#### バージョンの互換性

最新の Kotlin バージョンの使用を推奨します。
この CocoaPods セットアップに必要な最小バージョンは 1.7.0 です。

### Xcode 使用時のビルドエラー {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods のインストール状況によっては、Xcode でビルドエラーが発生することがあります。通常、Kotlin Gradle プラグインは `PATH` 内の `pod` 実行ファイルを見つけますが、環境によってこれが一致しない場合があります。

CocoaPods のインストールパスを明示的に設定するには、プロジェクトの `local.properties` ファイルに手動で、またはシェルコマンドを使用して追加できます：

* コードエディターを使用する場合、`local.properties` ファイルに以下の行を追加します：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* ターミナルを使用する場合、以下のコマンドを実行します：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### モジュールまたはフレームワークが見つからない {initial-collapse-state="collapsed" collapsible="true"}

Pod をインストールする際、[C interop](https://kotlinlang.org/docs/native-c-interop.html) の問題に関連して `module 'SomeSDK' not found` や `framework 'SomeFramework' not found` というエラーが発生することがあります。このようなエラーを解決するには、以下の解決策を試してください：

#### パッケージの更新

インストールツールとインストール済みのパッケージ（gem）を更新します：

<Tabs>
<TabItem title="RVM">

1. RVM を更新します：

   ```bash
   rvm get stable
   ```

2. Ruby のパッケージマネージャーである RubyGems を更新します：

    ```bash
    gem update --system
    ```

3. インストールされているすべての gem を最新バージョンにアップグレードします：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. Rbenv を更新します：

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. Ruby のパッケージマネージャーである RubyGems を更新します：

    ```bash
    gem update --system
    ```

3. インストールされているすべての gem を最新バージョンにアップグレードします：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. Homebrew パッケージマネージャーを更新します： 

   ```bash
   brew update
   ```

2. インストールされているすべてのパッケージを最新バージョンにアップグレードします：

   ```bash
   brew upgrade
   ```

</TabItem>
</Tabs>

#### フレームワーク名の指定 

1. ダウンロードされた Pod ディレクトリ `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 内で `module.modulemap` ファイルを探します。
2. モジュール内のフレームワーク名を確認します（例：`SDWebImageMapKit {}`）。フレームワーク名が Pod 名と一致しない場合は、明示的に指定してください：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### ヘッダーの指定

`pod("NearbyMessages")` のように、Pod に `.modulemap` ファイルが含まれていない場合は、メインヘッダーを明示的に指定します：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

詳細については [CocoaPods のドキュメント](https://guides.cocoapods.org/)を確認してください。解決しない場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) で問題を報告してください。

### Rsync エラー {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred` というエラーが発生することがあります。これは、Xcode のアプリケーションターゲットでユーザースクリプトのサンドボックス化が有効になっている場合に発生する[既知の問題](https://github.com/CocoaPods/CocoaPods/issues/11946)です。

この問題を解決するには：

1. アプリケーションターゲットでユーザースクリプトのサンドボックス化を無効にします：

   ![CocoaPods サンドボックスの無効化](disable-sandboxing-cocoapods.png){width=700}

2. サンドボックス化されていた可能性のある Gradle デーモンプロセスを停止します：

    ```shell
    ./gradlew --stop
    ```

## 次のステップ

* [Kotlin プロジェクトに Pod ライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
* [Kotlin プロジェクトと Xcode プロジェクトの間の依存関係を設定する](multiplatform-cocoapods-xcode.md)
* [CocoaPods Gradle プラグイン DSL の完全なリファレンスを見る](multiplatform-cocoapods-dsl-reference.md)