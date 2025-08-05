[//]: # (title: アプリケーションの公開)

アプリケーションのリリース準備が整ったら、公開してユーザーに届ける時です。

モバイルアプリケーションの場合、各プラットフォームで複数のストアが利用可能です。しかし、本記事では公式のストアに焦点を当てます。
[Google Play ストア](https://play.google.com/store)と[Apple App Store](https://www.apple.com/ios/app-store/)です。Webアプリケーションについては、[GitHub Pages](https://pages.github.com/)を使用します。

ここでは、Kotlin Multiplatformアプリケーションを公開するための準備方法を学び、このプロセスの中で特に注意が必要な部分を重点的に説明します。

## Androidアプリ

[KotlinはAndroid開発の主要言語である](https://developer.android.com/kotlin)ため、Kotlin MultiplatformがプロジェクトのコンパイルやAndroidアプリのビルドに明らかな影響を与えることはありません。共有モジュールから生成されるAndroidライブラリも、Androidアプリ自体も、典型的なAndroid Gradleモジュールであり、他のAndroidライブラリやアプリと違いはありません。したがって、Kotlin MultiplatformプロジェクトからAndroidアプリを公開することは、[Android開発者向けドキュメント](https://developer.android.com/studio/publish)に記載されている通常のプロセスと変わりありません。

## iOSアプリ

Kotlin MultiplatformプロジェクトのiOSアプリは典型的なXcodeプロジェクトからビルドされるため、公開に関わる主要な段階は[iOS開発者向けドキュメント](https://developer.apple.com/ios/submit/)に記載されているものと同じです。

> App Storeポリシーの2024年春の変更により、不足している、または不完全なプライバシーマニフェストは、アプリケーションの警告または拒否につながる可能性があります。
> 詳細と回避策、特にKotlin Multiplatformアプリの場合については、[iOSアプリのプライバシーマニフェスト](https://kotlinlang.org/docs/apple-privacy-manifest.html)を参照してください。
>
{style="note"}

Kotlin Multiplatformプロジェクトに特有なのは、共有Kotlinモジュールをフレームワークにコンパイルし、Xcodeプロジェクトにリンクすることです。
通常、共有モジュールとXcodeプロジェクト間の統合は、[Android Studio用Kotlin Multiplatformプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)によって自動的に行われます。
ただし、プラグインを使用しない場合は、XcodeでiOSプロジェクトをビルドおよびバンドルする際に以下の点に留意してください。

*   共有Kotlinライブラリはネイティブフレームワークにコンパイルされます。
*   特定のプラットフォーム用にコンパイルされたフレームワークをiOSアプリプロジェクトに接続する必要があります。
*   Xcodeプロジェクト設定で、ビルドシステムが検索するフレームワークへのパスを指定します。
*   プロジェクトをビルドした後、アプリを起動してテストし、実行時にフレームワークを扱う際に問題がないことを確認する必要があります。

共有KotlinモジュールをiOSプロジェクトに接続する方法は2つあります。
*   [Kotlin CocoaPods Gradleプラグイン](multiplatform-cocoapods-overview.md)を使用します。これにより、ネイティブターゲットを持つマルチプラットフォームプロジェクトをiOSプロジェクトでCocoaPodsの依存関係として使用できます。
*   Multiplatformプロジェクトを手動で設定してiOSフレームワークを作成し、Xcodeプロジェクトがその最新バージョンを取得するように構成します。
    Kotlin MultiplatformウィザードまたはAndroid Studio用Kotlin Multiplatformプラグインが通常この構成を行います。
    Xcodeに直接フレームワークを追加する方法については、[iOSプロジェクトをKMPフレームワークを使用するように構成する](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)を参照してください。

### iOSアプリケーションを構成する

Xcodeを使用せずに、結果として生成されるアプリに影響を与える基本的なプロパティを構成できます。

#### バンドルID

[バンドルID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion)は、オペレーティングシステム内でアプリを一意に識別します。これを変更するには、Android Studioで`iosApp/Configuration/Config.xcconfig`ファイルを開き、`BUNDLE_ID`を更新します。

#### アプリ名

アプリ名は、ターゲットの実行可能ファイル名とアプリケーションバンドル名を設定します。アプリの名前を変更するには：

*   まだAndroid Studioでプロジェクトを開いていない場合、任意のテキストエディタで`iosApp/Configuration/Config.xcconfig`ファイル内の`APP_NAME`オプションを直接変更できます。
*   すでにAndroid Studioでプロジェクトを開いている場合、以下を行います。

    1.  プロジェクトを閉じます。
    2.  任意のテキストエディタで、`iosApp/Configuration/Config.xcconfig`ファイル内の`APP_NAME`オプションを変更します。
    3.  Android Studioでプロジェクトを再度開きます。

他の設定を構成する必要がある場合は、Xcodeを使用してください。Android Studioでプロジェクトを開いた後、Xcodeで`iosApp/iosApp.xcworkspace`ファイルを開き、そこで変更を行います。

### クラッシュレポートのシンボル化

開発者がアプリを改善するのに役立つよう、iOSはアプリのクラッシュを分析する手段を提供します。詳細なクラッシュ分析には、クラッシュレポート内のメモリアドレスをソースコード内の場所（関数や行番号など）に紐付ける特殊なデバッグシンボル（`.dSYM`）ファイルを使用します。

デフォルトでは、共有Kotlinモジュールから生成されたiOSフレームワークのリリースバージョンには、付随する`.dSYM`ファイルがあります。これは、共有モジュールのコードで発生するクラッシュを分析するのに役立ちます。

iOSアプリがビットコードから再ビルドされると、その`dSYM`ファイルは無効になります。そのような場合、共有モジュールをスタティックフレームワークにコンパイルでき、その中にデバッグ情報を格納できます。Kotlinモジュールから生成されたバイナリでのクラッシュレポートのシンボル化設定に関する手順については、[Kotlin/Nativeドキュメント](https://kotlinlang.org/docs/native-ios-symbolication.html)を参照してください。

## Webアプリ

Webアプリケーションを公開するには、アプリケーションを構成するコンパイル済みファイルとリソースを含む成果物を作成します。これらの成果物は、GitHub PagesのようなWebホスティングプラットフォームにアプリケーションをデプロイするために必要です。

### 成果物を生成する

**wasmJsBrowserDistribution**タスクを実行するための実行構成を作成します。

1.  **Run | Edit Configurations**メニュー項目を選択します。
2.  プラスボタンをクリックし、ドロップダウンリストから**Gradle**を選択します。
3.  **Tasks and arguments**フィールドに、このコマンドを貼り付けます。

   ```shell
   wasmJsBrowserDistribution
   ```

4.  **OK**をクリックします。

これで、この構成を使用してタスクを実行できます。

![Wasmディストリビューションタスクを実行する](compose-run-wasm-distribution-task.png){width=350}

タスクが完了したら、生成された成果物を`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリで見つけることができます。

![成果物ディレクトリ](compose-web-artifacts.png){width=400}

### GitHub Pagesにアプリケーションを公開する

成果物の準備ができたら、Webホスティングプラットフォームにアプリケーションをデプロイできます。

1.  `productionExecutable`ディレクトリの内容を、サイトを作成したいリポジトリにコピーします。
2.  [サイトの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)に関するGitHubの指示に従ってください。

   > GitHubに変更をプッシュした後、サイトの変更が公開されるまでに最大10分かかる場合があります。
   >
   {style="note"}

3.  ブラウザでGitHub Pagesのドメインに移動します。

   ![GitHub Pagesに移動する](publish-your-application-on-web.png){width=650}

おめでとうございます！GitHub Pagesに成果物を公開しました。

### Webアプリケーションをデバッグする

Webアプリケーションは、追加の構成なしで、ブラウザでデバッグできます。ブラウザでデバッグする方法については、Kotlinドキュメントの[ブラウザでのデバッグ](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)ガイドを参照してください。