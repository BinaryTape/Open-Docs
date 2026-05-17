[//]: # (title: アプリケーションの公開)

アプリをリリースの準備ができたら、公開してユーザーに届ける時です。

モバイルアプリの場合、プラットフォームごとに複数のストアが利用可能です。しかし、この記事では公式のストアである [Google Play Store](https://play.google.com/store) と [Apple App Store](https://www.apple.com/ios/app-store/) に焦点を当てます。Web アプリについては、[GitHub Pages](https://pages.github.com/) を使用します。

Kotlin Multiplatform アプリケーションを公開用に準備する方法を学び、このプロセスのうち特に注意が必要な部分を強調します。

## Android アプリ

[Kotlin は Android 開発の主要言語](https://developer.android.com/kotlin)であるため、Kotlin Multiplatform がプロジェクトのコンパイルや Android アプリのビルドに与える影響はほとんどありません。共有モジュールから生成された Android ライブラリと Android アプリ自体の両方は、典型的な Android Gradle モジュールであり、他の Android ライブラリやアプリと何ら変わりありません。したがって、Kotlin Multiplatform プロジェクトから Android アプリを公開する方法は、[Android 開発者ドキュメント](https://developer.android.com/studio/publish)で説明されている通常のプロセスと同じです。

## iOS アプリ

Kotlin Multiplatform プロジェクトの iOS アプリは一般的な Xcode プロジェクトからビルドされるため、公開に関わる主な段階は [iOS 開発者ドキュメント](https://developer.apple.com/ios/submit/)で説明されているものと同じです。

> 2024年春の App Store ポリシーの変更により、プライバシー マニフェスト（privacy manifest）の欠落や不備があると、アプリの警告や却下につながる可能性があります。
> 詳細と、特に Kotlin Multiplatform アプリ向けの回避策については、「[iOS アプリのプライバシー マニフェスト](https://kotlinlang.org/docs/apple-privacy-manifest.html)」を参照してください。
>
{style="note"}

Kotlin Multiplatform プロジェクトに特有なのは、共有 Kotlin モジュールをフレームワーク（framework）にコンパイルし、それを Xcode プロジェクトにリンクすることです。一般的に、共有モジュールと Xcode プロジェクトの統合は [Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)によって自動的に行われます。ただし、プラグインを使用しない場合は、Xcode で iOS プロジェクトをビルドおよびパッケージ化する際に以下の点に注意してください。

*   共有 Kotlin ライブラリはネイティブ フレームワークにコンパイルされます。
*   特定のプラットフォーム用にコンパイルされたフレームワークを iOS アプリ プロジェクトに接続する必要があります。
*   Xcode プロジェクトの設定で、ビルド システムが検索するフレームワークのパスを指定します。
*   プロジェクトをビルドした後、アプリを起動してテストし、実行時にフレームワークを操作する際に問題がないことを確認してください。

共有 Kotlin モジュールを iOS プロジェクトに接続する方法は 2 つあります。
*   [Kotlin CocoaPods Gradle プラグイン](multiplatform-cocoapods-overview.md)を使用する：これにより、ネイティブ ターゲットを持つマルチプラットフォーム プロジェクトを、iOS プロジェクトの CocoaPods 依存関係として使用できます。
*   手動で構成する：マルチプラットフォーム プロジェクトで iOS フレームワークを作成し、Xcode プロジェクトでその最新バージョンを取得するように手動で構成します。Kotlin Multiplatform ウィザードや Kotlin Multiplatform IDE プラグインが通常この構成を処理します。Xcode でフレームワークを直接追加する方法については、「[既存のアプリにフレームワークを接続する](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)」を参照してください。

### iOS アプリケーションの構成

Xcode を使わずに、生成されるアプリに影響を与える基本プロパティを構成できます。

#### バンドル ID

[バンドル ID (Bundle ID)](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion) は、オペレーティング システム内でアプリを一意に識別します。これを変更するには、Android Studio で `iosApp/Configuration/Config.xcconfig` ファイルを開き、`BUNDLE_ID` を更新します。

#### アプリ名

アプリ名は、ターゲットの実行可能ファイル名とアプリケーション バンドル名を設定します。アプリ名を変更するには：

*   まだ Android Studio でプロジェクトを**開いていない**場合は、任意のテキスト エディタで `iosApp/Configuration/Config.xcconfig` ファイルの `APP_NAME` オプションを直接変更できます。
*   すでに Android Studio でプロジェクトを開いている場合は、以下の手順を実行してください。

  1. プロジェクトを閉じます。
  2. 任意のテキスト エディタで `iosApp/Configuration/Config.xcconfig` ファイルの `APP_NAME` オプションを変更します。
  3. Android Studio でプロジェクトを再度開きます。

その他の設定を構成する必要がある場合は、Xcode を使用してください。Android Studio でプロジェクトを開いた後、Xcode で `iosApp/iosApp.xcworkspace` ファイルを開き、そこで変更を加えます。

### クラッシュ レポートのシンボル化

デベロッパーがアプリを改善できるように、iOS はアプリのクラッシュを分析する手段を提供しています。詳細なクラッシュ分析のために、クラッシュ レポートのメモリ アドレスを関数や行番号などのソース コード内の場所と一致させる、特別なデバッグ シンボル（`.dSYM`）ファイルを使用します。

デフォルトでは、共有 Kotlin モジュールから生成された iOS フレームワークのリリース バージョンには、対応する `.dSYM` ファイルが付属しています。これにより、共有モジュールのコードで発生したクラッシュの分析が容易になります。

クラッシュ レポートのシンボル化（symbolication）の詳細については、[Kotlin/Native ドキュメント](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)を参照してください。

## Web アプリ

Web アプリケーションを公開するには、アプリケーションを構成するコンパイル済みファイルとリソースを含むアーティファクトを作成します。これらのアーティファクトは、GitHub Pages などの Web ホスティング プラットフォームにアプリケーションをデプロイするために必要です。

### アーティファクトの生成

**wasmJsBrowserDistribution** タスクを実行するための実行構成（Run configuration）を作成します。

1. **Run | Edit Configurations** メニュー項目を選択します。
2. プラスボタンをクリックし、ドロップダウン リストから **Gradle** を選択します。
3. **Tasks and arguments** フィールドに、次のコマンドを貼り付けます。

   ```shell
   wasmJsBrowserDistribution
   ```

4. **OK** をクリック。

これで、この構成を使用してタスクを実行できます。

![Wasm 配信タスクの実行](compose-run-wasm-distribution-task.png){width=350}

タスクが完了すると、生成されたアーティファクトを `sharedUI/build/dist/wasmJs/productionExecutable` ディレクトリに見つけることができます。

![アーティファクト ディレクトリ](compose-web-artifacts.png){width=400}

### GitHub Pages でアプリケーションを公開する

アーティファクトの準備ができたら、Web ホスティング プラットフォームにアプリケーションをデプロイできます。

1. `productionExecutable` ディレクトリの内容を、サイトを作成したいリポジトリにコピーします。
2. GitHub の指示に従って [サイトを作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) します。

   > GitHub に変更をプッシュしてから、サイトの変更が公開されるまでに最大 10 分かかることがあります。
   >
   {style="note"}

3. ブラウザで、GitHub Pages のドメインに移動します。

   ![GitHub Pages への移動](publish-your-application-on-web.png){width=650}

   おめでとうございます！アーティファクトを GitHub Pages に公開できました。

### Web アプリケーションのデバッグ

追加の構成なしで、すぐにブラウザで Web アプリケーションをデバッグできます。ブラウザでのデバッグ方法については、Kotlin ドキュメントの「[ブラウザでのデバッグ](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)」ガイドを参照してください。