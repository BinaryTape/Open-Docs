[//]: # (title: Lincheckガイド)

Lincheckは、JVM上の並行アルゴリズムをテストするための実用的で使いやすいフレームワークです。並行テストを記述するためのシンプルかつ宣言的な方法を提供します。

Lincheckフレームワークを使用すると、テストの実行方法を記述する代わりに、検証するすべての操作と必要な正しさのプロパティを宣言することで、_何をテストするか_を指定できます。その結果、典型的なLincheck並行テストは約15行しか含まれていません。

操作のリストが与えられると、Lincheckは自動的に次のことを行います。

*   ランダムな並行シナリオのセットを生成します。
*   ストレステストまたは有界モデル検査のいずれかを使用してそれらを検査します。
*   各呼び出しの結果が必要な正しさのプロパティを満たしていることを検証します（線形化可能性がデフォルトです）。

## Lincheckをプロジェクトに追加する

Lincheckのサポートを有効にするには、対応するリポジトリと依存関係をGradle設定に含めます。`build.gradle(.kts)`ファイルに以下を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## Lincheckを探索する

このガイドでは、Lincheckフレームワークに触れ、最も有用な機能を例とともに試すことができます。Lincheckの機能をステップバイステップで学びましょう。

1.  [Lincheckで最初のテストを記述する](introduction.md)
2.  [テスト戦略を選択する](testing-strategies.md)
3.  [操作の引数を設定する](operation-arguments.md)
4.  [一般的なアルゴリズムの制約を考慮する](constraints.md)
5.  [非ブロッキングな進行保証についてアルゴリズムをチェックする](progress-guarantees.md)
6.  [アルゴリズムの逐次仕様を定義する](sequential-specification.md)

## 追加リファレンス
*   「Kotlinコルーチンにおける並行アルゴリズムのテスト方法」by Nikita Koval: [動画](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
*   「Lincheck: JVMでの並行性のテスト」ワークショップ by Maria Sokolova: [パート1](https://www.youtube.com/watch?v=YNtUK9GK4pA)、[パート2](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021