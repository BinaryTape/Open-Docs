[//]: # (title: インクリメンタル処理)

インクリメンタル処理は、ソースの再処理を可能な限り回避する処理手法です。
インクリメンタル処理の主な目的は、典型的な「変更-コンパイル-テスト」サイクルのターンアラウンドタイムを短縮することです。
一般的な情報については、Wikipediaの[インクリメンタル計算](https://en.wikipedia.org/wiki/Incremental_computing)に関する記事を参照してください。

どのソースが _ダーティ_（再処理が必要なもの）であるかを判断するために、KSPはどの入力ソースがどの生成された出力に対応するかを特定するためのプロセッサによる補助を必要とします。この、しばしば煩雑でエラーが発生しやすいプロセスを支援するため、KSPはプロセッサがコード構造をナビゲートするための開始点として使用する、最小限の「ルートソース（root sources）」のセットのみを要求するように設計されています。言い換えれば、プロセッサは、`KSNode`が以下のいずれかから取得された場合、その出力を対応する`KSNode`のソースに関連付ける必要があります。
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

現在、インクリメンタル処理はデフォルトで有効になっています。無効にするには、Gradleプロパティ `ksp.incremental=false` を設定してください。
依存関係と出力に応じたダーティセットをダンプするログを有効にするには、`ksp.incremental.log=true` を使用してください。
これらのログファイルは、`build` 出力ディレクトリ内に拡張子 `.log` で生成されます。

JVMでは、クラスパスの変更、およびKotlinとJavaのソース変更がデフォルトで追跡されます。
KotlinとJavaのソース変更のみを追跡するには、`ksp.incremental.intermodule=false` Gradleプロパティを設定してクラスパスの追跡を無効にしてください。

## アグリゲート型 vs アイソレート型 (Aggregating vs Isolating)

[Gradleのアノテーション処理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)における概念と同様に、KSPは「アグリゲート（集約）型」と「アイソレート（分離）型」の両方のモードをサポートしています。Gradleのアノテーション処理とは異なり、KSPではプロセッサ全体ではなく、各出力をアグリゲート型またはアイソレート型として分類することに注意してください。

アグリゲート型の出力は、他のファイルに影響を与えないファイルの削除を除き、あらゆる入力の変更によって影響を受ける可能性があります。これは、いかなる入力の変更もすべてのアグリゲート型出力の再構築を招き、結果として、対応する登録済み、新規、および修正されたすべてのソースファイルの再処理が行われることを意味します。

例として、特定の注釈（アノテーション）を持つすべてのシンボルを収集する出力は、アグリゲート型出力と見なされます。

アイソレート型の出力は、指定されたソースのみに依存します。他のソースへの変更は、アイソレート型出力には影響しません。
Gradleのアノテーション処理とは異なり、特定の出力に対して複数のソースファイルを定義できることに注意してください。

例として、実装するインターフェース専用に生成されたクラスは、アイソレート型と見なされます。

まとめると、出力が新しいソースや変更されたソースに依存する可能性がある場合はアグリゲート型と見なされ、そうでない場合はアイソレート型となります。

Javaのアノテーション処理に慣れている読者向けのまとめ：
* アイソレート型のJavaアノテーションプロセッサでは、KSPのすべての出力がアイソレート型になります。
* アグリゲート型のJavaアノテーションプロセッサでは、KSPの一部の出力をアイソレート型に、一部をアグリゲート型にすることができます。

### 実装方法

依存関係は、注釈ではなく、入力ファイルと出力ファイルの関連付けによって計算されます。
これは多対多の関係です。

入出力の関連付けによるダーティ状態の伝播ルールは以下の通りです：
1. 入力ファイルが変更された場合、それは常に再処理されます。
2. 入力ファイルが変更され、それが特定の出力に関連付けられている場合、同じ出力に関連付けられている他のすべての入力ファイルも再処理されます。これは推移的であり、つまり、新しいダーティなファイルがなくなるまで無効化が繰り返し行われます。
3. 1つ以上のアグリゲート型出力に関連付けられているすべての入力ファイルは、再処理されます。言い換えれば、入力ファイルがいかなるアグリゲート型出力にも関連付けられていない場合、（上記の1または2に該当しない限り）再処理されません。

理由は以下の通りです：
1. 入力が変更されると、新しい情報が導入される可能性があるため、プロセッサはその入力を使用して再度実行する必要があります。
2. 出力は一連の入力から構成されます。プロセッサは出力を再生成するために、すべての入力を必要とする場合があります。
3. `aggregating=true` は、出力が新しい情報に依存する可能性があることを意味します。その情報は、新規ファイルまたは変更された既存ファイルのいずれかから得られます。
   `aggregating=false` は、プロセッサが、その情報が特定の入力ファイルのみから得られ、他のファイルや新規ファイルからは決して得られないことを確信していることを意味します。

## 例 1

プロセッサが、`A.kt` のクラス `A` と `B.kt` のクラス `B` を読み取った後、`outputForA` を生成するとします。ここで `A` は `B` を継承しています。
プロセッサは `Resolver.getSymbolsWithAnnotation` によって `A` を取得し、次に `A` から `KSClassDeclaration.superTypes` を通じて `B` を取得しました。
`B` が含まれるのは `A` に起因するため、`outputForA` の `dependencies` に `B.kt` を指定する必要はありません。
このケースで `B.kt` を指定することもできますが、必須ではありません。

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt は KSP によって依存関係として推論できるため、指定は不要
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA は A.kt と B.kt に依存する
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 例 2

プロセッサが `sourceA` を読み取って `outputA` を生成し、`sourceB` を読み取って `outputB` を生成する場合を考えます。

`sourceA` が変更されたとき：
* `outputB` がアグリゲート型の場合、`sourceA` と `sourceB` の両方が再処理されます。
* `outputB` がアイソレート型の場合、`sourceA` のみが再処理されます。

`sourceC` が追加されたとき：
* `outputB` がアグリゲート型の場合、`sourceC` と `sourceB` の両方が再処理されます。
* `outputB` がアイソレート型の場合、`sourceC` のみが再処理されます。

`sourceA` が削除されたとき、再処理が必要なものはありません。

`sourceB` が削除されたとき、再処理が必要なものはありません。

## ファイルのダーティ状態の決定方法

ダーティなファイルとは、ユーザーによって直接「変更」されたもの、または他のダーティなファイルによって間接的に「影響」を受けたもののいずれかです。KSPは2つのステップでダーティ状態を伝播させます：
* **解釈の追跡（resolution tracing）による伝播**:
  型参照の解決（暗黙的または明示的）は、あるファイルから別のファイルへとナビゲートする唯一の方法です。プロセッサによって型参照が解決されるとき、解決結果に影響を与える可能性のある変更を含む「変更されたファイル」または「影響を受けたファイル」は、その参照を含むファイルに影響を与えます。
* **入出力の対応関係による伝播**:
  ソースファイルが変更または影響を受けた場合、そのファイルと共通の出力を共有する他のすべてのソースファイルが影響を受けます。

これらはいずれも推移的であり、2番目のステップは同値類を形成することに注意してください。

## バグの報告

バグを報告するには、Gradleプロパティ `ksp.incremental=true` および `ksp.incremental.log=true` を設定し、クリーンビルドを実行してください。
このビルドにより、2つのログファイルが生成されます：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

その後、連続してインクリメンタルビルドを実行すると、さらに2つのログファイルが生成されます：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

これらのログには、ソースと出力のファイル名、およびビルドのタイムスタンプが含まれています。