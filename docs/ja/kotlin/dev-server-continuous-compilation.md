---
title: 開発サーバーと継続的コンパイル
---
変更を確認するためにKotlin/JSプロジェクトを手動でコンパイルして実行する代わりに、
_continuous compilation_（継続的コンパイル）モードを使用できます。通常の`run`コマンドを使用する代わりに、Gradle Wrapperを
_continuous_（継続的）モードで呼び出します。

```bash
./gradlew run --continuous
```

IntelliJ IDEAで作業している場合は、_run configuration_（実行構成）から同じフラグを渡すことができます。IDEからGradleの
`run`タスクを初めて実行すると、IntelliJ IDEAは自動的にその実行構成を生成します。これは編集可能です。

<img src="/img/edit-configurations.png" alt="Editing run configurations in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

**Run/Debug Configurations**（実行/デバッグ構成）ダイアログで継続的モードを有効にするには、実行構成の引数に`--continuous`フラグを追加するだけです。

<img src="/img/run-debug-configurations.png" alt="Adding the continuous flag to a run configuration in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

この実行構成を実行すると、Gradleプロセスがプログラムへの変更を監視し続けていることに気付くでしょう。

<img src="/img/waiting-for-changes.png" alt="Gradle waiting for changes" width="700" style={{verticalAlign: 'middle'}}/>

変更が検出されると、プログラムは自動的に再コンパイルされます。ブラウザでページを開いたままにしている場合は、開発サーバーがページの自動リロードをトリガーし、変更が表示されるようになります。
これは、Kotlin Multiplatform Gradleプラグインによって管理される統合された`webpack-dev-server`のおかげです。