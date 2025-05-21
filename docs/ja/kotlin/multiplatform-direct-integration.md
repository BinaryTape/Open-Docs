---
title: ダイレクトインテグレーション
---
:::info

   これはローカル統合メソッドです。以下の条件に当てはまる場合に有効です。<br/>

   * ローカルマシンでiOSをターゲットとするKotlin Multiplatformプロジェクトをすでにセットアップしている。
   * Kotlin MultiplatformプロジェクトにCocoaPodsの依存関係がない。<br/>

   [最適な統合方法を選択してください](multiplatform-ios-integration-overview)

:::

Kotlin MultiplatformプロジェクトとiOSプロジェクトを同時に開発し、それらの間でコードを共有したい場合は、特別なスクリプトを使用して直接統合を設定できます。

このスクリプトは、Kotlin frameworkをXcodeのiOSプロジェクトに接続するプロセスを自動化します。

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

このスクリプトは、Xcode環境専用に設計された`embedAndSignAppleFrameworkForXcode` Gradleタスクを使用します。セットアップ中に、iOSアプリのビルドのrun script phaseに追加します。その後、Kotlin artifact
がビルドされ、iOSアプリのビルドを実行する前に派生データに含まれます。

一般的に、スクリプトは次のことを行います。

* コンパイルされたKotlin frameworkをiOSプロジェクト構造内の正しいディレクトリにコピーします。
* 埋め込まれたframeworkのコード署名プロセスを処理します。
* Kotlin frameworkのコード変更がXcodeのiOSアプリに反映されるようにします。

## 設定方法

現在CocoaPodsプラグインを使用してKotlin frameworkを接続している場合は、最初に移行してください。プロジェクトにCocoaPodsの依存関係がない場合は、[この手順をスキップしてください](#connect-the-framework-to-your-project)。

### CocoaPodsプラグインからの移行

CocoaPodsプラグインから移行するには：

1. Xcodeで、**Product** | **Clean Build Folder**を使用するか、
   <shortcut>Cmd + Shift + K</shortcut>ショートカットを使用して、ビルドディレクトリをクリーンアップします。
2. `Podfile`ファイルがあるディレクトリで、次のコマンドを実行します。

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)`ファイルから`cocoapods {}`ブロックを削除します。
4. `.podspec`ファイルと`Podfile`ファイルを削除します。

### frameworkをプロジェクトに接続する

マルチプラットフォームプロジェクトから生成されたKotlin frameworkをXcodeプロジェクトに接続するには：

1. `embedAndSignAppleFrameworkForXcode`タスクは、`binaries.framework`構成オプションが
   宣言されている場合にのみ登録されます。Kotlin Multiplatformプロジェクトで、`build.gradle.kts`ファイルのiOSターゲット宣言を確認します。
2. Xcodeで、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開きます。
3. プロジェクト設定の**Build Phases**タブで、**+**をクリックし、**New Run Script Phase**を選択します。

   <img src="/img/xcode-run-script-phase-1.png" alt="Add run script phase" width="700" style={{verticalAlign: 'middle'}}/>

4. 次のスクリプトを調整し、結果をrun script phaseにコピーします。

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * `cd`コマンドで、Kotlin Multiplatformプロジェクトのルートへのパス（たとえば、`$SRCROOT/..`）を指定します。
   * `./gradlew`コマンドで、共有モジュールの名前（たとえば、`:shared`または`:composeApp`）を指定します。

   <img src="/img/xcode-run-script-phase-2.png" alt="Add the script" width="700" style={{verticalAlign: 'middle'}}/>

5. **Run Script** phaseを**Compile Sources** phaseの前にドラッグします。

   <img src="/img/xcode-run-script-phase-3.png" alt="Drag the Run Script phase" width="700" style={{verticalAlign: 'middle'}}/>

6. **Build Settings**タブで、**Build Options**の**User Script Sandboxing**オプションを無効にします。

   <img src="/img/disable-sandboxing-in-xcode-project-settings.png" alt="User Script Sandboxing" width="700" style={{verticalAlign: 'middle'}}/>

   > 最初にサンドボックスを無効にせずにiOSプロジェクトをビルドした場合、Gradle daemonの再起動が必要になる場合があります。
   > サンドボックス化されている可能性のあるGradle daemonプロセスを停止します。
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > 

7. Xcodeでプロジェクトをビルドします。すべてが正しく設定されていれば、プロジェクトは正常にビルドされます。

:::note
デフォルトの`Debug`または`Release`とは異なるカスタムビルド構成がある場合は、**Build Settings**
タブで、**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、それを`Debug`または`Release`に設定します。

:::

## 次のステップ

Swift Package Managerを使用する際に、ローカル統合を利用することもできます。[ローカルパッケージ内のKotlin frameworkへの依存関係を追加する方法](multiplatform-spm-local-integration)をご覧ください。