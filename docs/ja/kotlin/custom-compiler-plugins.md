[//]: # (title: カスタムコンパイラプラグイン)

> KotlinコンパイラプラグインAPIは不安定であり、リリースごとに破壊的変更が導入されます。
> 
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

独自のカスタムコンパイラプラグインを作成する前に、[利用可能なコンパイラプラグインのリスト](compiler-plugins-overview.md)を確認し、ユースケースに適したものが既に存在しないか確認してください。

また、目的を達成するために [Kotlin Symbol Processing (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) や [Android lint](https://developer.android.com/studio/write/lint) のような外部リンターを使用できないかどうかも検討してください。

それでも必要なものが見つからない場合は、カスタムコンパイラプラグインを作成できます。ただし、KotlinコンパイラプラグインAPIは**不安定**であることに注意してください。新しいコンパイラのリリースごとに破壊的変更が導入されるため、メンテナンスには継続的かつ多大な労力を投じる必要があります。

### Kotlinコンパイラとコンパイラプラグイン

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin compiler stages"/>
    </li>
    <li>
        <p>Kotlinコンパイラの動作:</p>
        <ol>
            <li>ソースコードをパースし、構造化された構文ツリーに変換します。</li>
            <li>コードを解析して解決（Resolve）します。これには、意味の特定、名前の解決、型のチェック、可視性ルールの適用などが含まれます。</li>
            <li>中間表現 (IR: Intermediate Representation) を生成します。これはソースコードとマシンコードの架け橋となるデータ構造です。</li>
            <li>IRを段階的に単純な形式へと変換（Lowering）します。</li>
            <li>変換されたIRを、JVMバイトコード、JavaScript、ネイティブマシンコードなどのターゲット固有の出力に翻訳します。</li>
        </ol>
    </li>
</list>

プラグインは、フロントエンドAPIを通じて初期のコンパイラステージに影響を与え、コンパイラがコードを解決する方法を変更できます。
例えば、プラグインによってアノテーションを追加したり、ボディのない新しいメソッドを導入したり、可視性修飾子を変更したりできます。これらの変更はIDE上でも確認できます。

また、プラグインはバックエンドAPIを通じて後半のステージに影響を与え、宣言の動作を修正することもできます。これらの変更は、コンパイル完了後に生成されるバイナリに反映されます。

実際には、コンパイラプラグインは解析と解決からコード生成までのステージに影響を与え、フロントエンドとバックエンドの両方をカバーします。例えば、フロントエンド部分で宣言を生成し、バックエンド部分でそれらの宣言のボディ（実装）を追加するといった具合です。

![Kotlin compiler stages with plugins](compiler-stages-with-plugins.svg){width=650}

[Kotlin serializationプラグイン](https://github.com/Kotlin/kotlinx.serialization)が良い例です。このプラグインのフロントエンド部分は、コンパニオンオブジェクトとシリアライザー関数を追加し、名前の衝突を防ぐためのチェックを行います。バックエンド部分は、`KSerializer` オブジェクトを通じて目的のシリアライズ動作を実装します。

### Kotlinコンパイラプラグインのテンプレート

カスタムコンパイラプラグインの作成を開始するには、[Kotlin compiler plugin template](https://github.com/Kotlin/compiler-plugin-template) を使用できます。
その後、フロントエンドおよびバックエンドのプラグインAPIから拡張ポイントを登録します。

> 現在、カスタムコンパイラプラグインの開発は [Gradle](gradle.md) でのみ可能です。
> 
{style="note"}

### フロントエンドプラグインAPI

フロントエンドプラグインAPIは、フロントエンド中間表現 (FIR: frontend intermediate representation) とも呼ばれ、解決（Resolution）をカスタマイズするための以下の専用拡張ポイントを備えています。

| 拡張ポイント名                                                                                                                                                                               | 説明                                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | カスタムのコンパイラチェッカーを追加します。                                                           |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | 新しい宣言を生成します。                                                              |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | プラグインの他の部分で使用されるカスタムコンポーネントを `FirSession` に登録します。 |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | 関数型の新しいファミリーを定義します。                                                |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | 宣言のメタデータに対して情報の読み書きを行います。                                    |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | 可視性やモダリティなどの宣言ステータス属性を修正します。                   |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | 既存のクラスに新しいスーパータイプを追加します。                                                |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | 型アノテーションに基づいて、特定の型に特別な属性を追加します。                |

#### IDEとの統合

解決方法の変更は、コードのハイライティングやサジェスチョン（提案）などのIDEの動作に影響を与えるため、プラグインがIDEと互換性を持っていることが重要です。IntelliJ IDEAおよびAndroid Studioの各バージョンには、開発バージョンのKotlinコンパイラが含まれています。このバージョンはIDE固有のものであり、リリースされたKotlinコンパイラとバイナリ互換性がありません。
その結果、IDEをアップデートする際には、動作を維持するためにコンパイラプラグインもアップデートする必要があります。このような理由から、コミュニティ製のプラグインはデフォルトではロードされません。

作成したカスタムコンパイラプラグインが異なるIDEバージョンで動作することを確認するには、各IDEバージョンに対してテストを行い、見つかった問題を修正してください。

Kotlinコンパイラプラグイン用の開発キット（devkit）が利用可能になれば、複数のIDEバージョンのサポートが容易になる可能性があります。この機能に興味がある場合は、[イシュートラッカー](https://youtrack.jetbrains.com/issue/KT-82617)でフィードバックを共有してください。

### バックエンドプラグインAPI

> バックエンドプラグインの開発は、IDEやデバッガのパフォーマンスを低下させずに正しく行うことが難しいため、変更は慎重かつ控えめに行ってください。
> 
{style="warning"}

バックエンドプラグインAPI（IRとも呼ばれます）には、単一の拡張ポイント [`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt) があります。
この拡張ポイントを使用し、`generate()` 関数をオーバーライドして、フロントエンドで既に生成された宣言にボディを追加したり、既存の宣言のボディを変更したりします。

この拡張ポイントを通じて行われた変更は、コンパイラによって**チェックされません**。このステージにおけるコンパイラの期待を壊さないように注意する必要があります。例えば、誤って無効な型、正しくない関数参照、あるいは適切なスコープ外の参照を導入してしまう可能性があります。

#### バックエンドプラグインのコードを調べる

Kotlin serializationプラグインのコードを調べることで、バックエンドプラグインのコンパイラコードが実際にどのようなものかを確認できます。
例えば、[`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt) は、主要なシリアライザーメンバーの欠落しているボディを補完します。一つの例として [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242) 関数があり、これは `KSerializer` 式のリストを収集して配列で返します。

#### バックエンドプラグインコードの問題を確認する

バックエンドプラグインコードの問題は、次の3つの方法で確認できます。

1. **IRの検証 (Verify the IR)**

    IRツリーを構築し、`Xverify-ir` コンパイラオプションを有効にします。このオプションはコンパイル速度に影響を与えるため、テスト中のみ使用してください。

2. **IR出力のダンプと比較**

    `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` コンパイラオプションを使用して、IRローアリング（Lowering）コンパイルステージの後にダンプファイルを作成します。JVMバックエンドの場合は、`-Xdump-directory=<your-file-directory>` オプションでダンプディレクトリを指定します。期待されるコードを手動で記述し、別のダンプファイルを生成して、両者を比較して差異がないか確認します。

3. **コンパイラコードのデバッグ**

    `convertToIr.kt` ファイル内の `convertToIrAndActualize()` 関数にブレークポイントを追加し、コンパイラをデバッグモードで実行することで、コンパイル中のより詳細な情報を取得できます。

### プラグインのテスト

プラグインを実装したら、徹底的にテストしてください。[Kotlin compiler plugin template](https://github.com/Kotlin/compiler-plugin-template) は、[Kotlin compiler test framework](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md) を使用するように既にセットアップされています。
テストは以下のディレクトリに追加できます。

* `compiler-plugin/testData`
* `compiler-plugin/testData/box` （コード生成テスト用）
* `compiler-plugin/testData/diagnostics` （診断テスト用）

テストが実行されると、フレームワークは以下の処理を行います。

1. テストソースファイルをパースします。例: [`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt)
2. 各ファイルに対してFIRとIRを構築します。
3. これらをテキスト形式のダンプファイルとして書き出します。例: [`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt) および [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt)
4. これらのファイルを、以前に作成されたファイル（存在する場合）と比較します。

これらのファイルを使用して、生成された差分の中に意図しない変更が含まれていないかを確認できます。問題がなければ、新しいダンプファイルが最新の「ゴールデンファイル（golden files）」、つまり将来の変更と比較するための承認済みで信頼できるソースとなります。

### ヘルプを得る

カスタムコンパイラプラグインの開発で問題が発生した場合は、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の [#compiler](https://slack-chats.kotlinlang.org/c/compiler) チャンネルに問い合わせてください。解決を保証することはできませんが、可能な限りお手伝いします。