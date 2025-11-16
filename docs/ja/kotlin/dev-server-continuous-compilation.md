[//]: # (title: 開発サーバーと連続コンパイル)

加えた変更を確認するたびにKotlin/JSプロジェクトを手動でコンパイルして実行する代わりに、_連続コンパイル_モードを使用できます。通常の`jsBrowserDevelopmentRun` (`browser`用) および `jsNodeDevelopmentRun` (`nodejs`用) コマンドを使用する代わりに、Gradleラッパーを連続モードで呼び出します。

```bash
 # For `browser` project
./gradlew jsBrowserDevelopmentRun --continuous

 # For `nodejs` project
./gradlew jsNodeDevelopmentRun --continuous
```

IntelliJ IDEAで作業している場合、実行構成のリストを介して同じフラグを渡すことができます。IDEから`jsBrowserDevelopmentRun` Gradleタスクを初めて実行すると、IntelliJ IDEAはそれに対する実行構成を自動的に生成し、上部のツールバーで編集できるようになります。

![IntelliJ IDEAで実行構成を編集する](edit-configurations.png){width=700}

**実行/デバッグ構成**ダイアログから連続モードを有効にするには、実行構成の引数に`--continuous`フラグを追加するだけで簡単です。

![IntelliJ IDEAで実行構成に連続フラグを追加する](run-debug-configurations.png){width=700}

この実行構成を実行すると、Gradleプロセスがプログラムの変更を監視し続けていることがわかります。

![変更を待機中のGradle](waiting-for-changes.png){width=700}

変更が検出されると、プログラムは自動的に再コンパイルされます。ブラウザでウェブページを開いたままにしている場合、開発サーバーはページの自動リロードをトリガーし、変更が反映されます。これは、[Kotlin Multiplatform Gradleプラグイン](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)によって管理される統合された[`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)のおかげです。