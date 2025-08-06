[//]: # (title: 開発サーバーと連続コンパイル)

変更を加えるたびに手動でKotlin/JSプロジェクトをコンパイルして実行する代わりに、_連続コンパイル_モードを使用できます。通常の`run`コマンドを使用する代わりに、Gradleラッパーを_連続_モードで呼び出します。

```bash
./gradlew run --continuous
```

IntelliJ IDEAで作業している場合、_実行構成_を介して同じフラグを渡すことができます。IDEからGradleの`run`タスクを初めて実行すると、IntelliJ IDEAはそれに対する実行構成を自動的に生成し、編集できるようになります。

![IntelliJ IDEAで実行構成を編集する](edit-configurations.png){width=700}

**実行/デバッグ構成**ダイアログから連続モードを有効にするには、実行構成の引数に`--continuous`フラグを追加するだけで簡単です。

![IntelliJ IDEAで実行構成に連続フラグを追加する](run-debug-configurations.png){width=700}

この実行構成を実行すると、Gradleプロセスがプログラムの変更を監視し続けていることがわかります。

![変更を待機中のGradle](waiting-for-changes.png){width=700}

変更が検出されると、プログラムは自動的に再コンパイルされます。ブラウザでページを開いたままにしている場合、開発サーバーはページの自動リロードをトリガーし、変更が反映されます。これは、Kotlin Multiplatform Gradleプラグインによって管理される統合された`webpack-dev-server`のおかげです。