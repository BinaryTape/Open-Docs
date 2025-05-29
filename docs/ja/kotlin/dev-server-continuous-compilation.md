[//]: # (title: 開発サーバーと継続的なコンパイル)

Kotlin/JSプロジェクトに加えた変更を確認するたびに、手動でコンパイルして実行する代わりに、_継続的なコンパイル_モードを使用できます。通常の`run`コマンドを使用する代わりに、_継続_モードでGradleラッパーを呼び出します。

```bash
./gradlew run --continuous
```

IntelliJ IDEAで作業している場合、_実行構成_を介して同じフラグを渡すことができます。IDEからGradleの`run`タスクを初めて実行すると、IntelliJ IDEAは自動的にそれに対する実行構成を生成し、それを編集できます。

![IntelliJ IDEAでの実行構成の編集](edit-configurations.png){width=700}

**Run/Debug Configurations**ダイアログを介して継続モードを有効にするには、実行構成の引数に`--continuous`フラグを追加するだけで簡単です。

![IntelliJ IDEAの実行構成にcontinuousフラグを追加](run-debug-configurations.png){width=700}

この実行構成を実行すると、Gradleプロセスがプログラムへの変更を監視し続けることに気づくでしょう。

![変更を待機中のGradle](waiting-for-changes.png){width=700}

変更が検出されると、プログラムは自動的に再コンパイルされます。ブラウザでページを開いたままにしている場合、開発サーバーがページの自動リロードをトリガーし、変更が反映されます。これは、Kotlin Multiplatform Gradleプラグインによって管理される統合された`webpack-dev-server`のおかげです。