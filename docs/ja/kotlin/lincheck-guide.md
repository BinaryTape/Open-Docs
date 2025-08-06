[//]: # (title: Lincheck ガイド)

Lincheckは、JVM上で並行アルゴリズムをテストするための実用的で使いやすいフレームワークです。これは、並行テストを記述するためのシンプルかつ宣言的な方法を提供します。

Lincheckフレームワークを使用すると、テストの実行方法を記述する代わりに、検査するすべての操作と必要な正当性プロパティを宣言することで、_何をテストするか_を指定できます。その結果、一般的な並行Lincheckテストはわずか約15行になります。

操作のリストが与えられると、Lincheckは自動的に以下を行います。

*   ランダムな並行シナリオのセットを生成します。
*   ストレス テストまたは有界モデル検査のいずれかを使用してそれらを検査します。
*   各呼び出しの結果が、要求される正当性プロパティ（線形化可能性がデフォルトです）を満たしていることを検証します。

## プロジェクトにLincheckを追加する

Lincheckのサポートを有効にするには、対応するリポジトリと依存関係をGradle設定に含めます。`build.gradle(.kts)`ファイルに以下を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## Lincheckを使ってみる

このガイドは、Lincheckフレームワークに親しみ、例を交えながら最も役立つ機能を試すのに役立ちます。Lincheckの機能をステップバイステップで学びましょう。

1.  [Lincheckで最初のテストを作成する](introduction.md)
2.  [テスト戦略を選択する](testing-strategies.md)
3.  [操作引数を設定する](operation-arguments.md)
4.  [一般的なアルゴリズムの制約を考慮する](constraints.md)
5.  [アルゴリズムの非ブロッキング進行保証を確認する](progress-guarantees.md)
6.  [アルゴリズムのシーケンシャル仕様を定義する](sequential-specification.md)

## その他の参考資料
*   Nikita Kovalによる「Kotlinコルーチンにおける並行アルゴリズムのテスト方法」： [動画](https://youtu.be/jZqkWfa11Js)。 KotlinConf 2023
*   Maria Sokolovaによる「Lincheck: JVM上での並行性テスト」ワークショップ： [パート1](https://www.youtube.com/watch?v=YNtUK9GK4pA)、[パート2](https://www.youtube.com/watch?v=EW7mkAOErWw)。 Hydra 2021