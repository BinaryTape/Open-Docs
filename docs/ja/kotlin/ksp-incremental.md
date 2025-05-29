[//]: # (title: インクリメンタル処理)

インクリメンタル処理は、ソースの再処理を可能な限り避けるための処理技術です。インクリメンタル処理の主な目的は、一般的な変更・コンパイル・テストサイクルにおけるターンアラウンドタイムを短縮することです。一般的な情報については、Wikipediaの[インクリメンタルコンピューティング](https://en.wikipedia.org/wiki/Incremental_computing)に関する記事を参照してください。

どのソースが _ダーティ_ (dirty)（再処理する必要があるソース）であるかを判断するために、KSPはプロセッサの助けを借りて、どの入力ソースがどの生成済み出力に対応するかを識別する必要があります。このしばしば手間がかかり、エラーが発生しやすいプロセスを助けるため、KSPは、プロセッサがコード構造をナビゲートするための出発点として使用する、最小限の _ルートソース_ (root sources) のみを要求するように設計されています。言い換えれば、プロセッサは、対応する `KSNode` のソースに出力を関連付ける必要があります。ただし、その `KSNode` が以下のいずれかから取得された場合に限ります。
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

インクリメンタル処理は現在、デフォルトで有効になっています。これを無効にするには、Gradleプロパティ `ksp.incremental=false` を設定します。依存関係と出力に基づいてダーティセットをダンプするログを有効にするには、`ksp.incremental.log=true` を使用します。これらのログファイルは、`.log` ファイル拡張子を持つ `build` 出力ディレクトリにあります。

JVMでは、クラスパスの変更、およびKotlinとJavaのソースの変更がデフォルトで追跡されます。KotlinとJavaのソースの変更のみを追跡するには、`ksp.incremental.intermodule=false` Gradleプロパティを設定してクラスパスの追跡を無効にします。

## 集約型と分離型

[Gradleアノテーションプロセッシング](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)の概念と同様に、KSPは _集約型_ (aggregating) モードと _分離型_ (isolating) モードの両方をサポートしています。Gradleアノテーションプロセッシングとは異なり、KSPはプロセッサ全体ではなく、各出力を集約型または分離型として分類することに注意してください。

集約型出力は、他のファイルに影響を与えないファイルの削除を除き、あらゆる入力変更の影響を受ける可能性があります。これは、いかなる入力変更もすべての集約型出力の再ビルドにつながり、ひいては、対応するすべての登録済み、新規、および変更されたソースファイルの再処理を意味します。

例として、特定の[アノテーション](https://kotlinlang.org/docs/annotations.html)を持つすべてのシンボルを収集する出力は、集約型出力とみなされます。

分離型出力は、指定されたソースのみに依存します。他のソースへの変更は、分離型出力に影響を与えません。Gradleアノテーションプロセッシングとは異なり、特定の出力に対して複数のソースファイルを定義できることに注意してください。

例として、実装するインターフェース専用に生成されたクラスは、分離型とみなされます。

まとめると、出力が新規または変更されたソースに依存する可能性がある場合、それは集約型とみなされます。そうでない場合、その出力は分離型です。

Javaアノテーションプロセッシングに詳しい読者向けにまとめたものです。
* 分離型のJavaアノテーションプロセッサでは、KSPのすべての出力は分離型です。
* 集約型のJavaアノテーションプロセッサでは、KSPの一部の出力は分離型に、一部は集約型になることがあります。

### 実装方法

依存関係は、アノテーションではなく、入力ファイルと出力ファイルの関連付けによって計算されます。これは多対多の関係です。

入出力の関連付けによるダーティ伝播ルールは以下の通りです。
1.  入力ファイルが変更された場合、常に再処理されます。
2.  入力ファイルが変更され、それが出力に関連付けられている場合、同じ出力に関連付けられている他のすべての入力ファイルも再処理されます。これは推移的であり、新しいダーティファイルがなくなるまで無効化が繰り返し発生します。
3.  1つ以上の集約型出力に関連付けられているすべての入力ファイルは再処理されます。言い換えれば、入力ファイルがいずれの集約型出力にも関連付けられていない場合、再処理されません（上記の1.または2.を満たす場合を除く）。

理由:
1.  入力が変更されると、新しい情報が導入される可能性があり、そのためプロセッサは入力とともに再度実行される必要があります。
2.  出力は一連の入力から生成されます。プロセッサは出力を再生成するためにすべての入力を必要とする場合があります。
3.  `aggregating=true` は、出力が新しい情報（新しいファイル、または変更された既存のファイルのいずれかから来る可能性がある）に依存する可能性があることを意味します。
4.  `aggregating=false` は、プロセッサが情報が特定の入力ファイルからのみ取得され、他のファイルや新規ファイルからは決して取得されないことを確信していることを意味します。

## 例1

プロセッサは、`A.kt` のクラス `A` と `B.kt` のクラス `B` を読み取った後、`outputForA` を生成します。ここで、`A` は `B` を継承しています。プロセッサは `Resolver.getSymbolsWithAnnotation` によって `A` を取得し、次に `A` から `KSClassDeclaration.superTypes` によって `B` を取得しました。`B` の組み込みが `A` に起因するため、`outputForA` の `dependencies` に `B.kt` を指定する必要はありません。この場合でも `B.kt` を指定することはできますが、不要です。

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
        // B.kt isn't required, because it can be deduced as a dependency by KSP
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA depends on A.kt and B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 例2

プロセッサが `sourceA` を読み取った後に `outputA` を、`sourceB` を読み取った後に `outputB` を生成すると仮定します。

`sourceA` が変更された場合:
*   `outputB` が集約型の場合、`sourceA` と `sourceB` の両方が再処理されます。
*   `outputB` が分離型の場合、`sourceA` のみが再処理されます。

`sourceC` が追加された場合:
*   `outputB` が集約型の場合、`sourceC` と `sourceB` の両方が再処理されます。
*   `outputB` が分離型の場合、`sourceC` のみが再処理されます。

`sourceA` が削除された場合、何も再処理する必要はありません。

`sourceB` が削除された場合、何も再処理する必要はありません。

## ファイルのダーティ状態がどのように決定されるか

ダーティファイルは、ユーザーによって直接 _変更された_ (changed) か、他のダーティファイルによって間接的に _影響を受けた_ (affected) ファイルです。KSPはダーティ状態を2つのステップで伝播します。
*   _解決トレース_ (resolution tracing) による伝播:
    型参照を（暗黙的または明示的に）解決することは、あるファイルから別のファイルに移動する唯一の方法です。プロセッサによって型参照が解決される際、解決結果に潜在的に影響を与える変更を含む変更済みまたは影響を受けたファイルは、その参照を含むファイルに影響を与えます。
*   _入出力対応_ (input-output correspondence) による伝播:
    ソースファイルが変更または影響を受けた場合、そのファイルと共通の出力を持つ他のすべてのソースファイルが影響を受けます。

これらは両方とも推移的であり、2番目のルールは同値クラスを形成することに注意してください。

## バグの報告

バグを報告するには、Gradleプロパティ `ksp.incremental=true` と `ksp.incremental.log=true` を設定し、クリーンビルドを実行してください。このビルドにより、以下の2つのログファイルが生成されます。

*   `build/kspCaches/<source set>/logs/kspDirtySet.log`
*   `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

その後、連続するインクリメンタルビルドを実行すると、さらに2つのログファイルが生成されます。

*   `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
*   `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

これらのログには、ソースと出力のファイル名、およびビルドのタイムスタンプが含まれています。