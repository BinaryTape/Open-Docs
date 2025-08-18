[//]: # (title: ローカルのSwiftパッケージからKotlinを使用する)

<tldr>
   これはローカルでの統合方法です。次の場合に役立ちます。<br/>

   * ローカルのSPMモジュールを持つiOSアプリがある。
   * ローカルマシンでiOSをターゲットとするKotlin Multiplatformプロジェクトを既にセットアップしている。
   * 既存のiOSプロジェクトが静的リンクタイプを使用している。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

このチュートリアルでは、Swift Package Manager (SPM) を使用して、Kotlin Multiplatformプロジェクトから生成されたKotlinフレームワークをローカルパッケージに統合する方法を学習します。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

統合をセットアップするには、プロジェクトのビルド設定に`embedAndSignAppleFrameworkForXcode` Gradleタスクをプリ実行アクションとして使用する特別なスクリプトを追加します。共通コードで行われた変更がXcodeプロジェクトに反映されるのを確認するには、Kotlin Multiplatformプロジェクトをリビルドするだけで済みます。

この方法は、スクリプトをビルドフェーズに追加し、共通コードからの変更を取得するためにKotlin MultiplatformプロジェクトとiOSプロジェクトの両方のリビルドが必要な通常の直接統合方法と比較して、ローカルのSwiftパッケージでKotlinコードを簡単に使用できるようにします。

> Kotlin Multiplatformに慣れていない場合は、まず[環境のセットアップ](quickstart.md)と[クロスプラットフォームアプリケーションのゼロからの作成](compose-multiplatform-create-first-app.md)について学習してください。
>
{style="tip"}

## プロジェクトをセットアップする

この機能はKotlin 2.0.0以降で利用可能です。

> Kotlinのバージョンを確認するには、Kotlin Multiplatformプロジェクトのルートにある`build.gradle(.kts)`ファイルに移動します。ファイルの先頭にある`plugins {}`ブロックに現在のバージョンが表示されます。
> 
> あるいは、`gradle/libs.versions.toml`ファイルでバージョンカタログを確認することもできます。
> 
{style="tip"}

このチュートリアルでは、プロジェクトが`embedAndSignAppleFrameworkForXcode`タスクをプロジェクトのビルドフェーズで使用する[直接統合](multiplatform-direct-integration.md)アプローチを採用していることを前提としています。KotlinフレームワークをCocoaPodsプラグインまたは`binaryTarget`を使用したSwiftパッケージを介して接続している場合は、まず移行してください。

### SPMの`binaryTarget`統合からの移行 {initial-collapse-state="collapsed" collapsible="true"}

`binaryTarget`を使用したSPM統合から移行するには：

1. Xcodeで、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut>ショートカットでビルドディレクトリをクリーンアップします。
2. すべての`Package.swift`ファイルから、Kotlinフレームワークを含むパッケージへの依存関係と、プロダクトへのターゲット依存関係の両方を削除します。

### CocoaPodsプラグインからの移行 {initial-collapse-state="collapsed" collapsible="true"}

> `cocoapods {}`ブロックに他のPodへの依存関係がある場合は、CocoaPods統合アプローチに頼る必要があります。現在、マルチモーダルSPMプロジェクトでPodとKotlinフレームワークの両方に依存関係を持つことは不可能です。
>
{style="warning"}

CocoaPodsプラグインから移行するには：

1. Xcodeで、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut>ショートカットでビルドディレクトリをクリーンアップします。
2. Podfileのあるディレクトリで、次のコマンドを実行します。

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)`ファイルから`cocoapods {}`ブロックを削除します。
4. `.podspec`ファイルとPodfileを削除します。

## フレームワークをプロジェクトに接続する

> `swift build`への統合は現在サポートされていません。
>
{style="note"}

ローカルのSwiftパッケージでKotlinコードを使用できるようにするには、マルチプラットフォームプロジェクトから生成されたKotlinフレームワークをXcodeプロジェクトに接続します。

1. Xcodeで、**Product** | **Scheme** | **Edit scheme** に移動するか、トップバーのスキームアイコンをクリックして**Edit scheme**を選択します。

   ![Edit scheme](xcode-edit-schemes.png){width=700}

2. **Build** | **Pre-actions** アイテムを選択し、**+** | **New Run Script Action** をクリックします。

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. 次のスクリプトを調整し、アクションとして追加します。

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd`コマンドで、Kotlin Multiplatformプロジェクトのルートへのパス（例: `$SRCROOT/..`）を指定します。
   * `./gradlew`コマンドで、共有モジュールの名前（例: `:shared`または`:composeApp`）を指定します。
  
4. **Provide build settings from**セクションでアプリのターゲットを選択します。

   ![Filled run script action](xcode-filled-run-script-action.png){width=700}

5. これで、共有モジュールをローカルのSwiftパッケージにインポートして、Kotlinコードを使用できるようになります。

   Xcodeで、ローカルのSwiftパッケージに移動し、モジュールのインポートを伴う関数を定義します。例：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM usage](xcode-spm-usage.png){width=700}

6. iOSプロジェクトの`ContentView.swift`ファイルで、ローカルパッケージをインポートすることでこの関数を使用できるようになりました。

   ```Swift
   import SwiftUI
   import SpmLocalPackage
   
   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }
   
   #Preview {
       ContentView()
   }
   ```
   
7. Xcodeでプロジェクトをビルドします。すべてが正しく設定されていれば、プロジェクトのビルドは成功します。
   
考慮すべき点が他にもいくつかあります。

* デフォルトの`Debug`または`Release`とは異なるカスタムビルド設定を使用している場合は、**Build Settings**タブの**User-Defined**セクションに`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定します。
* スクリプトのサンドボックス化に関するエラーが発生した場合は、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開き、**Build Settings**タブで**Build Options**の下にある**User Script Sandboxing**を無効にします。

## 次のステップ

* [統合方法を選択する](multiplatform-ios-integration-overview.md)
* [Swiftパッケージのエクスポート方法を設定する](multiplatform-spm-export.md)