[//]: # (title: ローカルの Swift パッケージから Kotlin を使用する)

<tldr>
   これはローカルでの統合手法です。以下の場合に適しています：<br/>

   * ローカル SwiftPM モジュールを持つ iOS アプリがある。
   * ローカルマシンに iOS をターゲットとした Kotlin Multiplatform プロジェクトをすでにセットアップしている。
   * 既存の iOS プロジェクトが静的リンク（static linking）タイプである。<br/>

   [自分に最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

このチュートリアルでは、Kotlin Multiplatform プロジェクトの Kotlin フレームワークを、Swift Package Manager (SwiftPM) を使用してローカルパッケージに統合する方法を学びます。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

統合をセットアップするために、プロジェクトのビルド設定で `embedAndSignAppleFrameworkForXcode` Gradle タスクをプリアクション（pre-action）として使用する特別なスクリプトを追加します。共通コード（common code）に加えられた変更を Xcode プロジェクトに反映させるには、Kotlin Multiplatform プロジェクトをリビルドするだけで済みます。

この方法により、ビルドフェーズにスクリプトを追加し、共通コードの変更を反映させるために Kotlin Multiplatform と iOS プロジェクトの両方をリビルドする必要がある通常の直接統合（direct integration）方法と比較して、ローカルの Swift パッケージで Kotlin コードを簡単に使用できるようになります。

> Kotlin Multiplatform に慣れていない場合は、まず[環境のセットアップ](quickstart.md)と[クロスプラットフォームアプリケーションのゼロからの作成](compose-multiplatform-create-first-app.md)について学んでください。
>
{style="tip"}

## プロジェクトのセットアップ

この機能は Kotlin 2.0.0 以降で使用可能です。

> Kotlin のバージョンを確認するには、Kotlin Multiplatform プロジェクトのルートにある `build.gradle(.kts)` ファイルに移動してください。ファイル上部の `plugins {}` ブロックで現在のバージョンを確認できます。
> 
> または、`gradle/libs.versions.toml` ファイルのバージョンカタログを確認してください。
> 
{style="tip"}

このチュートリアルでは、プロジェクトがプロジェクトのビルドフェーズで `embedAndSignAppleFrameworkForXcode` タスクを使用する[直接統合](multiplatform-direct-integration.md)アプローチを使用していることを前提としています。CocoaPods プラグインまたは `binaryTarget` を使用した Swift パッケージを通じて Kotlin フレームワークを接続している場合は、先に移行を行ってください。

### SPM の binaryTarget 統合からの移行 {initial-collapse-state="collapsed" collapsible="true"}

`binaryTarget` を使用した SwiftPM 統合から移行するには：

1. Xcode で、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut> ショートカットを使用してビルドディレクトリをクリーンアップします。
2. すべての `Package.swift` ファイルから、Kotlin フレームワークを含むパッケージへの依存関係と、プロダクトへのターゲット依存関係の両方を削除します。

### CocoaPods プラグインからの移行 {initial-collapse-state="collapsed" collapsible="true"}

> `cocoapods {}` ブロック内に他の Pod への依存関係がある場合は、CocoaPods 統合アプローチを継続する必要があります。現在、マルチモードの SwiftPM プロジェクトにおいて、Pod への依存関係と Kotlin フレームワークへの依存関係を両立させることはできません。
>
{style="warning"}

CocoaPods プラグインから移行するには：

1. Xcode で、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut> ショートカットを使用してビルドディレクトリをクリーンアップします。
2. Podfile のあるディレクトリで、以下のコマンドを実行します：

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` ファイルから `cocoapods {}` ブロックを削除します。
4. `.podspec` ファイルと Podfile を削除します。

## フレームワークをプロジェクトに接続する

> `swift build` への統合は、現在サポートされていません。
>
{style="note"}

ローカルの Swift パッケージで Kotlin コードを使用できるようにするには、マルチプラットフォームプロジェクトから生成された Kotlin フレームワークを Xcode プロジェクトに接続します：

1. Xcode で、**Product** | **Scheme** | **Edit scheme** に移動するか、トップバーのスキームアイコンをクリックして **Edit scheme** を選択します：

   ![Edit scheme](xcode-edit-schemes.png){width=700}

2. **Build** | **Pre-actions** 項目を選択し、**+** | **New Run Script Action** をクリックします：

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. 以下のスクリプトを調整し、アクションとして追加します：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd` コマンドでは、Kotlin Multiplatform プロジェクトのルートへのパスを指定します（例：`$SRCROOT/..`）。
   * `./gradlew` コマンドでは、共有モジュールの名前を指定します（例：`:shared` または `:composeApp`）。
  
4. **Provide build settings from** セクションで、アプリのターゲットを選択します：

   ![Filled run script action](xcode-filled-run-script-action.png){width=700}

5. これで、ローカルの Swift パッケージに共有モジュールをインポートして Kotlin コードを使用できるようになります。

   Xcode でローカルの Swift パッケージに移動し、モジュールのインポートを含む関数を定義します。例：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SwiftPM usage](xcode-spm-usage.png){width=700}

6. iOS プロジェクトの `ContentView.swift` ファイルで、このローカルパッケージをインポートして関数を使用できるようになります：

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
   
7. Xcode でプロジェクトをビルドします。すべてが正しくセットアップされていれば、プロジェクトのビルドは成功します。
   
他に考慮すべき点がいくつかあります：

* デフォルトの `Debug` または `Release` とは異なるカスタムビルド構成を使用している場合は、**Build Settings** タブの **User-Defined** で `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定を追加し、`Debug` または `Release` に設定してください。
* スクリプトのサンドボックス化（script sandboxing）に関するエラーが発生した場合は、プロジェクト名をダブルクリックして iOS プロジェクト設定を開き、**Build Settings** タブの **Build Options** にある **User Script Sandboxing** を無効にしてください。

## 次のステップ

* [統合方法を選択する](multiplatform-ios-integration-overview.md)
* [Swift パッケージのエクスポートをセットアップする方法を学ぶ](multiplatform-spm-export.md)