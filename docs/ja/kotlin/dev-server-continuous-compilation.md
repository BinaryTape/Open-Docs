[//]: # (title: 開発サーバーと継続的コンパイル)

変更を確認するたびに Kotlin/JS プロジェクトを手動でコンパイルして実行する代わりに、*継続的コンパイル*（continuous compilation）モードを使用できます。通常の `jsBrowserDevelopmentRun`（`browser` 用）や `jsNodeDevelopmentRun`（`nodejs` 用）コマンドを使用するのではなく、継続的モードで Gradle ラッパーを呼び出します。

```bash
 # `browser` プロジェクトの場合
./gradlew jsBrowserDevelopmentRun --continuous

 # `nodejs` プロジェクトの場合
./gradlew jsNodeDevelopmentRun --continuous
```

IntelliJ IDEA で作業している場合は、実行構成のリストを介して同じフラグを渡すことができます。IDE から `jsBrowserDevelopmentRun` Gradle タスクを初めて実行した後、IntelliJ IDEA はそれに対する実行構成を自動的に生成します。これは上部のツールバーで編集できます。

![IntelliJ IDEA での実行構成の編集](edit-configurations.png){width=700}

**実行/デバッグ構成**（Run/Debug Configurations）ダイアログで、実行構成の引数に `--continuous` フラグを追加して、継続的モードを有効にします。

![IntelliJ IDEA の実行構成への continuous フラグの追加](run-debug-configurations.png){width=700}

この実行構成を実行すると、Gradle プロセスがプログラムの変更を監視し続けていることがわかります。

![変更を待機中の Gradle](waiting-for-changes.png){width=700}

変更が検出されると、プログラムは自動的に再コンパイルされます。ブラウザで Web ページを開いたままにしている場合、開発サーバーがページの自動リロードをトリガーし、変更内容が反映されます。これは、[Kotlin Multiplatform Gradle プラグイン](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)によって管理されている、統合された [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) のおかげです。