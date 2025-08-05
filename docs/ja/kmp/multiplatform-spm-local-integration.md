[//]: # (title: ローカルのSwiftパッケージからKotlinを使用する)

<tldr>
   これはローカルな統合方法です。以下の条件に当てはまる場合に有効です。<br/>

   * ローカルのSPMモジュールを使用するiOSアプリがある。
   * ローカルマシンでiOSをターゲットとするKotlin Multiplatformプロジェクトを既にセットアップしている。
   * 既存のiOSプロジェクトが静的リンクタイプである。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

このチュートリアルでは、Kotlin Multiplatformプロジェクトから生成されたKotlinフレームワークを、Swift Package Manager (SPM) を使用してローカルパッケージに統合する方法を学習します。

![直接統合図](direct-integration-scheme.svg){width=700}

統合をセットアップするには、プロジェクトのビルド設定で`embedAndSignAppleFrameworkForXcode` Gradleタスクを事前アクションとして使用する特別なスクリプトを追加します。共通コードに加えられた変更をXcodeプロジェクトに反映させるには、Kotlin Multiplatformプロジェクトをリビルドするだけで済みます。

この方法では、ローカルのSwiftパッケージでKotlinコードを簡単に使用できます。これは、スクリプトをビルドフェーズに追加し、共通コードからの変更を反映させるためにKotlin MultiplatformプロジェクトとiOSプロジェクトの両方をリビルドする必要がある通常の直接統合方法と比較して容易です。

> Kotlin Multiplatformに慣れていない場合は、まず[環境をセットアップする](quickstart.md)方法と、[クロスプラットフォームアプリケーションをゼロから作成する](compose-multiplatform-create-first-app.md)方法を学びましょう。
>
{style="tip"}

## プロジェクトのセットアップ

この機能はKotlin 2.0.0以降で利用可能です。

> Kotlinのバージョンを確認するには、Kotlin Multiplatformプロジェクトのルートにある`build.gradle(.kts)`ファイルに移動します。ファイルの先頭にある`plugins {}`ブロックに現在のバージョンが表示されます。
> 
> あるいは、`gradle/libs.versions.toml`ファイルでバージョンカタログを確認します。
> 
{style="tip"}

このチュートリアルは、プロジェクトが`embedAndSignAppleFrameworkForXcode`タスクをプロジェクトのビルドフェーズで使用する[直接統合](multiplatform-direct-integration.md)アプローチを採用していることを前提としています。CocoaPodsプラグインまたは`binaryTarget`を使用したSwiftパッケージを介してKotlinフレームワークを接続している場合は、まず移行してください。

### SPMのbinaryTarget統合からの移行 {initial-collapse-state="collapsed" collapsible="true"}

SPMの`binaryTarget`統合から移行するには：

1. Xcodeで、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut> ショートカットでビルドディレクトリをクリーンアップします。
2. すべての`Package.swift`ファイルから、Kotlinフレームワークを含むパッケージへの依存関係と、プロダクトへのターゲット依存関係の両方を削除します。

### CocoaPodsプラグインからの移行 {initial-collapse-state="collapsed" collapsible="true"}

> `cocoapods {}`ブロックに他のPodへの依存関係がある場合、CocoaPods統合アプローチに頼る必要があります。現在、マルチモーダルSPMプロジェクトでPodとKotlinフレームワークの両方に依存関係を持つことは不可能です。
>
{style="warning"}

CocoaPodsプラグインから移行するには：

1. Xcodeで、**Product** | **Clean Build Folder** を使用するか、<shortcut>Cmd + Shift + K</shortcut> ショートカットでビルドディレクトリをクリーンアップします。
2. Podfileのあるディレクトリで、以下のコマンドを実行します。

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

1. Xcodeで、**Product** | **Scheme** | **Edit scheme** に移動するか、上部のバーにあるスキームアイコンをクリックして**Edit scheme** を選択します。

   ![スキームを編集](xcode-edit-schemes.png){width=700}

2. **Build** | **Pre-actions** を選択し、**+** | **New Run Script Action** をクリックします。

   ![新しいRun Scriptアクション](xcode-new-run-script-action.png){width=700}

3. 以下のスクリプトを調整し、アクションとして追加します。

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd`コマンドでは、Kotlin Multiplatformプロジェクトのルートへのパスを指定します。例: `$SRCROOT/..`
   * `./gradlew`コマンドでは、共有モジュールの名前を指定します。例: `:shared`または`:composeApp`
  
4. **Provide build settings from** セクションでアプリのターゲットを選択します。

   ![記入済みのRun Scriptアクション](xcode-filled-run-script-action.png){width=700}

5. これで、共有モジュールをローカルのSwiftパッケージにインポートして、Kotlinコードを使用できるようになります。

   Xcodeで、ローカルのSwiftパッケージに移動し、モジュールインポートを含む関数を定義します。例：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPMの使用法](xcode-spm-usage.png){width=700}

6. iOSプロジェクトの`ContentView.swift`ファイルで、ローカルパッケージをインポートすることでこの関数を使用できるようになります。

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
   
7. Xcodeでプロジェクトをビルドします。すべて正しく設定されていれば、プロジェクトのビルドは成功します。
   
さらに考慮すべき点がいくつかあります。

* デフォルトの`Debug`または`Release`とは異なるカスタムビルド設定がある場合、**Build Settings**タブで、**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定します。
* スクリプトのサンドボックス化に関するエラーが発生した場合、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開き、**Build Settings**タブで**Build Options**の下にある**User Script Sandboxing**を無効にします。

## 次のステップ

* [統合方法を選択する](multiplatform-ios-integration-overview.md)
* [Swiftパッケージのエクスポート方法を学ぶ](multiplatform-spm-export.md)