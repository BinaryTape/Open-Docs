[//]: # (title: Lincheckガイド)

Lincheckは、JVM上で並行アルゴリズムをテストするための、実用的で使いやすいフレームワークです。並行テストを記述するためのシンプルで宣言的な手法を提供します。

Lincheckフレームワークを使用すると、テストの実行方法を記述する代わりに、検証するすべての操作と必要な正確性プロパティ（correctness property）を宣言することで、「何をテストするか（_what to test_）」を指定できます。その結果、典型的なLincheckの並行テストはわずか15行程度で記述できます。

操作のリストが与えられると、Lincheckは自動的に以下のことを行います：

*   ランダムな並行シナリオのセットを生成します。
*   ストレス・テスト（stress-testing）または境界付きモデル検査（bounded model checking）を使用して、それらを検証します。
*   各呼び出しの結果が、要求される正確性プロパティ（デフォルトは線形化可能性：linearizability）を満たしていることを検証します。

## プロジェクトへのLincheckの追加

Lincheckのサポートを有効にするには、対応するリポジトリと依存関係をGradle設定に含めます。`build.gradle(.kts)`ファイルに以下を追加してください：

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

## Lincheckを探索する

このガイドでは、フレームワークに触れ、例を通して最も便利な機能を試すことができます。Lincheckの機能をステップバイステップで学習しましょう：

1. [Lincheckで最初のテストを作成する](introduction.md)
2. [テスト戦略を選択する](testing-strategies.md)
3. [操作の引数を設定する](operation-arguments.md)
4. [一般的なアルゴリズムの制約を考慮する](constraints.md)
5. [アルゴリズムのノンブロッキングな進行保証をチェックする](progress-guarantees.md)
6. [アルゴリズムの逐次仕様を定義する](sequential-specification.md)

## 追加のリソース
* Nikita Kovalによる「How we test concurrent algorithms in Kotlin Coroutines」: [動画](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
* Maria Sokolovaによる「Lincheck: Testing concurrency on the JVM」ワークショップ: [パート1](https://www.youtube.com/watch?v=YNtUK9GK4pA)、[パート2](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021