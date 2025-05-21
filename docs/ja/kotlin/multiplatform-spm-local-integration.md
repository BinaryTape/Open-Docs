---
title: "ローカルの Swift パッケージから Kotlin を使用する"
---
:::info

   これはローカルな連携方法です。以下のような場合に有効です:<br/>

   * ローカルのSPMモジュールを持つiOSアプリがある場合。
   * ローカルマシンでiOSをターゲットとするKotlin Multiplatformプロジェクトをすでにセットアップしている場合。
   * 既存のiOSプロジェクトがスタティックリンクタイプの場合。<br/>

   [最適な連携方法を選択してください](multiplatform-ios-integration-overview)

:::

このチュートリアルでは、Swift package manager (SPM)を使用して、Kotlin MultiplatformプロジェクトからのKotlin frameworkをローカル packageに連携する方法を学びます。

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

連携をセットアップするには、プロジェクトのビルド設定で`embedAndSignAppleFrameworkForXcode` Gradleタスクを使用する特別なスクリプトを事前アクションとして追加します。共通コードに加えられた変更をXcodeプロジェクトに反映させるには、Kotlin Multiplatformプロジェクトをリビルドするだけで済みます。

これにより、通常の直接連携方法と比較して、KotlinコードをローカルSwift packageで簡単に使用できます。通常の直接連携方法では、ビルドフェーズにスクリプトを追加し、共通コードからの変更を取得するには、Kotlin MultiplatformプロジェクトとiOSプロジェクトの両方をリビルドする必要があります。

:::note
Kotlin Multiplatformに慣れていない場合は、最初に[環境をセットアップする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)方法と[クロスプラットフォームアプリケーションを最初から作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)方法を学んでください。

## プロジェクトのセットアップ

この機能はKotlin 2.0.0以降で使用可能です。

Kotlinのバージョンを確認するには、Kotlin Multiplatformプロジェクトのルートにある`build.gradle(.kts)`ファイルに移動します。ファイルの先頭にある`plugins {}`ブロックに現在のバージョンが表示されます。

または、`gradle/libs.versions.toml`ファイルのバージョンカタログを確認してください。

このチュートリアルでは、プロジェクトが、プロジェクトのビルドフェーズで`embedAndSignAppleFrameworkForXcode`タスクを使用する[直接連携](multiplatform-direct-integration)アプローチを使用していることを前提としています。CocoaPodsプラグインまたは`binaryTarget`を使用したSwift packageを介してKotlin frameworkを接続している場合は、最初に移行してください。

### SPM `binaryTarget`連携からの移行

`binaryTarget`を使用したSPM連携から移行するには：

1. Xcodeで、**Product** | **Clean Build Folder**を使用するか、<shortcut>Cmd + Shift + K</shortcut>ショートカットを使用して、ビルドディレクトリをクリーンアップします。
2. すべての`Package.swift`ファイルで、Kotlin frameworkを含むpackageへの依存関係と、プロダクトへのターゲット依存関係の両方を削除します。

### CocoaPodsプラグインからの移行

`cocoapods {}`ブロックに他のPodsへの依存関係がある場合は、CocoaPods連携アプローチに頼る必要があります。現在、マルチモーダルSPMプロジェクトでPodsへの依存関係とKotlin frameworkへの依存関係の両方を持つことはできません。

CocoaPodsプラグインから移行するには：

1. Xcodeで、**Product** | **Clean Build Folder**を使用するか、<shortcut>Cmd + Shift + K</shortcut>ショートカットを使用して、ビルドディレクトリをクリーンアップします。
2. `Podfile`のあるディレクトリで、次のコマンドを実行します。

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)`ファイルから`cocoapods {}`ブロックを削除します。
4. `.podspec`ファイルと`Podfile`ファイルを削除します。

## frameworkをプロジェクトに接続する

`swift build`への連携は現在サポートされていません。

:::

KotlinコードをローカルSwift packageで使用できるようにするには、multiplatformプロジェクトから生成されたKotlin frameworkをXcodeプロジェクトに接続します。

1. Xcodeで、**Product** | **Scheme** | **Edit scheme**に移動するか、上部のバーにあるスキームアイコンをクリックして**Edit scheme**を選択します。

   <img src="/img/xcode-edit-schemes.png" alt="Edit scheme" width="700" style={{verticalAlign: 'middle'}}/>

2. **Build** | **Pre-actions**項目を選択し、**+** | **New Run Script Action**をクリックします。

   <img src="/img/xcode-new-run-script-action.png" alt="New run script action" width="700" style={{verticalAlign: 'middle'}}/>

3. 次のスクリプトを調整し、アクションとして追加します。

   ```bash
   cd "<Multiplatformプロジェクトのルートへのパス>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd`コマンドで、Kotlin Multiplatformプロジェクトのルートへのパスを指定します（例：`$SRCROOT/..`）。
   * `./gradlew`コマンドで、共有モジュールの名前を指定します（例：`:shared`または`:composeApp`）。
  
4. **Provide build settings from**セクションで、アプリのターゲットを選択します。

   <img src="/img/xcode-filled-run-script-action.png" alt="Filled run script action" width="700" style={{verticalAlign: 'middle'}}/>

5. これで、共有モジュールをローカルSwift packageにインポートし、Kotlinコードを使用できます。

   Xcodeで、ローカルSwift packageに移動し、モジュールインポートを含む関数を定義します（例：）。

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() `->` String {
       return Greeting.greet()
   }
   ```

   <img src="/img/xcode-spm-usage.png" alt="SPM usage" width="700" style={{verticalAlign: 'middle'}}/>

6. iOSプロジェクトの`ContentView.swift`ファイルで、ローカル packageをインポートしてこの関数を使用できます。

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
   
考慮すべき点がいくつかあります。

* デフォルトの`Debug`または`Release`とは異なるカスタムビルド構成がある場合は、**Build Settings**タブの**User-Defined**で`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定します。
* スクリプトサンドボックスでエラーが発生した場合は、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開き、**Build Settings**タブの**Build Options**で**User Script Sandboxing**を無効にします。

## 次のステップ

* [連携方法を選択してください](multiplatform-ios-integration-overview)
* [Swift packageエクスポートの設定方法を学ぶ](native-spm)

  ```